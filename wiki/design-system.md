# 设计系统搭建思路

## 四大准则
1. **主题准确** — 设计方向跟业务目标一致
2. **风格统一** — 全局一套视觉语言
3. **交互合理** — 符合用户心智模型
4. **组件规范** — 可复用、可维护

## 四层架构

### Layer 1: Foundations（基础层）
设计的原子：颜色、字体、间距、圆角、阴影、动效。
核心是 **Design Token** — 语义化命名，支持多主题切换。

### Layer 2: Components（组件层）
原子 → 分子 → 有机体：Button → Input → Card → Form。
每个组件必须定义完整状态（Default/Hover/Active/Focus/Disabled/Error）。

### Layer 3: Patterns（模式层）
组件的组合方式：表单模式、列表模式、分步引导（Wizard）、搜索+筛选。
解决"这几个组件怎么组合"的问题。

### Layer 4: Brand（品牌层）
Logo、插画、文案语气、品牌应用规范。

## Token 体系
不直接用色值，用语义变量：
```css
/* ❌ 直接用色值 */
color: #1B8A7B;

/* ✅ 用 Token */
color: var(--color-brand-primary);
```

好处：换主题只改 Token 映射，所有组件自动适配。

## 构建原则
1. **项目驱动** — 边做项目边沉淀，不空造规范
2. **单一来源** — 每个 token 只定义一次
3. **可扩展** — 支持多主题、多平台
4. **有据可查** — 每个决策记录理由

## 参考
- SAP Fiori：企业级设计系统标杆
- Material Design：组件状态最完善
- Apple HIG：极简质感标杆
