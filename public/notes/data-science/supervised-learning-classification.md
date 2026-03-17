# Supervised Learning: Classification Models

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between classification and regression problems.
- Understand the core intuition behind Logistic Regression and how it uses probabilities to classify.
- Grasp the decision-making process of Decision Trees and how they split data.
- Implement basic classification models using scikit-learn.
- Evaluate classification model performance using a Confusion Matrix, Accuracy, Precision, Recall, and F1-Score.

## Introduction
Welcome back to the fascinating world of [supervised learning](../data_science/supervised-learning-regression.md)! In our previous lesson, [supervised-learning-regression](../data_science/supervised-learning-regression.md), we explored how [machine learning](../data_science/introduction-to-machine-learning.md) models can predict continuous numerical values, like house prices or temperatures. We learned to estimate "how much" or "how many."

But what if your goal isn't to predict a number, but rather to assign an item to a specific category or label? For instance, imagine you want to build a system that can tell if an email is `spam` or `not spam`, or if a customer is `likely to churn` or `not likely to churn`. This is where **classification** comes into play.

Classification is a fundamental task in [machine learning](../data_science/introduction-to-machine-learning.md) that helps us sort data into predefined categories. It's incredibly powerful and forms the backbone of countless real-world applications, from medical diagnosis and sentiment analysis to fraud detection and image recognition. In this lesson, we'll dive deep into what classification is, explore two popular and intuitive classification models – Logistic Regression and Decision Trees – and learn how to evaluate their performance effectively.

## Concept Progression

### What is Classification? Predicting Categories

At its heart, classification is about making a choice: assigning an input data point to one of several discrete categories. Think of it like sorting items into different, clearly labeled bins.

Let's consider some everyday examples to solidify this idea:
*   **Spam Detection**: Is an email `spam` or `not spam`? (Two categories)
*   **Disease Diagnosis**: Does a patient have `Disease A`, `Disease B`, or `No Disease`? (Multiple categories)
*   **Image Recognition**: Is this picture a `cat`, `dog`, `bird`, or `car`? (Multiple categories)

The key difference from regression lies in the nature of the output:
*   **Regression**: Predicts a *continuous number* (e.g., 150000.50, 25.7 degrees Celsius).
*   **Classification**: Predicts a *discrete category* or *label* (e.g., "spam", "not spam", "cat").

[IMAGE_PLACEHOLDER: A simple diagram contrasting regression and classification. On the left, a scatter plot with a regression line showing continuous output. On the right, a scatter plot with a decision boundary separating two classes (e.g., red circles and blue squares), illustrating discrete output. Labels: "Regression: Continuous Output" and "Classification: Discrete Output".]

Classification problems can generally be divided into two types:
1.  **Binary Classification**: There are only two possible output categories (e.g., `yes/no`, `true/false`, `spam/not spam`). This is the most common starting point and what we'll focus on primarily.
2.  **Multi-class Classification**: There are more than two possible output categories (e.g., `cat/dog/bird`, `Disease A/Disease B/No Disease`). Many multi-class problems can actually be broken down into multiple binary problems.

Now that we understand *what* classification is, let's explore how different models actually perform this sorting task. We'll start with a model that uses probabilities to make its decisions.

### Logistic Regression: Classifying with Probabilities

Despite its name, **Logistic Regression** is a classification algorithm, not a regression one! The "regression" part comes from the fact that it uses a linear equation to predict a *probability*, and then this probability is used for classification. It's a powerful and widely used model, especially for binary classification.

#### The Intuition: From a Score to a Probability
Imagine you're trying to predict if a student will pass an exam based on the hours they studied. A simple linear model might give you a "score" for each student (e.g., 0.5, 1.2, -0.3). But how do you turn a score (which can be any number) into a clear `pass` or `fail` prediction?

Logistic Regression solves this by taking that linear score and "squashing" it into a probability that always falls between 0 and 1.

1.  **Linear Combination**: First, just like in [linear regression](../data_science/supervised-learning-regression.md), it calculates a weighted sum of your input features. This gives us a raw "score," often denoted as `z`:
    `z = b0 + b1*x1 + b2*x2 + ...`
    Here, `z` can be any real number, from negative infinity to positive infinity.

2.  **The Sigmoid Function**: To convert `z` into a probability `p` (which must be between 0 and 1), Logistic Regression uses a special S-shaped curve called the **sigmoid function** (also known as the logistic function).
    `p = 1 / (1 + e^(-z))`

    Let's see how this function transforms `z`:
    *   If `z` is a very large positive number, `e^(-z)` becomes very small, so `p` approaches 1.
    *   If `z` is 0, `p` is exactly 0.5.
    *   If `z` is a very large negative number, `e^(-z)` becomes very large, so `p` approaches 0.

This sigmoid function smoothly maps any real number `z` to a probability `p` between 0 and 1, making it perfect for classification.

[IMAGE_PLACEHOLDER: A plot of the sigmoid function. The x-axis represents 'z' (the linear score), and the y-axis represents 'p' (the probability). The curve should smoothly go from near 0, through 0.5 at z=0, to near 1, forming an 'S' shape. Labels for x and y axes are crucial.]

#### Making a Decision: The Decision Boundary
Once we have a probability `p` for an instance belonging to the positive class, we need a rule to classify it. The most common rule is to set a **threshold**, usually 0.5:
*   If `p >= 0.5`, predict the positive class (e.g., `spam`, `pass`, `churn`).
*   If `p < 0.5`, predict the negative class (e.g., `not spam`, `fail`, `no churn`).

This threshold defines a **decision boundary**. In a 2D plot, this boundary is a line (or a hyperplane in higher dimensions) that separates the two classes. Everything on one side of the line is classified as one class, and everything on the other side is classified as the other.

**Example: Predicting Customer Churn**
Let's say we want to predict if a customer will churn (`1`) or not churn (`0`) based on their monthly bill amount.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Sample data: Monthly bill (X) and Churn (y)
# Notice how higher bill amounts tend to be associated with churn (1)
X = np.array([20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]).reshape(-1, 1)
y = np.array([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]) # 0=No Churn, 1=Churn

# Split data into training and testing sets (good practice for real-world scenarios)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Create and train a Logistic Regression model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predict probabilities and classes for the test data
probabilities = model.predict_proba(X_test)[:, 1] # Probability of class 1 (churn)
predictions = model.predict(X_test)

print(f"Test data X (Monthly Bill): {X_test.flatten()}")
print(f"Predicted probabilities of Churn: {np.round(probabilities, 2)}")
print(f"Predicted classes: {predictions}")
print(f"Actual classes: {y_test}")
print(f"Accuracy on test set: {accuracy_score(y_test, predictions):.2f}")

# Plotting the decision boundary and sigmoid curve
plt.figure(figsize=(8, 6))
plt.scatter(X[y==0], y[y==0], color='blue', label='No Churn (0)', s=100, alpha=0.7)
plt.scatter(X[y==1], y[y==1], color='red', label='Churn (1)', s=100, alpha=0.7)

# Plot the sigmoid curve
x_vals = np.linspace(X.min() - 10, X.max() + 10, 300).reshape(-1, 1) # Extend range for smoother curve
y_proba = model.predict_proba(x_vals)[:, 1]
plt.plot(x_vals, y_proba, color='green', linewidth=2, label='Churn Probability (Sigmoid)')

# Plot the decision boundary at 0.5 probability
plt.axhline(0.5, color='gray', linestyle='--', label='Decision Boundary (0.5)')
plt.xlabel("Monthly Bill Amount")
plt.ylabel("Churn Probability / Class")
plt.title("Logistic Regression for Churn Prediction")
plt.legend()
plt.grid(True)
plt.show()
```
In the plot, you'll observe how the sigmoid curve smoothly transitions from low probability to high probability as the monthly bill increases. The point where this curve crosses the 0.5 probability line is our decision boundary, clearly separating customers predicted to churn from those predicted not to churn.

While Logistic Regression uses a smooth, probabilistic approach to find a decision boundary, Decision Trees take a very different, more step-by-step approach, mimicking human thought processes.

### Decision Trees: Making Decisions Like a Flowchart

Decision Trees offer a very different, yet incredibly intuitive, approach to classification. They mimic human decision-making by breaking down data into smaller and smaller subsets based on a series of simple questions. Think of it like a flowchart or a game of "20 Questions."

#### The Intuition: Asking Questions to Classify
Imagine you're trying to decide what to wear based on the weather. You don't immediately know the answer; you ask a series of questions:
*   **Question 1**: Is it raining?
    *   **Yes**: Okay, wear a raincoat. (Decision made!)
    *   **No**: Hmm, not raining. Now, **Question 2**: Is it cold?
        *   **Yes**: Wear a jacket. (Decision made!)
        *   **No**: Okay, not cold either. Wear a t-shirt. (Decision made!)

A Decision Tree works in precisely this manner. It asks a series of "yes/no" or "true/false" questions about the features of your data. Each answer leads you down a different branch of the tree until you reach a final decision (a leaf node), which is the predicted class label.

[IMAGE_PLACEHOLDER: A simple decision tree diagram. Start with a root node "Is it raining?". Two branches: "Yes" and "No". "Yes" leads to a leaf node "Raincoat". "No" leads to an internal node "Is it cold?". Two branches from there: "Yes" leads to "Jacket", "No" leads to "T-shirt". Clearly label root, internal, and leaf nodes.]

#### How They Split: Nodes, Branches, and Leaves
*   **Root Node**: The very first decision point at the top of the tree. It represents the entire dataset.
*   **Internal Nodes**: Decision points within the tree, asking questions about specific features (e.g., "Is `feature_X` > `threshold`?"). Each internal node has branches leading to further decisions.
*   **Branches**: The paths connecting nodes, representing the outcome of a decision (e.g., `True` or `False`, `Yes` or `No`).
*   **Leaf Nodes**: The final nodes at the end of the branches. These contain the predicted class label (e.g., `spam`, `not spam`, `Apple`, `Orange`). Once you reach a leaf node, your classification is complete.

The tree learns by finding the "best" features and thresholds to split the data at each node. The goal is to create subsets that are as "pure" as possible – meaning, they mostly contain data points belonging to a single class. This process continues until a stopping condition is met (e.g., the nodes are pure, or a maximum depth is reached).

**Example: Classifying Fruits**
Let's say we want to classify fruits as `Apple` or `Orange` based on their `weight` and `color_intensity`.

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# Sample data
data = {
    'weight': [150, 160, 140, 170, 130, 180, 120, 200, 190, 110],
    'color_intensity': [0.8, 0.9, 0.7, 0.85, 0.6, 0.95, 0.5, 0.98, 0.92, 0.4],
    'fruit': ['Apple', 'Apple', 'Apple', 'Apple', 'Apple', 'Orange', 'Orange', 'Orange', 'Orange', 'Orange']
}
df = pd.DataFrame(data)

X = df[['weight', 'color_intensity']]
y = df['fruit']

# Convert categorical target to numerical for scikit-learn (0 for Apple, 1 for Orange)
y_numeric = y.map({'Apple': 0, 'Orange': 1})

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_numeric, test_size=0.3, random_state=42)

# Create and train a Decision Tree model
# max_depth limits the tree's complexity to prevent overfitting and make it easier to visualize
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, y_train)

# Predict on the test set
predictions = model.predict(X_test)
print(f"Predicted classes (numeric): {predictions}")
print(f"Actual classes (numeric): {y_test.values}")
print(f"Accuracy on test set: {accuracy_score(y_test, predictions):.2f}")

# Visualize the Decision Tree
plt.figure(figsize=(15, 10)) # Increase figure size for better readability
plot_tree(model, feature_names=X.columns, class_names=['Apple', 'Orange'], filled=True, rounded=True, fontsize=10)
plt.title("Decision Tree for Fruit Classification", fontsize=16)
plt.show()
```
The `plot_tree` function will visually show you the flowchart, making it very clear how the model makes its decisions based on `weight` and `color_intensity`. You'll see how each node asks a question, and based on the answer, you move down a branch until you reach a leaf node that predicts whether the fruit is an 'Apple' or an 'Orange'.

Now that we've explored two distinct ways to classify data, a crucial question remains: how do we know if our models are actually performing well? This leads us to the critical topic of [model evaluation](../data_science/model-evaluation-and-selection.md).

### Evaluating Classification Models: Beyond Simple Accuracy

Once you've trained a classification model, how do you know if it's any good? Your first thought might be to look at **accuracy** – the percentage of correct predictions. While accuracy is a useful metric, it can be highly misleading, especially when your classes are imbalanced (e.g., 95% of emails are not spam, but 5% are spam).

Consider a hypothetical spam detection model: if it simply predicted "not spam" for every single email, it would achieve 95% accuracy! However, it would miss *all* the actual spam emails, which is a terrible outcome. This highlights why we need a more detailed and nuanced approach to evaluating classification models.

#### The Confusion Matrix: A Detailed Breakdown
The **Confusion Matrix** is a powerful table that summarizes the performance of a classification model by showing the counts of correct and incorrect predictions for each class. It's the fundamental building block for many other evaluation metrics.

For a binary classification problem (like `spam/not spam` or `churn/no churn`), it typically looks like this:

|                 | **Predicted Negative** | **Predicted Positive** |
| :-------------- | :--------------------- | :--------------------- |
| **Actual Negative** | True Negative (TN)     | False Positive (FP)    |
| **Actual Positive** | False Negative (FN)    | True Positive (TP)     |

Let's break down these crucial terms:
*   **True Positive (TP)**: The model correctly predicted the positive class. (e.g., Predicted spam, Actual spam)
*   **True Negative (TN)**: The model correctly predicted the negative class. (e.g., Predicted not spam, Actual not spam)
*   **False Positive (FP)**: The model incorrectly predicted the positive class. This is also known as a **Type I error**. (e.g., Predicted spam, Actual not spam - a "false alarm" or a legitimate email wrongly sent to spam)
*   **False Negative (FN)**: The model incorrectly predicted the negative class. This is also known as a **Type II error**. (e.g., Predicted not spam, Actual spam - a "missed detection" or a spam email that got through)

[IMAGE_PLACEHOLDER: A clear, color-coded confusion matrix diagram. Use green for TP and TN (correct predictions) and red/orange for FP and FN (incorrect predictions). Arrows or labels indicating "Actual" and "Predicted" axes are essential.]

#### Key Evaluation Metrics Derived from the Confusion Matrix

Using the values from the Confusion Matrix, we can calculate more insightful metrics that give us a clearer picture of our model's strengths and weaknesses:

1.  **Accuracy**:
    *   `Accuracy = (TP + TN) / (TP + TN + FP + FN)`
    *   **What it means**: The proportion of total predictions that were correct.
    *   **When to use**: Good when classes are balanced and the cost of False Positives and False Negatives is similar.
    *   **When to be cautious**: Can be highly misleading with imbalanced datasets, as shown in our spam example.

2.  **Precision**:
    *   `Precision = TP / (TP + FP)`
    *   **What it means**: Out of all instances the model *predicted as positive*, how many were *actually* positive? It measures the quality of positive predictions.
    *   **When to use**: Important when the cost of a **False Positive** is high. For example, in spam detection, you want high precision because you don't want legitimate emails (actual negative) to be incorrectly marked as spam (predicted positive).

3.  **Recall (Sensitivity)**:
    *   `Recall = TP / (TP + FN)`
    *   **What it means**: Out of all *actual* positive instances, how many did the model correctly identify? It measures the model's ability to find all positive samples.
    *   **When to use**: Important when the cost of a **False Negative** is high. For example, in disease detection, you want high recall because you don't want to miss actual disease cases (actual positive) by incorrectly predicting them as negative.

4.  **F1-Score**:
    *   `F1-Score = 2 * (Precision * Recall) / (Precision + Recall)`
    *   **What it means**: The harmonic mean of Precision and Recall. It provides a single score that balances both metrics.
    *   **When to use**: Good when you need a balance between Precision and Recall, especially with imbalanced classes, as it penalizes models that perform poorly on either metric.

**Example: Evaluating a Churn Prediction Model**

Let's use our churn prediction model from earlier and calculate these metrics.

```python
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score, classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Re-using the churn data from Logistic Regression example
X = np.array([20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]).reshape(-1, 1)
y = np.array([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]) # 0=No Churn, 1=Churn

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Calculate Confusion Matrix
cm = confusion_matrix(y_test, predictions)
print("Confusion Matrix:")
print(cm)
# Interpretation:
# Row 0 (Actual No Churn): [TN, FP]
# Row 1 (Actual Churn):   [FN, TP]

# Calculate individual metrics
accuracy = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions) # For the positive class (1, Churn)
recall = recall_score(y_test, predictions)       # For the positive class (1, Churn)
f1 = f1_score(y_test, predictions)               # For the positive class (1, Churn)

print(f"\nAccuracy: {accuracy:.2f}")
print(f"Precision (for Churn): {precision:.2f}")
print(f"Recall (for Churn): {recall:.2f}")
print(f"F1-Score (for Churn): {f1:.2f}")

# scikit-learn's classification_report provides all these metrics at once
print("\nClassification Report:")
print(classification_report(y_test, predictions, target_names=['No Churn', 'Churn']))
```
By looking at these metrics, you get a much clearer picture of your model's strengths and weaknesses than with accuracy alone. For instance, if predicting churn (the positive class) is critical because you want to intervene and retain customers, you might prioritize a model with higher recall, even if its precision is slightly lower. This means you're willing to tolerate a few "false alarms" (customers predicted to churn who actually wouldn't have) to ensure you don't miss any actual churners.

## Wrap-Up

Congratulations! You've taken a significant step into the world of classification. We started by understanding that classification is about predicting discrete categories, contrasting it with regression's continuous outputs. We then explored two powerful and distinct models:

*   **Logistic Regression**, which uses a linear combination of features and the S-shaped sigmoid function to predict probabilities, ultimately drawing a smooth decision boundary.
*   **Decision Trees**, which make decisions like a flowchart through a series of simple, rule-based splits, leading to clear, interpretable paths to classification.

Finally, and crucially, we learned why simple accuracy isn't always enough to evaluate a classification model. We discovered the power of the **Confusion Matrix** and how it allows us to calculate more nuanced metrics like **Precision**, **Recall**, and **F1-Score**, enabling us to understand our model's performance in detail and make informed decisions based on the specific costs of different types of errors.

These models are just the beginning. Many other classification algorithms exist, but the core concepts of probability-based classification, tree-based decisions, and robust evaluation metrics are fundamental to all of them. In the next lesson, we'll continue to build on these foundations, exploring more advanced [supervised learning](../data_science/supervised-learning-regression.md) techniques and how to improve model performance further.