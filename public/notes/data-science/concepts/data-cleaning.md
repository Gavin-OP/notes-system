---
title: "Data Cleaning"
slug: "data-cleaning"
display: true
order: 4
subject: "data-science"

# Mindmap相关
mindmap_category: "Data & Data Handling"
mindmap_importance: "high"

# Learning Path相关
learning_phase: 1
learning_order: 2
prerequisites: ["data-collection"]

tags: 
  - data-science
  - data-handling
  - data-cleaning
  - preprocessing
---

# Data Cleaning

## 概念简介

Data Cleaning（数据清洗）是识别和纠正数据质量问题的过程，包括处理缺失值、异常值、重复数据等。

据统计，数据科学家80%的时间都花在数据清洗上。

## 常见数据质量问题

- **缺失值** - 数据不完整
- **异常值** - 不符合正常分布的极端值
- **重复数据** - 同一记录出现多次
- **格式不一致** - 同一字段有不同的表示方式
- **数据类型错误** - 数值型数据被存储为字符串

## 与其他概念的关系

数据清洗在 [[data-collection]] 之后进行，是数据预处理的第一步。

清洗后的数据会被用于 [[feature-engineering]]，创建用于建模的特征。

不当的数据清洗可能导致信息丢失，影响 [[descriptive-statistics]] 的准确性。

## 处理方法

（本节内容将在后续完善）

- 缺失值处理：删除、填充、插值
- 异常值检测：统计方法、可视化
- 数据标准化和归一化

