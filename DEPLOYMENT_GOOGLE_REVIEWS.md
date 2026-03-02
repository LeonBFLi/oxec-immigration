# Google Reviews 部署配置（Docker）

如果首页显示“李女士 / 王先生 / 张女士”等模拟评价，通常表示后端请求 Google Places API 失败，已回退为 mock 数据（开发环境）或空数据（生产环境）。

## 1) Docker 运行时必须传入的环境变量

最少需要：

- `GOOGLE_PLACES_API_KEY`（推荐）或 `GOOGLE_MAPS_API_KEY`
- 可选：`GOOGLE_PLACE_ID`（不填则用代码内默认 Place ID）

示例：

```bash
docker run -itd \
  --name oxec-immigration \
  -p 80:80 \
  -e NODE_ENV=production \
  -e PORT=80 \
  -e GOOGLE_PLACES_API_KEY=your_real_key \
  -e GOOGLE_PLACE_ID=ChIJORL_fbF3hlQRDkdWbOI9Yl8 \
  your_dockerhub_user/oxec-immigration:latest
```

## 2) Google Cloud 控制台需要确认

- 已启用 **Places API (New)**。
- API Key 没有被错误的限制策略拦截：
  - 若设置了“HTTP referrer 限制”，服务端请求通常会失败。
  - 服务端容器建议使用“IP 限制”或先临时无应用限制做验证。
- API Key 的“API 限制”中包含 Places API (New)。

## 3) 如何快速确认是否仍在回退

查看容器日志：

```bash
docker logs -f oxec-immigration
```

如果看到以下日志，表示仍有配置问题：

- `Google Places API Key not configured`
- `Google Places API request failed: ...`

## 4) 是否还可以强制显示 mock 数据（仅测试用）

生产环境默认不显示 mock，避免误导。
如需临时演示可加：

```bash
-e ALLOW_MOCK_GOOGLE_REVIEWS=true
```
