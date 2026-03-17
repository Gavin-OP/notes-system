# Data Cleaning and Preprocessing

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the importance of data cleaning and preprocessing in the [machine learning](../data-science/introduction-to-machine-learning.md) pipeline.
- Identify and effectively handle missing values in a dataset using various strategies.
- Detect and treat outliers to prevent them from negatively impacting [model performance](../data-science/supervised-learning-regression.md).
- Apply common data transformation techniques, including feature scaling and encoding categorical variables.
- Understand the basics of feature engineering to create new, informative features.

## Introduction
Imagine you're a chef preparing a gourmet meal. You wouldn't just throw raw, unwashed ingredients straight into the pot, would you? You'd meticulously clean the vegetables, trim the meat, and measure everything precisely. Similarly, in the world of [machine learning](../data-science/introduction-to-machine-learning.md), data is our raw ingredient, and it rarely comes in a perfectly usable state.

The adage "Garbage in, garbage out" is particularly true in [data science](../data-science/introduction-to-data-science.md). If your data is messy, incomplete, or inconsistent, even the most sophisticated [machine learning](../data-science/introduction-to-machine-learning.md) model will struggle to perform well, leading to unreliable results. This is where **data cleaning and preprocessing** become indispensable. It's the essential first step to transform raw, often chaotic, data into a clean, structured, and suitable format for building robust and accurate models.

In this lesson, we'll learn the fundamental techniques to prepare your data, ensuring your models have the best possible ingredients to work with. We'll cover everything from fixing common data flaws to transforming features into a format that algorithms can truly understand.

## Concept Progression

### What is Data Cleaning and Preprocessing?
At its core, data cleaning and preprocessing is the comprehensive process of identifying and correcting errors, handling inconsistencies, and transforming raw data into a format that [machine learning](../data-science/introduction-to-machine-learning.md) algorithms can understand and learn from effectively. Think of it as preparing your data for its big debut – making it presentable, consistent, and ready to perform.

Why is this preparatory stage so critically important?
1.  **Accuracy:** Dirty or flawed data inevitably leads to inaccurate models and misleading insights. If your model learns from incorrect information, its predictions will also be flawed.
2.  **Efficiency:** Many algorithms run significantly faster and more efficiently on clean, well-structured data, saving computational resources and time.
3.  **[Model Performance](../data-science/supervised-learning-regression.md):** Some [machine learning](../data-science/introduction-to-machine-learning.md) algorithms are highly sensitive to the scale of features or the presence of extreme values (outliers). Preprocessing helps these models perform optimally, preventing them from being biased or overwhelmed by raw data.
4.  **Consistency:** Ensuring data is in a consistent format across all features and observations prevents errors, improves the model's ability to generalize, and makes the results easier to interpret.

Common issues we frequently encounter and tackle during this phase include:
*   **Missing values:** Gaps in our dataset where information is absent.
*   **Outliers:** Data points that are significantly different from the majority, potentially skewing results.
*   **Inconsistent formats:** For example, dates entered as "1/1/2023" in one place and "January 1st, 2023" in another.
*   **Categorical data:** Textual data (like 'City' or 'Product Type') that needs to be converted into numerical representations for algorithms.
*   **Varying scales:** Numerical features measured in vastly different units or ranges (e.g., age in years vs. income in thousands of dollars).

Let's dive into how we address these challenges, starting with one of the most prevalent issues: missing information.

### Handling Missing Data
Missing data is one of the most common and frustrating problems you'll encounter in real-world datasets. It occurs when no value is stored for a particular observation in a feature (column). This can happen for a myriad of reasons: data entry errors, equipment malfunction, privacy concerns, survey respondents skipping questions, or simply that the information wasn't applicable or collected.

**Identifying Missing Data**
Before we can fix missing data, we first need to locate it. In Python, the Pandas library provides excellent tools for this. Missing values often appear as `NaN` (Not a Number) for numerical data or `None` for object types.

```python
import pandas as pd
import numpy as np

# Create a sample DataFrame with missing values to demonstrate
data = {
    'Age': [25, 30, np.nan, 40, 35],
    'Salary': [50000, 60000, 75000, np.nan, 62000],
    'City': ['New York', 'London', 'Paris', 'New York', np.nan]
}
df = pd.DataFrame(data)
print("Original DataFrame:")
print(df)

# Check for missing values in each column
print("\nMissing values count per column:")
print(df.isnull().sum())

# Check the percentage of missing values, which helps assess the severity
print("\nPercentage of missing values per column:")
print(df.isnull().sum() / len(df) * 100)
```
The output shows us exactly which columns have missing data and how much, guiding our next steps.

**Strategies for Dealing with Missing Data**
Once identified, we have several strategies to choose from. The best approach depends on the amount of missing data, the nature of the feature, and the potential impact on your analysis.

1.  **Deletion:**
    *   **Row-wise deletion (`df.dropna()`):** This method removes any row that contains one or more missing values. It's simple and effective when the number of missing values is small, or if the missingness is truly random and doesn't carry specific information. However, be cautious, as it can lead to significant data loss if many rows have even a single missing value.

    ```python
    # Example: Deleting rows with any missing values
    df_cleaned_rows = df.dropna()
    print("\nDataFrame after deleting rows with missing values:")
    print(df_cleaned_rows)
    ```
    *   **Column-wise deletion (`df.dropna(axis=1)`):** If a column has a very high percentage of missing values (e.g., more than 70-80%), it might be better to remove the entire column. This is done when a feature is mostly empty and unlikely to provide useful information, or if imputing it would introduce too much artificial data.

    ```python
    # Example: Deleting columns with any missing values
    # For our small example, this would remove 'Age', 'Salary', and 'City'
    # because each contains at least one NaN. In a real scenario, you'd set a threshold.
    # df_cleaned_cols = df.dropna(axis=1, thresh=len(df) * 0.5) # Keep columns with at least 50% non-NaN values
    # print("\nDataFrame after deleting columns with too many missing values:")
    # print(df_cleaned_cols)
    ```

2.  **Imputation:**
    *   **Mean/Median/Mode Imputation:** This is a common and straightforward approach.
        *   **Mean:** Replace missing numerical values with the average of the existing values in that column. It's simple but sensitive to outliers.
        *   **Median:** Replace missing numerical values with the median (middle value) of the existing values. This is more robust to outliers than the mean.
        *   **Mode:** Replace missing categorical values with the most frequent category in that column.
    *   **Forward/Backward Fill:** Useful for time-series data, where you might replace a missing value with the previous (`ffill`) or next (`bfill`) valid observation.
    *   **Advanced Imputation:** For more complex scenarios, you can use sophisticated methods like K-Nearest Neighbors (KNN) imputation, which estimates missing values based on similar data points, or even predict missing values using other features in the dataset (e.g., using a regression model).

    ```python
    # Let's re-create the original DataFrame to demonstrate imputation clearly
    df_impute = pd.DataFrame(data)

    # Example: Imputing missing 'Age' with the median (robust to potential age outliers)
    median_age = df_impute['Age'].median()
    df_impute['Age'].fillna(median_age, inplace=True)

    # Example: Imputing missing 'Salary' with the mean (common for income-like data)
    mean_salary = df_impute['Salary'].mean()
    df_impute['Salary'].fillna(mean_salary, inplace=True)

    # Example: Imputing missing 'City' with the mode (most frequent city)
    mode_city = df_impute['City'].mode()[0] # .mode() returns a Series, so take the first element
    df_impute['City'].fillna(mode_city, inplace=True)

    print("\nDataFrame after imputation:")
    print(df_impute)
    ```
Choosing the right strategy for missing data is a critical decision. It depends heavily on the nature of your data, the extent of missingness, and your domain knowledge. Visualizing missing data patterns (e.g., using a heatmap) can also be very helpful in making informed choices.

[IMAGE_PLACEHOLDER: A heatmap showing missing values in a DataFrame. Rows represent observations, columns represent features. Missing values are highlighted in a distinct color (e.g., yellow), while present values are dark blue. The pedagogical intent is to visually represent the distribution and quantity of missing data across features.]

Now that we've learned how to handle gaps in our data, let's turn our attention to another common data quality issue: extreme values.

### Dealing with Outliers
Outliers are data points that significantly deviate from other observations in a dataset. They are "odd ones out" that lie an abnormal distance from other values. Think of a class where most students score between 60-90, but one student scores 5 and another scores 1000 (a data entry error). These extreme scores are outliers.

**Why do outliers matter?**
Outliers can profoundly skew statistical analyses and model training. For example, a single extremely high income value in a dataset could drastically inflate the calculated average income, making it unrepresentative of the majority. Many [machine learning](../data-science/introduction-to-machine-learning.md) algorithms, especially those sensitive to distance (like K-Means, Support Vector Machines, [Linear Regression](../data-science/supervised-learning-regression.md)), can be heavily influenced by outliers, leading to less accurate or biased models.

**Identifying Outliers**
Before we decide how to treat them, we need to find them.

1.  **Visualization:**
    *   **Box Plots:** These are excellent for visualizing the distribution of a numerical feature and clearly showing potential outliers as individual points beyond the "whiskers."
    *   **Scatter Plots:** Useful for identifying outliers in two-dimensional data, where points might lie far away from the main cluster of data.
    *   **Histograms:** Can show unusual peaks or long tails in the distribution, indicating the presence of extreme values.

2.  **Statistical Methods:**
    *   **Z-score:** The Z-score measures how many standard deviations a data point is from the mean. A common threshold for an outlier is a Z-score greater than 2 or 3 (or less than -2 or -3). This method assumes the data is normally distributed.
    *   **Interquartile Range (IQR):** This is a more robust method for identifying outliers, as it's less sensitive to extreme values itself. The IQR is the range between the first quartile (Q1, the 25th percentile) and the third quartile (Q3, the 75th percentile). Outliers are often defined as values that fall below `Q1 - 1.5 * IQR` or above `Q3 + 1.5 * IQR`.

Let's use a box plot and the IQR method to detect outliers:

[IMAGE_PLACEHOLDER: A box plot for a numerical feature like 'Salary'. The box represents the interquartile range (IQR), the line inside is the median. Whiskers extend to 1.5 * IQR from Q1 and Q3. Individual points outside the whiskers are clearly marked as outliers. The pedagogical intent is to visually demonstrate how outliers are identified using the IQR method.]

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Let's create a new DataFrame with some clear outliers for demonstration
data_outliers = {
    'Value': [10, 12, 15, 13, 11, 100, 14, 16, 9, 120, 11, 13]
}
df_outliers = pd.DataFrame(data_outliers)

# Visualize with a box plot
plt.figure(figsize=(6, 4))
sns.boxplot(y=df_outliers['Value'])
plt.title('Box Plot of Values with Outliers')
plt.ylabel('Value')
plt.show()

# Using the IQR method to detect outliers programmatically
Q1 = df_outliers['Value'].quantile(0.25)
Q3 = df_outliers['Value'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df_outliers[(df_outliers['Value'] < lower_bound) | (df_outliers['Value'] > upper_bound)]
print("\nOutliers detected using IQR method:")
print(outliers)
```

**Strategies for Dealing with Outliers**
Once identified, how do we handle them?

1.  **Removal:** If outliers are clearly due to data entry errors or are truly erroneous measurements, removing them might be the best option. However, exercise caution, as removing too much data can lead to loss of valuable information or alter the underlying distribution.
2.  **Transformation:** Applying mathematical transformations (like log transformation, square root transformation, or cube root transformation) can reduce the impact of extreme values by compressing the range of the data. This is often useful when data is highly skewed.
3.  **Capping (Winsorization):** Instead of removing outliers entirely, you can "cap" them. This means replacing values above a certain upper limit with the upper limit itself, and values below a certain lower limit with the lower limit itself. For example, replace all values above `Q3 + 1.5 * IQR` with `Q3 + 1.5 * IQR`. This preserves the data points but limits their extreme influence.
4.  **Treat as Missing:** In some cases, especially if the outlier is suspected to be an error, it can be treated as a missing value and then imputed using one of the methods discussed earlier.

```python
# Example: Capping outliers using the IQR method
df_outliers_capped = df_outliers.copy()
# Cap values above the upper bound
df_outliers_capped['Value'] = np.where(df_outliers_capped['Value'] > upper_bound, upper_bound, df_outliers_capped['Value'])
# Cap values below the lower bound
df_outliers_capped['Value'] = np.where(df_outliers_capped['Value'] < lower_bound, lower_bound, df_outliers_capped['Value'])

print("\nDataFrame after capping outliers:")
print(df_outliers_capped)

# Alternatively, you could remove them:
# df_outliers_removed = df_outliers[(df_outliers['Value'] >= lower_bound) & (df_outliers['Value'] <= upper_bound)]
# print("\nDataFrame after removing outliers:")
# print(df_outliers_removed)
```
Deciding whether to remove, transform, or cap outliers requires careful consideration and often domain expertise. It's crucial to understand the source of the outliers and their potential impact on your specific model.

### Data Transformation
Moving beyond fixing errors and extreme values, data transformation involves changing the scale or distribution of a feature. This is often a necessary step because many [machine learning](../data-science/introduction-to-machine-learning.md) algorithms perform better, converge faster, or yield more accurate results when numerical input variables have a consistent scale and/or a distribution that approximates a Gaussian (bell curve) shape.

#### Feature Scaling
Feature scaling is a method used to normalize the range of independent variables or features of data. While the term 'data normalization' is sometimes used broadly to refer to feature scaling, it often specifically refers to Min-Max scaling.

**Why scale features?**
*   **Distance-based algorithms:** Algorithms like K-Nearest Neighbors (KNN), Support Vector Machines (SVMs), and K-Means clustering calculate distances between data points. If features have vastly different scales (e.g., age from 0-100 and income from 0-1,000,000), features with larger ranges will numerically dominate the distance calculation, making the model biased towards them. Scaling ensures all features contribute proportionally.
*   **Gradient Descent based algorithms:** Algorithms like [Linear Regression](../data-science/supervised-learning-regression.md), [Logistic Regression](../data-science/supervised-learning-classification.md), and Neural Networks that use gradient descent to optimize their parameters converge much faster and more stably when features are scaled. Unscaled features can lead to an elongated cost function landscape, making it harder for the optimizer to find the minimum.
*   **Regularization:** Techniques like L1/L2 regularization penalize large coefficients to prevent overfitting. If features are not scaled, features with larger values might get disproportionately penalized or have their coefficients shrunk more than features with smaller values, regardless of their actual importance.

Common scaling techniques:

1.  **Min-Max Scaling (Normalization):**
    *   Rescales features to a fixed range, typically 0 to 1.
    *   Formula: `X_scaled = (X - X_min) / (X_max - X_min)`
    *   **Benefit:** Simple, preserves the original distribution shape.
    *   **Caution:** Highly sensitive to outliers, as they will determine the `X_min` and `X_max` values, compressing the range of the majority of data.

2.  **Standardization (Z-score Scaling):**
    *   Rescales features to have a mean of 0 and a standard deviation of 1.
    *   Formula: `X_scaled = (X - mean(X)) / std(X)`
    *   **Benefit:** Less affected by outliers than Min-Max scaling because it uses the mean and standard deviation, which are more robust to extreme values. It's suitable for algorithms that assume a Gaussian distribution.
    *   **Caution:** Does not bound values to a specific range, so extreme outliers can still result in scaled values far from 0.

```python
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Sample data with different scales
data_scaling = {'Feature1': [10, 20, 30, 40, 50],
                'Feature2': [1000, 2000, 3000, 4000, 5000]}
df_scaling = pd.DataFrame(data_scaling)
print("\nOriginal DataFrame for scaling:")
print(df_scaling)

# Apply Min-Max Scaling
min_max_scaler = MinMaxScaler()
df_min_max_scaled = pd.DataFrame(min_max_scaler.fit_transform(df_scaling), columns=df_scaling.columns)
print("\nDataFrame after Min-Max Scaling (values between 0 and 1):")
print(df_min_max_scaled)

# Apply Standardization
standard_scaler = StandardScaler()
df_standard_scaled = pd.DataFrame(standard_scaler.fit_transform(df_scaling), columns=df_scaling.columns)
print("\nDataFrame after Standardization (mean=0, std=1):")
print(df_standard_scaled)
```

[IMAGE_PLACEHOLDER: A set of three histograms or density plots for a single numerical feature. The first plot shows the original distribution (e.g., skewed). The second shows the distribution after Min-Max scaling (values compressed between 0 and 1, shape preserved). The third shows the distribution after Standardization (mean at 0, standard deviation of 1, shape preserved). The pedagogical intent is to visually compare the effect of different scaling methods on the feature's range and distribution.]

#### Encoding Categorical Data
[Machine learning](../data-science/introduction-to-machine-learning.md) algorithms are fundamentally designed to work with numerical data. This means that any categorical (textual) features in our dataset, such as 'City', 'Color', or 'Product Type', must be converted into numerical representations before they can be fed into a model.

1.  **One-Hot Encoding:**
    *   This is the most common and generally preferred method for **nominal** (unordered) categorical data.
    *   It creates a new binary (0 or 1) column for each unique category in the original feature. A '1' indicates the presence of that category for a given observation, and a '0' indicates its absence.
    *   **Benefit:** Avoids implying any artificial ordinal relationship between categories, which is crucial for nominal data.
    *   **Caution:** Can lead to a large number of new features if a categorical variable has many unique categories (a problem known as high cardinality), potentially increasing computational cost and the risk of the "curse of dimensionality." To mitigate this, `drop_first=True` is often used to avoid multicollinearity by dropping one of the generated columns.

    ```python
    # Using our imputed DataFrame 'df_impute' which has the 'City' column
    print("\nOriginal DataFrame for encoding (using imputed data):")
    print(df_impute)

    # One-Hot Encoding for 'City'
    # drop_first=True removes one category column to prevent multicollinearity
    df_encoded = pd.get_dummies(df_impute, columns=['City'], drop_first=True)
    print("\nDataFrame after One-Hot Encoding 'City':")
    print(df_encoded)
    ```

2.  **Label Encoding:**
    *   Assigns a unique integer to each category (e.g., 'Red': 0, 'Green': 1, 'Blue': 2).
    *   **Benefit:** Simple and creates only one new column, avoiding the dimensionality issue of one-hot encoding.
    *   **Suitability:** Primarily suitable for **ordinal** (ordered) categorical data, where the numerical order makes logical sense (e.g., 'Small': 0, 'Medium': 1, 'Large': 2).
    *   **Major Caution:** For nominal data, label encoding can mislead algorithms into assuming an artificial order or relationship between categories (e.g., that 'Paris' (2) is "greater than" 'London' (1)). This can negatively impact [model performance](../data-science/supervised-learning-regression.md), especially for algorithms that interpret numerical differences as meaningful (like linear models or tree-based models without specific handling).

    ```python
    from sklearn.preprocessing import LabelEncoder

    # Example for Label Encoding (use with caution for nominal data like 'City')
    df_label_encoded = df_impute.copy()
    le = LabelEncoder()
    df_label_encoded['City_LabelEncoded'] = le.fit_transform(df_label_encoded['City'])
    print("\nDataFrame after Label Encoding 'City':")
    print(df_label_encoded[['City', 'City_LabelEncoded']])
    ```
Always consider the nature of your categorical data (nominal vs. ordinal) when choosing an encoding strategy.

### Basic Feature Engineering
After cleaning and transforming our existing features, we arrive at one of the most creative and impactful stages: feature engineering. This is the process of creating new features from existing ones to improve the performance of [machine learning](../data-science/introduction-to-machine-learning.md) models. It's often considered an art form in [data science](../data-science/introduction-to-data-science.md), as it requires a blend of domain knowledge, statistical understanding, and creative problem-solving.

**Why Feature Engineering?**
Sometimes, the raw features in your dataset don't directly capture the underlying patterns or relationships that a model needs to learn. By combining, transforming, or extracting information from existing features, we can create new ones that are more informative, predictive, and directly relevant to the problem at hand. This can significantly boost model accuracy, even more so than trying different complex algorithms.

**Simple Examples:**

1.  **Combining Features:**
    *   If you have `FirstName` and `LastName`, you might combine them into `FullName` for identification.
    *   If you have `Height` and `Weight`, you could create `BMI = Weight / (Height^2)`, which is a more direct indicator of health than either feature alone.
    *   For sales data, `Price` and `Quantity` can be combined into `TotalPrice = Price * Quantity`.

2.  **Extracting Information:**
    *   From a `Date` or `Timestamp` column, you can extract a wealth of information: `Year`, `Month`, `Day`, `DayOfWeek`, `Hour`, `IsWeekend`, `Quarter`, `TimeSinceLastPurchase`, etc.
    *   From a `Text` column, you can extract `WordCount`, `CharacterCount`, `HasQuestionMark`, `SentimentScore`, or `LengthOfReview`.

3.  **Interaction Terms:**
    *   Multiplying two features together to capture their combined effect. For example, `Age * Income` might reveal a different pattern (e.g., older, high-income individuals behave differently) than `Age` and `Income` separately.

Let's look at an example of extracting information and combining features:

```python
# Create a new DataFrame for feature engineering demonstration
df_fe = pd.DataFrame({
    'PurchaseDate': pd.to_datetime(['2023-01-15', '2023-01-16', '2023-02-01', '2023-02-02', '2023-03-09']),
    'Price': [100, 150, 200, 120, 80],
    'Quantity': [1, 2, 1, 3, 2]
})
print("\nOriginal DataFrame for Feature Engineering:")
print(df_fe)

# Example 1: Extracting information from 'PurchaseDate'
df_fe['PurchaseMonth'] = df_fe['PurchaseDate'].dt.month
df_fe['DayOfWeek'] = df_fe['PurchaseDate'].dt.dayofweek # Monday=0, Sunday=6
df_fe['IsWeekend'] = df_fe['DayOfWeek'].isin([5, 6]).astype(int) # 1 if weekend, 0 otherwise

# Example 2: Combining features to create 'TotalPrice'
df_fe['TotalPrice'] = df_fe['Price'] * df_fe['Quantity']

print("\nDataFrame after Feature Engineering:")
print(df_fe)
```
Feature engineering is an iterative process. You might create new features, test your model's performance, and then refine or create even more features based on the results. It's a continuous cycle of hypothesis, creation, and evaluation.

## Wrap-Up
Congratulations! You've taken a crucial step in understanding the backbone of any successful [machine learning](../data-science/introduction-to-machine-learning.md) project: data cleaning and preprocessing. We've covered why it's essential, how to tackle common data quality issues like missing values and outliers, and how to transform your data through scaling and encoding to make it palatable for machine learning algorithms. We also touched upon the creative and powerful process of feature engineering, which can unlock hidden patterns and significantly boost your model's predictive power.

Remember, data preprocessing is not a one-time task but often an iterative process. It requires careful thought, domain knowledge, and experimentation. By mastering these techniques, you ensure that your [machine learning](../data-science/introduction-to-machine-learning.md) models are built on a solid foundation, leading to more reliable, accurate, and interpretable predictions. In the next lesson, we'll start exploring how to select the most relevant features for your model, building upon the clean and well-prepared data you now know how to create.