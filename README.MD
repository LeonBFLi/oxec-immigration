# oxec-immigration

本项目已支持通过 Docker 镜像部署，并默认对外暴露 **80 端口**。构建方式采用多阶段镜像（`node:20-alpine`），仅保留生产依赖与构建产物，尽量降低镜像体积和运行时资源消耗。

## 一、准备工作

- 安装 Docker（建议 20.x 以上版本）。
- 在项目根目录执行以下命令。

## 二、构建镜像

```bash
docker build -t oxec-immigration:latest .
```

## 三、运行容器（80 端口）

```bash
docker run -d \
  --name oxec-immigration \
  -p 80:80 \
  -e NODE_ENV=production \
  -e PORT=80 \
  oxec-immigration:latest
```

运行后即可访问：

```
http://<服务器IP>/
```

> 说明：服务端会读取 `PORT` 环境变量并监听对应端口。若端口被占用，程序会自动向后寻找可用端口，因此建议确保容器内 80 端口空闲。

## 四、配置环境变量（可选但推荐）

项目会从环境变量中读取以下配置（未配置时默认为空）：

- `DATABASE_URL`：数据库连接字符串
- `JWT_SECRET`：Cookie/Token 密钥
- `OAUTH_SERVER_URL`：OAuth 服务地址
- `VITE_APP_ID`：应用 ID
- `OWNER_OPEN_ID`：Owner OpenID
- `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`：Forge 服务配置

你可以使用 `--env-file` 方式加载 `.env` 文件：

```bash
docker run -d \
  --name oxec-immigration \
  -p 80:80 \
  --env-file .env \
  -e NODE_ENV=production \
  -e PORT=80 \
  oxec-immigration:latest
```

`.env` 示例：

```env
DATABASE_URL=mysql://user:pass@host:3306/dbname
JWT_SECRET=your-secret
OAUTH_SERVER_URL=https://oauth.example.com
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=owner-open-id
BUILT_IN_FORGE_API_URL=https://forge.example.com
BUILT_IN_FORGE_API_KEY=forge-api-key
```

## 五、资源消耗优化建议

- **镜像体积**：已采用多阶段构建 + `node:20-alpine`，仅安装生产依赖。
- **运行内存限制（可选）**：

```bash
docker run -d \
  --name oxec-immigration \
  -p 80:80 \
  --memory=512m \
  --cpus=1 \
  -e NODE_ENV=production \
  -e PORT=80 \
  oxec-immigration:latest
```

请根据实际负载调整资源限制。

## 六、常用运维命令

```bash
# 查看容器日志
docker logs -f oxec-immigration

# 停止容器
docker stop oxec-immigration

# 启动容器
docker start oxec-immigration

# 删除容器
docker rm -f oxec-immigration
```
