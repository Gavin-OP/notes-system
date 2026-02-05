---
title: "Supervised Learning"
slug: "supervised-learning"
display: true
order: 8
subject: "data-science"

# Mindmap相关
mindmap_category: "Machine Learning"
mindmap_importance: "high"

# Learning Path相关
learning_phase: 2
learning_order: 2
prerequisites: ["feature-engineering", "probability-basics"]

tags: 
  - data-science
  - machine-learning
  - supervised-learning
---

# Supervised Learning

## 概念简介

Supervised Learning（监督学习）是机器学习的一种范式，通过标注数据训练模型，使其能够对新数据进行预测。

## 核心思想

监督学习的基本流程：

1. **收集标注数据** - 包含输入特征和对应的正确答案
2. **训练模型** - 让模型学习输入到输出的映射关系
3. **评估性能** - 在测试集上验证模型效果
4. **预测** - 对新数据进行预测

## 主要类型

- **分类问题** - 预测离散的类别标签（如垃圾邮件检测）
- **回归问题** - 预测连续的数值（如房价预测）

## 常见算法

- 线性回归/逻辑回归
- 决策树
- 随机森林
- 支持向量机（SVM）
- 神经网络

## 与其他概念的关系

监督学习需要经过 [[feature-engineering]] 处理的高质量特征。

理解 [[probability-basics]] 有助于掌握许多监督学习算法的原理。

训练监督学习模型时需要警惕 [[overfitting-underfitting]] 问题。

[[model-selection]] 帮助我们在不同的监督学习算法中选择最佳模型。

## 挑战

（本节内容将在后续完善）

- 需要大量标注数据
- 标注成本高
- 泛化能力
- 类别不平衡

