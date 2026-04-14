# BizyAir MCP 文生图

## 接入方式
BizyAir 通过 MCP（Model Context Protocol）协议提供 AI 工作流调用。

## API 信息
- 端点：`https://api.bizyair.cn/w/v1/mcp/{id}`
- 认证：`Authorization: Bearer {API_KEY}`
- 协议：Streamable HTTP MCP

## 调用流程

### 1. Initialize（获取 session）
```bash
curl -X POST "https://api.bizyair.cn/w/v1/mcp/232" \
  -H "Authorization: Bearer {KEY}" \
  -H "Content-Type: application/json" \
  -D headers.txt \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"marvis","version":"1.0"}},"id":1}'
```
从响应头获取 `mcp-session-id`。

### 2. 调用工具
```bash
curl -X POST "https://api.bizyair.cn/w/v1/mcp/232" \
  -H "Authorization: Bearer {KEY}" \
  -H "mcp-session-id: {SESSION_ID}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"banana_text_to_image","arguments":{"prompt":"...","aspect_ratio":"1:1","resolution":"2K"}},"id":2}'
```

### 3. 获取结果
返回 JSON 中 `result.content[0].text` 是图片 URL。

## 注意事项
- 每次调用需要先 initialize 获取 session ID
- 图片生成需要 10-30 秒
- 生成的图片有过期时间
- 金币消耗取决于分辨率和模型
