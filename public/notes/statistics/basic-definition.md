<a id="concept-basic-definition"></a>
# Basic Definition: The Building Blocks of Probability

## Learning Objectives
By the end of this lesson, you will be able to:
- Define and identify the **sample space** for a given experiment.
- Understand what constitutes an **event** and how to combine events using basic set operations.
- Explain the concept of a **random variable** and distinguish between discrete and continuous types.
- Describe the purpose and properties of a **Probability Mass Function (PMF)** for discrete random variables.
- Describe the purpose and properties of a **Probability Density Function (PDF)** for continuous random variables.
- Understand the **Cumulative Distribution Function (CDF)** as a unified way to describe probabilities for both discrete and continuous random variables.

## Introduction
Welcome to the foundational concepts of [probability](../data-science/statistical-foundations.md#concept-probability) and statistics! Before we can analyze [data](../data-science/data-fundamentals-and-types.md#concept-data), make predictions, or understand uncertainty, we need a common language. This lesson will introduce you to the basic building blocks: defining all possible outcomes, identifying specific results, and turning those results into numbers we can work with. Think of these as the alphabet and grammar that will allow us to "speak" statistics. Mastering these definitions will set a strong stage for everything that follows, enabling you to confidently approach more complex topics.

## Concept Progression

<a id="concept-sample-space"></a>
### The Sample Space: All Possible Outcomes

Every time we perform an experiment, like flipping a coin or rolling a die, there's a set of all possible results that could occur. This complete collection of every single possible outcome is called the **sample space**. It's the entire "universe" of possibilities for your experiment.

We often denote the sample space with the letter $S$ (or sometimes $\Omega$). Each individual outcome within the sample space is referred to as a **sample point**.

Let's look at some examples to make this concrete:

*   **Flipping a single coin:** The coin can land on Heads (H) or Tails (T).
    The sample space is $S = \{H, T\}$.
*   **Rolling a standard six-sided die:** The die can show any number from 1 to 6.
    The sample space is $S = \{1, 2, 3, 4, 5, 6\}$.
*   **Flipping two coins:** This experiment has more outcomes. We consider the result of each coin flip.
    The possible combinations are:
    *   Heads on the first, Heads on the second (HH)
    *   Heads on the first, Tails on the second (HT)
    *   Tails on the first, Heads on the second (TH)
    *   Tails on the second, Tails on the second (TT)
    The sample space is $S = \{HH, HT, TH, TT\}$.

Understanding the sample space is the very first and most crucial step in any probability problem because it defines the boundaries of what can happen. Without knowing all possibilities, we can't accurately assess the likelihood of specific results.

<!-- IMAGE_SLOT: img-001 -->
![A diagram showing three distinct sample spaces. The first shows a coin with 'H' and 'T' as two](../../../../../image/statistics/basic-definition/img-001.png)


### Events: Specific Outcomes of Interest

Once we've defined our sample space – the full list of everything that *could* happen – we often want to focus on particular results. An **event** is simply a specific collection of one or more outcomes from the sample space. In mathematical terms, an event is a subset of the sample space.

Let's continue with our previous examples to illustrate events:

*   **Flipping a single coin:**
    *   Event A: Getting Heads. $A = \{H\}$
    *   Event B: Getting Tails. $B = \{T\}$
*   **Rolling a standard six-sided die:**
    *   Event C: Rolling an even number. $C = \{2, 4, 6\}$
    *   Event D: Rolling a number greater than 4. $D = \{5, 6\}$
    *   Event E: Rolling a 7. This is an impossible event, as 7 is not in our sample space. So, $E = \{\}$ (the empty set).
*   **Flipping two coins:**
    *   Event F: Getting exactly one Head. $F = \{HT, TH\}$
    *   Event G: Getting at least one Head. $G = \{HH, HT, TH\}$

Beyond defining individual events, we can also combine them using basic **set operations**, which are incredibly useful in probability:

*   **Union ($\cup$):** The union of two events A and B (written as $A \cup B$) means that event A *or* event B (or both) occurs. It includes all outcomes that are in A, or in B, or in both.
    *   Example: For the die roll, if $C = \{2, 4, 6\}$ (rolling an even number) and $D = \{5, 6\}$ (rolling a number greater than 4), then $C \cup D = \{2, 4, 5, 6\}$. This event means "rolling an even number OR a number greater than 4."
*   **Intersection ($\cap$):** The intersection of two events A and B (written as $A \cap B$) means that both event A *and* event B occur simultaneously. It includes only the outcomes that are common to both A and B.
    *   Example: For the die roll, $C \cap D = \{6\}$. This event means "rolling a number that is both even AND greater than 4."
*   **Complement ($A^c$ or $A'$):** The complement of an event A means that event A *does not* occur. It includes all outcomes in the sample space that are not in A.
    *   Example: For the die roll, if $C = \{2, 4, 6\}$, then $C^c = \{1, 3, 5\}$. This event means "rolling an odd number" (the opposite of rolling an even number).

<!-- IMAGE_SLOT: img-002 -->
![A Venn diagram illustrating two overlapping circles labeled 'Event A' and 'Event B' within a larger rectangle labeled](../../../../../image/statistics/basic-definition/img-002.png)


### Random Variables: Quantifying Outcomes

While sample spaces and events help us describe outcomes qualitatively (like "Heads" or "rolling an even number"), in statistics, we often need to work with numbers. This is where **random variables** become essential.

A random variable is a [function](../python/functions-in-python.md#concept-function) that assigns a numerical value to each outcome in the sample space. It's called "random" because the specific outcome of the experiment is uncertain, and therefore the numerical value the variable takes is also uncertain. We typically use capital letters like $X$, $Y$, or $Z$ to denote random variables.

Let's revisit our examples to see how random variables transform qualitative outcomes into quantitative ones:

*   **Flipping two coins:** The sample space is $S = \{HH, HT, TH, TT\}$.
    Let $X$ be the random variable representing the *number of Heads*.
    *   For the outcome HH, $X = 2$
    *   For the outcome HT, $X = 1$
    *   For the outcome TH, $X = 1$
    *   For the outcome TT, $X = 0$
    The possible values for $X$ are $\{0, 1, 2\}$.
*   **Rolling a standard six-sided die:** The sample space is $S = \{1, 2, 3, 4, 5, 6\}$.
    Let $Y$ be the random variable representing the *square of the number rolled*.
    *   For the outcome 1, $Y = 1^2 = 1$
    *   For the outcome 2, $Y = 2^2 = 4$
    *   ...
    *   For the outcome 6, $Y = 6^2 = 36$
    The possible values for $Y$ are $\{1, 4, 9, 16, 25, 36\}$.

Random variables are broadly classified into two main types, depending on the nature of the values they can take:

1.  **Discrete Random Variables:** These are random variables that can only take on a finite or a countably infinite number of values. They often arise from *counting* things.
    *   Examples: The number of heads in coin flips (0, 1, 2), the number of cars passing a point in an hour (0, 1, 2, ...), the number of defects in a product (0, 1, 2, ...).
2.  **Continuous Random Variables:** These are random variables that can take on any value within a given range or interval. They often arise from *measuring* things.
    *   Examples: The height of a person (e.g., 170.5 cm, 170.51 cm, etc.), temperature (e.g., 25.3 degrees Celsius), the time taken to complete a task (e.g., 3.14 minutes).

Now that we can assign numerical values to outcomes, the next step is to describe the *probability* of these numerical values occurring. This leads us to [probability distribution](../data-science/statistical-foundations.md#concept-probability) functions.

<a id="concept-probability-mass-function"></a>
### Probability Mass Function (PMF): For Discrete Random Variables

When working with discrete random variables, we need a way to describe the probability of each specific value occurring. This is precisely the role of a **Probability Mass [Function](../python/functions-in-python.md#concept-function) (PMF)**.

A PMF, typically denoted as $P(X=x)$ or $f_X(x)$, gives the probability that a discrete random variable $X$ takes on a particular value $x$.

The PMF must satisfy two fundamental conditions:
1.  For every possible value $x$, the probability must be non-negative: $P(X=x) \ge 0$. (Probabilities can't be negative).
2.  The sum of all probabilities for all possible values of $x$ must equal 1: $\sum_x P(X=x) = 1$. (The total probability of all possible outcomes must be 1).

Let's return to our two-coin flip example, where $X$ is the number of Heads.
The [sample space](../statistics/basic-definition.md#concept-sample-space) is $S = \{HH, HT, TH, TT\}$. Assuming a fair coin, each of these four outcomes has an equal probability of $1/4$.
*   For $X=0$ (outcome TT): $P(X=0) = 1/4 = 0.25$
*   For $X=1$ (outcomes HT, TH): $P(X=1) = P(HT) + P(TH) = 1/4 + 1/4 = 2/4 = 1/2 = 0.50$
*   For $X=2$ (outcome HH): $P(X=2) = 1/4 = 0.25$

So, the PMF for $X$ is:
$P(X=0) = 0.25$
$P(X=1) = 0.50$
$P(X=2) = 0.25$

Notice that both conditions are met: all probabilities are non-negative, and their sum is $0.25 + 0.50 + 0.25 = 1$. The PMF provides a complete picture of the probability distribution for a discrete random variable.

<!-- IMAGE_SLOT: img-003 -->
![A bar chart showing the Probability Mass Function (PMF) for the number of heads in two coin flips.](../../../../../image/statistics/basic-definition/img-003.png)


<a id="concept-probability-density-function"></a>
### Probability Density Function (PDF): For Continuous Random Variables

Unlike discrete random variables, continuous random variables can take on an infinite number of values within any given range. Because of this, the probability of a continuous random variable taking on any *single specific value* is essentially zero. For example, what is the probability that a person's height is *exactly* 170.000000... cm? It's practically impossible to measure with infinite precision, so we consider this probability to be zero.

Instead, for continuous random variables, we talk about the probability of the variable falling within a certain *range* or *interval*. This is where the **Probability Density Function (PDF)** comes in, denoted as $f_X(x)$. The PDF itself does *not* give probabilities directly; rather, the *area under the PDF curve* over a given interval represents the probability that the random variable falls within that interval.

The PDF must satisfy two conditions:
1.  For all values $x$, the density must be non-negative: $f_X(x) \ge 0$. (The curve cannot dip below the x-axis).
2.  The total area under the curve over all possible values of $x$ must equal 1: $\int_{-\infty}^{\infty} f_X(x) dx = 1$. (The total probability over all possible values must be 1).

To find the probability that a continuous random variable $X$ falls between two values $a$ and $b$, we calculate the area under the PDF curve from $a$ to $b$ using integration:
$P(a \le X \le b) = \int_a^b f_X(x) dx$.

A common example is the **uniform distribution**, where all values within a specific range are equally likely. For instance, if $X$ is uniformly distributed between 0 and 1, its PDF is $f_X(x) = 1$ for $0 \le x \le 1$, and $0$ otherwise. The probability of $X$ being between 0.2 and 0.5 would be the area of a rectangle with width $(0.5 - 0.2) = 0.3$ and height $1$, so $P(0.2 \le X \le 0.5) = \int_{0.2}^{0.5} 1 dx = [x]_{0.2}^{0.5} = 0.5 - 0.2 = 0.3$.

<!-- IMAGE_SLOT: img-004 -->
![A smooth curve representing a Probability Density Function (PDF) for a continuous random variable X. The x-axis is](../../../../../image/statistics/basic-definition/img-004.png)


<a id="concept-cumulative-distribution-function"></a>
### Cumulative Distribution Function (CDF): A Unified View

While PMFs and PDFs are specific to discrete and continuous random variables, respectively, the **Cumulative Distribution Function (CDF)** offers a powerful, unified way to describe the probability distribution for *both* types of random variables. It tells us the probability that a random variable $X$ will take a value less than or equal to a specific value $x$.

Formally, the CDF is defined as $F_X(x) = P(X \le x)$.

The CDF has several important properties that make it very useful:
1.  **Non-decreasing:** As $x$ increases, $F_X(x)$ can only stay the same or increase. If $x_1 < x_2$, then $F_X(x_1) \le F_X(x_2)$.
2.  **Bounds:** The CDF always ranges from 0 to 1. As $x$ approaches negative infinity, $F_X(x)$ approaches 0 ($\lim_{x \to -\infty} F_X(x) = 0$). As $x$ approaches positive infinity, $F_X(x)$ approaches 1 ($\lim_{x \to \infty} F_X(x) = 1$).
3.  **For discrete random variables:** The CDF is a **step function**, meaning it jumps at each possible value of $X$ and remains constant between these values.
4.  **For continuous random variables:** The CDF is a **continuous function** (a smooth curve).

Let's look at the CDF for our two-coin flip example (discrete $X$, number of Heads):
*   $F_X(0) = P(X \le 0) = P(X=0) = 0.25$
*   $F_X(1) = P(X \le 1) = P(X=0) + P(X=1) = 0.25 + 0.50 = 0.75$
*   $F_X(2) = P(X \le 2) = P(X=0) + P(X=1) + P(X=2) = 0.25 + 0.50 + 0.25 = 1.00$
For any value $x$ between 0 and 1 (e.g., $x=0.5$), $F_X(0.5) = P(X \le 0.5) = P(X=0) = 0.25$, because $X$ can only take integer values.

For continuous random variables, the CDF is directly related to the PDF: it is the integral of the PDF up to a given point $x$:
$F_X(x) = \int_{-\infty}^{x} f_X(t) dt$.

The CDF is incredibly useful because it allows us to calculate probabilities for intervals easily, regardless of whether the variable is discrete or continuous:
$P(a < X \le b) = F_X(b) - F_X(a)$. This means the probability of $X$ falling between $a$ and $b$ is the probability that $X$ is less than or equal to $b$, minus the probability that $X$ is less than or equal to $a$.

<!-- IMAGE_SLOT: img-005 -->
![A plot showing a Cumulative Distribution Function (CDF). For a discrete variable, it shows a step function with](../../../../../image/statistics/basic-definition/img-005.png)


## Wrap-Up
In this lesson, we've laid the groundwork for understanding probability by defining its most fundamental terms. We started with the **sample space**, which lists all possible outcomes of an experiment. From there, we learned about **events**, which are specific collections of these outcomes, and how to combine them using set operations like union, intersection, and complement. We then introduced **random variables** to quantify these outcomes, distinguishing between discrete and continuous types based on the values they can take. Finally, we explored how to describe the probabilities associated with these variables using **Probability Mass Functions (PMF)** for discrete variables, **Probability Density Functions (PDF)** for continuous variables, and the unifying **Cumulative Distribution Function (CDF)**. These definitions are crucial for building more complex statistical models and performing data analysis, so take your time to ensure you grasp each concept thoroughly. They are the bedrock upon which all further probabilistic and statistical reasoning is built.