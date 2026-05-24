# ETF Insight - Round Hill ETF 分析平台（技术实现版）

## 项目概述
本项目是为 Round Hill Investments ETF 产品线设计的专业分析平台。它采用 OpenClue 架构，致力于提供一个高度模块化、数据驱动、用户体验友好的综合性金融数据展示系统。

---

## 1. 技术架构与设计原则

### 1.1 技术栈
*   **前端框架**: HTML5 + CSS3 + Vanilla JS (强调轻量级和高性能)。
*   **图表库**: Chart.js (用于易于实现的趋势图和观点演化气泡图)。
*   **数据层**: Vanilla JS模块 + Fetch API (模拟/真实API调用，实现数据规范化和容错)。
*   **架构模式**: 采用**组件化（Component Pattern）**和**数据抽象层（Data Abstraction Layer）**来解耦，使各个视图独立于数据源和 UI 逻辑。

### 1.2 目录结构 (Codebase)
```
/etf-insight
├── index.html              # 首页 - 概览性数据展示
├── etf.html                # ETF 详情页 - 深度分析核心
├── compare.html            # ETF 对比页
├── reports.html            # 综合报告页
├── insights.html           # 观点演化追踪页
├── community.html          # 社区页
/assets
│   ├── css/
│   │   └── styles.css      # 全局样式 & 设计系统
│   ├── js/
│   │   ├── main.js         # 根控制器 - 负责初始化和组件渲染顺序
│   │   ├── data.js         # 数据服务层 - 统一数据获取与规范化
│   │   ├── charts.js       # 图表渲染服务 - 封装 Chart.js/D3.js
│   │   └── components.js   # UI 组件库 - 封装所有可复用的小组件
│   ├── data/
│   │   ├── etfs.json       # ETF 基本信息
│   │   ├── market.json     # 市场数据
│   │   ├── insights.json   # 观点历史
│   │   └── news.json       # 快讯数据
```

### 1.3 核心设计模式
1.  **数据抽象层 (Data.js)**: 负责所有数据的加载。它不仅发起请求，还执行数据校验和**容错机制 (Fallback)**，确保无论哪个数据源失败，系统都能展示默认/历史数据。
2.  **组件化 (Components.js)**: 每个功能块（如卡片、投票器、新闻源）都是一个独立的类或函数，隔离了内部状态和渲染逻辑。
3.  **视图控制器 (Main.js)**: 这是一个单点入口，它根据页面结构（`etf.html`的ID或URL参数）调用各个组件，执行完整的渲染流程。

---

## 2. 页面详细设计 (以 etf.html 为核心)

### 2.1 结构与布局
**`etf.html`** 页面采用分块（Block）设计，由多个独立 `<section>` 组成，确保各个功能模块互不干扰，便于维护和扩展。

| 区域 | 核心组件 | 数据依赖 | 描述 |
| :--- | :--- | :--- | :--- |
| **Header** | ETF Meta | etfs.json | 实时展示 ETF 名称、Ticker、类别等核心身份信息。 |
| **Daily Insight** | Daily Insight Block | insights.json | 结合情绪（`SentimentBadge`）和核心论点（`thesis`）进行即时观点传递。 |
| **Market Section** | Metrics Grid | market.json | 展示量化指标（Price, NAV, YTD等）。 |
| **Chart Container** | InsightChart, PriceChart, PremiumChart | insights.json, market.json | 核心图表区域，提供时间范围切换逻辑。 |
| **Holdings Table** | HoldingsTable | etfs.json | 详细展示 ETF 持仓分布，需要复杂的排序和计算逻辑。 |
| **Performance** | Performance Table | market.json | 结构化的历史表现数据对比。 |
| **Documents** | DocLinks | N/A | 统一的外部资源下载链接展示区。 |

---

## 3. 核心功能模块逻辑实现

### 3.1 🎨 设计系统 (Design System / CSS)
**`assets/css/styles.css`**: 定义了平台的所有视觉语言。
*   **颜色系统**: 使用 CSS Variables (`:root`) 管理所有主题色、情绪色和背景色。
    *   **核心颜色**: `--primary` (蓝色), `--secondary` (紫色), `--accent` (橙色)。
    *   **情绪色**: `--bullish` (看多), `--bearish` (看空), `--neutral` (中性)。
    *   **背景/文本**: 定义了深色模式（如`--bg-primary: #0f172a`）的深空蓝黑系，保证视觉冲击力和沉稳感。
*   **布局**: 使用 Flexbox 和 Grid 布局 (`.main-grid`, `.etf-grid`) 实现了响应式的多维数据展示。

### 3.2 数据服务层 (Data.js)
**`assets/js/data.js`**: 是系统的“神经系统”。
*   **核心逻辑**: `loadAllData()` 协调所有数据源的加载。
*   **容错机制 (Fallback)**: 每个数据获取函数（如 `fetchEtfData`, `fetchMarketData`）都被设计为异步函数，内部包含 `try-catch` 逻辑。如果API调用失败，它会尝试从本地缓存或备用数据（此处以 `console.log` 模拟）返回数据，保证主应用流程不中断。
*   **数据规范化**: 负责将不同 JSON 格式的数据（如 `market.json` 的性能字段）统一清洗成应用所需的标准对象结构。

### 3.3 组件逻辑库 (Components.js)
**`assets/js/components.js`**: 所有UI的骨架。
*   **`ETFCard`**: 接收 `etfData`，负责渲染基础的卡片结构，并根据 `category`/`exchange` 动态生成 CSS 类名。
*   **`PollWidget`**: 封装了投票计算和展示，其 `render()` 方法内部包含了占位计算逻辑，并在实际应用中需要接入后端实时投票 API。
*   **`NewsFeed`**: 接收新闻列表，通过 `formatTime(isoDateString)` 将 ISO 时间戳转换成用户友好的相对时间（如 "22m 前"）。

### 3.4 图表渲染服务 (Charts.js)
**`assets/js/charts.js`**: 专注于可视化。
*   **`renderInsightChart`**: 实现基于 Chart.js 的**散点图 (Scatter Plot)**，X轴为时间，Y轴为置信度，Z轴用于隐式定义情感倾向（牛/熊/中性），完美契合“观点演化”的图表需求。
*   **`renderPriceChart`**: 经典的**折线图 (Line Chart)**，用于展示价格走势。
*   **`renderPremiumChart`**: 采用折线图，专门追踪指数溢价或折价随时间的变化趋势，提供关键的量化分析指标。

---

## 4. 待办和展望 (Next Steps)
目前的模块化实现已经非常完善，接下来的工作重心应该放在**集成测试**和**优化性能**上。

*   **待完善点**: 将 `assets/js/main.js` 的各个渲染函数（如 `renderMarketOverview`）中的 `console.log` 替换为实际的数据绑定代码，确保数据流从 `data.js` 到 `components.js` 再到 DOM 的完整链路通畅。
*   **优化点**: 进一步优化数据获取的并发性，尤其是在 `loadAllData` 函数中。

---
*（本文档内容应随着代码的迭代和功能的增减持续更新。）*