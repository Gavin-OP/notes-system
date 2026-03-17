# Exploratory Data Analysis (EDA)

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose and importance of Exploratory Data Analysis (EDA) in the data science workflow.
- Calculate and interpret key descriptive statistics (mean, median, mode, standard deviation, quartiles) to summarize data.
- Choose appropriate visualization techniques (histograms, box plots, scatter plots, bar charts) for different types of data and analytical goals.
- Create basic data visualizations using Python libraries like Matplotlib and Seaborn.
- Identify patterns, trends, outliers, and relationships within datasets using visual and statistical methods.

## Introduction
Imagine you're a detective arriving at a new crime scene. Before you start interviewing suspects or building a case, what's the first thing you do? You observe! You look for clues, patterns, and anything unusual. You try to get a feel for the scene, gathering initial impressions before forming any theories.

In the world of data, we do something very similar. Before we build complex models, make predictions, or draw major conclusions, we need to understand our data deeply. This crucial process is called **Exploratory Data Analysis (EDA)**. It's about getting to know your dataset, uncovering its secrets, and spotting anything that might be important (or problematic!).

EDA is a fundamental step in any data project because it helps us:
*   **Understand the data's structure and content:** What variables do we have? What are their types?
*   **Identify missing values or errors:** Are there gaps in our information? Are there any incorrect entries?
*   **Spot outliers or unusual observations:** Are there data points that stand out from the rest?
*   **Discover patterns, trends, and relationships between variables:** Do certain variables move together? Are there common behaviors?
*   **Formulate hypotheses and guide future analysis or model building:** What questions should we ask next? What kind of model might be appropriate?

Think of EDA as the initial conversation you have with your data. You ask questions, and the data answers through numerical summaries and compelling visualizations. Let's dive in and learn how to have that conversation effectively!

## Concept Progression

### What is EDA and Why Do We Do It?
At its core, EDA is about making sense of data. It's not about proving a specific hypothesis, but rather about exploring the data to *formulate* hypotheses and gain initial insights. It's an iterative process, meaning you'll often go back and forth between different techniques as new questions arise from your observations.

Why is this exploration so important? Because raw data can be messy, misleading, or contain hidden issues. Without EDA, you might build a sophisticated [machine learning](../data_science/introduction-to-machine-learning.md) model on flawed data, leading to incorrect conclusions or poor performance. EDA helps you avoid the classic "garbage in, garbage out" problem by ensuring you understand the quality and characteristics of your data from the start.

Let's consider a simple example. Imagine you have a dataset of student test scores. Without EDA, you might just jump into calculating an average. But EDA would prompt you to ask:
*   Are most scores high or low?
*   Is there a wide range of scores, or are they all clustered together?
*   Are there any students who scored exceptionally high or low compared to the rest?
*   Does the performance vary significantly between different classes or subjects?

EDA provides the tools to answer these kinds of questions, giving you a solid, informed foundation before you move on to more advanced analysis or model building.

### Summarizing Data with Descriptive Statistics
One of the first and most fundamental ways to understand your data is by calculating **descriptive statistics**. These are numerical summaries that describe the main features of a dataset. They help us understand the "center" (where the data tends to be) and the "spread" (how dispersed the data is) of our variables.

#### Measures of Central Tendency
These statistics tell us about the typical or central value of our data:
*   **Mean (Average):** The sum of all values divided by the number of values. It's widely used but can be sensitive to extreme values (outliers).
*   **Median:** The middle value when the data is sorted in ascending order. If there's an even number of values, it's the average of the two middle values. The median is robust to outliers, making it a good choice for skewed data.
*   **Mode:** The most frequently occurring value. This is useful for both numerical and categorical data, indicating the most common category or value.

#### Measures of Spread (Variability)
These statistics tell us how spread out or dispersed our data is:
*   **Range:** The difference between the maximum and minimum values. It's simple to calculate but highly sensitive to outliers.
*   **Variance:** The average of the squared differences from the mean. It gives a general idea of how spread out the data is, but its units are squared, making it less intuitive to interpret.
*   **Standard Deviation:** The square root of the variance. This brings the measure of spread back into the same units as the original data, making it much easier to interpret than variance. A small standard deviation means data points are clustered closely around the mean; a large one means they are widely spread out.
*   **Quartiles (Q1, Q2, Q3):** These divide the data into four equal parts after it's sorted.
    *   **Q1 (25th percentile):** 25% of the data falls below this value.
    *   **Q2 (50th percentile):** This is the median.
    *   **Q3 (75th percentile):** 75% of the data falls below this value.
*   **Interquartile Range (IQR):** The difference between Q3 and Q1 (IQR = Q3 - Q1). It represents the middle 50% of the data and, like the median, is robust to outliers.

Let's see these in action with a small dataset using Python's powerful `pandas` library.

```python
import pandas as pd
import numpy as np

# Sample data: daily sales in dollars for a small shop
sales_data = {
    'Day': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    'Sales': [150, 180, 160, 200, 250, 350, 170]
}
df = pd.DataFrame(sales_data)

print("Original Sales Data:")
print(df)

# Calculate descriptive statistics using .describe()
print("\nDescriptive Statistics for Sales (using .describe()):")
print(df['Sales'].describe())

# Let's manually calculate a few key statistics to reinforce understanding:
mean_sales = df['Sales'].mean()
median_sales = df['Sales'].median()
std_sales = df['Sales'].std()
q1_sales = df['Sales'].quantile(0.25)
q3_sales = df['Sales'].quantile(0.75)
iqr_sales = q3_sales - q1_sales

print(f"\nManual Calculations (for clarity):")
print(f"Mean Sales: {mean_sales:.2f}")
print(f"Median Sales: {median_sales:.2f}")
print(f"Standard Deviation Sales: {std_sales:.2f}")
print(f"Q1 (25th percentile): {q1_sales:.2f}")
print(f"Q3 (75th percentile): {q3_sales:.2f}")
print(f"IQR (Interquartile Range): {iqr_sales:.2f}")
```

**Output:**
```
Original Sales Data:
   Day  Sales
0  Mon    150
1  Tue    180
2  Wed    160
3  Thu    200
4  Fri    250
5  Sat    350
6  Sun    170

Descriptive Statistics for Sales (using .describe()):
count      7.000000
mean     208.571429
std       72.827721
min      150.000000
25%      165.000000
50%      180.000000
75%      225.000000
max      350.000000
Name: Sales, dtype: float64

Manual Calculations (for clarity):
Mean Sales: 208.57
Median Sales: 180.00
Standard Deviation Sales: 72.83
Q1 (25th percentile): 165.00
Q3 (75th percentile): 225.00
IQR (Interquartile Range): 60.00
```
From this output, we can quickly see that the average daily sales are around $208.57. However, the median sales are $180.00, which is lower than the mean. This difference suggests that there might be some higher sales values pulling the mean upwards (in this case, Saturday's $350 sales). The standard deviation of $72.83 indicates a fair amount of variability in daily sales, meaning sales figures aren't tightly clustered around the mean.

### Visualizing Data - The Power of Pictures
While descriptive statistics give us precise numbers, **data visualization** helps us see the story behind those numbers. Our brains are incredibly good at recognizing patterns, trends, and outliers when data is presented visually. As the saying goes, "A picture is worth a thousand numbers," and this is especially true in EDA. Visualizations can often reveal insights that might be hidden in tables of numbers.

We'll use two powerful Python libraries for creating these visual stories:
*   **Matplotlib:** This is the foundational plotting library in Python. It provides extensive flexibility and fine-grained control over every aspect of your plots.
*   **Seaborn:** Built on top of Matplotlib, Seaborn provides a high-level interface for drawing attractive and informative statistical graphics. It often requires less code for common plots and comes with aesthetically pleasing default styles.

Let's explore some common types of plots and what they can reveal about your data.

### Understanding Distributions with Histograms
A **histogram** is used to visualize the distribution of a single numerical variable. It shows how frequently different values or ranges of values (called 'bins') occur in your dataset.

Imagine you're tracking the heights of all students in a school. A histogram would show you how many students are between 150-155cm, how many are 155-160cm, and so on, giving you a clear picture of the typical height and its variation.

**What to look for in a histogram:**
*   **Shape:** Is it symmetrical (like a bell curve), skewed (leaning to one side), or does it have multiple peaks (bimodal or multimodal)?
    *   *Symmetrical/Normal:* Bell-shaped, common in natural phenomena.
    *   *Skewed Right (Positive Skew):* The tail extends to the right, meaning most values are lower, but there are some higher outliers (e.g., income data).
    *   *Skewed Left (Negative Skew):* The tail extends to the left, meaning most values are higher, but there are some lower outliers.
*   **Center:** Where is the peak of the distribution? This gives an idea of the most common values.
*   **Spread:** How wide is the histogram? A wide histogram means more variability in the data.
*   **Outliers:** Are there any bars far away from the main body of the data, indicating unusual values?

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Let's use a slightly larger, more varied dataset for better visualization
# Example: Ages of customers at a store
customer_ages = [22, 25, 28, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38, 39, 40, 41, 42, 45, 50, 55, 60, 65, 70, 75, 80]

plt.figure(figsize=(8, 5))
sns.histplot(customer_ages, bins=10, kde=True, color='skyblue') # kde=True adds a smooth density curve
plt.title('Distribution of Customer Ages', fontsize=16)
plt.xlabel('Age', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.grid(axis='y', alpha=0.75, linestyle='--')
plt.show()
```

[IMAGE_PLACEHOLDER: A histogram showing the distribution of customer ages. The x-axis is 'Age' (e.g., 20-80), and the y-axis is 'Frequency'. The bars should show a roughly bell-shaped distribution, possibly slightly skewed to the right, with a peak around 30-40 years old, and then gradually decreasing frequency for older ages. A smooth Kernel Density Estimate (KDE) curve should overlay the bars, following the general shape of the distribution. The pedagogical intent is to illustrate how a histogram visually represents the frequency of values within different bins, showing the shape, center, and spread of a single numerical variable.]

In the example above, you might observe that most customers are in their 30s and 40s, with fewer very young or very old customers. The distribution might appear slightly skewed to the right, indicating a longer tail towards older ages. The `kde=True` argument adds a smooth line that estimates the probability density function, giving an even clearer view of the distribution's overall shape.

### Comparing Groups and Spotting Outliers with Box Plots
While histograms are great for a single distribution, a **box plot** (also known as a box-and-whisker plot) is excellent for visualizing the distribution of a numerical variable, especially when you want to compare distributions across different categories. It compactly displays the median, quartiles, and potential outliers.

**What to look for in a box plot:**
*   **Median (the line inside the box):** This is the central value (Q2 or 50th percentile) of the data.
*   **The Box:** This represents the Interquartile Range (IQR), containing the middle 50% of the data (from Q1 to Q3). A wider box means more variability in the middle 50% of the data.
*   **Whiskers:** These lines extend from the box to the most extreme data points that are *not* considered outliers. Typically, these points are within 1.5 times the Interquartile Range (IQR) from the first and third quartiles (Q1 and Q3).
*   **Outliers (individual points beyond the whiskers):** These are data points that fall outside the range defined by the whiskers (i.e., more than 1.5 * IQR below Q1 or above Q3). They are often plotted as individual dots or stars, drawing attention to unusual observations.

```python
# Example: Exam scores for two different classes
class_a_scores = [65, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95]
class_b_scores = [50, 55, 60, 68, 70, 72, 75, 78, 80, 85, 90, 100, 105] # 105 is an outlier

# Combine into a DataFrame for Seaborn, which works well with structured data
df_scores = pd.DataFrame({
    'Score': class_a_scores + class_b_scores,
    'Class': ['A'] * len(class_a_scores) + ['B'] * len(class_b_scores)
})

plt.figure(figsize=(8, 5))
sns.boxplot(x='Class', y='Score', data=df_scores, palette='pastel')
plt.title('Exam Scores Distribution by Class', fontsize=16)
plt.xlabel('Class', fontsize=12)
plt.ylabel('Score', fontsize=12)
plt.grid(axis='y', alpha=0.75, linestyle='--')
plt.show()
```

[IMAGE_PLACEHOLDER: Two side-by-side box plots, one for 'Class A' and one for 'Class B', on a y-axis representing 'Score'. Both boxes should show a median line, the interquartile range (box), and whiskers. Class B's box plot should clearly show an individual point (a dot or star) above its upper whisker, indicating an outlier (e.g., a score of 105). The pedagogical intent is to demonstrate how box plots summarize the central tendency, spread, and presence of outliers for a numerical variable, and how they are particularly useful for comparing these distributions across different categories.]

In this example, you can visually compare the median scores, the spread of the middle 50% of scores, and immediately spot the outlier in Class B (the score of 105). This might prompt you to investigate if it was a bonus score, a data entry error, or a truly exceptional student, which could significantly impact your analysis if not addressed.

### Exploring Relationships with Scatter Plots
After looking at individual variables, you'll often want to understand how two numerical variables relate to each other. A **scatter plot** is the perfect tool for this, visualizing the relationship between two numerical variables. Each point on the plot represents an observation, with its position determined by its values for the two variables (one on the x-axis, one on the y-axis).

Imagine you want to see if there's a relationship between the amount of time students study and their exam scores. A scatter plot would show you if more study time generally leads to higher scores, or if there's no clear connection.

**What to look for in a scatter plot:**
*   **Direction:** Is the relationship positive (as one variable increases, the other tends to increase), negative (as one increases, the other tends to decrease), or is there no clear direction?
*   **Strength:** How closely do the points cluster around a line or curve? A tight cluster indicates a strong relationship, while scattered points suggest a weak one.
*   **Form:** Is the relationship linear (can be approximated by a straight line) or non-linear (curved)?
*   **Clusters/Groups:** Are there distinct groups of points that suggest different underlying behaviors?
*   **Outliers:** Are there any points far away from the general pattern, indicating unusual combinations of values?

```python
# Example: Relationship between study hours and exam scores
study_hours = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
exam_scores = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

# Add some noise and an outlier for realism
np.random.seed(42) # for reproducibility
exam_scores_noisy = [score + np.random.randint(-5, 5) for score in exam_scores]
exam_scores_noisy[2] = 40 # Introduce an outlier: low score (40) despite 4 hours of study

df_study = pd.DataFrame({
    'Study Hours': study_hours,
    'Exam Score': exam_scores_noisy
})

plt.figure(figsize=(8, 5))
sns.scatterplot(x='Study Hours', y='Exam Score', data=df_study, hue='Study Hours', size='Exam Score', sizes=(50, 200), palette='viridis')
plt.title('Study Hours vs. Exam Score', fontsize=16)
plt.xlabel('Study Hours', fontsize=12)
plt.ylabel('Exam Score', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.6)
plt.show()
```

[IMAGE_PLACEHOLDER: A scatter plot showing 'Study Hours' on the x-axis and 'Exam Score' on the y-axis. The points should generally show an upward trend, indicating a positive correlation (more study hours, higher scores). There should be one or two points that deviate significantly from this trend, acting as outliers (e.g., a student with 4 study hours but a very low score). The pedagogical intent is to illustrate how scatter plots reveal the direction, strength, and form of the relationship between two numerical variables, and to identify potential outliers in that relationship.]

In this plot, you'd likely observe a positive, fairly strong linear relationship: as study hours increase, exam scores generally tend to increase. You might also spot an outlier – a student who studied a decent amount (4 hours) but still received a surprisingly low score (40). This point deviates from the overall trend and could warrant further investigation into factors beyond study time.

### Visualizing Categorical Data with Bar Charts
Finally, when you have a **categorical variable** (data that can be divided into groups or categories), a **bar chart** is the go-to visualization. It's used to display the frequency (counts) or proportion of different categories, or to compare a numerical value across distinct groups.

Imagine you have data on the favorite colors of a group of people. A bar chart would show you how many people prefer blue, how many prefer green, and so on, making it easy to see which colors are most popular.

**What to look for in a bar chart:**
*   **Relative Heights:** Which categories are most common or have the highest values? Which are least common?
*   **Comparisons:** How do the counts or values compare between different categories? Are there significant differences or are they relatively similar?

```python
# Example: Favorite fruits of a group of people
favorite_fruits = ['Apple', 'Banana', 'Orange', 'Apple', 'Grape', 'Banana', 'Apple', 'Orange', 'Banana', 'Apple']

df_fruits = pd.DataFrame({'Fruit': favorite_fruits})

plt.figure(figsize=(8, 5))
sns.countplot(x='Fruit', data=df_fruits, palette='viridis', order=df_fruits['Fruit'].value_counts().index) # countplot is great for frequencies of categories
plt.title('Favorite Fruits', fontsize=16)
plt.xlabel('Fruit Type', fontsize=12)
plt.ylabel('Number of People', fontsize=12)
plt.grid(axis='y', alpha=0.75, linestyle='--')
plt.show()
```

[IMAGE_PLACEHOLDER: A bar chart with 'Fruit Type' on the x-axis (e.g., Apple, Banana, Orange, Grape) and 'Number of People' on the y-axis. Each bar should represent the count for a specific fruit, with 'Apple' having the tallest bar, followed by 'Banana', then 'Orange', and 'Grape' having the shortest bar. The bars should be distinct and visually comparable in height. The pedagogical intent is to show how bar charts effectively display the frequency or count of observations within different categories, making it easy to compare their relative proportions.]

From this bar chart, it's immediately clear that 'Apple' is the most popular fruit among this group, followed by 'Banana', then 'Orange', and 'Grape' is the least popular. The `order` argument in `sns.countplot` helps arrange the bars from most to least frequent, making comparisons even easier.

## Wrap-Up
Congratulations! You've taken your first major steps into the world of Exploratory Data Analysis. We've learned that EDA is like getting to know your data, using both numerical summaries (descriptive statistics) and powerful visual tools (histograms, box plots, scatter plots, and bar charts).

Remember, EDA is not a one-time task but an iterative process. You'll often go back and forth, asking new questions as you uncover insights. It's about curiosity, critical thinking, and letting the data guide your investigation. A thorough EDA [sets](../python/sets.md) the stage for robust modeling, reliable conclusions, and ultimately, better decision-making.

In the next lesson, we'll build on these foundational skills by exploring more advanced visualization techniques and statistical tests to deepen our understanding of data and prepare it for more complex analyses.