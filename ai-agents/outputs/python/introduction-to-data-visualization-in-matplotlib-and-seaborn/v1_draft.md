# Introduction to Data Visualization in Matplotlib and Seaborn

## Learning Objectives
- Understand the pyplot plotting workflow and its relation to MATLAB-style usage.
- Use Matplotlib for plot structure, geometry control, and basic charting.
- Use Seaborn on top of Matplotlib/Pandas for quick statistical visualizations.

## Introduction
Imagine you're looking at a giant spreadsheet filled with numbers. Rows and columns of data, stretching endlessly. Can you quickly spot trends? Identify outliers? Understand relationships between different columns? Probably not, or at least not easily. This is where data visualization comes in!

Data visualization is the art and science of representing data visually, often through charts, graphs, and maps. It transforms raw numbers into insights, making complex information understandable at a glance. In the world of data science, it's an indispensable tool for exploration, analysis, and communication.

In this lesson, we'll dive into two of Python's most powerful and popular libraries for data visualization: **Matplotlib** and **Seaborn**. Matplotlib is the foundational library, offering immense control over every aspect of a plot. Seaborn, built on top of Matplotlib, provides a higher-level interface for creating beautiful and informative statistical graphics with less code, especially when working with Pandas DataFrames. By the end of this lesson, you'll be able to create your first meaningful plots and start uncovering stories hidden in your data.

## Concept Progression

### Why Visualize Data? The Power of Seeing
Before we even touch code, let's understand *why* visualization is so critical. Our brains are wired to process visual information incredibly efficiently. Patterns, anomalies, and relationships that are invisible in a table of numbers often jump out immediately when presented graphically.

Consider a simple example: Imagine you have four different datasets. If you just look at their mean, standard deviation, and correlation, they might all appear very similar. However, when you plot them, you'd see four wildly different patterns – one might be a straight line, another a curve, one with an outlier, and another completely random. This famous example is known as Anscombe's Quartet, and it perfectly illustrates that "summary statistics can be misleading; always visualize your data."

Visualization helps us:
*   **Explore Data:** Find patterns, trends, and outliers.
*   **Confirm Hypotheses:** See if your assumptions about the data hold true.
*   **Communicate Findings:** Present complex results clearly and persuasively to others.

### Matplotlib's Core Idea: The Pyplot Workflow
Matplotlib is the grand-daddy of Python plotting libraries. It's incredibly powerful and flexible, allowing you to customize virtually every element of a plot. The most common way to use Matplotlib for beginners is through its `pyplot` module, which provides a MATLAB-like interface.

Let's start with the `pyplot` workflow. It's often referred to as "state-based" plotting because functions implicitly operate on the "current" figure and axes.

First, we need to import `matplotlib.pyplot`, conventionally aliased as `plt`:

```python
import matplotlib.pyplot as plt
import numpy as np # We'll use numpy to generate some data
```

Now, let's create a very simple line plot:

```python
# Generate some data
x = np.linspace(0, 10, 100) # 100 points between 0 and 10
y = np.sin(x) # The sine of x

# Create a plot
plt.plot(x, y)

# Add a title and labels
plt.title("Simple Sine Wave")
plt.xlabel("X-axis")
plt.ylabel("Y-axis")

# Display the plot
plt.show()
```

In this example:
1.  `plt.plot(x, y)` creates a line plot using `x` values for the horizontal axis and `y` values for the vertical axis.
2.  `plt.title()`, `plt.xlabel()`, and `plt.ylabel()` add descriptive text to our plot.
3.  `plt.show()` displays the plot. Without `plt.show()`, in some environments (like scripts), the plot might not appear. In interactive environments (like Jupyter notebooks), plots often display automatically, but `plt.show()` is good practice.

This "MATLAB-style" approach is quick for simple plots, but for more complex visualizations or when you want to arrange multiple plots, it's better to use Matplotlib's object-oriented interface.

### Building Blocks of a Matplotlib Plot: Figure and Axes
While `pyplot` is convenient, Matplotlib's true power comes from its object-oriented approach, which gives you explicit control over the different components of your plot. The two most fundamental components are the `Figure` and the `Axes`.

*   **`Figure`**: Think of the `Figure` as the entire canvas or window that holds your plot(s). It's the top-level container for all plot elements. You can have multiple `Axes` objects within a single `Figure`.
*   **`Axes`**: An `Axes` object is the actual plotting area where your data is drawn. It contains the x-axis, y-axis, labels, title, and the data points themselves. A `Figure` can contain one or many `Axes` objects. Don't confuse `Axes` with "axis" (singular), which refers to the x or y dimension.

The most common way to create a `Figure` and one or more `Axes` objects is using `plt.subplots()`:

```python
# Create a Figure and a single Axes object
fig, ax = plt.subplots()

# Plot data on the Axes object
ax.plot(x, y)

# Set title and labels using the Axes object's methods
ax.set_title("Sine Wave (Object-Oriented)")
ax.set_xlabel("X-axis")
ax.set_ylabel("Y-axis")

plt.show()
```

Notice the difference: instead of `plt.title()`, we use `ax.set_title()`. This is because we are now directly interacting with the `Axes` object (`ax`) rather than relying on `pyplot` to manage the "current" plot. This approach is more explicit, robust, and easier to manage when you have multiple plots.

You can also create multiple subplots within a single figure:

```python
# Create a Figure with 1 row, 2 columns of subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4)) # figsize sets the width and height of the figure

# Plot on the first Axes
ax1.plot(x, np.sin(x), color='blue')
ax1.set_title("Sine Wave")
ax1.set_xlabel("X")
ax1.set_ylabel("sin(X)")

# Plot on the second Axes
ax2.plot(x, np.cos(x), color='red')
ax2.set_title("Cosine Wave")
ax2.set_xlabel("X")
ax2.set_ylabel("cos(X)")

# Automatically adjust subplot parameters for a tight layout
plt.tight_layout()
plt.show()
```
Here, `plt.subplots(1, 2)` returns a `Figure` object and an array of two `Axes` objects, which we unpack into `ax1` and `ax2`. We then plot on each `Axes` independently.

### Basic Chart Types with Matplotlib
Matplotlib offers a wide array of plot types. Let's look at some fundamental ones:

1.  **Line Plot (`ax.plot()`):** Connects data points with lines. Ideal for showing trends over time or continuous data.

    ```python
    # Already demonstrated with sine wave
    # ax.plot(x, y)
    ```

2.  **Scatter Plot (`ax.scatter()`):** Displays individual data points as markers. Great for showing relationships between two numerical variables and identifying clusters or outliers.

    ```python
    # Generate some random data
    np.random.seed(42) # for reproducibility
    x_scatter = np.random.rand(50) * 10
    y_scatter = 2 * x_scatter + np.random.randn(50) * 2 + 5 # y = 2x + noise + 5

    fig, ax = plt.subplots()
    ax.scatter(x_scatter, y_scatter, color='green', alpha=0.7) # alpha controls transparency
    ax.set_title("Scatter Plot of Random Data")
    ax.set_xlabel("Feature X")
    ax.set_ylabel("Feature Y")
    plt.show()
    ```

3.  **Bar Plot (`ax.bar()`):** Represents categorical data with rectangular bars. Useful for comparing quantities across different categories.

    ```python
    categories = ['A', 'B', 'C', 'D']
    values = [23, 45, 56, 12]

    fig, ax = plt.subplots()
    ax.bar(categories, values, color=['purple', 'orange', 'cyan', 'magenta'])
    ax.set_title("Bar Plot of Categories")
    ax.set_xlabel("Category")
    ax.set_ylabel("Value")
    plt.show()
    ```

These are just a few examples. Matplotlib supports many more, including histograms, pie charts, box plots, and more specialized scientific plots. The key is to remember the `Figure` and `Axes` structure and use the appropriate method on your `Axes` object.

### Enhancing Plots with Seaborn
While Matplotlib gives you ultimate control, it can sometimes be verbose for common statistical plots or for achieving aesthetically pleasing defaults. This is where **Seaborn** shines! Seaborn is a high-level data visualization library built on Matplotlib. It provides a more convenient interface for creating attractive and informative statistical graphics, especially when working with Pandas DataFrames.

Seaborn automatically handles many details like color palettes, legend placement, and statistical estimations, making your code shorter and your plots look better by default.

Let's import Seaborn, conventionally aliased as `sns`:

```python
import seaborn as sns
import pandas as pd # Seaborn works great with Pandas DataFrames
```

One of Seaborn's strengths is its integration with Pandas DataFrames. You can often pass an entire DataFrame to a Seaborn function and specify columns by name.

Let's use a built-in dataset from Seaborn to demonstrate:

```python
# Load a sample dataset
tips = sns.load_dataset("tips")
print(tips.head())
```
Output:
```
   total_bill   tip    sex smoker  day    time  size
0       16.99  1.01  Female     No  Sun  Dinner     2
1       10.34  1.66    Male     No  Sun  Dinner     3
2       21.01  3.50    Male     No  Sun  Dinner     3
3       23.68  3.31    Male     No  Sun  Dinner     2
4       24.59  3.61  Female     No  Sun  Dinner     4
```

Now, let's create a scatter plot using Seaborn:

```python
# Create a scatter plot using Seaborn
sns.scatterplot(x="total_bill", y="tip", data=tips)
plt.title("Tip vs. Total Bill (Seaborn)")
plt.xlabel("Total Bill ($)")
plt.ylabel("Tip ($)")
plt.show()
```
Notice how much simpler this is compared to Matplotlib if your data is in a DataFrame. You just specify the column names for `x` and `y`, and the `data` source.

Seaborn also makes it easy to add more dimensions to your plot, like color-coding by a categorical variable:

```python
# Scatter plot with 'sex' determining the color of points
sns.scatterplot(x="total_bill", y="tip", hue="sex", data=tips)
plt.title("Tip vs. Total Bill by Sex")
plt.xlabel("Total Bill ($)")
plt.ylabel("Tip ($)")
plt.show()
```

Seaborn also offers specialized statistical plots, like `histplot` for histograms or `boxplot` for distributions:

```python
# Create a histogram of total bills
sns.histplot(data=tips, x="total_bill", kde=True) # kde=True adds a kernel density estimate
plt.title("Distribution of Total Bills")
plt.xlabel("Total Bill ($)")
plt.ylabel("Count")
plt.show()
```

A great feature of Seaborn is that its functions often return a Matplotlib `Axes` object (or `Figure` for figure-level functions). This means you can combine Seaborn's ease of use with Matplotlib's fine-grained control:

```python
fig, ax = plt.subplots(figsize=(8, 6)) # Create a Matplotlib Figure and Axes
sns.boxplot(x="day", y="total_bill", data=tips, ax=ax) # Plot on the specific Axes
ax.set_title("Total Bill Distribution by Day (Seaborn + Matplotlib)")
ax.set_xlabel("Day of the Week")
ax.set_ylabel("Total Bill ($)")
plt.show()
```
Here, we explicitly created a Matplotlib `Axes` object (`ax`) and then told Seaborn to draw its box plot directly onto that `ax`. This allows us to use Matplotlib methods like `ax.set_title()` for further customization.

Finally, Seaborn can also enhance the default aesthetics of *all* your Matplotlib plots by simply setting a theme:

```python
sns.set_theme(style="whitegrid") # Apply a nice theme

# Now, even a basic Matplotlib plot will look better
fig, ax = plt.subplots()
ax.plot(x, y, label="sin(x)")
ax.legend()
ax.set_title("Sine Wave with Seaborn Theme")
plt.show()

sns.set_theme() # Reset to default Seaborn theme if needed
```
By calling `sns.set_theme()`, you change the default styles for all subsequent Matplotlib and Seaborn plots, giving them a more modern and consistent look.

## Wrap-Up
Congratulations! You've taken your first steps into the powerful world of data visualization with Python. We started by understanding why visualization is crucial for uncovering insights from data. You learned about Matplotlib's foundational `pyplot` workflow and then moved to its more robust object-oriented approach using `Figure` and `Axes` objects. We explored basic chart types like line, scatter, and bar plots. Finally, you discovered Seaborn, a high-level library that simplifies creating beautiful statistical graphics, especially with Pandas DataFrames, and how it seamlessly integrates with Matplotlib.

With these tools, you're now equipped to start exploring your own datasets visually. In the next lesson, we'll dive deeper into customizing your plots, adding annotations, and making them even more informative.