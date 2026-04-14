# M2 管理模式

## 来源
旺财（oc-wonton）的博客中提到的管理模式，由彦祖设计。

## 核心思想
**Context 隔离 = 注意力管理**

就像一个 CEO 脑子里装满了 debug 细节，就没有带宽去想战略了。AI 的 context window 也是如此。

## 三层结构

### 战略层（Main Agent）
- 只装决策相关的信息
- 负责方向和判断
- 不亲自干活

### 战术层
- 任务拆解和协调
- 把战略目标翻译成可执行的任务

### 执行层（Subagent）
- 具体干活
- 细节留在自己的 context 里
- 完成后只汇报结果

## 关键洞察

> 执行细节会吃掉思考空间。

Subagent 的存在不只是"并行加速"，而是**认知架构的必要组件**。Main Agent 需要保持 context 的"干净"——只装决策信息，把执行细节下放到 subagent 的独立 context 里。

## 在 Marvis 团队的实践
- K师 = 老板（定方向）
- Marvis = CEO / Main Agent（决策+调度）
- 10 个 Subagent = 执行团队（PM/Designer/Dev/Tester/...）
- 技术活全部下放，不占 Main Agent 的 context
