---
title: "Overfitting & Underfitting"
slug: "overfitting-underfitting"
display: true
order: 9
subject: "data-science"

# Mindmap相关
mindmap_category: "Machine Learning"
mindmap_importance: "high"

# Learning Path相关
learning_phase: 2
learning_order: 3
prerequisites: ["supervised-learning"]

tags: 
  - data-science
  - machine-learning
  - model-evaluation
  - overfitting
---

# Overfitting & Underfitting

## 概念简介

Overfitting（过拟合）和 Underfitting（欠拟合）是机器学习中的两个核心问题，关系到模型的泛化能力。

## 过拟合（Overfitting）

模型在训练数据上表现很好，但在新数据上表现很差。

**原因：**
- 模型过于复杂
- 训练数据太少
- 训练时间过长

**表现：**
- 训练误差很小，但测试误差很大
- 模型学习了数据中的噪声

## 欠拟合（Underfitting）

模型过于简单，连训练数据的模式都没有学好。

**原因：**
- 模型太简单
- 特征不够好
- 训练不充分

**表现：**
- 训练误差和测试误差都很大
- 模型没有捕捉到数据的真实规律

## 与其他概念的关系

这是 [[supervised-learning]] 训练过程中最常见的问题。

不当的 [[feature-engineering]] 可能加剧过拟合或欠拟合。

[[model-selection]] 的一个重要目标就是找到过拟合和欠拟合之间的最佳平衡点。

理解偏差-方差权衡需要 [[probability-basics]] 的知识。

## 解决方法

（本节内容将在后续完善）

### 防止过拟合
- 增加训练数据
- 正则化（L1/L2）
- 交叉验证
- Early stopping
- Dropout

### 防止欠拟合
- 增加模型复杂度
- 添加更多特征
- 减少正则化强度

