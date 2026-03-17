# Supervised Learning: Regression

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what regression is and identify real-world problems it can solve.
- Understand the core principles of Linear Regression and its mathematical representation.
- Implement a basic Linear Regression model using scikit-learn.
- Describe the concept of Polynomial Regression for modeling non-linear relationships.
- Evaluate the performance of regression models using metrics like MAE, MSE, RMSE, and R-squared.

## Introduction
In our journey through [machine learning](../data-science/introduction-to-machine-learning.md), we've learned that [supervised learning](../data-science/introduction-to-machine-learning.md) involves training models on labeled data to make predictions. We've seen how [classification](../data-science/classification.md) helps us predict categories, like whether an email is spam or not. But what if we want to predict a *number*? What if we want to estimate the price of a house, the temperature tomorrow, or a person's salary?

This is where **regression** comes in. Regression is a powerful set of techniques used to predict a continuous numerical value. It's like drawing a line or a curve through data points to find the best possible trend, allowing us to make educated guesses about new, unseen data. In this lesson, we'll dive into the world of regression, starting with the simplest form, linear regression, and gradually building up to more complex ideas and how to evaluate our models effectively.

## Concept Progression

### What is Regression? Predicting Continuous Values

Let's start with a simple scenario. Imagine you're tracking the growth of a plant. You measure its height every day. After a few weeks, you might want to predict how tall it will be next week, even if you haven't measured it yet. Since height is a continuous number (it can be 10cm, 10.1cm, 10.15cm, etc., not just discrete categories), this is a perfect example of a regression problem.

In [machine learning](../data-science/introduction-to-machine-learning.md), **regression** is a type of [supervised learning](../data-science/introduction-to-machine-learning.md) where the output variable (what we want to predict) is a continuous value. This is fundamentally different from [classification](../data-science/classification.md), where the output is a discrete category or class.

To clarify the distinction:
*   **Classification**: Is this email spam (Yes/No)? Is this image a cat, dog, or bird? (Predicting categories)
*   **Regression**: What will the temperature be tomorrow (e.g., 25.7°C)? How much will this house sell for (e.g., $350,000)? (Predicting specific numerical values)

Regression models learn the relationship between input features (like the plant's age, amount of sunlight, water given) and the continuous output label (its height). Once trained, they can use this learned relationship to predict the output for new, unseen inputs.

[IMAGE_PLACEHOLDER: A scatter plot showing data points representing plant height over time. The x-axis is 'Days Since Planting' (0 to 30), and the y-axis is 'Plant Height (cm)' (0 to 50). The points generally show an upward trend. A dashed line or curve is drawn through the points, illustrating a potential regression fit. The pedagogical intent is to visually distinguish continuous output prediction from discrete classification.]

### Linear Regression: Drawing a Straight Line

Now that we understand what regression is, let's explore its most basic form: **Linear Regression**. As its name implies, linear regression aims to find a straight line that best fits your data.

Consider a graph where the x-axis represents a feature (like the size of a house) and the y-axis represents the target (its price). Linear regression's goal is to draw a straight line through these data points such that the line is as close as possible to all the points. Once this "best-fit" line is determined, it can be used to predict the price of a new house based on its size.

You might recall the equation of a straight line from algebra:
`y = mx + b`

In [machine learning](../data-science/introduction-to-machine-learning.md), we often write it slightly differently to reflect our specific terminology:
`y_hat = β₀ + β₁x₁`

Let's break down these terms:
*   `y_hat` (pronounced "y-hat") is our **predicted output** (e.g., the predicted house price). The "hat" signifies that it's an estimate.
*   `β₀` (beta-naught) is the **y-intercept**. This is the value of `y_hat` when `x₁` is zero. In practical terms, it's the baseline prediction when all input features are zero.
*   `β₁` (beta-one) is the **slope** of the line. It tells us how much `y_hat` is expected to change for every one-unit increase in `x₁`. For example, how much the price increases for every extra square foot of house size.
*   `x₁` is our **input feature** (e.g., house size).

If our model uses multiple features (e.g., house size, number of bedrooms, age of the house), the equation simply extends:
`y_hat = β₀ + β₁x₁ + β₂x₂ + ... + βnxn`

The core task of linear regression is to find the optimal values for these **coefficients** (`β₀, β₁, ..., βn`) that make this line (or hyperplane in higher dimensions) fit the data as accurately as possible.

**Example: Predicting Exam Scores**
Let's consider a simple scenario where we want to predict a student's final exam score based on the number of hours they studied.

| Hours Studied (x) | Exam Score (y) |
| :---------------- | :------------- |
| 2                 | 50             |
| 4                 | 65             |
| 6                 | 70             |
| 8                 | 85             |
| 10                | 90             |

A linear regression model would try to find a line like `Score = β₀ + β₁ * Hours_Studied` that minimizes the difference between the actual scores and the scores predicted by the line.

[IMAGE_PLACEHOLDER: A scatter plot with 'Hours Studied' on the x-axis (0 to 12) and 'Exam Score' on the y-axis (0 to 100). The five data points from the example table are plotted. A straight, upward-sloping line is drawn through the points, representing a linear regression fit. The line should visually appear to minimize the vertical distance to the points. The pedagogical intent is to illustrate the concept of a "best-fit" line.]

### How Do We Find the "Best" Line? The Cost Function and Gradient Descent

We've talked about finding the "best-fit" line, but what does "best" truly mean in a mathematical sense? It means finding the line (or the optimal `β` coefficients) that results in the smallest overall error between its predictions (`y_hat`) and the actual values (`y`) in our training data. To quantify this error, we use a **cost function** (also known as a loss function).

A very common cost function for linear regression is the **Mean Squared Error (MSE)**, which we'll explore in more detail later. For now, understand that it calculates the average of the squared differences between the predicted values and the actual values. The smaller the MSE, the better our line fits the data.

Our ultimate goal is to find the specific values for `β₀` and `β₁` (and any other `β`s if we have more features) that minimize this cost function. How do we achieve this? One of the most popular and powerful methods is called **Gradient Descent**.

Imagine you are standing on a mountain, blindfolded, and your goal is to find the lowest point (the minimum cost). You can't see the entire mountain, but you can feel the slope directly beneath your feet. To get to the bottom, you would take a small step in the steepest downhill direction. You repeat this process, taking small steps, always moving in the direction of the steepest descent, until you eventually reach the bottom.

[IMAGE_PLACEHOLDER: A 3D contour plot representing a cost function surface. The x and y axes are 'β₀' and 'β₁' respectively, and the z-axis is 'Cost'. The surface should have a bowl-like shape with a clear minimum point. A winding path, starting from a higher point on the surface and gradually moving downwards towards the minimum, is shown with arrows indicating the direction of movement. This path represents the iterative steps of Gradient Descent. The pedagogical intent is to intuitively explain how an algorithm finds the optimal parameters by minimizing a cost function.]

That's precisely what **Gradient Descent** does. It iteratively adjusts the `β` values by taking small steps in the direction that reduces the cost function most rapidly. It continues this process until it converges to a point where the cost function is at its minimum (or very close to it), thereby finding the optimal `β` coefficients for our "best-fit" line.

### Implementing Linear Regression with Scikit-learn

Fortunately, we don't have to implement Gradient Descent or the complex math from scratch. Libraries like scikit-learn provide highly optimized and ready-to-use implementations. Let's see how to perform a simple linear regression using this powerful library.

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split # Essential for robust evaluation
import matplotlib.pyplot as plt

# 1. Generate some synthetic data (e.g., house size vs. price)
# We'll create 100 data points for house sizes and corresponding prices.
np.random.seed(0) # For reproducibility
house_sizes = 2 * np.random.rand(100, 1) + 3 # Sizes between 3 and 5 (representing 1000 sq ft)
house_prices = 50 + 20 * house_sizes + np.random.randn(100, 1) * 10 # Prices in $1000s

# Scikit-learn expects X (features) to be a 2D array and y (target) to be a 1D array.
X = house_sizes
y = house_prices.flatten() # .flatten() converts the 2D array to a 1D array

# 2. Split data into training and testing sets
# This is a crucial step in machine learning! We train our model on the 'training' data
# and then evaluate its performance on the 'testing' data it has never seen before.
# This helps us assess how well the model generalizes to new data and prevents overfitting.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Create a Linear Regression model object
model = LinearRegression()

# 4. Train the model using the training data
# The .fit() method is where the model learns the optimal β coefficients using Gradient Descent (or similar optimization).
model.fit(X_train, y_train)

# 5. Make predictions on the test data
# Now that the model is trained, we use it to predict prices for the unseen test house sizes.
y_pred = model.predict(X_test)

# 6. Print the learned coefficients
# These are the β₀ (intercept) and β₁ (coefficient) values our model found.
print(f"Intercept (β₀): {model.intercept_:.2f}")
print(f"Coefficient (β₁): {model.coef_[0]:.2f}")

# 7. Visualize the results
plt.figure(figsize=(10, 6))
plt.scatter(X_test, y_test, color='blue', label='Actual Prices (Test Data)')
plt.plot(X_test, y_pred, color='red', linewidth=2, label='Predicted Regression Line')
plt.xlabel('House Size (1000 sq ft)')
plt.ylabel('House Price ($1000s)')
plt.title('Linear Regression: House Size vs. Price')
plt.legend()
plt.grid(True)
plt.show()

# Example prediction for a new, single house size
new_house_size = np.array([[4.5]]) # A 4500 sq ft house (must be 2D array for predict)
predicted_price = model.predict(new_house_size)
print(f"\nPredicted price for a 4500 sq ft house: ${predicted_price[0]*1000:.2f}")
```
In this example, `model.intercept_` gives us `β₀` and `model.coef_[0]` gives us `β₁`. These are the parameters that define our "best-fit" line.

### Beyond Straight Lines: Polynomial Regression

While linear regression is powerful, not all relationships in the real world are perfectly straight lines. What if the relationship between our features and the target variable is curved? For instance, the performance of a car engine might increase with RPM up to a certain point, and then decrease. A simple straight line wouldn't be able to capture this kind of nuanced, curved trend.

This is where **Polynomial Regression** comes in. It's a special form of linear regression that allows us to model non-linear relationships. Instead of fitting a straight line, it fits an *n*-th degree polynomial curve to the data.

Instead of the linear equation `y_hat = β₀ + β₁x`, we might use:
`y_hat = β₀ + β₁x + β₂x²` (a quadratic, or degree 2, relationship)
or
`y_hat = β₀ + β₁x + β₂x² + β₃x³` (a cubic, or degree 3, relationship)

The crucial insight here is that while the relationship between `x` and `y` is non-linear, the equation is still **linear in its coefficients** (`β₀, β₁, β₂`, etc.). This means we can use the same underlying linear regression techniques (like Gradient Descent) after transforming our input features. Essentially, we create new features that are powers of the original feature (e.g., if `x` is our original feature, we add `x²`, `x³`, and so on as new features). Then, we train a standard linear regression model on these *transformed* features.

**Example: Modeling a Curved Relationship**
Let's generate some data that clearly follows a curved pattern and see how polynomial regression can fit it.

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline # Helps chain transformations and models

# 1. Generate some non-linear data
np.random.seed(0)
X_curve = np.sort(5 * np.random.rand(100, 1), axis=0) # Sorted X values
y_curve = np.sin(X_curve).ravel() + np.random.randn(100) * 0.1 # A sine wave with some noise

# 2. Split data into training and testing sets
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_curve, y_curve, test_size=0.2, random_state=42)

# 3. Create a Polynomial Regression model (e.g., degree 3)
# make_pipeline allows us to combine steps: first transform features, then apply Linear Regression.
degree = 3
poly_model = make_pipeline(PolynomialFeatures(degree), LinearRegression())

# 4. Train the model
poly_model.fit(X_train_c, y_train_c)

# 5. Make predictions
y_pred_c = poly_model.predict(X_test_c)

# 6. Visualize the results
plt.figure(figsize=(10, 6))
plt.scatter(X_curve, y_curve, color='blue', label='Actual Data')
# To plot the smooth curve, we need to predict over a sorted range of X values
X_plot = np.linspace(0, 5, 100).reshape(-1, 1)
y_plot_pred = poly_model.predict(X_plot)
plt.plot(X_plot, y_plot_pred, color='red', linewidth=2, label=f'Polynomial Regression (Degree {degree})')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Polynomial Regression Example')
plt.legend()
plt.grid(True)
plt.show()
```

[IMAGE_PLACEHOLDER: A scatter plot with 'X' on the x-axis and 'Y' on the y-axis. The data points form a clear sinusoidal or parabolic curve. A red curved line, representing a polynomial regression fit (e.g., degree 3), is drawn smoothly through the data points, capturing the non-linear trend much better than a straight line would. The pedagogical intent is to show how polynomial regression can fit curved data.]

While polynomial regression allows us to model more complex relationships, it's important to be mindful of the degree of the polynomial. A higher degree means a more flexible and complex model. This highlights a crucial trade-off in model building: while more complex models (like high-degree polynomials) can capture intricate patterns in the training data, they also increase the risk of **overfitting**. An overfit model learns the noise in the training data rather than the true underlying relationship, leading to poor performance on new, unseen data. We'll discuss overfitting more shortly.

### Evaluating Our Models: How Good is the Fit?

After training a regression model, how do we know if it's any good? We need objective ways to measure its performance. This is where **evaluation metrics** come in. They provide a quantitative assessment of how well our model's predictions match the actual values, typically on the *test data* that the model has not seen during training. Different metrics offer different perspectives on the model's error.

Here are some common metrics for regression:

1.  **Mean Absolute Error (MAE)**
    *   **What it is**: The average of the absolute differences between the predicted values (`y_hat`) and the actual values (`y`).
    *   **Intuition**: It tells you, on average, how much your predictions are off, in the original units of the target variable. If MAE is 10, your predictions are typically off by 10 units.
    *   **Formula**: `MAE = (1/n) * Σ|yᵢ - y_hatᵢ|`
    *   **Pros**: Easy to understand and interpret. Less sensitive to outliers compared to MSE/RMSE because it doesn't square the errors.
    *   **Cons**: Doesn't tell you the direction of the error (whether it's an over-prediction or under-prediction).

2.  **Mean Squared Error (MSE)**
    *   **What it is**: The average of the *squared* differences between the predicted values and the actual values.
    *   **Intuition**: Similar to MAE, but because errors are squared, larger errors are penalized much more heavily. This makes MSE more sensitive to outliers.
    *   **Formula**: `MSE = (1/n) * Σ(yᵢ - y_hatᵢ)²`
    *   **Pros**: Mathematically convenient (often used in optimization algorithms like Gradient Descent). Penalizes large errors more, which can be desirable in some contexts.
    *   **Cons**: The units are squared (e.g., if predicting price in dollars, MSE is in dollars squared), making it harder to interpret directly. Highly sensitive to outliers.

3.  **Root Mean Squared Error (RMSE)**
    *   **What it is**: The square root of the MSE.
    *   **Intuition**: Brings the error back to the original units of the target variable, making it much more interpretable than MSE. It still penalizes larger errors more than MAE due to the squaring step before the root.
    *   **Formula**: `RMSE = √MSE = √[(1/n) * Σ(yᵢ - y_hatᵢ)²]`
    *   **Pros**: Interpretable in the same units as the target variable.
    *   **Cons**: Still sensitive to outliers.

4.  **R-squared (Coefficient of Determination)**
    *   **What it is**: A statistical measure that represents the proportion of the variance in the dependent variable that is predictable from the independent variables.
    *   **Intuition**: It tells you how well your model explains the variability of the target variable. An R-squared of 0.75 means that 75% of the variance in the target variable can be explained by your model.
    *   **Range**: Typically between 0 and 1. A value of 1 means the model perfectly predicts the target. A value of 0 means the model explains none of the variance (it's no better than simply predicting the average of the target). It can sometimes be negative if the model performs worse than a simple horizontal line at the mean of the target values.
    *   **Pros**: Provides a relative measure of fit. Easy to understand as a percentage of explained variance.
    *   **Cons**: Can be misleading if not used carefully (e.g., adding more features always increases R-squared, even if they don't genuinely improve the model's generalization).

**Calculating Metrics with Scikit-learn:**

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Using the predictions from our Linear Regression example (y_test, y_pred)
# Remember, y_test contains the actual values from the test set, and y_pred are our model's predictions for them.

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse) # RMSE is simply the square root of MSE
r2 = r2_score(y_test, y_pred)

print(f"\n--- Model Evaluation ---")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"R-squared (R²): {r2:.2f}")
```

These metrics are essential tools for understanding how well our model is performing and for comparing different models to choose the best one for a given task.

### Overfitting and a Glimpse at Regularization

As we touched upon with polynomial regression, a model that is too complex might fit the training data perfectly but fail to generalize to new, unseen data. This critical problem is called **overfitting**. An overfit model essentially "memorizes" the training data, including its random noise and specific quirks, instead of learning the true underlying patterns. This leads to excellent performance on the training data but poor performance on any new data.

Conversely, an **underfit** model is too simple to capture the underlying patterns in the data. It performs poorly on both training and test data because it hasn't learned enough.

[IMAGE_PLACEHOLDER: A single plot showing three different regression lines fitting the same scatter plot of data points.
1.  **Underfit (High Bias)**: A straight line that clearly doesn't capture the trend of the curved data points. Labeled "Too Simple".
2.  **Good Fit (Just Right)**: A slightly curved line that follows the general trend of the data points without being too wiggly. Labeled "Good Fit".
3.  **Overfit (High Variance)**: A very wiggly, complex line that passes through almost every training data point, including outliers, but looks erratic and unlikely to generalize well to new data. Labeled "Too Complex / Overfit".
The pedagogical intent is to visually demonstrate the concepts of underfitting, good fitting, and overfitting.]

To combat overfitting, especially in models with many features or high-degree polynomials, we can use techniques called **regularization**. Regularization methods work by adding a penalty to the cost function for large coefficient values (`β`s). This encourages the model to keep the coefficients small, effectively simplifying the model and making it less prone to overfitting. By penalizing complexity, regularization helps the model focus on the most important features and learn more generalizable patterns.

Two common types of regularization for linear models are:
*   **Lasso Regression (L1 Regularization)**: Adds a penalty proportional to the absolute value of the coefficients. A key feature of Lasso is that it can shrink some coefficients to exactly zero, effectively performing [feature selection](../data-science/unsupervised-learning-dimensionality-reduction.md) by eliminating less important features.
*   **Ridge Regression (L2 Regularization)**: Adds a penalty proportional to the square of the coefficients. Ridge regression shrinks coefficients towards zero but rarely makes them exactly zero.

We won't dive deep into the mathematical details of regularization here, but it's an important concept to be aware of as you build more complex regression models. It helps strike a crucial balance between fitting the training data well and ensuring the model generalizes effectively to new, unseen data.

## Wrap-Up

In this lesson, we've explored the exciting world of regression, a fundamental [supervised learning](../data-science/introduction-to-machine-learning.md) technique for predicting continuous numerical values. We started with the intuitive idea of drawing a "best-fit" line with Linear Regression, understood how a cost function and Gradient Descent help us find that line, and then extended our capabilities to non-linear relationships using Polynomial Regression. Crucially, we also learned how to objectively measure our model's performance using metrics like MAE, MSE, RMSE, and R-squared, and briefly touched upon the critical problem of overfitting and how regularization can help manage model complexity.

Regression is a cornerstone of [machine learning](../data-science/introduction-to-machine-learning.md), with applications ranging from financial forecasting to medical diagnostics. As you continue your learning journey, you'll encounter more advanced regression techniques and further strategies for building robust and accurate predictive models.