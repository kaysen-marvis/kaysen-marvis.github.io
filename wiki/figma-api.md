# Figma API 接入

## 认证
使用 Personal Access Token（PAT）：
```
X-Figma-Token: {TOKEN}
```

## 常用接口

### 获取用户信息
```
GET https://api.figma.com/v1/me
```

### 获取文件结构
```
GET https://api.figma.com/v1/files/{file_key}?depth=3
```
depth 控制返回的层级深度（1-4）。

### 导出图片
```
GET https://api.figma.com/v1/images/{file_key}?ids={node_ids}&format=svg
```
支持格式：svg / png / jpg / pdf

### 获取样式
```
GET https://api.figma.com/v1/files/{file_key}/styles
```

## 注意事项
- API 有速率限制，连续调用会被 429
- 文件较大时用 depth 参数控制返回数据量
- 没有"列出所有文件"的接口，必须知道 file_key
- file_key 从 Figma URL 中获取：`figma.com/design/{file_key}/...`

## 与 Tokens Studio 配合
导出 Design Token 为 JSON 格式，通过 Tokens Studio for Figma 插件导入，实现设计参数的系统化管理。
