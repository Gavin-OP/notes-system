<a id="concept-data-cleaning-preprocessing"></a>
# Data Cleaning and Preprocessing

## Learning Objectives
- Understand why data cleaning and preprocessing are essential steps in any data project.
- Identify and effectively handle missing data using various imputation techniques.
- Detect and manage outliers to prevent them from skewing your analysis and models.
- Apply data transformation methods to adjust data distributions for better model performance.
- Implement feature scaling techniques like normalization and standardization to standardize feature ranges.
- Convert categorical data into a numerical format suitable for machine learning algorithms using encoding methods.

## Introduction
Imagine you're a chef preparing a gourmet meal. You wouldn't just throw raw, unwashed ingredients straight into the pot, would you? You'd meticulously clean the vegetables, trim the meat, and measure everything precisely. [Data](../data-science/data-fundamentals-and-types.md#concept-data) science is much the same. Raw data, fresh from collection, is rarely in a perfect state. It's often messy, incomplete, and inconsistent. This "raw" data can lead to unreliable analyses and poor-performing models, no matter how sophisticated your algorithms are.

This is where **Data Cleaning and Preprocessing** comes in. It's the crucial step of transforming raw data into a clean, structured, and usable format. Think of it as preparing your ingredients before you start cooking. By mastering these techniques, you ensure your data is of high quality, making your models more accurate and your insights more trustworthy. In this lesson, we'll explore the fundamental techniques to whip your data into shape, starting with one of the most common issues: missing information.

## Concept Progression

<a id="concept-missing-data"></a>
### The Messy Reality: Missing Data
One of the most common and frustrating issues you'll encounter with raw data is **missing data**. This refers to values that are not recorded for a particular variable in your dataset. These missing values can appear in various forms: `NaN` (Not a Number), `null`, empty strings, or even specific placeholder numbers like `999` or `-1`, depending on how the data was originally collected.

Why does data go missing? The reasons are numerous: a sensor might fail, a user might skip a question in a survey, a database entry might be corrupted, or data might simply not exist for a particular observation. Regardless of the cause, missing data can severely impact your analysis. Most statistical models and machine learning algorithms cannot handle missing values directly and will either throw an error or produce biased, unreliable results. Therefore, identifying and addressing them is a critical first step.

In Python, using libraries like Pandas, identifying missing data is straightforward. Let's see how:

```python
import pandas as pd
import numpy as np

# Create a sample DataFrame with missing values
data = {
    'Age': [25, 30, np.nan, 40, 35],
    'Income': [50000, 60000, 75000, np.nan, 62000],
    'City': ['New York', 'London', 'Paris', 'New York', np.nan]
}
df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)

print("\nMissing values per column:")
print(df.isnull().sum())
```

**Output:**
```
Original DataFrame:
    Age   Income      City
0  25.0  50000.0  New York
1  30.0  60000.0    London
2   NaN  75000.0     Paris
3  40.0      NaN  New York
4  35.0  62000.0       NaN

Missing values per column:
Age       1
Income    1
City      1
dtype: int64
```

[IMAGE_PLACEHOLDER: A table representing a small dataset with columns 'Age', 'Income', 'City'. Several cells are explicitly marked as "NaN" or empty, highlighting the missing values. For example, Age for row 3 is NaN, Income for row 4 is NaN, and City for row 5 is NaN. The table should clearly show the structure of a DataFrame with missing entries.]

As you can see, our sample DataFrame has one missing value in each column. Now that we've identified these gaps, the next step is to decide how to fill or manage them.

<a id="concept-data-imputation"></a>
### Filling the Gaps: Data Imputation
Once you've identified missing [data](../data-science/data-fundamentals-and-types.md#concept-data), you need a strategy to handle it. **Data imputation** is the process of replacing these missing values with substituted values. The goal is to fill these gaps in a way that preserves the integrity of your dataset and minimizes bias, allowing your models to run without errors and produce more accurate results.

Common imputation strategies include:

1.  **Deletion**:
    *   **Row-wise deletion (Listwise Deletion)**: This involves removing entire rows that contain *any* missing values. It's simple to implement but can lead to significant data loss if many rows have even a single missing entry, potentially reducing the representativeness of your dataset.
    *   **Column-wise deletion**: This means removing entire columns if they have too many missing values (e.g., more than 50% missing). This is only advisable if a column is largely empty or deemed irrelevant to your analysis.

2.  **Mean/Median/Mode Imputation**:
    *   For numerical features, you can replace missing values with the **mean** (average) or **median** (middle value) of that column. The median is often preferred if the data has outliers, as it's less sensitive to extreme values and provides a more robust central tendency.
    *   For categorical features, replace missing values with the **mode** (most frequent value) of that column. This ensures the imputed values are valid categories.

3.  **Forward Fill / Backward Fill**:
    *   For time-series or ordered data, you can fill missing values with the previous valid observation (forward fill) or the next valid observation (backward fill). This assumes that the value doesn't change drastically over short periods.

Let's apply some of these imputation techniques to our sample DataFrame:

```python
# Impute 'Age' with the median (robust to potential outliers)
df['Age'].fillna(df['Age'].median(), inplace=True)

# Impute 'Income' with the mean (common for numerical data, but be mindful of outliers)
df['Income'].fillna(df['Income'].mean(), inplace=True)

# Impute 'City' with the mode (most frequent city)
df['City'].fillna(df['City'].mode()[0], inplace=True)

print("\nDataFrame after imputation:")
print(df)
print("\nMissing values after imputation:")
print(df.isnull().sum())
```

**Output:**
```
DataFrame after imputation:
    Age   Income      City
0  25.0  50000.0  New York
1  30.0  60000.0    London
2  32.5  75000.0     Paris
3  40.0  61750.0  New York
4  35.0  62000.0  New York

Missing values after imputation:
Age       0
Income    0
City      0
dtype: int64
```

[IMAGE_PLACEHOLDER: A before-and-after diagram showing a column named 'Age' with missing values. The "before" section shows the column with `NaN` in one row. The "after" section shows the same column where the `NaN` has been replaced by the calculated median value (e.g., 32.5), clearly demonstrating the imputation process.]

Choosing the right imputation method depends heavily on the nature of your data and the reason for the missingness. Simple methods like mean/median/mode imputation are good starting points, but more advanced techniques (such as using machine learning models to predict missing values) exist for complex scenarios.

With our missing values handled, let's turn our attention to another common data quality issue: extreme values that don't quite fit in.

<a id="concept-outliers"></a>
### The Odd Ones Out: Outliers
Beyond missing data, another common data quality issue is the presence of **outliers**. An outlier is a data point that significantly differs from other observations. It's an "anomaly" or an "extreme value" that lies an abnormal distance from other values in a random sample from a population. Think of it as a single very tall person in a room full of people of average height – they stand out.

Outliers can arise from various sources:
*   **Measurement errors**: A faulty sensor, a human error during data entry (e.g., typing an extra zero).
*   **Data entry errors**: A typo, like entering `1000` instead of `100`.
*   **Natural variations**: A truly rare but valid observation (e.g., a person with an exceptionally high income in a general population survey). These are often the most challenging to decide how to handle.
*   **Intentional errors**: Fraudulent data entries.

Why are outliers problematic? They can disproportionately influence statistical analyses and machine learning models. For example, a single extremely high income value can drastically inflate the calculated mean income, making it unrepresentative of the majority. This can lead to models that perform poorly on typical data, as they've been skewed by these extreme points.

Identifying outliers often involves visualization and statistical methods. A common and effective visualization is the **box plot**.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Create a sample dataset with an outlier
data_with_outlier = {
    'Score': [85, 90, 78, 92, 88, 150, 80, 87]
}
df_outlier = pd.DataFrame(data_with_outlier)

print("DataFrame with outlier:")
print(df_outlier)

# Visualize with a box plot
plt.figure(figsize=(6, 4))
sns.boxplot(y=df_outlier['Score'])
plt.title('Box Plot of Scores with Outlier')
plt.ylabel('Score')
plt.show()
```

[IMAGE_PLACEHOLDER: A box plot showing a distribution of data points for 'Score'. The box represents the interquartile range, the line inside is the median, and whiskers extend to typical data range. One data point (e.g., 150) is clearly plotted as an individual dot far above the upper whisker, representing a distinct outlier.]

In the box plot above, the point far above the upper whisker (150) is clearly an outlier. Statistically, the Interquartile Range (IQR) method is often used: any data point falling below `Q1 - 1.5 * IQR` or above `Q3 + 1.5 * IQR` is typically considered an outlier. (Q1 is the 25th percentile, Q3 is the 75th percentile, and IQR = Q3 - Q1).

Handling outliers requires careful consideration and domain knowledge. You might:
*   **Remove them**: If they are clearly data entry errors or anomalies that won't generalize to new data. Be cautious, as this reduces your dataset size.
*   **Transform them**: Use transformations (like log transformation, which we'll discuss next) that reduce the impact of extreme values by compressing their range.
*   **Cap/Floor them (Winsorization)**: Replace outliers with the nearest non-outlier value (e.g., replace values above `Q3 + 1.5 * IQR` with `Q3 + 1.5 * IQR`). This keeps the data point but limits its extreme influence.
*   **Keep them**: If they represent genuine, albeit rare, phenomena that are important for your analysis (e.g., a rare disease outbreak, a record-breaking sales day).

Once missing values and outliers are addressed, we can move on to more general adjustments to our data's structure and distribution.

<a id="concept-data-transformation"></a>
### Shaping Your Data: Data Transformation
**Data transformation** is a broad process of converting data from one format or structure into another. While handling missing values and outliers are specific types of transformations, this concept generally refers to changing the distribution, scale, or relationships within your features. The primary goal of data transformation is to make the data more suitable for analysis and modeling, often by making it conform to certain statistical assumptions or improving model performance.

Why transform data?
*   **Meet model assumptions**: Many statistical models (like linear regression) assume that data is normally distributed (bell-shaped curve). Transformations can help achieve this.
*   **Improve model performance**: Some algorithms perform better when features have a specific distribution or range.
*   **Reduce skewness**: Highly skewed data (where values are concentrated on one side with a long tail) can lead to biased models. Transformations can make distributions more symmetrical.
*   **Handle non-linearity**: Transformations can sometimes linearize relationships between variables, which is beneficial for linear models.

Common transformations include:
*   **Log transformation**: Particularly useful for highly right-skewed data (where the tail is on the right), converting multiplicative relationships into additive ones. It compresses large values more than small values.
*   **Square root transformation**: Similar to log, but less aggressive in compressing values.
*   **Reciprocal transformation**: Can be used for highly skewed data, especially when dealing with ratios.
*   **Box-Cox transformation**: A more generalized power transformation that can handle various distributions, requiring data to be positive.

Let's see a log transformation example to reduce skewness:

```python
# Create a highly skewed numerical feature
df_skewed = pd.DataFrame({'Value': [10, 20, 30, 50, 100, 200, 500, 1000, 5000]})

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.histplot(df_skewed['Value'], kde=True)
plt.title('Original Skewed Data')

# Apply log transformation (add 1 to avoid log(0) if zeros are present)
df_skewed['Log_Value'] = np.log1p(df_skewed['Value']) # np.log1p(x) computes log(1+x)

plt.subplot(1, 2, 2)
sns.histplot(df_skewed['Log_Value'], kde=True)
plt.title('Log Transformed Data')

plt.tight_layout()
plt.show()
```

[IMAGE_PLACEHOLDER: A pair of histograms side-by-side. The first histogram (left) shows a highly right-skewed distribution, with most data points clustered on the left and a long tail to the right. The second histogram (right) shows the same data after a log transformation, appearing much more symmetrical and closer to a normal distribution.]

As you can see, the log transformation helps to normalize the distribution, making it more symmetrical and bell-shaped. This can be highly beneficial for models sensitive to skewed data.

Building on the idea of transforming data, let's now look at a specific and very common type of transformation: adjusting the range of our numerical features.

<a id="concept-feature-scaling"></a>
### Leveling the Playing Field: Feature Scaling (Normalization and Standardization)
When your dataset has numerical features with vastly different ranges, it can cause problems for many machine learning algorithms. For example, a feature ranging from 0 to 100,000 (like income) will dominate a feature ranging from 0 to 1 (like a satisfaction score) if they are not scaled. Algorithms that calculate distances between data points (like K-Nearest Neighbors, Support Vector Machines, or neural networks) will give undue importance to features with larger ranges. This is where **feature scaling** comes in. It's a critical type of data transformation that adjusts the range of independent variables or features of data to a standard scale.

There are two primary methods for feature scaling:

1.  **Normalization (Min-Max Scaling)**:
    *   Rescales the feature to a fixed range, typically between 0 and 1.
    *   Formula: `X_normalized = (X - X_min) / (X_max - X_min)`
    *   **When to use**: Useful when you need features to be within a specific bounded range. It's sensitive to outliers, as they will heavily influence `X_max` and `X_min`, compressing the range of the majority of data points.

2.  **Standardization**:
    *   Rescales the feature to have a mean of 0 and a standard deviation of 1 (a standard normal distribution). This means the transformed values represent how many standard deviations away from the mean a data point is.
    *   Formula: `X_standardized = (X - μ) / σ` (where μ is the mean and σ is the standard deviation).
    *   **When to use**: Less affected by outliers than normalization because it uses the mean and standard deviation, which are more robust than min/max values. It's often preferred for algorithms that assume a Gaussian distribution or those that calculate distances between data points.

Let's demonstrate with an example using `scikit-learn`:

```python
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Sample data with different scales
data_scaling = {
    'Age': [25, 30, 35, 40, 45],
    'Salary': [50000, 60000, 75000, 90000, 120000]
}
df_scaling = pd.DataFrame(data_scaling)

print("Original DataFrame:")
print(df_scaling)

# Apply Min-Max Normalization
scaler_minmax = MinMaxScaler()
df_scaling[['Age_Normalized', 'Salary_Normalized']] = scaler_minmax.fit_transform(df_scaling[['Age', 'Salary']])

print("\nDataFrame after Min-Max Normalization:")
print(df_scaling)

# Apply Standardization
scaler_standard = StandardScaler()
df_scaling[['Age_Standardized', 'Salary_Standardized']] = scaler_standard.fit_transform(df_scaling[['Age', 'Salary']])

print("\nDataFrame after Standardization:")
print(df_scaling)
```

**Output:**
```
Original DataFrame:
   Age  Salary
0   25   50000
1   30   60000
2   35   75000
3   40   90000
4   45  120000

DataFrame after Min-Max Normalization:
   Age  Salary  Age_Normalized  Salary_Normalized
0   25   50000            0.00           0.000000
1   30   60000            0.25           0.142857
2   35   75000            0.50           0.357143
3   40   90000            0.75           0.571429
4   45  120000            1.00           1.000000

DataFrame after Standardization:
   Age  Salary  Age_Normalized  Salary_Normalized  Age_Standardized  Salary_Standardized
0   25   50000            0.00           0.000000         -1.414214            -1.378959
1   30   60000            0.25           0.142857         -0.707107            -0.861849
2   35   75000            0.50           0.357143          0.000000            -0.103422
3   40   90000            0.75           0.571429          0.707107             0.655005
4   45  120000            1.00           1.000000          1.414214             1.689225
```

[IMAGE_PLACEHOLDER: A scatter plot showing two features, 'Age' (e.g., 20-60) and 'Salary' (e.g., 30,000-150,000), with vastly different scales. The points are clustered. Next to it, another scatter plot showing the same data points but after feature scaling (either normalization or standardization), where both features now occupy a similar, smaller range (e.g., 0-1 or -2 to 2), demonstrating how the data points are brought into a comparable scale.]

Notice how both 'Age' and 'Salary' are transformed to a similar range. Normalization puts them between 0 and 1, while standardization centers them around 0 with a standard deviation of 1. This makes them equally important to distance-based algorithms, preventing one feature from overpowering another simply due to its larger magnitude.

Finally, let's address how to prepare non-numerical data for machine learning models.

<a id="concept-categorical-encoding"></a>
### Making Sense of Categories: Categorical Encoding
Many real-world datasets contain **categorical data**, which represents qualities or characteristics rather than numerical quantities (e.g., 'Color', 'City', 'Gender', 'Product Type'). However, most machine learning algorithms are designed to work exclusively with numerical input. They don't understand text labels directly. **Categorical encoding** is the essential process of converting these text-based categories into numerical representations that algorithms can process.

There are several encoding techniques, each suitable for different types of categorical data:

1.  **Label Encoding**:
    *   Assigns a unique integer to each category. For example, 'Red' might become 0, 'Blue' becomes 1, and 'Green' becomes 2.
    *   **When to use**: Best suited for **ordinal data**, where there's a natural order or ranking among categories (e.g., 'Small', 'Medium', 'Large'; 'Low', 'Medium', 'High'). Applying it to nominal data (categories with no inherent order) can mislead models into assuming a non-existent hierarchy (e.g., that 'Red' (0) is "less than" 'Blue' (1)).

2.  **One-Hot Encoding**:
    *   Creates new binary (0 or 1) columns for each unique category in the original feature. If a row belongs to a specific category, the corresponding new column gets a 1, and all other new category columns get a 0.
    *   **When to use**: Ideal for **nominal data**, where there is no inherent order (e.g., 'City', 'Color', 'Gender'). It avoids implying any false relationships or hierarchies between categories, as each category is treated as an independent feature.

Let's illustrate with an example:

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Sample DataFrame with categorical features
data_categorical = {
    'Size': ['Small', 'Medium', 'Large', 'Medium', 'Small'], # Ordinal
    'Color': ['Red', 'Blue', 'Green', 'Red', 'Blue']         # Nominal
}
df_cat = pd.DataFrame(data_categorical)

print("Original DataFrame:")
print(df_cat)

# Apply Label Encoding to 'Size' (ordinal data)
# Note: LabelEncoder assigns integers alphabetically by default.
# For true ordinality, you might need to map manually or use OrdinalEncoder.
le = LabelEncoder()
df_cat['Size_Encoded'] = le.fit_transform(df_cat['Size'])

print("\nDataFrame after Label Encoding 'Size':")
print(df_cat)

# Apply One-Hot Encoding to 'Color' (nominal data)
# Using ColumnTransformer is good practice for integrating with pipelines
ct = ColumnTransformer(
    transformers=[
        ('encoder', OneHotEncoder(handle_unknown='ignore'), ['Color']) # handle_unknown='ignore' for new categories
    ],
    remainder='passthrough' # Keep other columns as they are
)
df_encoded = ct.fit_transform(df_cat)

# Convert back to DataFrame for readability (OneHotEncoder returns a numpy array)
# get_feature_names_out() helps name the new columns
df_encoded = pd.DataFrame(df_encoded, columns=ct.get_feature_names_out())

print("\nDataFrame after One-Hot Encoding 'Color':")
print(df_encoded)
```

**Output:**
```
Original DataFrame:
     Size  Color
0   Small    Red
1  Medium   Blue
2   Large  Green
3  Medium    Red
4   Small   Blue

DataFrame after Label Encoding 'Size':
     Size  Color  Size_Encoded
0   Small    Red             2
1  Medium   Blue             1
2   Large  Green             0
3  Medium    Red             1
4   Small   Blue             2

DataFrame after One-Hot Encoding 'Color':
   encoder__Color_Blue  encoder__Color_Green  encoder__Color_Red remainder__Size remainder__Size_Encoded
0                  0.0                   0.0                 1.0           Small                     2.0
1                  1.0                   0.0                 0.0          Medium                     1.0
2                  0.0                   1.0                 0.0           Large                     0.0
3                  0.0                   0.0                 1.0          Medium                     1.0
4                  1.0                   0.0                 0.0           Small                     2.0
```

[IMAGE_PLACEHOLDER: A table showing a categorical column named 'Color' with values like 'Red', 'Blue', 'Green'. Next to it, a transformed table showing the result of one-hot encoding. The 'Color' column is replaced by three new binary columns: 'Color_Red', 'Color_Blue', 'Color_Green'. For each row, only one of these new columns has a '1' (indicating the original color), and the others have '0'. This visually demonstrates the expansion of one categorical column into multiple binary columns.]

In the `Size_Encoded` column, 'Large' became 0, 'Medium' became 1, and 'Small' became 2. This is because `LabelEncoder` assigns integers based on alphabetical order by default. For 'Color', one-hot encoding created three new columns (`encoder__Color_Blue`, `encoder__Color_Green`, `encoder__Color_Red`), each representing a unique color, with 1s and 0s indicating presence or absence. This prevents the model from assuming any false order between colors.

## Wrap-Up
Congratulations! You've now learned the fundamental techniques for data cleaning and preprocessing. From handling pesky missing values and identifying disruptive outliers to transforming data distributions, scaling numerical features, and encoding categorical features, these steps are indispensable for any data professional.

Remember, clean and well-prepared data is the bedrock of reliable analysis and robust machine learning models. Without proper preparation, even the most advanced algorithms will struggle to deliver meaningful results. As you move forward, always prioritize understanding your data's quality and applying the right preprocessing steps to unlock its full potential. This meticulous preparation is what truly sets apart effective data scientists.