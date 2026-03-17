# Supervised Learning: Regression Models

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what regression is and differentiate it from classification.
- Understand the core concept of Linear Regression and its goal.
- Implement a simple Linear Regression model using scikit-learn.
- Evaluate the performance of regression models using metrics like MAE, MSE, and R-squared.
- Identify key assumptions and limitations of Linear Regression.

## Introduction
Imagine you need to predict a specific numerical value – perhaps the future price of a house, tomorrow's high temperature, or a company's sales for the next quarter. These aren't questions with simple "yes" or "no" answers; they demand a precise numerical forecast. This is precisely where **regression** comes into play. As a fundamental type of [supervised-learning](../data_science/supervised-learning-classification.md), regression allows us to predict continuous values by uncovering relationships within historical data, enabling us to make more informed decisions.

In this lesson, we'll embark on a journey into the world of regression. We'll start by grasping its core idea and then focus on one of its most common, intuitive, and foundational forms: **Linear Regression**. You'll learn not only how it works and how to build one using Python's powerful scikit-learn library, but also, crucially, how to objectively measure if your model is making accurate predictions.

## Concept Progression

### What is Regression? Predicting Continuous Values

At its core, regression is about discovering and modeling a relationship between your **input features** (the information you already have) and a **continuous target variable** (the numerical value you want to predict). Think of it as trying to draw a line or a curve that best captures the trend within a set of data points. Once you've found that "line," you can use it to estimate the target value for new, unseen data.

Let's use the example of predicting house prices to make this concrete:
*   **Input Features (Independent Variables):** These are the characteristics of a house that might influence its price, such as its size (square footage), the number of bedrooms, its location, or its age.
*   **Target Variable (Dependent Variable):** This is the actual price of the house – a continuous numerical value that can fall anywhere within a range.

Our primary goal with a regression model is to learn from past house sales data how these features collectively impact the price. With this learned relationship, we can then confidently estimate the price of a new house based on its features.

This approach stands in contrast to [supervised-learning-classification](../data_science/supervised-learning-classification.md), where the objective is to predict a *category* or *class* (e.g., classifying an email as "spam" or "not spam," or an image as "cat" or "dog"). Regression, instead, focuses on predicting a *quantity*.

### Introducing Linear Regression: Finding the Best-Fit Line

Now that we understand the general aim of regression, how do we actually go about finding that predictive relationship? One of the simplest and most widely used methods is **Linear Regression**. As its name suggests, this technique assumes that the relationship between your input features and the target variable can be approximated by a straight line. In cases with multiple features, this "line" extends into a flat plane or hyperplane in higher dimensions.

Let's begin with the simplest scenario: predicting a target `y` using just one feature `x`. You might recall the equation for a straight line from algebra:

`y = mx + b`

In the context of [machine learning](../data_science/introduction-to-machine-learning.md) and Linear Regression, we typically write this as:

`y_predicted = β₀ + β₁ * x`

Let's break down these terms:
*   `y_predicted` is the value our model estimates for the target variable.
*   `x` is our single input feature.
*   `β₀` (pronounced "beta-naught") is the **intercept**. This is the predicted value of `y` when `x` is zero, representing where the line crosses the y-axis.
*   `β₁` (pronounced "beta-one") is the **coefficient** or **slope**. It tells us how much `y_predicted` is expected to change for every one-unit increase in `x`.

The fundamental goal of Linear Regression is to find the "best" values for `β₀` and `β₁` that make this line fit our training data as closely as possible.

[IMAGE_PLACEHOLDER: A 2D scatter plot showing several data points. A straight line (the regression line) is drawn through the middle of these points, representing the best fit. The X-axis is labeled "Feature (e.g., House Size)", and the Y-axis is labeled "Target (e.g., House Price)". The line should visually minimize the distance to the points.]

When we incorporate multiple features (for example, house size, number of bedrooms, and age), the equation naturally extends to accommodate them:

`y_predicted = β₀ + β₁ * x₁ + β₂ * x₂ + ... + βₙ * xₙ`

Here, `x₁, x₂, ..., xₙ` represent our different input features, and `β₁, β₂, ..., βₙ` are their corresponding coefficients, each indicating the individual impact of that feature on the target variable.

### The Math Behind the Line: Minimizing Errors (Intuition)

What exactly does "best-fit" mean in the context of Linear Regression? It means finding a line that minimizes the overall difference between the values our model predicts and the actual values observed in our training data. These differences are known as **residuals** or **errors**.

Consider a data point where the actual house price was $300,000, but your model predicted $280,000. The residual for that specific point would be $20,000. Our objective is to find a line where, on average, these residuals are as small as possible across all data points.

[IMAGE_PLACEHOLDER: A 2D scatter plot with data points and a regression line. For several data points, vertical dashed lines extend from the point to the regression line, illustrating the residuals. One residual line is explicitly labeled "Residual (Error)".]

A widely used method to define "best-fit" in Linear Regression is the **Ordinary Least Squares (OLS)** method. OLS works by finding the line that minimizes the **sum of the squared residuals**. Why do we square the errors?
1.  **Ensuring Positive Contributions:** Squaring each error ensures that all errors contribute positively to the total sum, regardless of whether the prediction was an overestimate or an underestimate. This prevents positive and negative errors from canceling each other out.
2.  **Penalizing Large Errors More:** Squaring gives disproportionately more weight to larger errors. For instance, a prediction that is off by 10 units contributes `10² = 100` to the sum of squared errors, whereas two predictions each off by 5 units contribute `5² + 5² = 25 + 25 = 50`. This mechanism encourages the model to prioritize avoiding significant individual mistakes.

By minimizing this sum, OLS mathematically determines the unique line that best represents the linear relationship within the data.

### Implementing Linear Regression with Scikit-learn

Let's translate these concepts into practice using `scikit-learn`, Python's popular and powerful [machine learning](../data_science/introduction-to-machine-learning.md) library. We'll generate some simple, synthetic data to clearly demonstrate the process.

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt

# 1. Generate some synthetic data
# We'll create a simple linear relationship with some random noise
np.random.seed(42) # For reproducibility
X = 2 * np.random.rand(100, 1) # 100 samples, 1 feature (values between 0 and 2)
y = 4 + 3 * X + np.random.randn(100, 1) # y = 4 + 3x + noise (random normal distribution)

# Visualize the generated data to see its linear trend
plt.figure(figsize=(8, 6))
plt.scatter(X, y, s=20, alpha=0.7)
plt.xlabel("Feature (X)")
plt.ylabel("Target (y)")
plt.title("Synthetic Data for Linear Regression")
plt.grid(True)
plt.show()
```

Now, let's use this data to build and train our Linear Regression model.

```python
# 2. Split the data into training and testing sets
# It's crucial to evaluate our model on data it has not seen during training
# to get an unbiased estimate of its performance.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training data shape: X_train={X_train.shape}, y_train={y_train.shape}")
print(f"Testing data shape: X_test={X_test.shape}, y_test={y_test.shape}")

# 3. Create a Linear Regression model instance
model = LinearRegression()

# 4. Train the model (fit it to the training data)
# The .fit() method is where the OLS algorithm runs, calculating the optimal
# intercept (β₀) and coefficient (β₁) values from X_train and y_train.
model.fit(X_train, y_train)

# 5. Make predictions on the unseen test set
y_pred = model.predict(X_test)

# 6. Inspect the learned coefficients and intercept
# These are the β₀ and β₁ values that the model found.
print(f"\nLearned Intercept (β₀): {model.intercept_[0]:.2f}")
print(f"Learned Coefficient (β₁): {model.coef_[0][0]:.2f}")

# Visualize the regression line on the test data to see how well it fits
plt.figure(figsize=(8, 6))
plt.scatter(X_test, y_test, s=20, alpha=0.7, label='Actual Test Data')
plt.plot(X_test, y_pred, color='red', linewidth=2, label='Regression Line (Predictions)')
plt.xlabel("Feature (X)")
plt.ylabel("Target (y)")
plt.title("Linear Regression Fit on Test Data")
plt.legend()
plt.grid(True)
plt.show()
```
In this practical example:
*   We first generated data that inherently follows a linear pattern, with some added random noise to simulate real-world imperfections.
*   We then **split our data**: `X_train` and `y_train` are used to *teach* the model, while `X_test` and `y_test` are held back to *evaluate* how well it learned on data it has never seen.
*   `LinearRegression()` creates an empty model object, ready to be trained.
*   `model.fit(X_train, y_train)` is the crucial step where the model learns the optimal `β₀` (intercept) and `β₁` (coefficient) values from the training data using the Ordinary Least Squares method.
*   `model.predict(X_test)` uses this newly learned line to make predictions on our unseen test data.
*   Finally, we can access `model.intercept_` and `model.coef_` to see the actual `β₀` and `β₁` values the model found. Notice how remarkably close they are to our original `4` and `3` from the data generation step, demonstrating the model's effectiveness!

### Evaluating Regression Models: How Good is Our Prediction?

After training a model, the next critical step is to objectively assess its performance. For regression tasks, we use specific metrics to quantify the difference between our model's predictions and the actual observed values. These metrics help us understand how accurate and reliable our model is.

#### 1. Mean Absolute Error (MAE)
**Why it matters:** MAE is one of the most intuitive and easy-to-understand metrics. It tells you the average magnitude of the errors in your predictions, without considering whether the prediction was too high or too low.
**How it works:** It calculates the average of the *absolute differences* between each predicted value and its corresponding actual value.
`MAE = (1/n) * Σ |actual - predicted|`
*   **Interpretation:** If your MAE is 5, it means, on average, your model's predictions are off by 5 units from the actual values. The units of MAE are the same as the target variable, making it very interpretable.

#### 2. Mean Squared Error (MSE)
**Why it matters:** MSE is widely used, especially during model training, because it penalizes larger errors much more heavily than smaller ones (due to the squaring operation). This makes it a good metric for optimization, as models often try to minimize MSE.
**How it works:** It calculates the average of the *squared differences* between predicted and actual values.
`MSE = (1/n) * Σ (actual - predicted)²`
*   **Interpretation:** MSE values are in squared units of the target variable, which can make them harder to interpret directly in a real-world context. However, a lower MSE always indicates a better fit.

#### 3. Root Mean Squared Error (RMSE)
**Why it matters:** RMSE is simply the square root of MSE. This crucial step brings the error metric back into the same units as the target variable, making it much more interpretable and comparable to MAE.
**How it works:** `RMSE = √MSE`
*   **Interpretation:** If your RMSE is 5, it means, on average, your predictions are off by about 5 units. Similar to MAE, but because of the squaring involved in its calculation, RMSE gives a higher penalty to large errors, making it more sensitive to outliers.

#### 4. R-squared (Coefficient of Determination)
**Why it matters:** R-squared provides a relative measure of how well your independent variables (features) explain the variability of your dependent variable (target). It gives you a sense of the "goodness of fit" of your model compared to a very basic alternative.
**How it works:** It compares your model's performance to a very simple baseline model that just predicts the mean of the target variable for all inputs.
`R² = 1 - (Sum of Squared Residuals / Total Sum of Squares)`
*   **Interpretation:**
    *   `R² = 1`: Your model perfectly predicts the target variable; all variability is explained.
    *   `R² = 0`: Your model performs no better than simply predicting the mean of the target variable for every input.
    *   `R² < 0`: Your model performs worse than predicting the mean, indicating a very poor fit or that the model is fundamentally flawed for the data.
*   **Range:** For a well-fitting model, R-squared typically ranges between 0 and 1. It can be negative if the model is extremely poor.

Let's calculate these important metrics for our trained Linear Regression model using the test set:

```python
# Evaluate the model using the unseen test set
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse) # Calculate RMSE from MSE for better interpretability
r2 = r2_score(y_test, y_pred)

print(f"\n--- Model Evaluation on Test Set ---")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"R-squared (R²): {r2:.2f}")
```
For our synthetic data, which was designed to have a clear linear relationship, we expect to see very good scores: a high R-squared value (close to 1) and low MAE, MSE, and RMSE values. These results confirm that our model has successfully captured the underlying pattern.

### Assumptions and Limitations of Linear Regression

While Linear Regression is a powerful and straightforward tool, it's not a universal solution. Its reliability and the validity of its interpretations depend on several key assumptions about the data. If these assumptions are violated, the model's performance might suffer, and its conclusions could be misleading. Understanding these "conditions for use" is crucial for effective model building.

**Key Assumptions:**

1.  **Linearity:** The most fundamental assumption is that there is a **linear relationship** between the input features and the target variable. If the true relationship is inherently curved (e.g., quadratic or exponential), a straight line simply won't capture it well, leading to poor predictions.
2.  **Independence of Errors:** The residuals (the differences between actual and predicted values) should be **independent** of each other. This means the error for one prediction should not be correlated with the error for another prediction. This assumption is often violated in time-series data, where errors might show patterns over time.
3.  **Homoscedasticity (Constant Variance of Errors):** This technical term means that the **spread (variance) of the residuals should be roughly constant** across all levels of the predicted values. Visually, if you plot residuals against predicted values, you shouldn't see a "fanning out" or "fanning in" pattern. If errors get systematically larger as predicted values increase (or decrease), this assumption is violated.
    [IMAGE_PLACEHOLDER: Two scatter plots side-by-side. Left plot (Homoscedastic): Residuals plotted against predicted values, showing a random scatter with constant width. Right plot (Heteroscedastic): Residuals plotted against predicted values, showing a fanning-out or fanning-in pattern, indicating increasing or decreasing variance of errors.]
4.  **Normality of Errors:** The residuals should be **normally distributed**. While not strictly necessary for the model to produce predictions, this assumption is important for statistical inference, such as calculating confidence intervals or performing hypothesis tests on the coefficients.
5.  **No Multicollinearity:** If you have multiple input features, they should **not be highly correlated with each other**. If two or more features provide very similar information, it can make it difficult for the model to accurately determine the individual impact (coefficient) of each feature, leading to unstable and less interpretable coefficients.

**Limitations:**

*   **Cannot capture non-linear relationships:** As mentioned, if the underlying data truly follows a complex curve, Linear Regression will struggle to fit it accurately. More advanced, non-linear models would be required.
*   **Sensitive to outliers:** Extreme values (outliers) in the data can exert a strong pull on the regression line, significantly altering its slope and intercept. This can lead to a line that poorly represents the majority of the data points.
*   **Requires [feature engineering](../data_science/data-cleaning-and-preprocessing.md) for complex interactions:** Linear Regression inherently assumes that the effects of different features are additive. If features interact in more complex ways (e.g., the impact of house size on price might depend on the number of bathrooms), you might need to manually create new "interaction features" to capture these relationships.

Understanding these assumptions and limitations is crucial. They help you diagnose why your Linear Regression model might not be performing as expected, and they guide you toward choosing more appropriate models or applying necessary data preprocessing steps to improve your model's reliability and accuracy.

## Wrap-Up

In this lesson, we've successfully demystified regression, understanding its vital role in predicting continuous numerical values. We delved specifically into **Linear Regression**, learning how it works by finding a "best-fit" line that minimizes the sum of squared errors between predictions and actual values. You've gained hands-on experience implementing this foundational model using Python's `scikit-learn` library and, critically, learned how to evaluate its performance using key metrics like MAE, MSE, RMSE, and R-squared. Finally, we explored the important assumptions and limitations of Linear Regression, which are essential for knowing when and how to apply this powerful technique effectively.

Linear Regression is a cornerstone algorithm in [machine learning](../data_science/introduction-to-machine-learning.md). Despite its simplicity, it provides a robust baseline and often serves as an excellent starting point for a wide array of predictive tasks. As you continue your [machine learning](../data_science/introduction-to-machine-learning.md) journey, you'll find that the principles learned here form the basis for understanding more advanced regression techniques that can tackle even greater complexities.