<a id="concept-supervised-learning-classification"></a>
# Supervised Learning: Classification

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between classification and regression tasks within supervised learning.
- Understand the core intuition behind common classification algorithms like Logistic Regression, Decision Trees, and Support Vector Machines.
- Explain the purpose and components of a Confusion Matrix.
- Define and calculate key classification evaluation metrics: Accuracy, Precision, Recall, and F1-Score.
- Recognize when to use different evaluation metrics based on the problem's context.

## Introduction
In our previous lesson on [supervised learning](../data-science/supervised-learning-regression.md#concept-supervised-learning-regression), we explored **regression**, where our goal was to predict a continuous numerical value, such as forecasting house prices or predicting tomorrow's temperature. But what if your prediction isn't a number, but rather a category or a label? For instance, you might want to decide if an email is "spam" or "not spam," or identify whether a customer will "churn" (leave) or "stay."

This is precisely where **classification** comes into play. Classification is the other major pillar of supervised learning, focusing on predicting discrete categories or classes. It's a fundamental task in machine learning with widespread applications, from medical diagnosis and image recognition to fraud detection. In this lesson, we'll dive deep into what classification entails, explore some popular algorithms used to perform it, and learn how to effectively evaluate how well our classification models are performing.

## Concept Progression

<a id="concept-classification"></a>
### The Classification Task: Sorting Data into Categories
At its core, a **classification task** involves teaching a computer to sort [data](../data-science/data-fundamentals-and-types.md#concept-data) into predefined categories or classes. Think of it like a digital sorting machine: you feed it an item, and it places that item into one of several designated bins. In machine learning, these categories are often represented by numbers (e.g., 0 for "not spam," 1 for "spam") or descriptive labels ("cat," "dog," "bird").

The most crucial distinction from regression lies in the *type* of output:
-   **Regression:** Predicts a continuous numerical value (e.g., `25.7 degrees Celsius`, `350,000 dollars`). The output can be any value within a range.
-   **Classification:** Predicts a discrete category or label (e.g., `Yes/No`, `A/B/C`, `Spam/Not Spam`). The output is one of a fixed set of options.

Let's consider a practical example: predicting if a loan applicant will default on their loan.
-   **Input Data (Features):** These are the pieces of information we have about the applicant, such as their income, credit score, existing debts, and employment status.
-   **Output (Target Variable):** This is what we want to predict: `Default` or `No Default`. Since this is a choice between distinct categories, it's a classic classification problem.

Classification problems can be further categorized based on the number of possible outcomes:
-   **Binary Classification:** There are only two possible output classes (e.g., `spam` or `not spam`, `malignant` or `benign`, `pass` or `fail`).
-   **Multi-class Classification:** There are more than two possible output classes (e.g., identifying `cat`, `dog`, or `bird` in an image, or classifying car colors as `red`, `green`, or `blue`).

<!-- IMAGE_SLOT: img-001 -->
![A diagram illustrating the difference between regression and classification. On the left, a scatter plot with a line](../../../../../image/data_science/supervised-learning-classification/img-001.png)


<a id="concept-logistic-regression"></a>
### Logistic Regression: Classifying with Probabilities
Despite its name, **Logistic Regression** is a fundamental and widely used algorithm for **binary classification**. The "regression" part of its name comes from the fact that it models the *probability* of an instance belonging to a particular class, and probabilities are continuous values between 0 and 1. However, the ultimate goal is to classify, not to predict a continuous value directly.

Imagine you're trying to predict if a student will pass an exam based on the number of hours they studied. A simple [linear regression](../data-science/supervised-learning-regression.md#concept-linear-regression) might predict a score, but we need a `Pass` or `Fail` outcome. Logistic Regression works by taking a linear combination of input features (similar to linear regression) and then passing this result through a special function called the **sigmoid function**.

The sigmoid [function](../python/functions-in-python.md#concept-function) "squashes" any real-valued number into a value between 0 and 1. This output can then be interpreted as the probability of the input belonging to the positive class. If this probability is above a certain threshold (commonly 0.5), we classify it as the positive class (e.g., `Pass`); otherwise, it's classified as the negative class (e.g., `Fail`).

**Example:**
Let's say we're predicting if an email is spam (1) or not spam (0) based on the number of suspicious words it contains.
-   If our Logistic Regression model outputs a probability of `0.8` for an email being spam, and our decision threshold is `0.5`, we classify it as `spam`.
-   If it outputs `0.2`, we classify it as `not spam`.

```python
import numpy as np

def sigmoid(z):
    """The sigmoid activation function, mapping any real value to a probability between 0 and 1."""
    return 1 / (1 + np.exp(-z))

# Example: 'z' represents the raw score from our linear model (e.g., suspicious words * weight + bias)
raw_score_for_email_A = 2.5  # A high score, suggesting many suspicious words
raw_score_for_email_B = -1.0 # A low score, suggesting few suspicious words

# Convert raw scores into probabilities using the sigmoid function
prob_email_A = sigmoid(raw_score_for_email_A)
prob_email_B = sigmoid(raw_score_for_email_B)

print(f"Probability of email A being spam: {prob_email_A:.2f}") # Output: ~0.92
print(f"Probability of email B being spam: {prob_email_B:.2f}") # Output: ~0.27

# Classify based on a 0.5 probability threshold
if prob_email_A > 0.5:
    print("Email A classified as SPAM")
else:
    print("Email A classified as NOT SPAM")

if prob_email_B > 0.5:
    print("Email B classified as SPAM")
else:
    print("Email B classified as NOT SPAM")
```

<!-- IMAGE_SLOT: img-002 -->
![A graph showing the sigmoid function (S-shaped curve). The x-axis represents the input (z, the linear combination of](../../../../../image/data_science/supervised-learning-classification/img-002.png)


### Decision Trees: A Flowchart for Decisions
Imagine making a series of "if-then-else" decisions to arrive at a conclusion. That's essentially how a **Decision Tree** works! It's a flowchart-like structure where each internal node represents a "test" on an attribute (e.g., "Is the temperature > 25°C?"), each branch represents the outcome of that test (e.g., "Yes" or "No"), and each leaf node represents a class label (the final decision or prediction).

Decision trees are highly intuitive because they mimic human decision-making processes. They learn to split the [data](../data-science/data-fundamentals-and-types.md#concept-data) based on features that best separate the different classes, creating a hierarchical tree structure. The goal is to make splits that result in the purest possible groups of data points at each leaf node.

**Example:** Deciding whether to play tennis based on weather conditions.

-   **Root Node:** Outlook (Is it Sunny, Overcast, or Rainy?)
    -   If Outlook is `Overcast`, then `Play Tennis`. (This is a leaf node, a final decision)
    -   If Outlook is `Sunny`, then we need more information, so we check `Humidity`.
        -   If Humidity is `High`, then `Don't Play Tennis`. (Leaf Node)
        -   If Humidity is `Normal`, then `Play Tennis`. (Leaf Node)
    -   If Outlook is `Rainy`, then we check `Wind`.
        -   If Wind is `Strong`, then `Don't Play Tennis`. (Leaf Node)
        -   If Wind is `Weak`, then `Play Tennis`. (Leaf Node)

This process continues, making more specific decisions down the branches, until all data points are classified or no further meaningful splits can be made.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

# Load a classic sample dataset: the Iris dataset for classifying types of flowers
iris = load_iris()
X, y = iris.data, iris.target # X are features (sepal/petal measurements), y are target classes (flower species)

# Split the data into training and testing sets to evaluate our model later
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

# Create a Decision Tree Classifier. max_depth limits how deep the tree can grow.
tree_classifier = DecisionTreeClassifier(max_depth=3, random_state=42)

# Train the model using the training data
tree_classifier.fit(X_train, y_train)

# Make a prediction for a new, unseen flower based on its features
# Example features: [sepal length, sepal width, petal length, petal width]
new_flower_features = [[5.1, 3.5, 1.4, 0.2]]
predicted_class = tree_classifier.predict(new_flower_features)

# The predicted_class will be an integer (0, 1, or 2), which corresponds to a flower name
print(f"Predicted class for new flower: {iris.target_names[predicted_class[0]]}")
```

<!-- IMAGE_SLOT: img-003 -->
![A simple decision tree diagram. The root node is "Outlook" with branches for "Sunny", "Overcast", "Rainy". The "Overcast"](../../../../../image/data_science/supervised-learning-classification/img-003.png)


<a id="concept-support-vector-machine"></a>
### Support Vector Machines (SVM): Finding the Optimal Separator
**Support Vector Machines (SVMs)** are powerful and versatile classification algorithms that aim to find the "best" possible boundary to separate different classes in your data. This boundary is called a **hyperplane**.

Imagine you have two types of data points (e.g., apples and oranges) scattered on a table. An SVM tries to draw a line (or a plane in higher dimensions) that separates the apples from the oranges. But it doesn't just draw *any* line; it draws the line that maximizes the distance to the nearest data points of each class. These nearest data points are crucial and are called **support vectors**, and the region between them and the hyperplane is called the **margin**.

The core idea is that a larger margin generally means better generalization to new, unseen data, making the model more robust. If the classes are not perfectly separable by a straight line in their original form, SVMs can use a clever mathematical technique called the **"kernel trick"** to implicitly transform the data into a higher-dimensional space where a linear separation might become possible. This allows SVMs to handle complex, non-linear decision boundaries.

**Example:**
Consider classifying emails into "work-related" or "personal." An SVM would analyze various features (like word counts, sender, subject line characteristics) and find a hyperplane in this multi-dimensional feature space that best separates these two types of emails, maximizing the margin between them. This optimal separation helps ensure that new emails are classified correctly even if they are slightly ambiguous.

```python
from sklearn.svm import SVC
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt # Used for visualization, not strictly for SVM training

# Generate some synthetic 2D data for a binary classification problem
# make_blobs creates clusters of points, ideal for demonstrating separation
X, y = make_blobs(n_samples=50, centers=2, random_state=0, cluster_std=0.60)

# Create an SVM classifier. 'linear' kernel means we're looking for a straight line separator.
# C is a regularization parameter (we'll cover this in more advanced topics).
svm_classifier = SVC(kernel='linear', C=1)

# Train the model on our generated data
svm_classifier.fit(X, y)

# In a real-world scenario, you would typically split your data into X_train and X_test
# to evaluate performance on unseen data. For this simple demonstration, we're just showing
# that the model has learned a decision boundary.
print("SVM trained. It found a hyperplane to separate the classes.")
print(f"Number of support vectors: {svm_classifier.n_support_}")
# The support vectors are the data points closest to the decision boundary.
```

<!-- IMAGE_SLOT: img-004 -->
![A 2D scatter plot showing two distinct clusters of data points, one colored blue and one red. A](../../../../../image/data_science/supervised-learning-classification/img-004.png)


<a id="concept-accuracy"></a>
### Evaluating Classification Models: Beyond Simple Accuracy
Once you've trained a classification model using algorithms like Logistic Regression, Decision Trees, or SVMs, the next crucial step is to determine how well it actually performs. It's not enough to just say, "It works!" We need concrete, quantifiable ways to measure its effectiveness.

While simply counting the number of correct predictions (which gives us **accuracy**) might seem intuitive, it can be highly misleading, especially when dealing with **imbalanced datasets**.

Consider this common scenario: you're building a model to detect a rare disease that affects only 1% of the population. If your model *always* predicts "no disease" for every patient, it would achieve a staggering 99% accuracy! This sounds fantastic, but such a model is completely useless because it fails to identify *any* actual cases of the disease. This stark example highlights why we need a more comprehensive set of evaluation metrics to truly understand our model's strengths and weaknesses.

<a id="concept-confusion-matrix"></a>
### The Confusion Matrix: A Detailed Breakdown of Predictions
The **Confusion Matrix** is a fundamental and incredibly useful tool for understanding the detailed performance of any classification model. It's a table that summarizes the number of correct and incorrect predictions made by a classifier, broken down by each class. It serves as the foundation for calculating many other important metrics.

For a binary classification problem (where there are two classes, typically labeled "Positive" and "Negative"), the confusion matrix has four key components:

|                 | **Predicted Positive** | **Predicted Negative** |
| :-------------- | :--------------------- | :--------------------- |
| **Actual Positive** | True Positive (TP)     | False Negative (FN)    |
| **Actual Negative** | False Positive (FP)    | True Negative (TN)     |

Let's break down these terms using our disease detection example, where "Positive" means having the disease and "Negative" means being healthy:

-   **True Positive (TP):** The model correctly predicted `Positive`. (e.g., correctly identified a sick person as sick). This is a desired outcome.
-   **True Negative (TN):** The model correctly predicted `Negative`. (e.g., correctly identified a healthy person as healthy). This is also a desired outcome.
-   **False Positive (FP):** The model incorrectly predicted `Positive` when the actual class was `Negative`. (e.g., predicted a healthy person was sick – this is also known as a "Type I error").
-   **False Negative (FN):** The model incorrectly predicted `Negative` when the actual class was `Positive`. (e.g., predicted a sick person was healthy – this is also known as a "Type II error").

Understanding these four values is crucial because they tell us *where* our model is making mistakes.

```python
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

# Generate a synthetic dataset for a binary classification problem
X, y = make_classification(n_samples=100, n_features=2, n_informative=2,
                           n_redundant=0, n_clusters_per_class=1, random_state=42)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

# Train a simple Logistic Regression model
model = LogisticRegression(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test) # Get the model's predictions on the test set

# Calculate and print the confusion matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)
# The output format from sklearn.metrics.confusion_matrix is:
# [[True Negatives, False Positives],
#  [False Negatives, True Positives]]
# For instance, if the output is:
# [[12,  1],
#  [ 2, 10]]
# This means:
# - TN = 12 (12 actual negatives were correctly predicted as negative)
# - FP = 1  (1 actual negative was incorrectly predicted as positive)
# - FN = 2  (2 actual positives were incorrectly predicted as negative)
# - TP = 10 (10 actual positives were correctly predicted as positive)
```

<!-- IMAGE_SLOT: img-005 -->
![A clear, labeled diagram of a 2x2 confusion matrix. The rows are "Actual Positive" and "Actual Negative". The](../../../../../image/data_science/supervised-learning-classification/img-005.png)


### Accuracy: The Simplest Metric (and its Pitfalls)
**Accuracy** is perhaps the most straightforward and commonly understood metric. It simply tells you the proportion of the total predictions that were correct.

**Formula:**
Accuracy = (Number of Correct Predictions) / (Total Number of Predictions)
Which can also be written using confusion matrix terms:
Accuracy = (TP + TN) / (TP + TN + FP + FN)

**Example:**
If our disease detection model made 100 predictions, and the confusion matrix looked like this:
-   TP = 9 (correctly identified sick patients)
-   TN = 88 (correctly identified healthy patients)
-   FP = 2 (healthy patients incorrectly predicted as sick)
-   FN = 1 (sick patients incorrectly predicted as healthy)

Accuracy = (9 + 88) / (9 + 88 + 2 + 1) = 97 / 100 = 0.97 (or 97%)

While 97% accuracy sounds impressive, remember our earlier discussion about rare diseases. If only 1% of the population has the disease, a model that *always* predicts "no disease" would achieve 99% accuracy. In that scenario, it would have 0 TP and 100% FN for the positive class, making it useless for its intended purpose. This is why accuracy alone can be highly misleading, especially for datasets where one class is much more common than the other (imbalanced datasets).

<a id="concept-precision-vs-recall"></a>
### Precision and Recall: Balancing Different Types of Errors
To get a more nuanced and reliable view of our model's performance, especially with imbalanced classes or when different types of errors have different costs, we often look at **Precision** and **Recall**. These metrics focus specifically on the positive class, but from different, complementary perspectives.

#### Precision: How Trustworthy are Our Positive Predictions?
**Precision** answers the question: "Of all the instances our model *predicted* as positive, how many were *actually* positive?" It measures the quality or exactness of the positive predictions. A high precision means that when the model says something is positive, it's very likely to be correct, resulting in fewer false positives.

**Formula:**
Precision = TP / (TP + FP)

**Example (Spam Detection):**
Imagine our email spam filter flagged 100 emails as spam:
-   90 of those were actually spam (TP)
-   10 were legitimate emails incorrectly flagged as spam (FP)

Precision = 90 / (90 + 10) = 90 / 100 = 0.90 (or 90%)
This means 90% of the emails our model said were spam, actually *were* spam. High precision is crucial when false positives are costly – for example, flagging a legitimate email as spam means the user might miss important information.

#### Recall: How Many Actual Positives Did We Catch?
**Recall** (also known as Sensitivity or True Positive Rate) answers the question: "Of all the instances that were *actually* positive, how many did our model correctly identify?" It measures the completeness or coverage of the positive predictions. A high recall means the model is good at finding all the positive cases, resulting in fewer false negatives.

**Formula:**
Recall = TP / (TP + FN)

**Example (Disease Detection):**
Suppose there were 10 patients who actually had a disease:
-   9 of them were correctly identified as sick by our model (TP)
-   1 was incorrectly identified as healthy (FN)

Recall = 9 / (9 + 1) = 9 / 10 = 0.90 (or 90%)
This means our model caught 90% of the actual sick patients. High recall is critical when false negatives are costly – for example, missing a sick patient in medical diagnosis could have severe, even life-threatening, consequences.

#### The Precision-Recall Trade-off
Often, there's an inherent trade-off between precision and recall. Improving one might inadvertently decrease the other. For instance, to increase recall in disease detection (to catch more sick people), you might lower your diagnostic threshold, which could lead to more healthy people being incorrectly flagged as sick (increasing false positives and thus lowering precision). The choice of which metric to prioritize depends entirely on the specific problem, the domain, and the relative costs associated with each type of error (false positives vs. false negatives).

<a id="concept-f1-score"></a>
### F1-Score: Balancing Precision and Recall
Since precision and recall often have an inverse relationship, it can be challenging to evaluate a model based on two conflicting metrics. This is where the **F1-Score** comes in handy. The F1-Score is the harmonic mean of precision and recall, providing a single metric that balances both. It's particularly useful when you have an uneven class distribution and want a metric that penalizes models that perform poorly on either precision or recall.

**Formula:**
F1-Score = 2 * (Precision * Recall) / (Precision + Recall)

The harmonic mean gives more weight to lower values. This means that for a high F1-Score, both precision and recall must be reasonably high. If either precision or recall is very low, the F1-Score will also be low, indicating a poor overall performance.

**Example:**
Let's use the example confusion matrix from earlier, where:
-   TP = 10
-   FP = 1
-   FN = 2
-   TN = 12

First, we calculate Precision and Recall:
-   Precision = TP / (TP + FP) = 10 / (10 + 1) = 10 / 11 ≈ 0.909
-   Recall = TP / (TP + FN) = 10 / (10 + 2) = 10 / 12 ≈ 0.833

Now, we calculate the F1-Score:
F1-Score = 2 * (0.909 * 0.833) / (0.909 + 0.833)
F1-Score = 2 * 0.7572 / 1.742
F1-Score = 1.5144 / 1.742 ≈ 0.869

```python
from sklearn.metrics import precision_score, recall_score, f1_score

# These lists are constructed to match the example Confusion Matrix:
# TN=12, FP=1, FN=2, TP=10
# y_true_example represents the actual labels
y_true_example = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, # 13 actual negatives (0s)
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] # 12 actual positives (1s)
# y_pred_example represents the model's predictions
y_pred_example = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, # 12 TN (correct 0s), 1 FP (incorrect 1)
                  0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] # 2 FN (incorrect 0s), 10 TP (correct 1s)

precision = precision_score(y_true_example, y_pred_example)
recall = recall_score(y_true_example, y_pred_example)
f1 = f1_score(y_true_example, y_pred_example)

print(f"Precision: {precision:.2f}") # Output: 0.91
print(f"Recall: {recall:.2f}")      # Output: 0.83
print(f"F1-Score: {f1:.2f}")       # Output: 0.87
```
The F1-Score provides a good overall measure of a model's performance, especially when you need to consider both false positives and false negatives and when classes are imbalanced. It helps you find a model that strikes a good balance between being precise and being comprehensive in its positive predictions.

## Wrap-Up
In this lesson, we've journeyed into the fascinating world of **classification**, a crucial part of supervised learning where the goal is to predict discrete categories. We started by understanding the core task of classification and how it differs fundamentally from regression. We then explored three foundational algorithms that enable classification:
-   **Logistic Regression**, which uses probabilities and a sigmoid function to make binary predictions.
-   **Decision Trees**, which mimic human decision-making through a series of "if-then-else" rules.
-   **Support Vector Machines (SVMs)**, which find the optimal hyperplane to separate classes with the largest possible margin.

Crucially, we learned that evaluating classification models requires more than just simple accuracy. The **Confusion Matrix** provides a detailed breakdown of correct and incorrect predictions, serving as the basis for calculating more insightful metrics. We then delved into **Precision** (the quality of positive predictions), **Recall** (the completeness of positive predictions), and the **F1-Score** (a harmonic mean that balances both precision and recall). Understanding these metrics is vital for choosing the right model and making informed decisions based on the specific costs of different types of errors in your problem.

As you continue your machine learning journey, remember that selecting the appropriate classification algorithm and, just as importantly, the correct evaluation metrics, is a critical step. This often requires domain knowledge and careful consideration of the problem's unique context. Next, we'll explore how to improve these models further through techniques like hyperparameter tuning and ensemble methods.