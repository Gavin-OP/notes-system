<a id="concept-supervised-learning-regression"></a>
# Supervised Learning: Regression

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what regression analysis is and differentiate it from classification.
- Understand the core concept of linear regression and its mathematical representation.
- Describe how Mean Squared Error (MSE) is used to evaluate regression model performance.
- Grasp the intuition behind Gradient Descent as an optimization algorithm.
- Extend your understanding to Multiple Linear Regression for predicting outcomes with several features.
- Interpret the R-squared metric to assess the goodness of fit for a regression model.

## Introduction
In our previous lesson, we explored the exciting world of supervised learning, where models learn from labeled [data](../data-science/data-fundamentals-and-types.md#concept-data). We saw how classification models predict categories, like "spam" or "not spam." But what if you need to predict a number, rather than a category? What if you want to estimate the price of a house, the temperature tomorrow, or a person's salary?

This is where **regression** comes in! Regression is a powerful type of supervised learning used to predict continuous numerical values. It's like drawing a line (or a more complex curve) through data points to find a pattern that allows us to make educated guesses about new, unseen data. In this lesson, we'll dive into the fundamentals of regression, starting with the simplest yet incredibly useful technique: linear regression.

## Concept Progression

<a id="concept-regression-analysis"></a>
### Regression Analysis: Predicting Numbers
Imagine you're trying to predict the price of a house. You know that factors like the size of the house, the number of bedrooms, and its location all play a role. The house price isn't a "category" like "expensive" or "cheap"; it's a specific numerical value, like $350,000 or $525,500. This is a classic example of a **regression problem**.

In regression analysis, our goal is to find a relationship between one or more input features (like house size, number of bedrooms) and a continuous target variable (like house price). We want to build a model that can take new input features and output a prediction for the target variable. This contrasts with classification problems, where the goal is to predict discrete categories (like 'spam' or 'not spam').

Think of it like this: you have a bunch of data points, and you're trying to find a trend or a line that best represents those points. Once you have that line, you can use it to predict where a new point would fall.

<!-- IMAGE_SLOT: img-001 -->
![A scatter plot showing various data points representing house size (x-axis) vs. house price (y-axis). The points are](../../../../../image/data_science/supervised-learning-regression/img-001.png)


<a id="concept-linear-regression"></a>
### Linear Regression: Drawing a Straight Line
Building on the idea of finding a trend, the simplest and most fundamental approach is **linear regression**. As the name suggests, it tries to model the relationship between features and the target variable using a straight line.

Let's stick with our house price example. Suppose we only consider one factor: the size of the house. We want to predict the `House Price` based on `House Size`. A linear regression model would try to find the "best" straight line that fits the [data](../data-science/data-fundamentals-and-types.md#concept-data) points.

The equation for a straight line is something you might remember from algebra:

$y = mx + b$

In the context of linear regression:
-   $y$ is the **predicted target variable** (e.g., predicted house price).
-   $x$ is the **input feature** (e.g., house size).
-   $m$ is the **slope** of the line. It tells us how much $y$ changes for every one-unit change in $x$. For houses, a positive slope means larger houses tend to have higher prices.
-   $b$ is the **y-intercept**. It's the value of $y$ when $x$ is 0. In some real-world scenarios, this might not make practical sense (e.g., a house with 0 size), but mathematically it defines where the line crosses the y-axis.

So, our house price prediction model might look like:
`Predicted Price = (Slope * House Size) + Intercept`

Let's say after analyzing data, our model finds that `m = 150` and `b = 50000`.
Then, for a house of `1500 sq ft`:
`Predicted Price = (150 * 1500) + 50000 = 225000 + 50000 = $275,000`

This simple equation allows us to make predictions based on the learned relationship.

### Finding the "Best Fit" Line: The Challenge
You might be wondering, how do we find the "best" straight line? There are infinitely many lines we could draw through a scatter plot. The "best fit" line is the one that minimizes the difference between the predicted values and the actual values in our training data.

Consider the actual house prices from our data and the prices our line predicts. For each house, there will be a difference between its actual price and the price our line estimates. We want a line where these differences, on average, are as small as possible. This difference is often called the **error** or **residual**.

<!-- IMAGE_SLOT: img-002 -->
![A scatter plot of house size vs. house price. Three different lines are drawn: one clearly too high,](../../../../../image/data_science/supervised-learning-regression/img-002.png)


<a id="concept-mean-squared-error"></a>
### Measuring Model Performance: Mean Squared Error (MSE)
To find the "best fit" line, we need a way to quantify how "bad" a given line is, or how large these errors are. This measure is called a **loss [function](../python/functions-in-python.md#concept-function)** or **cost function**. A common and powerful loss function for regression is the **Mean Squared Error (MSE)**.

Here's how MSE works:
1.  For each data point, calculate the **error** (or **residual**): the difference between the actual value ($y_{actual}$) and the value predicted by our line ($\hat{y}_{predicted}$).
    $Error = y_{actual} - \hat{y}_{predicted}$
2.  **Square** each error. We square the errors for two main reasons:
    *   It makes all errors positive, so positive and negative errors don't cancel each other out.
    *   It penalizes larger errors more heavily, which is often desirable. A prediction that's off by 10 units is considered much worse than two predictions off by 5 units each (since $10^2 = 100$, while $5^2 + 5^2 = 25 + 25 = 50$).
3.  **Sum** up all the squared errors.
4.  **Divide** by the total number of data points ($n$) to get the average (mean) squared error.

The formula for MSE is:

$MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$

Where:
-   $n$ is the number of data points.
-   $y_i$ is the actual value for the $i$-th data point.
-   $\hat{y}_i$ (pronounced "y-hat") is the predicted value for the $i$-th data point.

Our goal is to find the line (i.e., the values of $m$ and $b$) that results in the smallest possible MSE. A lower MSE means our model's predictions are closer to the actual values.

**Example Calculation:**
Suppose we have three data points and our model predicts values as follows:

| Actual ($y$) | Predicted ($\hat{y}$) | Error ($y - \hat{y}$) | Squared Error ($(y - \hat{y})^2$) |
| :----------- | :-------------------- | :-------------------- | :-------------------------------- |
| 10           | 9                     | 1                     | 1                                 |
| 15           | 16                    | -1                    | 1                                 |
| 20           | 18                    | 2                     | 4                                 |

Sum of Squared Errors = $1 + 1 + 4 = 6$
Number of data points ($n$) = 3
$MSE = \frac{6}{3} = 2$

<a id="concept-gradient-descent"></a>
### Gradient Descent: Finding the Minimum
With MSE defined as our measure of "badness," our next challenge is to find the specific values for $m$ and $b$ that make MSE as small as possible. This is where an optimization algorithm called **Gradient Descent** comes into play.

Imagine the MSE as a landscape with hills and valleys. Our goal is to find the lowest point in this landscape (the global minimum), which represents the smallest possible MSE. Gradient Descent is like a hiker trying to find the bottom of a valley.

Here's the intuition:
1.  **Start somewhere**: We begin with some random initial values for $m$ and $b$. This places our hiker at a random spot on the MSE landscape.
2.  **Look around**: At our current position, we look at the slope (the "gradient") around us. The gradient tells us the direction of the steepest ascent – where the hill goes up most sharply.
3.  **Take a step downhill**: To minimize MSE, we want to go in the opposite direction of the steepest ascent – downhill! We take a small step in that direction. This means we adjust $m$ and $b$ slightly.
4.  **Repeat**: We repeat steps 2 and 3, continuously adjusting $m$ and $b$ and taking small steps downhill, until we reach a point where the slope is flat, indicating we've found a minimum.

<!-- IMAGE_SLOT: img-003 -->
![A 2D contour plot representing a loss function (e.g., MSE) with two parameters (e.g., 'm' and 'b') on](../../../../../image/data_science/supervised-learning-regression/img-003.png)


The "size" of each step is controlled by a parameter called the **learning rate**. A small learning rate means tiny steps, which can be slow but precise. A large learning rate means big steps, which can be faster but might overshoot the minimum or bounce around.

Gradient Descent is a fundamental algorithm not just for linear regression, but for training many machine learning models, especially neural networks.

<a id="concept-multiple-linear-regression"></a>
### Multiple Linear Regression: More Features, Better Predictions
While simple linear regression is a great starting point, real-world problems often involve more than one influencing factor. So far, we've looked at predicting house prices using only one feature: house size. But what if we could use more information? What if we also considered the number of bedrooms, the age of the house, or the distance to the nearest school? This is where **Multiple Linear Regression** comes in.

Instead of just one $x$, we now have multiple input features, let's call them $x_1, x_2, x_3$, and so on. The equation expands to include a slope (or "coefficient") for each feature:

$y = b_0 + b_1x_1 + b_2x_2 + ... + b_nx_n$

Where:
-   $y$ is the predicted target variable.
-   $b_0$ is the y-intercept.
-   $b_1, b_2, ..., b_n$ are the coefficients (slopes) for each feature $x_1, x_2, ..., x_n$.

For our house price example:
`Predicted Price = Intercept + (Coefficient_Size * House Size) + (Coefficient_Bedrooms * Number of Bedrooms) + (Coefficient_Age * House Age)`

Each coefficient ($b_1, b_2$, etc.) tells us the estimated impact of its corresponding feature on the predicted price, assuming all other features remain constant. For instance, `Coefficient_Bedrooms` might tell us how much the price increases for each additional bedroom, holding size and age constant.

Multiple linear regression allows our models to capture more complex relationships and often leads to more accurate predictions by leveraging more available data. The process of finding the best coefficients ($b_0, b_1, ..., b_n$) still involves minimizing a loss [function](../python/functions-in-python.md#concept-function) like MSE, typically using algorithms like Gradient Descent, just with more parameters to adjust.

<a id="concept-r-squared"></a>
### Evaluating Regression Models: R-squared
After all the effort of building and optimizing our regression model, we need a clear way to understand how well it's actually performing. MSE tells us the average squared error, but it's in squared units of our target variable, which can be hard to interpret directly. A more intuitive metric is **R-squared** (also known as the **coefficient of determination**).

R-squared measures the proportion of the variance in the dependent variable (our target, like house price) that is predictable from the independent variables (our features, like house size, bedrooms). In simpler terms, it tells us how well our model explains the variability of the target variable around its mean.

-   **R-squared values typically range from 0 to 1 (or 0% to 100%).**
-   An R-squared of **0** means our model explains none of the variability of the target variable around its mean. Essentially, our model is no better than simply predicting the average value of the target variable for every input.
-   An R-squared of **1** (or 100%) means our model explains all the variability of the target variable. This would imply a perfect fit, which is rare in real-world scenarios.
-   An R-squared of **0.75** means that 75% of the variation in the target variable can be explained by our model's features. The remaining 25% is unexplained variability.

Generally, a higher R-squared value indicates a better fit for the model. However, it's important to note that a high R-squared doesn't necessarily mean the model is perfect or that the chosen features are the only important ones. It's one of several metrics to consider when evaluating a regression model.

## Wrap-Up
In this lesson, we've demystified regression, a fundamental supervised learning technique for predicting continuous numerical values. We started with the intuitive idea of finding trends in data, then explored how linear regression uses a straight line to model these relationships. We learned about Mean Squared Error (MSE) as a way to quantify how well our line fits the data, and how Gradient Descent iteratively adjusts the line to minimize this error. Finally, we extended our understanding to Multiple Linear Regression, which allows us to use multiple features for more robust predictions, and introduced R-squared as a key metric to evaluate our model's explanatory power.

Understanding regression is a crucial step in your machine learning journey, opening doors to solving a wide range of real-world prediction problems. In future lessons, we'll explore more advanced regression techniques and delve deeper into model evaluation and selection.