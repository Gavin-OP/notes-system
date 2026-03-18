# Basic Machine Learning Algorithms

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between supervised and unsupervised learning tasks.
- Explain the core principles of Linear Regression and identify its use cases.
- Understand how Logistic Regression is used for classification problems.
- Describe the K-Nearest Neighbors (KNN) algorithm for both classification and regression.
- Outline the fundamental idea behind Decision Trees and how they make predictions.
- Grasp the concept of K-Means Clustering for grouping unlabeled data.

## Introduction
Welcome to the exciting world of [machine learning](../data-science/introduction-to-machine-learning.md) algorithms! In the previous lesson, [introduction-to-machine-learning](../data-science/introduction-to-machine-learning.md), we learned what machine learning is and why it's so powerful. Now, it's time to roll up our sleeves and meet some of the foundational algorithms that make all that magic happen.

Think of [machine learning](../data-science/introduction-to-machine-learning.md) algorithms as recipes. Each recipe takes some ingredients (your data) and follows a specific set of instructions to produce a dish (a prediction or a pattern). Just like a chef has different recipes for different meals, a data scientist uses various algorithms for different problems.

In this lesson, we'll explore some of the most common and intuitive algorithms that form the backbone of many [machine learning](../data-science/introduction-to-machine-learning.md) applications. We'll cover both **supervised learning** algorithms, which learn from data that has been labeled with the correct answers, and **unsupervised learning** algorithms, which find patterns in data without any pre-existing labels. Understanding these basics will give you a strong foundation to tackle more complex topics later on.

## Concept Progression

### Linear Regression: Predicting Continuous Values

Let's start with a common problem: predicting a numerical value. Imagine you want to predict the price of a house based on its size. As houses generally get bigger, their prices tend to go up. **Linear Regression** is one of the simplest and most fundamental algorithms for this type of prediction. It's used when you want to predict a *continuous* numerical value, like price, age, temperature, or sales figures. Because it learns from data where the correct answers (house prices) are known, it's a **supervised learning** algorithm specifically designed for **regression** tasks.

**Intuition:**
At its core, Linear Regression tries to find the "best-fit" straight line that describes the relationship between your input features (like house size) and your target output (house price). Once it finds this line, you can use it to predict the price of a new house just by knowing its size. It's like drawing a trend line through a scatter plot of data points.

**How it works:**
The algorithm looks at all your existing data points (e.g., many houses with their sizes and prices) and calculates a line that minimizes the overall distance between the line and all those points. This "distance" is usually measured by the sum of squared errors, meaning it tries to make the line as close as possible to all the data points on average.

Mathematically, if you have data points where the x-axis is house size and the y-axis is house price, Linear Regression finds a line represented by the equation $y = mx + b$ (or $y = \beta_0 + \beta_1x$). Here, $m$ (or $\beta_1$) is the slope of the line, telling you how much the price changes for each unit increase in size, and $b$ (or $\beta_0$) is the y-intercept, representing the base price when the size is zero (though this might not always make practical sense for all data).

**Example:**
Suppose you have the following data for house sizes (in sq ft) and prices (in thousands of dollars):

| Size (sq ft) | Price ($1000s) |
| :----------- | :------------- |
| 1000         | 200            |
| 1200         | 230            |
| 1500         | 280            |
| 1800         | 320            |
| 2000         | 350            |

Linear Regression would find a line that roughly passes through these points. If the algorithm determines the best-fit line is, for example, `Price = 0.15 * Size + 50`, then for a new house of 1600 sq ft, it would predict:
`Price = 0.15 * 1600 + 50 = 240 + 50 = 290` (or $290,000).

[IMAGE_PLACEHOLDER: A scatter plot showing several data points representing house size vs. price. A straight line (the regression line) is drawn through the scatter plot, illustrating the "best fit" relationship. The x-axis is labeled "House Size (sq ft)" and the y-axis is labeled "House Price ($1000s)". Arrows or dashed lines could show the vertical distance from points to the line, representing errors.]

### Logistic Regression: Classifying into Categories

While Linear Regression is excellent for predicting continuous numbers, what if you want to predict a *category* or a "yes/no" outcome? For example, whether an email is spam or not spam, if a customer will click on an ad (yes/no), or if a medical test result is positive or negative. This is where **Logistic Regression** comes in. Despite having "regression" in its name, it's primarily used for **classification** tasks, making it another powerful **supervised learning** algorithm.

**Intuition:**
Instead of drawing a straight line through data points to predict a value, Logistic Regression draws an "S-shaped" curve (called a sigmoid function) that squashes any input value into a probability between 0 and 1. This probability can then be used to classify an item into one of two categories. Think of it as predicting the *likelihood* of something belonging to a certain group.

**How it works:**
Logistic Regression first calculates a linear combination of your input features, much like Linear Regression. However, instead of outputting this raw linear value directly, it passes it through the sigmoid function. The sigmoid function transforms any real number into a value between 0 and 1, which can be interpreted as a probability.

For example, if the output probability is 0.8, it means there's an 80% chance the item belongs to the "positive" class (e.g., "spam"). You then set a **threshold** (commonly 0.5): if the probability is above this threshold, it's classified as one category; otherwise, it's the other.

**Example:**
Let's say you're building a spam detector. You feed features like "number of suspicious words" and "sender reputation" into your Logistic Regression model. The model might output a probability of 0.9 for a new email. Since 0.9 is greater than the 0.5 threshold, the email is classified as "spam." If another email gets a probability of 0.2, it's classified as "not spam."

[IMAGE_PLACEHOLDER: A 2D plot showing data points belonging to two different classes (e.g., 'spam' and 'not spam') represented by different colors/shapes. An S-shaped sigmoid curve separates these two classes, illustrating the probability boundary. The x-axis could represent a feature like "Suspicious Word Count", and the y-axis could represent the probability of being spam (0 to 1).]

### K-Nearest Neighbors (KNN): Learning from Your Neighbors

Moving on to another versatile algorithm, imagine you're at a party and meet someone new. You want to guess if they like sci-fi movies. You might look at the people they're talking to – if they're surrounded by known sci-fi fans, you'd probably guess the new person likes sci-fi too. This is the core idea behind **K-Nearest Neighbors (KNN)**. It's a simple, yet powerful, **supervised learning** algorithm used for both **classification** and **regression** tasks.

**Intuition:**
KNN is often called a "lazy learner" because it doesn't build a specific model during training. Instead, it simply memorizes all the training data. When it needs to make a prediction for a new data point, it looks at the 'K' closest data points (its "neighbors") in the training set and makes a decision based on what the majority of those neighbors are. It assumes that similar things exist in close proximity.

**How it works:**
1.  **Choose K:** You decide on a number `K`, which represents how many neighbors to consider. This is a crucial parameter you set.
2.  **Find Neighbors:** For a new data point you want to classify or predict, the algorithm calculates the distance (e.g., Euclidean distance, like a straight line on a graph) between this new point and *every* point in your training data.
3.  **Select K Closest:** It then identifies the `K` data points from the training set that are closest to your new point.
4.  **Vote/Average:**
    *   **For Classification:** It counts how many of these `K` neighbors belong to each category and assigns the new point to the category that has the most votes.
    *   **For Regression:** It takes the average (or median) of the target values of the `K` neighbors and assigns that average as the prediction for the new point.

**Example (Classification):**
Let's say you have a dataset of fruits, classified as "Apple" or "Orange," based on their "sweetness" and "crunchiness." You get a new fruit and want to classify it.
If you set `K=3`:
1.  The algorithm finds the 3 closest fruits in your dataset to the new fruit.
2.  Suppose 2 of those 3 neighbors are "Apples" and 1 is an "Orange."
3.  Since "Apple" is the majority, the new fruit is classified as an "Apple."

[IMAGE_PLACEHOLDER: A 2D scatter plot showing existing data points belonging to two classes (e.g., blue circles and red squares). A new, unclassified data point (e.g., a green star) is placed on the plot. Circles are drawn around the green star, indicating its 'K' nearest neighbors (e.g., K=3 or K=5), with the neighbors highlighted. Arrows point from the neighbors to the new point, showing distance.]

### Decision Trees: Making Choices Like a Flowchart

Have you ever played "20 Questions" or followed a flowchart to make a decision? That's essentially how a **Decision Tree** works. It's a powerful and intuitive **supervised learning** algorithm that can be used for both **classification** and **regression** tasks. Its strength lies in its interpretability.

**Intuition:**
A Decision Tree builds a model that looks like a tree structure, where each internal node represents a "test" on an attribute (e.g., "Is the temperature > 25°C?"), each branch represents the outcome of that test (e.g., "Yes" or "No"), and each leaf node represents a class label (for classification) or a numerical value (for regression). The goal is to split the data in a way that creates the purest possible groups at each step, making decisions progressively.

**How it works:**
The algorithm starts at the "root" of the tree and considers all possible features. It then picks the feature that best splits the data into distinct groups. For example, if you're predicting whether someone will play tennis, the first split might be based on "Outlook: Sunny, Overcast, or Rainy." The "best split" is determined by metrics that measure how well the split separates the data into homogeneous groups.

It then repeats this process for each branch, creating further "nodes" and "branches" until it reaches a point where it can no longer split the data meaningfully, or a stopping criterion is met (e.g., a maximum depth for the tree). These final nodes are called "leaves," and they contain the prediction.

**Example (Classification):**
Let's say you want to decide whether to play tennis based on weather conditions:

[IMAGE_PLACEHOLDER: A simple decision tree diagram. The root node is "Outlook?". Branches lead to "Sunny", "Overcast", "Rainy". From "Sunny", a node "Humidity?" branches to "High" (leading to "No Play") and "Normal" (leading to "Play"). From "Overcast", it directly leads to "Play". From "Rainy", a node "Wind?" branches to "Strong" (leading to "No Play") and "Weak" (leading to "Play").]

To predict if you should play tennis on a new day:
1.  Start at the root: What's the "Outlook"?
2.  If "Sunny," go down that branch. Now, what's the "Humidity"?
3.  If "High," the tree predicts "No Play." If "Normal," it predicts "Play."

Decision Trees are easy to understand and visualize, which is a major advantage, especially when you need to explain your model's reasoning.

### K-Means Clustering: Finding Natural Groups

So far, we've talked about **supervised learning**, where our data has labels (e.g., "spam" or "not spam," "price"). But what if you have a lot of data without any labels, and you want to find natural groupings within it? This is where **unsupervised learning** comes in, and **K-Means Clustering** is one of its most popular algorithms. It helps us discover hidden patterns and structures in data.

**Intuition:**
Imagine you have a pile of mixed candies, and you want to sort them into groups based on their similarities (e.g., color, shape) without knowing what each candy *is* beforehand. K-Means Clustering does something similar: it groups data points into 'K' distinct clusters, where points within the same cluster are more similar to each other than to points in other clusters. It's all about finding inherent structures.

**How it works:**
1.  **Choose K:** You decide how many clusters (`K`) you want to find in your data. This is often determined by domain knowledge or by trying different values.
2.  **Initialize Centroids:** The algorithm randomly picks `K` data points from your dataset to be the initial "centroids" (the center points of your clusters).
3.  **Assign Points to Clusters:** Each data point in the dataset is assigned to the closest centroid. This forms `K` initial clusters.
4.  **Update Centroids:** Once all points are assigned, the algorithm recalculates the position of each centroid by taking the average (mean) of all the data points currently assigned to that cluster. The centroids effectively move to the "center of gravity" of their assigned points.
5.  **Repeat:** Steps 3 and 4 are repeated iteratively. Points are reassigned to the *new* closest centroids, and centroids are recalculated. This process continues until the centroids no longer move significantly, meaning the clusters have stabilized and points are no longer changing their cluster assignments.

**Example:**
Imagine you have customer data (e.g., age and annual income) and you want to segment them into 3 groups (`K=3`) to tailor marketing strategies without knowing the segments beforehand.
1.  K-Means randomly picks 3 customers as initial centroids.
2.  All other customers are assigned to the closest of these 3 centroids.
3.  The centroids then move to the average position of all customers assigned to them.
4.  This repeats until the customer segments are stable. You might end up with distinct groups like "Young, Low-Income," "Middle-Aged, Mid-Income," and "Older, High-Income" segments, which you can then analyze further.

[IMAGE_PLACEHOLDER: A 2D scatter plot showing many unlabeled data points. Initially, K random centroids are marked. Then, in an iterative process, points are colored according to their assigned cluster, and the centroids move to the center of their respective clusters. The final state shows distinct clusters of points, each with a centroid at its center, illustrating the grouping of similar data points.]

## Wrap-Up
Congratulations! You've just taken a significant step in your [machine learning](../data-science/introduction-to-machine-learning.md) journey by understanding five fundamental algorithms. We covered:

*   **Linear Regression:** A **supervised learning** algorithm for **regression** tasks, predicting continuous numbers by finding a best-fit line.
*   **Logistic Regression:** A **supervised learning** algorithm for **classification** tasks, classifying data into categories by predicting probabilities using an S-shaped curve.
*   **K-Nearest Neighbors (KNN):** A versatile **supervised learning** algorithm for both **classification** and **regression**, making predictions based on the majority vote or average of the 'K' closest data points.
*   **Decision Trees:** A highly interpretable **supervised learning** algorithm for both **classification** and **regression**, making decisions through a flowchart-like structure based on feature splits.
*   **K-Means Clustering:** A powerful **unsupervised learning** algorithm for grouping unlabeled data into natural clusters based on similarity.

You've seen how these algorithms tackle different types of problems – some predict numbers (regression), some predict categories (classification), and some find patterns without labels (clustering). This foundational knowledge will be invaluable as you explore more advanced [machine learning](../data-science/introduction-to-machine-learning.md) techniques and applications. In the next lesson, we'll delve deeper into how we evaluate the performance of these models to ensure they are making accurate and reliable predictions.