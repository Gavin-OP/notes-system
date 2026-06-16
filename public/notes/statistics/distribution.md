<a id="concept-distribution"></a>
# Distribution

## Learning Objectives
- Understand what a probability distribution is and why it's important in data analysis.
- Differentiate between discrete and continuous probability distributions.
- Identify the characteristics and common applications of the Bernoulli, Binomial, Poisson, Normal, and Exponential distributions.
- Recognize the roles of the Chi-squared and Student's t-distributions in statistical inference.
- Develop an intuitive understanding of how different distributions model real-world phenomena.

## Introduction
Imagine you're tracking something in the world – perhaps the number of heads you get when flipping a coin, the height of students in a class, or the number of cars passing a certain point on a road in an hour. When you collect this [data](../data-science/data-fundamentals-and-types.md#concept-data), you'll inevitably notice patterns. Some values occur more often than others, and some values might be very rare.

A **distribution** is essentially a map that shows you all the possible values a variable can take and how often each value occurs. Think of it as a way to visualize the "shape" of your data. Understanding these shapes, or distributions, is fundamental to making sense of data, predicting future outcomes, and drawing meaningful conclusions in statistics and [data science](../data-science/introduction-to-data-science.md#concept-data-science). It helps us answer crucial questions like: "What's the most likely outcome?" or "How spread out are my results?"

In this lesson, we'll explore various types of distributions, starting with the most basic concepts and gradually building up to some of the most commonly used distributions in statistics.

## Concept Progression

### What is a Distribution?
At its core, a distribution describes the likelihood of different outcomes for a variable. If you were to [collect data](../data-science/statistical-foundations.md#concept-sampling) on a variable, say the scores on a recent exam, and then plot how many students got each score, you'd be visualizing its distribution. Some scores might be very common (e.g., around 70-80%), while others might be rare (e.g., 0% or 100%).

Consider a simple example: rolling a single six-sided die.
The possible outcomes are 1, 2, 3, 4, 5, 6.
If the die is fair, each outcome has an equal chance of appearing (1/6).
If you roll the die many times and record the results, you'd expect to see each number appear roughly the same number of times. This is a **[uniform distribution](../statistics/basic-definition.md#concept-probability-density-function)**, where all outcomes are equally likely.

<!-- IMAGE_SLOT: img-001 -->
![A bar chart showing the distribution of rolling a fair six-sided die. The x-axis is labeled "Outcome (1-6)"](../../../../../image/statistics/distribution/img-001.png)


Distributions can be represented in various ways:
*   **Tables**: Listing each outcome and its frequency/probability.
*   **Graphs**: Histograms or bar charts for discrete [data](../data-science/data-fundamentals-and-types.md#concept-data), or smooth curves for [continuous data](../data-science/data-fundamentals-and-types.md#concept-quantitative-data).
*   **Formulas**: Mathematical equations that describe the probability of each outcome.

### Discrete vs. Continuous Distributions
A crucial first step in understanding distributions is to distinguish between discrete and [continuous variables](../statistics/basic-statistics.md#concept-expectation), as this distinction determines the type of distribution we use to model them.

*   **Discrete Distributions**: These are used for variables that can only take on a finite or countably infinite number of distinct, separate values. Think of things you can *count*.
    *   **Examples**: The number of heads in 10 coin flips (can be 0, 1, 2, ..., 10), the number of cars passing a point in an hour (can be 0, 1, 2, ...), the number of children in a family. You can't have 2.5 heads or 1.7 cars.
    *   **Representation**: Often shown with bar charts, where each bar represents the probability of a specific, distinct outcome.

*   **Continuous Distributions**: These are used for variables that can take on any value within a given range. Think of things you *measure*.
    *   **Examples**: The height of a person (can be 170 cm, 170.5 cm, 170.53 cm, etc.), the temperature of a room, the time it takes to complete a task.
    *   **Representation**: Often shown with smooth curves. For continuous distributions, we talk about the probability of a value falling within a *range*, rather than the probability of a single exact value (which is technically zero). The area under the curve between two points represents the probability.

<!-- IMAGE_SLOT: img-002 -->
![A two-panel diagram. The left panel shows a discrete probability distribution with a bar chart, x-axis labeled "Number](../../../../../image/statistics/distribution/img-002.png)


### The Bernoulli Distribution
Let's start with the simplest discrete distribution. The **Bernoulli distribution** models a single trial of an experiment that has only two possible outcomes: "success" or "failure."

*   **Scenario**: Flipping a coin once. It can either be heads (success) or tails (failure).
*   **Parameters**: It's defined by a single parameter, `p`, which is the probability of success. The probability of failure is then `1 - p`.
*   **Example**: If you flip a fair coin, `p = 0.5` for getting heads. If you're looking at whether a customer clicks an ad, `p` would be the probability of clicking.

| Outcome | Probability |
| :------ | :---------- |
| Success (1) | `p` |
| Failure (0) | `1 - p` |

This distribution is the fundamental building block for many other discrete distributions.

<a id="concept-binomial-distribution"></a>
### The Binomial Distribution
Now, let's extend the idea of a single Bernoulli trial. The **Binomial distribution** describes the number of successes in a *fixed number* of independent Bernoulli trials.

*   **Scenario**: Instead of flipping a coin once, what if you flip it 10 times? The Binomial distribution tells you the probability of getting, say, exactly 3 heads out of those 10 flips.
*   **Parameters**: It has two parameters:
    *   `n`: The number of trials (e.g., 10 coin flips).
    *   `p`: The probability of success on a single trial (e.g., 0.5 for heads).
*   **Key Characteristics**:
    *   A fixed number of trials (`n`).
    *   Each trial is independent (one flip doesn't affect the next).
    *   Each trial has only two outcomes (success/failure).
    *   The probability of success (`p`) is constant for each trial.

**Example**: You're a quality control inspector, and you test 20 items from a production line. Historically, 5% of items are defective (`p = 0.05`). What's the probability that exactly 2 of the 20 items are defective? This is a classic binomial problem.

```python
from scipy.stats import binom

n = 20  # Number of trials (items tested)
p = 0.05 # Probability of success (item being defective)
k = 2   # Number of successes (2 defective items)

# binom.pmf calculates the Probability Mass Function for discrete distributions
# It gives the probability of exactly 'k' successes in 'n' trials.
probability = binom.pmf(k, n, p)
print(f"The probability of exactly 2 defective items is: {probability:.4f}")
# Output: The probability of exactly 2 defective items is: 0.1887
```

<!-- IMAGE_SLOT: img-003 -->
![A bar chart showing a binomial distribution for n=10, p=0.5. The x-axis is labeled "Number of Successes (0-10)"](../../../../../image/statistics/distribution/img-003.png)


<a id="concept-poisson-distribution"></a>
### The Poisson Distribution
While the [Binomial distribution](../statistics/distribution.md#concept-binomial-distribution) counts successes in a *fixed number of trials*, the **Poisson distribution** helps us count events that happen over a *fixed interval* of time or space, especially when we only know the average rate at which these events occur.

*   **Scenario**: How many phone calls does a customer service center receive in an hour? How many typos are there on a page of a book? How many meteorites hit a certain area in a year?
*   **Parameters**: It's defined by a single parameter, `λ` (lambda), which represents the average rate of events in the given interval.
*   **Key Characteristics**:
    *   Events occur independently.
    *   The average rate of events (`λ`) is constant over the interval.
    *   The number of events in one interval does not affect the number of events in another disjoint interval.

**Example**: A call center receives an average of 5 calls per hour (`λ = 5`). What is the probability that they receive exactly 3 calls in the next hour?

```python
from scipy.stats import poisson

lambda_rate = 5 # Average number of calls per hour
k = 3           # Number of calls we are interested in

# poisson.pmf calculates the Probability Mass Function for discrete distributions
# It gives the probability of exactly 'k' events occurring given the average rate 'lambda_rate'.
probability = poisson.pmf(k, lambda_rate)
print(f"The probability of receiving exactly 3 calls is: {probability:.4f}")
# Output: The probability of receiving exactly 3 calls is: 0.1404
```

<!-- IMAGE_SLOT: img-004 -->
![A bar chart showing a Poisson distribution for lambda=3. The x-axis is labeled "Number of Events (0, 1,](../../../../../image/statistics/distribution/img-004.png)


<a id="concept-normal-distribution"></a>
### The Normal Distribution (Gaussian Distribution)
Shifting gears from counting discrete events to measuring continuous phenomena, we encounter the most ubiquitous [distribution](../statistics/distribution.md#concept-distribution) in statistics: the **Normal distribution**, often called the "bell curve" or **Gaussian distribution**. It's a continuous distribution that appears naturally in countless real-world scenarios.

*   **Scenario**: Heights of adult males, measurement errors in experiments, blood pressure readings, IQ scores. Many natural processes tend to cluster around an average value, with fewer observations further away.
*   **Parameters**: It's defined by two parameters:
    *   `μ` (mu): The mean (average) of the distribution, which also represents the peak of the bell curve.
    *   `σ` (sigma): The standard deviation, which measures the spread or variability of the data. A smaller `σ` means data points are clustered closer to the mean; a larger `σ` means they are more spread out.
*   **Key Characteristics**:
    *   **Symmetric**: The curve is perfectly symmetrical around its mean.
    *   **Bell-shaped**: It has a distinctive bell shape.
    *   **Asymptotic**: The tails of the curve approach the x-axis but never quite touch it, meaning theoretically, extreme values are possible, though highly unlikely.
    *   **Empirical Rule (68-95-99.7 Rule)**: Approximately 68% of data falls within 1 standard deviation of the mean, 95% within 2 standard deviations, and 99.7% within 3 standard deviations.

<!-- IMAGE_SLOT: img-005 -->
![A smooth bell-shaped curve representing a normal distribution. The x-axis is labeled "Value" and the y-axis is labeled](../../../../../image/statistics/distribution/img-005.png)


The Normal distribution is incredibly important because:
1.  Many natural phenomena inherently follow it.
2.  The **[Central Limit Theorem](../statistics/probability-theorem.md#concept-central-limit-theorem)** states that the sampling distribution of the sample mean of many independent random variables will be approximately normal, regardless of the original distribution, as long as the sample size is large enough. This makes it crucial for statistical inference, allowing us to make assumptions about sample means even when the underlying population distribution isn't normal.

**Example**: Suppose the heights of adult women are normally distributed with a mean (`μ`) of 163 cm and a standard deviation (`σ`) of 7 cm. What percentage of women are between 156 cm and 170 cm tall? (Notice this range is `μ - σ` to `μ + σ`, so we expect approximately 68% based on the Empirical Rule).

```python
from scipy.stats import norm

mu = 163 # Mean height
sigma = 7 # Standard deviation of height

# norm.cdf calculates the Cumulative Distribution Function for continuous distributions
# It gives the probability that a random variable takes a value less than or equal to a given value.
prob_less_than_170 = norm.cdf(170, mu, sigma) # P(X <= 170)
prob_less_than_156 = norm.cdf(156, mu, sigma) # P(X <= 156)

# To find P(156 <= X <= 170), we subtract P(X <= 156) from P(X <= 170)
probability_range = prob_less_than_170 - prob_less_than_156
print(f"The probability of a woman being between 156cm and 170cm is: {probability_range:.4f}")
# Output: The probability of a woman being between 156cm and 170cm is: 0.6827 (approx 68%)
```

<a id="concept-exponential-distribution"></a>
### The Exponential Distribution
While the Normal distribution models the distribution of measurements, the **Exponential distribution** is specifically designed to model the *time until an event occurs*. It's a [continuous distribution](../statistics/distribution.md#concept-distribution) often used in scenarios where events happen continuously and independently at a constant average rate, much like the events modeled by the [Poisson distribution](../statistics/distribution.md#concept-poisson-distribution), but here we focus on the *waiting time* between those events.

*   **Scenario**: The time until the next customer arrives at a store, the lifespan of an electronic component, the time between successive calls to a call center.
*   **Parameters**: It's defined by a single parameter, `λ` (lambda), which is the rate parameter (the average number of events per unit of time). It's the reciprocal of the mean time between events.
*   **Key Characteristics**:
    *   **Memoryless Property**: The probability of an event occurring in the future is independent of how much time has already passed. For example, if a component has been working for 10 hours, the probability it will work for another hour is the same as if it were brand new.
    *   **Right-skewed**: It starts high at 0 and then decreases exponentially, meaning shorter times between events are more likely than longer times.

**Example**: A light bulb has an average lifespan of 1000 hours. This means `λ = 1/1000` (or 0.001 events per hour). What is the probability that a bulb will last less than 500 hours?

```python
from scipy.stats import expon

lambda_rate = 1/1000 # Rate parameter (1/mean lifespan)
time_threshold = 500 # Time in hours

# expon.cdf calculates the Cumulative Distribution Function for continuous distributions
# The 'scale' parameter for expon is 1/lambda (the mean time between events).
probability = expon.cdf(time_threshold, scale=1/lambda_rate)
print(f"The probability a bulb lasts less than 500 hours is: {probability:.4f}")
# Output: The probability a bulb lasts less than 500 hours is: 0.3935
```

<!-- IMAGE_SLOT: img-006 -->
![A smooth curve showing an exponential distribution. The x-axis is labeled "Time Until Event" and the y-axis is](../../../../../image/statistics/distribution/img-006.png)


<a id="concept-students-t-distribution"></a>
### Other Key Distributions: Chi-squared and Student's t-Distribution
So far, we've looked at distributions that help us describe and model [raw data](../data-science/data-cleaning-preprocessing.md#concept-data-cleaning-preprocessing). Now, let's introduce two distributions that are absolutely critical for *statistical inference* – that is, making educated guesses and drawing conclusions about larger populations based on smaller samples.

*   **Chi-squared Distribution**:
    *   **Purpose**: This distribution is primarily used in [hypothesis testing](../data-science/statistical-foundations.md#concept-hypothesis-testing), especially for tests involving [categorical data](../data-science/data-fundamentals-and-types.md#concept-quantitative-data) (like the Chi-squared test for independence or goodness-of-fit) and for estimating population variance.
    *   **Parameters**: It has one parameter: `df` (degrees of freedom), which influences its shape. The degrees of freedom are related to the number of independent pieces of information used to calculate the statistic.
    *   **Intuition**: It arises when you sum the squares of several independent standard normal random variables. This squaring makes it always positive and right-skewed.

*   **Student's t-Distribution**:
    *   **Purpose**: The t-distribution is crucial when estimating the mean of a normally distributed population when the sample size is small and the population standard deviation is unknown. It's widely used in t-tests and constructing confidence intervals for means.
    *   **Parameters**: It also has one parameter: `df` (degrees of freedom), which is typically `n-1` (sample size minus one).
    *   **Intuition**: It looks similar to the normal distribution but has "fatter tails," meaning it accounts for more uncertainty when dealing with smaller samples. As the degrees of freedom increase (i.e., as sample size increases), the t-distribution approaches the normal distribution.

<!-- IMAGE_SLOT: img-007 -->
![A multi-line graph comparing the shapes of the Normal distribution and several Student's t-distributions with different degrees of](../../../../../image/statistics/distribution/img-007.png)


These distributions might seem more abstract now, but you'll encounter them frequently when you learn about hypothesis testing and confidence intervals, where they provide the critical values needed to make statistical decisions.

## Wrap-Up
We've covered the fundamental concept of a distribution, distinguishing between discrete and continuous types, and explored several key distributions: Bernoulli, Binomial, Poisson, Normal, and Exponential. We also briefly touched upon the Chi-squared and Student's t-distributions, noting their importance in statistical inference.

Understanding these distributions is like learning the alphabet of statistical modeling. Each distribution tells a unique story about the data it represents, from simple coin flips to complex natural phenomena. As you continue your journey in statistics, you'll find yourself returning to these foundational concepts again and again, using them to describe, analyze, and make predictions about the world around you. In the next lessons, we'll see how these distributions are applied in real-world scenarios, particularly in the context of sampling and hypothesis testing.