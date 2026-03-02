/**
 * Google Places API集成 (使用新版API)
 * 用于获取真实的Google评价数据
 */

import { GoogleReviewsData, GoogleReview, getMockGoogleReviews } from "./mockGoogleReviews";

// Google Places API配置
const GOOGLE_PLACES_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ??
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.VITE_GOOGLE_PLACES_API_KEY ??
  "";

// OXEC Immigration的Google Place ID
// 地址: 1008-4710, Kingsway, Burnaby, BC V5H 4M2, Canada
const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? "ChIJORL_fbF3hlQRDkdWbOI9Yl8";

/**
 * 从Google Places API (New)获取真实的评价数据
 * @param limit 返回的评价数量限制
 * @returns Google评价数据
 */
export async function getRealGoogleReviews(limit: number = 4): Promise<GoogleReviewsData> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("Google Places API Key not configured, using mock data");
    return getMockGoogleReviews(limit);
  }

  try {
    const apiUrl = `https://places.googleapis.com/v1/places/${PLACE_ID}`;

    console.log("Fetching Google Places reviews using new API...");
    const response = await fetch(apiUrl, {
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
    });

    if (!response.ok) {
      console.error("Google Places API request failed:", response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return getMockGoogleReviews(limit);
    }

    const data = await response.json();

    if (!data) {
      console.warn("No result from Google Places API, using mock data");
      return getMockGoogleReviews(limit);
    }

    const reviews = data.reviews || [];

    // 转换Google Places API的评价格式为我们的格式
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
    return getMockGoogleReviews(limit);
  }
}

/**
 * 获取相对时间描述（例如"1个月前"）
 */
function getRelativeTimeDescription(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = (now - timestamp) / 1000;

  if (secondsAgo < 60) {
    return "刚刚";
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo}分钟前`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo}小时前`;
  } else if (secondsAgo < 604800) {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo}天前`;
  } else if (secondsAgo < 2592000) {
    const weeksAgo = Math.floor(secondsAgo / 604800);
    return `${weeksAgo}周前`;
  } else if (secondsAgo < 31536000) {
    const monthsAgo = Math.floor(secondsAgo / 2592000);
    return `${monthsAgo}个月前`;
  } else {
    const yearsAgo = Math.floor(secondsAgo / 31536000);
    return `${yearsAgo}年前`;
  }
}
