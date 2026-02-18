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

## Concept Overview

Data Cleaning is the process of identifying and correcting data quality issues, including handling missing values, outliers, duplicate data, etc.

According to statistics, data scientists spend 80% of their time on data cleaning.

## Common Data Quality Issues

- **Missing Values** - Incomplete data
- **Outliers** - Extreme values that don't conform to normal distribution
- **Duplicate Data** - Same record appearing multiple times
- **Inconsistent Formats** - Same field represented in different ways
- **Wrong Data Types** - Numeric data stored as strings

## Relationships with Other Concepts

Data cleaning is performed after [[data-collection]] and is the first step of data preprocessing.

Cleaned data will be used for [[feature-engineering]] to create features for modeling.

Improper data cleaning may lead to information loss, affecting the accuracy of [[descriptive-statistics]].

## Processing Methods

(This section will be refined in future updates)

- Missing value handling: deletion, imputation, interpolation
- Outlier detection: statistical methods, visualization
- Data standardization and normalization
