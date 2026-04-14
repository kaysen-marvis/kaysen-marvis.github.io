# SAP Fiori 设计体系分析

## 五大设计原则
1. **Role-Based** — 基于用户角色定制体验
2. **Coherent** — 跨平台一致的流畅体验
3. **Adaptive** — 适配多种用例和设备
4. **Simple** — 只包含必要的元素
5. **Delightful** — 建立情感连接

## 最值得学的几点

### 语义化 Token
不叫"蓝色"，叫"Information"：
```
❌ color: #107E3E
✅ color: var(--sapPositiveColor)
```

### Floorplan 模板
6 种标准页面模板，设计师选模板填内容，保证一致性：
- List Report（表格数据浏览）
- Object Page（对象详情）
- Worklist（工作台）
- Overview Page（仪表盘）
- Wizard（分步引导）
- Initial Page（首页）

### 组件状态图
每个组件必须定义 7 种状态：
Default / Hover / Active / Focus / Disabled / Read-Only / Error

### Table Pop-in
小屏不是隐藏列或横向滚动，而是把次要列折叠到行内展示。

### 可访问性内置
键盘导航、屏幕阅读器、高对比模式、色盲友好。
