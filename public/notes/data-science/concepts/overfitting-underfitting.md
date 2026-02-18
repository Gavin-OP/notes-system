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

## Concept Overview

Overfitting and Underfitting are two core problems in machine learning, relating to model generalization capability.

## Overfitting

The model performs well on training data but poorly on new data.

**Causes:**
- Model too complex
- Too little training data
- Training for too long

**Symptoms:**
- Small training error but large test error
- Model learned noise in the data

## Underfitting

The model is too simple and hasn't even learned the patterns in the training data.

**Causes:**
- Model too simple
- Features not good enough
- Insufficient training

**Symptoms:**
- Both training and test errors are large
- Model hasn't captured the true patterns in the data

## Relationships with Other Concepts

This is the most common problem in [[supervised-learning]] training processes.

Improper [[feature-engineering]] may exacerbate overfitting or underfitting.

An important goal of [[model-selection]] is to find the optimal balance between overfitting and underfitting.

Understanding bias-variance tradeoff requires knowledge of [[probability-basics]].

## Solutions

(This section will be refined in future updates)

### Preventing Overfitting
- Increase training data
- Regularization (L1/L2)
- Cross-validation
- Early stopping
- Dropout

### Preventing Underfitting
- Increase model complexity
- Add more features
- Reduce regularization strength
