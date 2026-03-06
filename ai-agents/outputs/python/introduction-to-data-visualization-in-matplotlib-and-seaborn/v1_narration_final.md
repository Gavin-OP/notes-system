# Introduction to Data Visualization in Matplotlib and Seaborn

## Learning Goals

Hello everyone! [PAUSE_SHORT] By the end of this lesson, you'll have a solid foundation in data visualization using Python. [PAUSE_SHORT] Specifically, you'll be able to do a few key things. [PAUSE_SHORT]

First, you'll understand Matplotlib's basic `pyplot` workflow. [PAUSE_SHORT] This is a quick and easy way to create plots, similar to how you might in MATLAB. [PAUSE_SHORT]

Next, we'll dive into Matplotlib's more powerful object-oriented interface. [PAUSE_SHORT] This approach gives you precise control over every element of your plot, from its overall structure to individual chart types. [PAUSE_SHORT]

Finally, you'll discover Seaborn. [PAUSE_SHORT] Built on top of Matplotlib and Pandas, Seaborn helps you create beautiful and informative statistical visualizations much more quickly and with less code.

[PAUSE_LONG]

## Introduction

Imagine you're faced with a massive spreadsheet, an endless sea of numbers. [PAUSE_SHORT] Can you quickly spot trends, identify unusual data points, or understand how different columns relate to each other? [PAUSE_SHORT] Probably not, or at least not without a lot of mental effort and time. [PAUSE_SHORT]

This is precisely why data visualization is so incredibly important! [PAUSE_SHORT]

Data visualization is both an art and a science. [PAUSE_SHORT] It's the process of transforming raw data into visual representations like charts, graphs, and maps. [PAUSE_SHORT] This powerful tool takes complex information and makes it easy to understand at a glance. [PAUSE_SHORT] In the world of data science, visualization is absolutely crucial. [PAUSE_SHORT] It helps us explore datasets, analyze our findings, and share our results clearly and effectively with others.

[PAUSE_SHORT]

In this lesson, we're going to explore two of Python's most powerful and popular libraries for data visualization: **Matplotlib** and **Seaborn**. [PAUSE_SHORT] Matplotlib is the foundational library. [PAUSE_SHORT] It provides incredible flexibility and control over every tiny detail of your plots. [PAUSE_SHORT] Seaborn, on the other hand, is built on top of Matplotlib. [PAUSE_SHORT] It offers a simpler, more intuitive way to create beautiful and informative statistical graphics with less code, especially when you're working with Pandas DataFrames. [PAUSE_SHORT]

By the end of this lesson, you'll be ready to create your first meaningful plots and start uncovering the stories hidden within your data.

[PAUSE_LONG]

## Why Visualize Data? The Power of Seeing

Before we even write any code, let's truly understand *why* data visualization is such a critical skill. [PAUSE_SHORT] Our brains are naturally wired to process visual information very efficiently. [PAUSE_SHORT] Patterns, unusual points, and relationships that are completely hidden in a table of numbers often jump out immediately when you see them in a graph.

[PAUSE_SHORT]

Consider the famous **Anscombe's Quartet**. [PAUSE_SHORT] This example consists of four different datasets. [PAUSE_SHORT] If you look at their summary statistics—things like the average, variance, and correlation—they appear almost identical. [PAUSE_SHORT] But when you plot each dataset, they reveal wildly different visual patterns! [PAUSE_SHORT] One might be a perfect straight line, another a curve, one with a clear outlier, and another completely random. [PAUSE_SHORT] This example perfectly illustrates a golden rule in data analysis: "Summary statistics can be misleading; always visualize your data."

[PAUSE_SHORT]

Visualization empowers us to do a few key things: [PAUSE_SHORT]
*   **Explore Data:** We can quickly find trends, patterns, and outliers that we might otherwise miss in raw numbers.
*   **Confirm Hypotheses:** We can visually check if our assumptions or theories about the data are true or false.
*   **Communicate Findings:** We can present complex analytical results clearly and convincingly to anyone, regardless of their technical background.

[PAUSE_LONG]

## Matplotlib's Core Idea: The Pyplot Workflow

Matplotlib is the original and most fundamental Python plotting library. [PAUSE_SHORT] It's incredibly versatile and flexible, allowing you to customize almost every part of a plot. [PAUSE_SHORT] For beginners, the easiest way to start is with its `pyplot` module. [PAUSE_SHORT] This module offers a simple, MATLAB-like interface that's great for quick plots.

[PAUSE_SHORT]

The `pyplot` workflow is often called "state-based." [PAUSE_SHORT] This means that functions implicitly work on the "current" figure and axes. [PAUSE_SHORT] You don't always explicitly tell it *where* to draw; it just draws on whatever plot is currently active.

[PAUSE_SHORT]

Let's start by importing `matplotlib.pyplot`, which we usually shorten to `plt`. [PAUSE_SHORT] We'll also import `numpy` to help us create some sample data for our plots.

[PAUSE_SHORT]

Code cue: Here's how we import the libraries we'll need.
```python
import matplotlib.pyplot as plt
import numpy as np # We'll use numpy to generate some data
```

[PAUSE_SHORT]

Now, let's create a very simple line plot.

[PAUSE_SHORT]

Code cue: This code will generate some data and then create a basic sine wave plot.
```python
# Generate some data
x = np.linspace(0, 10, 100) # 100 evenly spaced points between 0 and 10
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

[PAUSE_SHORT]

Let's break down what happened in this example: [PAUSE_SHORT]
1.  `plt.plot(x, y)` created a line plot. [PAUSE_SHORT] It used our `x` values for the horizontal axis and `y` values for the vertical axis.
2.  `plt.title()`, `plt.xlabel()`, and `plt.ylabel()` added descriptive text. [PAUSE_SHORT] This makes our plot much easier to understand.
3.  `plt.show()` is very important. [PAUSE_SHORT] It explicitly displays the plot. [PAUSE_SHORT] While interactive environments like Jupyter notebooks might show plots automatically, `plt.show()` ensures your plot appears consistently everywhere.

[PAUSE_SHORT]

This "MATLAB-style" approach is excellent for quickly making simple plots. [PAUSE_SHORT] However, for more complex visualizations, or when you need to arrange multiple plots, Matplotlib's more explicit object-oriented interface offers much greater control and clarity. [PAUSE_SHORT] Let's explore that next.

[PAUSE_LONG]

## Building Blocks of a Matplotlib Plot: Figure and Axes

While `pyplot` is convenient for quick plots, Matplotlib's real power and flexibility come from its object-oriented approach. [PAUSE_SHORT] This method gives you explicit control over each individual part of your plot. [PAUSE_SHORT] The two most fundamental parts are the `Figure` and the `Axes`.

[PAUSE_SHORT]

*   **`Figure`**: Think of the `Figure` as the entire canvas or window that holds your plot or plots. [PAUSE_SHORT] It's the top-level container for everything related to your visualization. [PAUSE_SHORT] A single `Figure` can contain one or many `Axes` objects.
*   **`Axes`**: An `Axes` object is the actual plotting area where your data is drawn. [PAUSE_SHORT] It includes the x-axis, y-axis, their labels, the plot's title, and the data points themselves. [PAUSE_SHORT] It's important not to confuse `Axes` (plural, referring to the entire plotting area) with "axis" (singular, referring to just the x or y dimension). [PAUSE_SHORT] Again, a `Figure` can contain one or many `Axes` objects.

[PAUSE_SHORT]

The most common and recommended way to create a `Figure` and one or more `Axes` objects is by using the `plt.subplots()` function.

[PAUSE_SHORT]

Code cue: This code shows how to create a Figure and a single Axes object, then plot on it using the object-oriented approach.
```python
# Create a Figure and a single Axes object
fig, ax = plt.subplots()

# Plot data directly on the Axes object
ax.plot(x, y)

# Set title and labels using the Axes object's methods
ax.set_title("Sine Wave (Object-Oriented)")
ax.set_xlabel("X-axis")
ax.set_ylabel("Y-axis")

plt.show()
```

[PAUSE_SHORT]

Notice the key difference here: [PAUSE_SHORT] Instead of `plt.title()`, we now use `ax.set_title()`. [PAUSE_SHORT] This means we are directly interacting with the `Axes` object, `ax`. [PAUSE_SHORT] We're not relying on `pyplot` to implicitly manage the "current" plot. [PAUSE_SHORT] This object-oriented approach is more explicit, more robust, and much easier to manage when you're working with multiple plots or complex layouts.

[PAUSE_SHORT]

You can also easily create multiple subplots within a single figure, arranging them in a grid.

[PAUSE_SHORT]

Code cue: This example creates a figure with two subplots side-by-side, plotting a sine wave on one and a cosine wave on the other.
```python
# Create a Figure with 1 row and 2 columns of subplots
# figsize sets the width and height of the entire figure in inches
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

# Plot on the first Axes object (ax1)
ax1.plot(x, np.sin(x), color='blue')
ax1.set_title("Sine Wave")
ax1.set_xlabel("X")
ax1.set_ylabel("sin(X)")

# Plot on the second Axes object (ax2)
ax2.plot(x, np.cos(x), color='red')
ax2.set_title("Cosine Wave")
ax2.set_xlabel("X")
ax2.set_ylabel("cos(X)")

# Automatically adjust subplot parameters for a tight layout, preventing labels from overlapping
plt.tight_layout()
plt.show()
```

[PAUSE_SHORT]

In this example, `plt.subplots(1, 2)` returns a `Figure` object, `fig`, and an array containing two `Axes` objects. [PAUSE_SHORT] We conveniently unpack these into `ax1` and `ax2`. [PAUSE_SHORT] We then plot on each `Axes` independently. [PAUSE_SHORT] This clearly shows the power of explicit control when managing multiple plots.

[PAUSE_LONG]

## Basic Chart Types with Matplotlib

Matplotlib offers a huge variety of plot types for different data visualization needs. [PAUSE_SHORT] Let's look at some of the most fundamental ones, always keeping the `Figure` and `Axes` structure in mind.

[PAUSE_SHORT]

### 1. Line Plot (`ax.plot()`)

*   **Purpose:** A line plot connects data points with lines. [PAUSE_SHORT] It's perfect for showing trends over time, continuous data, or functional relationships.
*   **Example:** We already saw this with the sine wave. [PAUSE_SHORT] You can easily customize it with different colors and line styles.

[PAUSE_SHORT]

Code cue: This is a reminder of how a line plot is created, with options for customization.
```python
# fig, ax = plt.subplots()
# ax.plot(x, y, color='purple', linestyle='--') # Example of customization
# ax.set_title("Customized Sine Wave")
# plt.show()
```

[PAUSE_SHORT]

### 2. Scatter Plot (`ax.scatter()`)

*   **Purpose:** A scatter plot displays individual data points as markers. [PAUSE_SHORT] It's excellent for visualizing the relationship between two numerical variables. [PAUSE_SHORT] It helps identify clusters of data or spot unusual outliers.
*   **Example:**

[PAUSE_SHORT]

Code cue: This code generates some random data and then creates a scatter plot to show the relationship between two features.
```python
# Generate some random data to show a relationship with noise
np.random.seed(42) # for reproducibility
x_scatter = np.random.rand(50) * 10
y_scatter = 2 * x_scatter + np.random.randn(50) * 2 + 5 # y = 2x + some random noise + offset

fig, ax = plt.subplots()
ax.scatter(x_scatter, y_scatter, color='green', alpha=0.7, s=50) # alpha controls transparency, s controls marker size
ax.set_title("Scatter Plot of Random Data")
ax.set_xlabel("Feature X")
ax.set_ylabel("Feature Y")
plt.show()
```

[PAUSE_SHORT]

Here, `alpha` controls the transparency of the markers, making them semi-transparent, and `s` controls their size.

[PAUSE_SHORT]

### 3. Bar Plot (`ax.bar()`)

*   **Purpose:** A bar plot represents categorical data with rectangular bars. [PAUSE_SHORT] It's useful for comparing quantities across different discrete categories.
*   **Example:**

[PAUSE_SHORT]

Code cue: This code defines some categories and values, then creates a bar plot to compare them.
```python
categories = ['Category A', 'Category B', 'Category C', 'Category D']
values = [23, 45, 56, 12]

fig, ax = plt.subplots()
ax.bar(categories, values, color=['purple', 'orange', 'cyan', 'magenta'])
ax.set_title("Bar Plot of Categories")
ax.set_xlabel("Category")
ax.set_ylabel("Value")
plt.show()
```

[PAUSE_SHORT]

Notice how we can pass a list of colors to the `color` parameter to give each bar a different shade.

[PAUSE_SHORT]

These are just a few basic examples. [PAUSE_SHORT] Matplotlib supports many other plot types, including histograms, pie charts, box plots, and more specialized scientific visualizations. [PAUSE_SHORT] The key is to remember the `Figure` and `Axes` structure. [PAUSE_SHORT] Then, use the appropriate plotting method directly on your `Axes` object.

[PAUSE_LONG]

## Enhancing Plots with Seaborn

While Matplotlib gives you ultimate control, it can sometimes require a lot of detailed code for common statistical plots, or for simply achieving aesthetically pleasing defaults. [PAUSE_SHORT] This is exactly where **Seaborn** comes in! [PAUSE_SHORT] Seaborn is a high-level data visualization library built on top of Matplotlib. [PAUSE_SHORT] It offers a more convenient and intuitive way to create attractive and informative statistical graphics. [PAUSE_SHORT] This is especially true when your data is organized in Pandas DataFrames.

[PAUSE_SHORT]

Seaborn intelligently handles many plotting details automatically. [PAUSE_SHORT] For example, it selects appropriate color palettes, positions legends, and performs statistical estimations. [PAUSE_SHORT] This results in shorter code and visually appealing plots right out of the box.

[PAUSE_SHORT]

Let's import Seaborn, which we usually shorten to `sns`. [PAUSE_SHORT] We'll also import Pandas, because Seaborn works exceptionally well with DataFrames.

[PAUSE_SHORT]

Code cue: Listen for the imports of Seaborn and Pandas.
```python
import seaborn as sns
import pandas as pd # Seaborn works great with Pandas DataFrames
```

[PAUSE_SHORT]

One of Seaborn's greatest strengths is how smoothly it works with Pandas DataFrames. [PAUSE_SHORT] You can often pass an entire DataFrame to a Seaborn function. [PAUSE_SHORT] Then, you just specify the columns you want to plot by their names.

[PAUSE_SHORT]

Let's use a convenient built-in dataset from Seaborn to show this in action.

[PAUSE_SHORT]

Code cue: This code loads a sample dataset about restaurant tips and prints the first few rows.
```python
# Load a sample dataset about restaurant tips
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

[PAUSE_SHORT]

Now, let's create a scatter plot using Seaborn to compare `total_bill` and `tip`.

[PAUSE_SHORT]

Code cue: This code creates a scatter plot using Seaborn, showing the relationship between total bill and tip amount.
```python
# Create a scatter plot using Seaborn
sns.scatterplot(x="total_bill", y="tip", data=tips)
plt.title("Tip vs. Total Bill (Seaborn)")
plt.xlabel("Total Bill ($)")
plt.ylabel("Tip ($)")
plt.show()
```

[PAUSE_SHORT]

Notice how much simpler this code is compared to Matplotlib for a similar plot, especially when your data is already in a DataFrame. [PAUSE_SHORT] You just provide the column names for `x` and `y`, and specify the `data` source.

[PAUSE_SHORT]

Seaborn also makes it incredibly easy to add more dimensions to your plot. [PAUSE_SHORT] For example, you can color-code points based on a categorical variable.

[PAUSE_SHORT]

Code cue: This code enhances the scatter plot by coloring the points based on the 'sex' of the diner.
```python
# Scatter plot with 'sex' determining the color of points
sns.scatterplot(x="total_bill", y="tip", hue="sex", data=tips)
plt.title("Tip vs. Total Bill by Sex")
plt.xlabel("Total Bill ($)")
plt.ylabel("Tip ($)")
plt.show()
```

[PAUSE_SHORT]

With just one additional parameter, `hue="sex"`, Seaborn automatically assigns different colors to 'Male' and 'Female' data points and adds a legend. [PAUSE_SHORT] This makes the plot much more informative with minimal effort.

[PAUSE_SHORT]

Seaborn also excels at providing specialized statistical plots. [PAUSE_SHORT] For example, `histplot` for histograms or `boxplot` for visualizing distributions across categories.

[PAUSE_SHORT]

Code cue: This code creates a histogram of total bills, adding a smooth curve called a kernel density estimate.
```python
# Create a histogram of total bills, adding a kernel density estimate (KDE)
sns.histplot(data=tips, x="total_bill", kde=True)
plt.title("Distribution of Total Bills")
plt.xlabel("Total Bill ($)")
plt.ylabel("Count")
plt.show()
```

[PAUSE_SHORT]

A powerful feature of Seaborn is that its plotting functions often return a Matplotlib `Axes` object. [PAUSE_SHORT] This means you can seamlessly combine Seaborn's ease of use and aesthetic defaults with Matplotlib's fine-grained control.

[PAUSE_SHORT]

Code cue: This example shows how to create a Matplotlib Figure and Axes, then use Seaborn to plot a box plot directly onto those axes.
```python
# Create a Matplotlib Figure and Axes object explicitly
fig, ax = plt.subplots(figsize=(8, 6))

# Plot a box plot using Seaborn, directing it to our specific Axes object
sns.boxplot(x="day", y="total_bill", data=tips, ax=ax)

# Now, use Matplotlib's Axes methods for further customization
ax.set_title("Total Bill Distribution by Day (Seaborn + Matplotlib)")
ax.set_xlabel("Day of the Week")
ax.set_ylabel("Total Bill ($)")
plt.show()
```

[PAUSE_SHORT]

Here, we explicitly created a Matplotlib `Axes` object, `ax`. [PAUSE_SHORT] Then, we passed it to Seaborn's `boxplot` function using the `ax=ax` parameter. [PAUSE_SHORT] This lets us use Seaborn for the main plot generation, while still retaining the ability to use Matplotlib methods like `ax.set_title()` for precise control over labels and titles.

[PAUSE_SHORT]

Finally, Seaborn can also improve the default look of *all* your Matplotlib plots. [PAUSE_SHORT] You just need to set a theme.

[PAUSE_SHORT]

Code cue: This code applies a Seaborn theme globally, then shows how even a basic Matplotlib plot will inherit the improved style.
```python
sns.set_theme(style="whitegrid") # Apply a clean, grid-based theme

# Now, even a basic Matplotlib plot will inherit this improved aesthetic
fig, ax = plt.subplots()
ax.plot(x, y, label="sin(x)")
ax.legend()
ax.set_title("Sine Wave with Seaborn Theme")
plt.show()
```