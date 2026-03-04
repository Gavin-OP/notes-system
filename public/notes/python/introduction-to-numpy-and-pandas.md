# Introduction to Numpy and Pandas

- slug: introduction-to-numpy-and-pandas
- prerequisites: introduction-to-base-python-part-2
- difficulty: 2/5
- estimated_time_minutes: 30
- tags: python, numpy, pandas, data-analysis

## Learning Objectives
- Import and alias common Python data packages in a consistent style
- Understand why NumPy improves numeric computation speed and array handling
- Use Pandas for basic tabular data manipulation and summary statistics

## Core Explanation
NumPy (Numerical Python) is fundamental for scientific computing in Python. It provides a high-performance multidimensional array object and tools for working with these arrays. Its core strength lies in vectorized operations, which are significantly faster than traditional Python loops for numerical tasks. NumPy is ideal for numerical and scientific data, such as processing images, audio signals, or performing complex mathematical operations. Pandas builds on NumPy, offering powerful data structures like DataFrames for tabular data. DataFrames are ideal for handling structured data, such as CSV files, database tables, or spreadsheets, allowing for easy manipulation, cleaning, and analysis. The examples provided leverage these vectorized operations for efficiency. Together, NumPy and Pandas form the backbone of data analysis workflows in Python, enabling efficient handling of large datasets.

## Worked Examples
- Importing NumPy and creating an array:
import numpy as np
my_array = np.array([1, 2, 3, 4, 5])
print(my_array * 2)
# Output: [ 2  4  6  8 10]
- Importing Pandas and creating a DataFrame:
import pandas as pd
data = {'Name': ['Alice', 'Bob'], 'Age': [25, 30]}
df = pd.DataFrame(data)
print(df)
# Output:
#     Name  Age
# 0  Alice   25
# 1    Bob   30
- Performing a basic operation on a NumPy array:
import numpy as np
arr1 = np.array([10, 20, 30])
arr2 = np.array([1, 2, 3])
result = arr1 + arr2
print(result)
# Output: [11 22 33]
- Selecting a column and calculating the mean in Pandas:
import pandas as pd
data = {'Score': [85, 90, 78, 92]}
df = pd.DataFrame(data)
mean_score = df['Score'].mean()
print(f"Average Score: {mean_score}")
# Output: Average Score: 86.25

## Common Pitfalls
- Forgetting to import NumPy as `np` or Pandas as `pd`. Using these standard aliases is a widely adopted best practice for readability and consistency in the data science community.
- Trying to perform vectorized operations on standard Python lists instead of NumPy arrays, which can lead to significantly slower performance.
- Confusing DataFrame column selection with row selection or incorrect indexing.
- Not understanding that NumPy operations often return new arrays, rather than modifying arrays in-place.

## Practice Tasks
- Create a NumPy array of 10 zeros and multiply each element by 7.
- Create a Pandas DataFrame with two columns: 'Product' and 'Price'. Add 3 rows.
- From your DataFrame, select the 'Price' column and find its maximum value.
- Create two 3x3 NumPy arrays and perform element-wise multiplication.
