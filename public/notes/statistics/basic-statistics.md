<a id="concept-basic-statistics"></a>
# Basic Statistics: Understanding Your Data

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the concept of **expectation** (or mean) as a fundamental measure of central tendency.
- Understand **variance** as a key indicator of data spread and calculate it for simple datasets.
- Identify and interpret **quantiles**, including the median and percentiles, to describe data distribution robustly.
- Define **covariance** and understand how it measures the directional relationship between two variables.
- Explain **correlation** as a standardized measure of the linear relationship between two variables and interpret its value.

## Introduction
Have you ever looked at a large collection of numbers and wondered, "What does all this mean?" Whether it's exam scores, daily temperatures, or house prices, raw [data](../data-science/data-fundamentals-and-types.md#concept-data) can be overwhelming. This is where **basic statistics** comes to our rescue! Statistics provides a powerful toolkit to summarize, analyze, and interpret data, helping us uncover patterns, make sense of information, and even predict future trends.

In this lesson, we'll embark on a journey to explore the most fundamental statistical concepts. We'll learn how to find the "average" value, understand how spread out our data points are, and even discover how two different sets of numbers might influence each other. These foundational ideas are crucial for anyone looking to understand data, from students to data scientists, and are the building blocks for more advanced statistical analysis.

## Concept Progression

<a id="concept-expectation"></a>
### Expectation (The Average Value)
Let's begin with a concept you're likely already familiar with: the average. In statistics, we often refer to this as the **expectation** or the **mean**. Imagine you're trying to find a single number that best represents a whole group of numbers. The expectation is that "typical" value, the central point around which your data tends to cluster. It's what you'd "expect" to see if you took many observations.

For instance, if you want to know your overall performance in a course, you'd calculate the average of all your test scores. This single number gives you a quick summary of your general standing.

To calculate the mean of a set of numbers, the process is straightforward: you simply add all the numbers together and then divide by the total count of numbers.

**Example: Calculating Your Average Quiz Score**
Suppose you took five quizzes and received the following scores: 85, 90, 78, 92, and 88.
To find your average (expectation) score:
1.  **Sum all the scores:** $85 + 90 + 78 + 92 + 88 = 433$
2.  **Count how many scores there are:** There are 5 scores.
3.  **Divide the sum by the count:** $433 \div 5 = 86.6$

So, your average (expectation) quiz score is 86.6. This single value provides a concise summary of your performance across all quizzes.

While the example above shows how to calculate the mean for a sample of [data](../data-science/data-fundamentals-and-types.md#concept-data), the concept of expectation applies more broadly. For a random variable $X$ (which represents the outcome of a random phenomenon), its expectation, denoted as $E[X]$ or $\mu$ (the [Greek letter](../statistics/rules-of-thumb.md#concept-greek-letters) mu), is formally defined based on its [probability distribution](../data-science/statistical-foundations.md#concept-probability):
-   For **discrete variables** (countable outcomes): $E[X] = \sum x \cdot P(X=x)$ (the sum of each possible value multiplied by its probability).
-   For **continuous variables** (outcomes that can take any value in a range): $E[X] = \int x \cdot f(x) dx$ (the integral of x times its [probability density function](../statistics/basic-definition.md#concept-probability-density-function)).

For a specific sample of data points $x_1, x_2, \ldots, x_n$, the sample mean is represented as:
$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$

<!-- IMAGE_SLOT: img-001 -->
![A simple bar chart showing five quiz scores (85, 90, 78, 92, 88) with a horizontal line drawn](../../../../../image/statistics/basic-statistics/img-001.png)


<a id="concept-variance"></a>
### Variance (Measuring Data Spread)
The [expectation](../statistics/basic-statistics.md#concept-expectation) gives us a great sense of the "center" of our data, but it doesn't tell the whole story. What if two different datasets have the same average but look very different?

Consider these two groups of students and their exam scores:
*   **Group A scores:** 80, 85, 90, 95, 100 (Mean = 90)
*   **Group B scores:** 50, 70, 90, 110, 130 (Mean = 90)

Both groups have an average score of 90. However, Group A's scores are tightly clustered around the average, while Group B's scores are much more spread out. Relying solely on the mean here would be misleading!

This is where **variance** becomes essential. Variance is a statistical measure that quantifies how much individual data points deviate or "vary" from the mean.
*   A **high variance** indicates that data points are widely dispersed, far from the mean and from each other.
*   A **low variance** suggests that data points are clustered closely around the mean.

To calculate variance, we essentially find the average of the *squared* differences between each data point and the mean. We square these differences for two main reasons:
1.  To ensure all deviations are positive, so that values above the mean don't cancel out values below the mean.
2.  To give more weight to larger deviations, penalizing points that are very far from the mean more heavily.

The formula for the sample variance, denoted as $s^2$, is:
$s^2 = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})^2$
You might wonder why we divide by $n-1$ instead of $n$. For sample variance, dividing by $n-1$ (known as Bessel's correction) provides a more accurate, unbiased estimate of the true population variance, especially when dealing with smaller samples.

**Example: Calculating Variance for Your Quiz Scores**
Let's revisit your quiz scores: 85, 90, 78, 92, 88. We already calculated the mean ($\bar{x}$) as 86.6.

1.  **Find the difference between each score and the mean:**
    *   $85 - 86.6 = -1.6$
    *   $90 - 86.6 = 3.4$
    *   $78 - 86.6 = -8.6$
    *   $92 - 86.6 = 5.4$
    *   $88 - 86.6 = 1.4$

2.  **Square each of these differences:**
    *   $(-1.6)^2 = 2.56$
    *   $(3.4)^2 = 11.56$
    *   $(-8.6)^2 = 73.96$
    *   $(5.4)^2 = 29.16$
    *   $(1.4)^2 = 1.96$

3.  **Sum all the squared differences:**
    $2.56 + 11.56 + 73.96 + 29.16 + 1.96 = 119.2$

4.  **Divide by $n-1$ (since $n=5$, $n-1=4$):**
    $119.2 \div 4 = 29.8$

The variance of your quiz scores is 29.8. This number tells us about the spread. A higher variance would indicate your scores were more inconsistent. The square root of the variance is called the **standard deviation**, which is often easier to interpret because it's in the same units as the original data. In this case, the standard deviation would be $\sqrt{29.8} \approx 5.46$.

<!-- IMAGE_SLOT: img-002 -->
![A scatter plot showing five data points (quiz scores) along a number line. The mean (86.6) is marked](../../../../../image/statistics/basic-statistics/img-002.png)


<a id="concept-quantile"></a>
### Quantiles (Median, Percentiles: Robust Measures of Position)
While the mean is a powerful measure of central tendency, it has a vulnerability: it can be heavily skewed by extreme values, often called **[outliers](../data-science/data-cleaning-preprocessing.md#concept-outliers)**. For example, if you're looking at house prices in a neighborhood, a single very expensive mansion could drastically inflate the average price, making the neighborhood seem more expensive than it truly is for most residents.

**Quantiles** offer an alternative, more robust way to understand the [distribution](../statistics/distribution.md#concept-distribution) of data. They divide an ordered dataset into segments, each containing an equal proportion of the data. Because they focus on position rather than exact values, quantiles are much less sensitive to outliers than the mean.

The most common and intuitive quantile is the **median**. The median is simply the middle value in a dataset when all the data points are arranged in order from smallest to largest.
*   If there's an odd number of data points, the median is the single value exactly in the middle.
*   If there's an even number of data points, the median is the average of the two middle values.

**Example: Median House Prices (Dealing with Outliers)**
Let's consider these house prices (in thousands of dollars) in a small town:
$200, 220, 250, 280, 300, 320, 1500$ (Notice the last house is significantly more expensive!)

1.  **Order the data:** The data is already ordered for us: $200, 220, 250, 280, 300, 320, 1500$
2.  **Find the middle value:** There are 7 data points, so the middle value is the 4th one in the ordered list.
    The median house price is $280$ (thousand dollars).

Now, let's compare this to the mean for the same dataset:
Mean = $(200+220+250+280+300+320+1500) \div 7 = 3070 \div 7 \approx 438.57$ (thousand dollars).
Notice how the single $1500K$ house pulled the mean up significantly to $438.57K$, while the median ($280K$) gives a much more representative picture of what most houses in this town cost.

**Percentiles** are a more general form of quantiles. A percentile indicates the value below which a given percentage of observations in a dataset falls.
*   For example, the 25th percentile (also known as the first quartile) is the value below which 25% of the data falls.
*   The median is precisely the 50th percentile.
*   The 75th percentile (the third quartile) is the value below which 75% of the data falls.

**Example: Understanding Percentiles in Context**
If a student scores in the 90th percentile on a standardized test, it means they performed better than 90% of all other students who took that test. This doesn't tell you their raw score, but it provides valuable information about their relative standing within the group.

<!-- IMAGE_SLOT: img-003 -->
![A box plot illustrating the distribution of house prices. The median is clearly marked within the box. The](../../../../../image/statistics/basic-statistics/img-003.png)


<a id="concept-covariance"></a>
### Covariance (Measuring How Two Variables Move Together)
So far, we've focused on understanding single variables: their center and their spread. But what if we're interested in the relationship between *two* different variables? For instance, does studying more hours tend to lead to higher exam scores? Does the temperature outside influence ice cream sales? **Covariance** is the statistical tool that helps us explore these kinds of relationships by measuring how two variables change together.

Specifically, covariance tells us two key things about the relationship between two variables, say $X$ and $Y$:
1.  **Direction:**
    *   A **positive covariance** suggests that as one variable tends to increase, the other also tends to increase (or both decrease together).
    *   A **negative covariance** suggests that as one variable tends to increase, the other tends to decrease.
2.  **Magnitude (to some extent):** A larger absolute value of covariance generally indicates a stronger relationship. However, its exact value is difficult to interpret directly because it depends on the units of the variables involved.

The formula for the sample covariance between two variables $X$ and $Y$, denoted as $s_{xy}$, is:
$s_{xy} = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})$

Let's break down what this formula is doing:
*   For each pair of data points $(x_i, y_i)$, we calculate how much $x_i$ deviates from its mean ($\bar{x}$) and how much $y_i$ deviates from its mean ($\bar{y}$).
*   We then multiply these two deviations together.
    *   If both $x_i$ and $y_i$ are above their respective means (both deviations are positive), their product will be positive.
    *   If both are below their means (both deviations are negative), their product will also be positive.
    *   If one is above its mean and the other is below its mean (one positive, one negative deviation), their product will be negative.
*   Finally, we sum up all these products and divide by $n-1$ (similar to variance, for an unbiased estimate).

**Example: Temperature and Ice Cream Sales**
Let's collect some hypothetical data for daily temperature (in Celsius) and the number of ice creams sold:

| Day | Temperature ($x_i$) | Ice Creams Sold ($y_i$) |
| :-- | :------------------ | :---------------------- |
| 1   | 20                  | 100                     |
| 2   | 22                  | 110                     |
| 3   | 18                  | 90                      |
| 4   | 25                  | 130                     |
| 5   | 15                  | 70                      |

First, we need to calculate the mean for both temperature ($\bar{x}$) and ice cream sales ($\bar{y}$):
$\bar{x} = (20+22+18+25+15) \div 5 = 100 \div 5 = 20$
$\bar{y} = (100+110+90+130+70) \div 5 = 500 \div 5 = 100$

Now, let's calculate the product of deviations $(x_i - \bar{x})(y_i - \bar{y})$ for each day:
*   Day 1: $(20-20)(100-100) = 0 \cdot 0 = 0$
*   Day 2: $(22-20)(110-100) = 2 \cdot 10 = 20$
*   Day 3: $(18-20)(90-100) = -2 \cdot -10 = 20$
*   Day 4: $(25-20)(130-100) = 5 \cdot 30 = 150$
*   Day 5: $(15-20)(70-100) = -5 \cdot -30 = 150$

Sum of these products = $0 + 20 + 20 + 150 + 150 = 340$
Finally, calculate the covariance $s_{xy} = 340 \div (5-1) = 340 \div 4 = 85$.

A positive covariance of 85 suggests that as temperature increases, ice cream sales tend to increase, which aligns with our intuition. However, the value 85 itself is hard to interpret. Is 85 a "strong" relationship? A "weak" one? This ambiguity leads us to our next concept.

<!-- IMAGE_SLOT: img-004 -->
![A scatter plot showing temperature on the x-axis and ice cream sales on the y-axis. The mean for](../../../../../image/statistics/basic-statistics/img-004.png)


<a id="concept-correlation"></a>
### Correlation (Standardized Relationship Strength)
As we just saw, covariance tells us the direction of a relationship, but its magnitude is difficult to interpret because it's affected by the units of the variables. A covariance of 85 for temperature in Celsius and ice cream sales would be a different number if we measured temperature in Fahrenheit, even though the underlying relationship between temperature and sales hasn't changed.

This is where **correlation** steps in. Correlation is essentially a standardized version of covariance. It measures the strength and direction of a *linear* relationship between two variables, and its value always falls within a fixed range: between -1 and +1. This standardization makes correlation much easier to interpret and compare across different datasets.

The most common type of correlation is Pearson's correlation coefficient, often denoted as $r$:
$r = \frac{s_{xy}}{s_x s_y}$
Where:
*   $s_{xy}$ is the covariance between variables $X$ and $Y$.
*   $s_x$ is the standard deviation of $X$.
*   $s_y$ is the standard deviation of $Y$.

Let's interpret the correlation coefficient $r$:
*   **$r = +1$**: Indicates a **perfect positive linear relationship**. As one variable increases, the other increases proportionally. All data points would fall perfectly on an upward-sloping straight line.
*   **$r = -1$**: Indicates a **perfect negative linear relationship**. As one variable increases, the other decreases proportionally. All data points would fall perfectly on a downward-sloping straight line.
*   **$r = 0$**: Indicates **no linear relationship**. The variables do not tend to move together in a linear fashion. (Important note: This doesn't mean there's *no* relationship at all, just no *linear* one. There could be a strong non-linear relationship.)
*   **Values between 0 and +1**: Represent a **positive linear relationship**, with stronger relationships closer to +1.
*   **Values between 0 and -1**: Represent a **negative linear relationship**, with stronger relationships closer to -1.

**Example: Correlation for Temperature and Ice Cream Sales**
We've already calculated the covariance $s_{xy} = 85$.
Now we need the standard deviations for temperature ($s_x$) and ice cream sales ($s_y$). Recall that standard deviation is the square root of variance.

Let's quickly calculate the squared deviations for $X$ (Temperature) and $Y$ (Ice Creams Sold) from our previous example:
*   **For X (Temperature):**
    *   Deviations: $0, 2, -2, 5, -5$
    *   Squared deviations: $0^2=0, 2^2=4, (-2)^2=4, 5^2=25, (-5)^2=25$
    *   Sum of squared deviations for X = $0+4+4+25+25 = 58$
    *   Variance $s_x^2 = 58 \div 4 = 14.5$
    *   Standard deviation $s_x = \sqrt{14.5} \approx 3.808$

*   **For Y (Ice Creams Sold):**
    *   Deviations: $0, 10, -10, 30, -30$
    *   Squared deviations: $0^2=0, 10^2=100, (-10)^2=100, 30^2=900, (-30)^2=900$
    *   Sum of squared deviations for Y = $0+100+100+900+900 = 2000$
    *   Variance $s_y^2 = 2000 \div 4 = 500$
    *   Standard deviation $s_y = \sqrt{500} \approx 22.361$

Now, we can calculate the correlation coefficient:
$r = \frac{s_{xy}}{s_x s_y} = \frac{85}{3.808 \cdot 22.361} = \frac{85}{85.12} \approx 0.998$

A correlation coefficient of approximately 0.998 is very close to +1. This indicates an extremely strong positive linear relationship between temperature and ice cream sales. In our example, it means that as the temperature goes up, ice cream sales almost perfectly increase in a linear fashion. This value is much more interpretable than the raw covariance of 85.

<!-- IMAGE_SLOT: img-005 -->
![A series of three scatter plots. The first shows points tightly clustered along an upward-sloping line (r close](../../../../../image/statistics/basic-statistics/img-005.png)


## Wrap-Up
Congratulations! In this lesson, you've built a solid foundation for understanding data by exploring some of the most fundamental statistical concepts. We started by learning that **expectation** (the mean) gives us the central tendency of our data, while **variance** tells us how spread out those data points are. We then discovered how **quantiles**, such as the median, offer robust measures of position that are less affected by extreme values. Finally, we ventured into understanding relationships between two variables, learning how **covariance** indicates the direction of their joint movement and how **correlation** provides a standardized measure of the strength and direction of their linear relationship.

These tools are incredibly powerful for summarizing, interpreting, and communicating insights from data. They allow us to move beyond just looking at raw numbers and start understanding the stories and patterns they reveal. As you continue your journey in statistics, you'll find these basic concepts are the essential building blocks for more advanced analyses, such as hypothesis testing and regression. Keep practicing, and you'll soon be confidently making sense of the data all around you!