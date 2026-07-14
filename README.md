# 学生月度安排日历 | Student Planning Calendar

中英双语的学生日程规划工具，支持两种模式：

- **学生日常安排 Daily Student Schedule** — 每月活动、课外项目、阅读、考试、面谈、作品集安排
- **申请季安排 Application Season Plan** — 文书、推荐信、材料递交、网申、面试、截止日期管理

## 功能

- 多学生管理，按月日历 + 一年甘特时间轴 + 自动时间轴三种视图
- 自定义类别与颜色
- 打印 / 导出 PDF（A4 横向，自动缩放为单页，与页面时间轴一致）
- 数据保存在浏览器本地（localStorage），无需后端
- 支持 URL 直达：`#daily`、`#application`、`#application/学生名`

## 本地运行

纯静态站点，任意静态服务器即可：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 文件结构

- `index.html` — 页面结构
- `styles.css` — 样式（含打印样式）
- `app.js` — 应用逻辑
- `seed.js` / `seed.json` — 初始示例数据（首次访问写入 localStorage）
