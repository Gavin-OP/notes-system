---
title: "Feature Engineering"
slug: "feature-engineering"
display: true
order: 5
subject: "data-science"

# Mindmap相关
mindmap_category: "Data & Data Handling"
mindmap_importance: "high"

# Learning Path相关
learning_phase: 2
learning_order: 1
prerequisites: ["data-cleaning"]

tags: 
  - data-science
  - data-handling
  - feature-engineering
  - preprocessing
---

# Feature Engineering

## 概念简介

Feature Engineering（特征工程）是将原始数据转换为更适合机器学习模型的特征的过程。它是提升模型性能的关键环节。

"Applied machine learning is basically feature engineering." - Andrew Ng

## 核心技术

特征工程包括多个方面：

- **特征创建** - 从现有特征生成新特征
- **特征变换** - 改变特征的分布或尺度
- **特征选择** - 选择最有价值的特征
- **特征编码** - 将类别变量转换为数值

## 与其他概念的关系

特征工程在 [[data-cleaning]] 完成后进行。

好的特征工程可以显著提升 [[supervised-learning]] 模型的性能。

但需要注意避免 [[overfitting-underfitting]]，不要创建过多复杂特征。

特征工程的质量会直接影响 [[model-selection]] 的效果。

## 最佳实践

（本节内容将在后续完善）

- 基于领域知识创建特征
- 使用特征重要性进行筛选
- 注意特征之间的相关性
- 警惕数据泄露问题

