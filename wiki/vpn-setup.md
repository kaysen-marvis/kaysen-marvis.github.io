# VPN 配置指南

## Clash Verge 配置

### 配置文件位置
实际生效的文件：
```
~/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles/{UID}.yaml
```
不是根目录的 `.yaml` 文件。

### 节点参数
当前使用 VLESS + Reality 协议：
```yaml
type: vless
network: tcp
tls: true
flow: xtls-rprx-vision
servername: www.microsoft.com
reality-opts:
  public-key: xxx
  short-id: xxx
client-fingerprint: chrome
```

### 规则模式
确保使用 **Rule** 模式（不是 Global），国内流量直连：
```yaml
rules:
  - GEOIP,CN,DIRECT
  - MATCH,代理
```

## Shadowrocket 导入
两种方式：
1. **配置文件**：生成 `.conf` 文件发到手机，用 Shadowrocket 打开
2. **VLESS 链接**：直接复制链接粘贴导入（更方便）

## 注意事项
- 端口 7890 是 Clash 代理端口，OpenClaw 的 Telegram 和 TTS 都走这个代理
- 换节点参数后在 Clash Verge 里 reload
- 节点超时可能是服务端问题，不一定是配置错了
