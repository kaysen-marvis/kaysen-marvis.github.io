# OpenClaw 运维手册

## Gateway 管理

### 常用命令
- 启动：`openclaw gateway start`
- 重启：`openclaw gateway restart`（**永远不要用 stop + start**）
- 状态：`openclaw gateway status`
- 日志：`openclaw logs`

### Gateway 挂了怎么办
1. 检查进程：`lsof -i :18789`
2. 如果有进程占端口但 Gateway 没响应：`pkill -f "openclaw.*gateway" && sleep 3 && openclaw gateway start`
3. 如果5分钟内没手动修复，watchdog 会自动拉起

### 409 Conflict（多实例冲突）
Telegram 报 `getUpdates conflict` = 有两个 Gateway 在跑。
解决：`pkill -f "openclaw.*gateway" && sleep 3 && openclaw gateway start`

## 微信 contextToken

微信发消息需要 contextToken，Gateway 重启后可能失效。
**症状**：日志显示 `contextToken missing`，微信发不出去。
**解决**：让 K师 在微信上发一条消息，自动恢复。

## 看门狗
位置：`~/Library/LaunchAgents/com.marvis.gateway-watchdog.plist`
脚本：`~/.openclaw/scripts/gateway-watchdog.sh`
功能：每 5 分钟检查 Gateway 是否存活，挂了自动拉起。

## TTS 语音
- Provider：Microsoft Edge TTS
- 声音：zh-CN-YunxiNeural（云希）
- **关键**：需要配 proxy `http://127.0.0.1:7890`，否则连不上微软服务
- 模式：tagged（需要时手动加语音）
