/**
 * Google Places API集成 (使用新版API)
 * 用于获取真实的Google评价数据
 */

import { GoogleReviewsData, GoogleReview, getMockGoogleReviews } from "./mockGoogleReviews";

function getGooglePlacesApiKey(): string {
  return (
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.VITE_GOOGLE_PLACES_API_KEY ??
    ""
  );
}

function getPlaceId(): string {
  // OXEC Immigration的Google Place ID
  // 地址: 1008-4710, Kingsway, Burnaby, BC V5H 4M2, Canada
  return process.env.GOOGLE_PLACE_ID ?? "ChIJORL_fbF3hlQRDkdWbOI9Yl8";
}

function shouldUseMockFallback(): boolean {
  // 生产环境默认不展示模拟评价，避免误导。
  // 可通过 ALLOW_MOCK_GOOGLE_REVIEWS=true 强制启用。
  if (process.env.ALLOW_MOCK_GOOGLE_REVIEWS === "true") return true;
  if (process.env.ALLOW_MOCK_GOOGLE_REVIEWS === "false") return false;
  return process.env.NODE_ENV !== "production";
}

function getUnavailableReviewsData(): GoogleReviewsData {
  return {
    rating: 0,
    reviewCount: 0,
    reviews: [],
  };
}

function getFallbackReviews(limit: number): GoogleReviewsData {
  if (shouldUseMockFallback()) {
    return getMockGoogleReviews(limit);
  }

  return getUnavailableReviewsData();
}

/**
 * 从Google Places API (New)获取真实的评价数据
 * @param limit 返回的评价数量限制
 * @returns Google评价数据
 */
export async function getRealGoogleReviews(limit: number = 4): Promise<GoogleReviewsData> {
  const googlePlacesApiKey = getGooglePlacesApiKey();
  const placeId = getPlaceId();

  if (!googlePlacesApiKey) {
    console.warn("Google Places API Key not configured");
    return getFallbackReviews(limit);
  }

  try {
    const apiUrl = `https://places.googleapis.com/v1/places/${placeId}`;

    console.log("Fetching Google Places reviews using new API...");
    const response = await fetch(apiUrl, {
      headers: {
        "X-Goog-Api-Key": googlePlacesApiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
    });

    if (!response.ok) {
      console.error("Google Places API request failed:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return getFallbackReviews(limit);
    }

    const data = await response.json();

    if (!data) {
      console.warn("No result from Google Places API");
      return getFallbackReviews(limit);
    }

    const reviews = data.reviews || [];

    const convertedReviews: GoogleReview[] = reviews.slice(0, limit).map((review: any, index: number) => {
      const publishedTimestamp = review.publishTime ? new Date(review.publishTime).getTime() : Date.now();

      return {
        id: review.name || `review_${index}_${publishedTimestamp}`,
        author: review.authorAttribution?.displayName || "Anonymous",
        authorUrl: review.authorAttribution?.uri || "https://www.google.com/maps",
        profilePhotoUrl: review.authorAttribution?.photoUri || "https://lh3.googleusercontent.com/a-/default-user=s64",
        rating: review.rating || 5,
        text: review.originalText?.text || review.text?.text || review.text || "",
        time: publishedTimestamp,
        relativeTimeDescription: getRelativeTimeDescription(publishedTimestamp),
      };
    });

    return {
      rating: data.rating || 5.0,
      reviewCount: data.userRatingCount || reviews.length,
      reviews: convertedReviews,
    };
  } catch (error) {
    console.error("Error fetching Google Places reviews:", error);
    return getFallbackReviews(limit);
  }
}

/**
 * 获取相对时间描述（例如"1个月前"）
 */
function getRelativeTimeDescription(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = (now - timestamp) / 1000;

  if (secondsAgo < 60) return "刚刚";
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}分钟前`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}小时前`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}天前`;
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 604800)}周前`;
  if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)}个月前`;
  return `${Math.floor(secondsAgo / 31536000)}年前`;
}
