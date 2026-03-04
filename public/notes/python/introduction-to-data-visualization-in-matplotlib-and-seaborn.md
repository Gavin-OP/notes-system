# Introduction to Data Visualization in Matplotlib and Seaborn

- slug: introduction-to-data-visualization-in-matplotlib-and-seaborn
- prerequisites: introduction-to-numpy-and-pandas
- difficulty: 2/5
- estimated_time_minutes: 60
- tags: python, matplotlib, seaborn, visualization

## Learning Objectives
- Understand the pyplot plotting workflow and its relation to MATLAB-style usage
- Use Matplotlib for plot structure, geometry control, and basic charting
- Use Seaborn on top of Matplotlib/Pandas for quick statistical visualizations

## Core Explanation
Data visualization is crucial for understanding datasets. Matplotlib is Python's foundational plotting library, offering fine-grained control over plot elements like figures, axes, and basic chart types (line, scatter, bar). Its `pyplot` module provides a MATLAB-like interface for quick plotting. Seaborn builds on Matplotlib, providing a high-level interface for drawing attractive and informative statistical graphics. It integrates seamlessly with Pandas DataFrames, simplifying complex visualizations like distributions, relationships, and categorical plots. Together, they form a powerful toolkit for exploring and presenting data.

## Worked Examples
- Create a simple line plot using Matplotlib's `pyplot` module. This demonstrates the fundamental workflow of defining data points and plotting them.

import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [10, 15, 13, 18]
plt.plot(x, y)
plt.title('Simple Line Plot')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.show()
- Generate a scatter plot to visualize the relationship between two variables. Add axis labels and a title for clarity, showcasing basic plot customization.

import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [18, 13, 15, 10]
plt.scatter(x, y)
plt.title('Simple Scatter Plot')
plt.xlabel('Feature A')
plt.ylabel('Feature B')
plt.show()
- Demonstrate Matplotlib's object-oriented approach to create subplots and control figure geometry, such as figure size and axis limits.

import matplotlib.pyplot as plt
import numpy as np

# Create a figure and a set of subplots (1 row, 2 columns)
fig, axes = plt.subplots(1, 2, figsize=(10, 4))

# Plot on the first subplot
x = np.linspace(0, 10, 100)
axes[0].plot(x, np.sin(x), color='blue')
axes[0].set_title('Sine Wave')
axes[0].set_xlabel('X-axis')
axes[0].set_ylabel('Y-axis')
axes[0].set_xlim(0, 10) # Set x-axis limits

# Plot on the second subplot
axes[1].plot(x, np.cos(x), color='red')
axes[1].set_title('Cosine Wave')
axes[1].set_xlabel('X-axis')
axes[1].set_ylabel('Y-axis')
axes[1].set_ylim(-1.5, 1.5) # Set y-axis limits

plt.tight_layout() # Adjust subplot parameters for a tight layout
plt.show()
- Use Seaborn to quickly visualize the distribution of a single numerical variable with a histogram. Seaborn handles binning and styling automatically, making it easy to create informative histograms.

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

data = np.random.normal(loc=0, scale=1, size=100)
sns.histplot(data, kde=True)
plt.title('Distribution of Random Data')
plt.show()
- Plot a scatter plot directly from a Pandas DataFrame using Seaborn. This highlights Seaborn's integration with DataFrames, simplifying data selection and plotting.

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.DataFrame({
    'size': [10, 15, 20, 25, 30],
    'price': [100, 150, 180, 220, 250]
})
sns.scatterplot(x='size', y='price', data=df)
plt.title('Price vs. Size')
plt.show()

## Common Pitfalls
- Forgetting `plt.show()`: Plots won't display without this call in some environments, especially scripts.
- Overlapping plots: Not creating new figures or axes for distinct plots can lead to messy, unreadable visuals. Always use `plt.figure()` or the object-oriented `fig, ax = plt.subplots()` for each new plot to ensure proper separation.
- Incorrect data format: Seaborn often expects data in a Pandas DataFrame for easy column referencing by name.

## Practice Tasks
- Create a Matplotlib bar chart showing sales for different product categories.
- Generate a Seaborn box plot to compare the distribution of a variable across groups.
- Add a legend and customize colors on a Matplotlib line plot with two lines.
