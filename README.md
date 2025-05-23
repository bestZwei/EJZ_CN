### 此仓库不再更新，请移步的 honoka55 项目 https://honoka55.github.io/erjian-convert/

# 二简字转换器 (Second-Stage Chinese Character Converter)

这个项目是一个在线工具，用于将简体中文文本转换为「第二次汉字简化方案」（俗称"二简字"）。

## 项目概述

二简字转换器是一个网页应用，能够实时将输入的简体中文字符转换为对应的二简字形式，支持直观的字符对照和多种输出格式。

演示站：https://ejz.is-an.org/

### 特性

- 简体中文到二简字的在线转换
- 直观的字符显示和对照
- 支持混合显示模式和纯文本模式
- 支持复制转换结果为文本或图片
- 支持将转换结果导出为图片
- 响应式设计，适配不同设备
- 支持URL参数方式传递文本

## 什么是二简字？

二简字是指中国在1977年提出的《第二次汉字简化方案（草案）》中的汉字。该方案是继1956年《汉字简化方案》之后的又一次汉字简化尝试，提出了约800个汉字的进一步简化形式。这个方案最终未被正式采用，但作为历史文物和研究对象仍有重要意义。

## 如何使用

1. 在输入框中输入需要转换的简体中文文本
2. 点击"转换"按钮
3. 在结果框中查看转换后的内容
4. 可通过"混合显示"按钮切换显示模式
5. 使用复制按钮可复制文本结果
6. 使用复制图片或下载图片按钮可获取图片形式的结果

您也可以通过URL参数直接传递文本进行转换，例如：
```
https://您的网站地址/?text=要转换的文本
```

## 技术实现

- 前端：HTML, CSS, JavaScript
- 字符转换：基于预定义的映射字典
- 字形显示：使用GlyphWiki SVG图像
- 图片导出：使用html2canvas库

## 数据来源

二简字字形数据来源于[GlyphWiki](http://glyphwiki.org/wiki/Group:%E7%AC%AC%E4%BA%8C%E6%AC%A1%E6%B1%89%E5%AD%97%E7%AE%80%E5%8C%96%E6%96%B9%E6%A1%88%E3%83%BB%E7%AC%AC%E4%B8%80%E8%A1%A8)。

## 部署

项目已配置为可直接部署到Vercel平台。也可以作为静态网站部署到任何托管服务，不需要服务器端支持。

## 许可证

本项目使用MIT许可证。

## 贡献

欢迎对项目提出建议或贡献代码，可以通过提交Pull Request或Issues参与项目改进。
