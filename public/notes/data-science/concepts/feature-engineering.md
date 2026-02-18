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

## Concept Overview

Feature Engineering is the process of transforming raw data into features that are more suitable for machine learning models. It is a key step in improving model performance.

"Applied machine learning is basically feature engineering." - Andrew Ng

## Core Techniques

Feature engineering includes multiple aspects:

- **Feature Creation** - Generate new features from existing ones
- **Feature Transformation** - Change feature distribution or scale
- **Feature Selection** - Select the most valuable features
- **Feature Encoding** - Convert categorical variables to numeric

## Relationships with Other Concepts

Feature engineering is performed after [[data-cleaning]] is completed.

Good feature engineering can significantly improve the performance of [[supervised-learning]] models.

However, care must be taken to avoid [[overfitting-underfitting]] by not creating too many complex features.

The quality of feature engineering directly affects the effectiveness of [[model-selection]].

## Best Practices

(This section will be refined in future updates)

- Create features based on domain knowledge
- Use feature importance for filtering
- Pay attention to correlations between features
- Beware of data leakage issues
