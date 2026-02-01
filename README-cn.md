# 猫娘图片生成器

一个简单的网页应用，从 nekos.best API 获取随机猫娘图片，支持多语言。

[查看效果](https://greenhatteam.github.io/neko-images/)

## 功能特点
- 从 nekos.best API 获取随机猫娘图片
- 显示艺术家信息和来源链接
- 多语言支持（自动检测用户语言）
- 响应式设计，适配各种设备
- 简洁现代的深色主题界面

## 工作原理

### API 调用
应用通过 JavaScript 的 Fetch API 调用 nekos.best 的公开接口：

> const response = await fetch('https://nekos.best/api/v2/neko?t=${timestamp}');

为了防止浏览器缓存，我们在 URL 中添加了时间戳参数。每次请求都会返回一个包含猫娘图片数据的 JSON 对象。

### 数据处理
API 返回的数据格式如下：

```json
{
  "results": [
    {
      "artist_name": "艺术家名字",
      "artist_href": "艺术家主页链接",
      "source_url": "图片来源链接",
      "url": "猫娘图片直接链接"
    }
  ]
}
```

应用会提取这些数据并更新页面：
1. 将图片直接链接设置到 <img> 元素的 src 属性
2. 显示艺术家名字
3. 将艺术家主页链接和图片来源链接设置为可点击的超链接
4. 更新加载状态和错误处理信息

### 语言系统
应用启动时会检测用户语言偏好，按以下顺序：
1. URL 中的 lang 参数
2. localStorage 中保存的语言偏好
3. 浏览器默认语言

检测到语言代码后，会尝试加载对应的语言文件：

> 尝试加载完整语言代码文件（如 zh-CN.js）
> 如果失败且语言代码包含连字符，尝试基础语言代码（如 zh.js）
> 如果都失败，回退到英语（en.js）

语言文件使用 ES6 模块导出，包含所有界面文本的翻译键值对。

### 界面更新
所有文本元素都通过 data-key 属性标记：

> <div data-key="artistName">艺术家名字</div>

语言加载器会自动用对应语言的文本替换这些元素的内容，图片的 alt 属性也会根据当前语言动态设置。

## 使用方法
1. 点击[这里](https://greenhatteam.github.io/neko-images/)以打开 index.html
2. 点击"获取图片"按钮获取新的猫娘图片
3. 在信息面板查看艺术家详情和来源链接
4. 应用会自动根据浏览器语言显示界面

## 语言支持
应用支持多种语言：
- 英文 (en) - 默认语言
- 简体中文 (zh-CN)
- 繁体中文 (zh-TW, zh-HK)
- 基础中文 (zh)

要添加新语言，在 languages/ 目录创建新文件 \[语言代码\].js，按照现有语言文件的格式编写，系统会自动检测并使用。

## 使用的API
本项目使用 [nekos.best API](https://nekos.best) 获取猫娘图片和相关数据。

## 浏览器兼容性
支持所有现代浏览器，需要支持：
- ES6 模块
- Fetch API
- CSS Flexbox/Grid
- 动态导入

## 许可证
[MIT许可证](./LICENSE)