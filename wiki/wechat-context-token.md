# 微信插件 contextToken 机制

## 是什么
微信插件（openclaw-weixin）发消息时需要一个 contextToken。这个 token 类似 session cookie，是微信后端用来验证发送者身份的。

## 怎么获取
只有当用户**主动发消息给 Bot** 时，微信后端才会在消息中携带 context_token。插件收到后自动缓存。

## 存储位置
```
~/.openclaw/openclaw-weixin/accounts/ae24a2bc9d9b-im-bot.context-tokens.json
```
内存 Map + 磁盘 JSON 双重存储。Gateway 重启后从磁盘恢复。

## 什么时候会丢
- Gateway 重启后，token 从磁盘恢复。但如果 token 已过期，恢复了也没用。
- 长时间不交互，token 可能过期。

## 怎么修复
让用户在微信上发一条消息，插件自动获取新的 contextToken。

## 大小写敏感
微信 target 是大小写敏感的：
```
o9cq804iXzEEU4ijT2s8cEKmPlOM@im.wechat  ✅
o9cq804ixzeeu4ijt2s8cekmplom@im.wechat  ❌
```
