---
title: "Markov Chain"
slug: markov-chain
display: true
order: 8
tags:
  - statistics
---

<a id="concept-markov-chain"></a>
# Markov Chain

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what a stochastic process is and how it describes systems changing over time.
- Define the Markov property and understand its "memoryless" characteristic.
- Identify the states and transitions within a Markov chain.
- Construct and interpret a transition probability matrix for a given Markov chain.
- Understand the concept of a stationary distribution as the long-term behavior of a Markov chain.

## Introduction
Have you ever tried to predict the future? While we can't truly see what's coming, many real-world systems exhibit a fascinating pattern: their next state depends *only* on their current state, not on how they got there. This "memoryless" characteristic is the cornerstone of a powerful mathematical tool called a **Markov Chain**.

Imagine predicting tomorrow's weather based solely on today's, modeling [stock](../finance/equity-market.md#concept-stock) prices, understanding customer journeys, or even tracking the movement of molecules. Markov chains provide a robust framework for understanding and forecasting systems that evolve probabilistically over time. In this lesson, we'll start with the fundamental intuition behind these chains and gradually build up to understanding how they work and what profound insights they can offer about the long-term future.

## Concept Progression

### What is a Stochastic Process?
Before we delve into the specifics of Markov chains, let's first grasp the broader concept of a **stochastic process**. Simply put, a stochastic process describes any system that changes over time in a way that involves randomness or chance. Think of it as a sequence of random events.

Consider these everyday examples:
*   **Weather patterns:** The weather changing from sunny to cloudy to rainy day by day.
*   **Stock prices:** The daily fluctuations in the price of a particular stock.
*   **Customer behavior:** A customer's status evolving from "browsing" to "shopping" to "purchased" on an e-commerce site.
*   **Queue length:** The number of people waiting in line at a coffee shop throughout the day.

In each of these scenarios, the system exists in a particular "state" at any given moment, and that state can change randomly. A stochastic process is essentially a collection of random variables, indexed by time, where each variable represents the system's state at a specific point in time. We often denote the state of the process at time $t$ as $X_t$.

For instance, if we're tracking the weather, $X_t$ could take values like "Sunny," "Cloudy," or "Rainy" on day $t$. The sequence of states observed over time, such as (Sunny, Sunny, Cloudy, Rainy, Cloudy, ...), forms a single realization or path of the stochastic process.

<a id="concept-markov-property"></a>
### The Markov Property: The "Memoryless" Rule
Now, let's introduce the special characteristic that transforms a general stochastic process into a **Markov chain**: the **Markov property**. This property dictates that the future state of the system depends *exclusively* on its current state, and is entirely independent of any states it occupied in the past. In essence, the system has no "memory" of its history; only the present matters for predicting the immediate future.

Let's revisit our weather example. If the weather follows the Markov property, then the probability of tomorrow being sunny depends *only* on whether today is sunny, cloudy, or rainy. It doesn't matter if it's been sunny for the past five days, or if there was a storm last week. All that's relevant for tomorrow's forecast is *today's* weather.

More formally, if $X_t$ represents the state at time $t$, the Markov property can be written as:
$P(X_{t+1} = j \mid X_t = i, X_{t-1} = k, \dots, X_0 = m) = P(X_{t+1} = j \mid X_t = i)$

This equation states that the probability of transitioning to state $j$ at the next time step ($t+1$), given all the past states leading up to the current state $i$, is simply equal to the probability of transitioning to state $j$ given *only* the current state $i$. Any information about states $k, \dots, m$ from previous times ($t-1, \dots, 0$) is irrelevant.

This simplification is incredibly powerful because it allows us to model and analyze complex systems without needing to track their entire historical trajectory.

### States and Transitions: Mapping the Possibilities
A Markov chain operates by moving between a finite set of defined **states**. These states represent all the possible conditions or configurations the system can be in. The movement from one state to another is called a **transition**. Each transition is associated with a **transition probability**, which quantifies the likelihood of moving from a specific current state to a specific next state.

Let's consider a simplified model of a student's study habits over hourly intervals, with three possible states:
1.  **Studying (S)**
2.  **Procrastinating (P)**
3.  **Sleeping (L)**

At any given hour, the student is in one of these states. The Markov property implies that the student's state in the next hour depends solely on their current state.

Suppose we've observed the following probabilities:
*   If the student is currently **Studying (S)**:
    *   There's a 70% chance they'll continue **Studying (S)**.
    *   A 20% chance they'll start **Procrastinating (P)**.
    *   A 10% chance they'll go to **Sleeping (L)**.
*   If the student is currently **Procrastinating (P)**:
    *   There's a 30% chance they'll start **Studying (S)**.
    *   A 50% chance they'll continue **Procrastinating (P)**.
    *   A 20% chance they'll go to **Sleeping (L)**.
*   If the student is currently **Sleeping (L)**:
    *   There's a 10% chance they'll start **Studying (S)**.
    *   A 10% chance they'll start **Procrastinating (P)**.
    *   An 80% chance they'll continue **Sleeping (L)**.

We can visually represent these states and transitions using a **state diagram**:

<!-- IMAGE_SLOT: img-001 -->
![A state diagram illustrating a Markov chain with three states: "Studying (S)", "Procrastinating (P)", and "Sleeping (L)". Each](../../../../../image/statistics/markov-chain/img-001.png)


An important observation from the state diagram is that for each state, the probabilities of all possible outgoing transitions (including the transition back to the same state) must sum up to 1. This makes intuitive sense: from any given state, the student *must* transition to one of the available states in the next hour.

<a id="concept-transition-probability-matrix"></a>
### The Transition Probability Matrix: Organizing the Chances
To work with Markov chains mathematically and efficiently, we organize all these transition probabilities into a compact structure called a **transition probability matrix**, commonly denoted by $P$. In this matrix, each row represents the *current* state, and each column represents the *next* state. The entry $p_{ij}$ found in row $i$ and column $j$ is the probability of moving from state $i$ to state $j$.

For our student study habits example, if we order our states as S, P, L, the general structure of the transition matrix would be:

$$
P = \begin{pmatrix}
    p_{SS} & p_{SP} & p_{SL} \\
    p_{PS} & p_{PP} & p_{PL} \\
    p_{LS} & p_{LP} & p_{LL}
\end{pmatrix}
$$

Now, let's plug in our specific probabilities:

$$
P = \begin{pmatrix}
    0.7 & 0.2 & 0.1 \\
    0.3 & 0.5 & 0.2 \\
    0.1 & 0.1 & 0.8
\end{pmatrix}
$$

Here are the key properties of a transition probability matrix:
*   **Square Matrix:** It's always a square matrix, meaning the number of rows equals the number of columns, which is equal to the total number of states in the system.
*   **Non-negative Entries:** All entries $p_{ij}$ must be non-negative, as they represent probabilities.
*   **Row Sums to One:** The sum of probabilities in each row must equal 1. This reflects the certainty that from any given state, the system *must* transition to *some* state (including potentially staying in the same state).

This matrix describes a **time-homogeneous** Markov chain, which means the transition probabilities $p_{ij}$ remain constant over time. The probability of moving from state $i$ to state $j$ is the same whether it's happening from hour 1 to hour 2, or from hour 10 to hour 11. This is a common and simplifying assumption for introductory Markov chain analysis.

### Stepping Through Time: Predicting the Future
With our transition matrix in hand, we can now predict the probabilities of the system being in different states after multiple time steps.

Let $\pi^{(t)}$ be a row vector representing the probability [distribution](../statistics/distribution.md#concept-distribution) of the system across all states at time $t$. For our student example, if $\pi^{(0)} = \begin{pmatrix} 1 & 0 & 0 \end{pmatrix}$, it means the student is initially 100% in the "Studying" state (and 0% in Procrastinating or Sleeping).

To find the probability distribution after one step (e.g., one hour), we multiply the initial distribution vector by the transition matrix:
$\pi^{(1)} = \pi^{(0)} P$

If our student starts by Studying ($\pi^{(0)} = \begin{pmatrix} 1 & 0 & 0 \end{pmatrix}$):
$\pi^{(1)} = \begin{pmatrix} 1 & 0 & 0 \end{pmatrix} \begin{pmatrix}
    0.7 & 0.2 & 0.1 \\
    0.3 & 0.5 & 0.2 \\
    0.1 & 0.1 & 0.8
\end{pmatrix} = \begin{pmatrix} 0.7 & 0.2 & 0.1 \end{pmatrix}$

This result tells us that after one hour, there's a 70% chance the student is Studying, a 20% chance they're Procrastinating, and a 10% chance they're Sleeping. Notice this is simply the first row of the transition matrix, as expected when starting with 100% certainty in the first state.

To find the distribution after two steps, we simply apply the transition matrix again:
$\pi^{(2)} = \pi^{(1)} P = (\pi^{(0)} P) P = \pi^{(0)} P^2$

And generally, after $n$ steps, the probability distribution is:
$\pi^{(n)} = \pi^{(0)} P^n$

Here, $P^n$ (the transition matrix multiplied by itself $n$ times) is known as the $n$-step transition matrix. The entry $(P^n)_{ij}$ represents the probability of transitioning from state $i$ to state $j$ in exactly $n$ steps. This allows us to forecast the system's state probabilities far into the future.

<a id="concept-stationary-distribution"></a>
### Stationary Distribution: The Long-Term Balance
What happens if we let the Markov chain run for a very long time—say, many hours for our student example? Does the probability [distribution](../statistics/distribution.md#concept-distribution) of being in each state eventually settle down and stop changing? For many Markov chains, the answer is a resounding yes! This long-term, stable probability distribution is called the **stationary distribution** (or steady-state distribution).

A stationary distribution, denoted by $\pi$, is a probability distribution over the states such that if the system is currently in this distribution, it will remain in this exact distribution after one more transition. Mathematically, this crucial relationship is expressed as:
$\pi P = \pi$

Here, $\pi$ is a row vector of probabilities (e.g., $\begin{pmatrix} \pi_S & \pi_P & \pi_L \end{pmatrix}$ for our student example), and a fundamental condition is that the sum of its elements must be 1 ($\pi_S + \pi_P + \pi_L = 1$).

This equation intuitively means that when the system reaches its stationary distribution, the "flow" of probability into each state exactly balances the "flow" of probability out of it. The system has achieved a dynamic equilibrium where the overall proportions of time spent in each state remain constant.

Finding the stationary distribution typically involves solving a system of linear equations derived from $\pi P = \pi$ and the sum-to-one condition. For our student example, we would solve:
$\begin{pmatrix} \pi_S & \pi_P & \pi_L \end{pmatrix} \begin{pmatrix}
    0.7 & 0.2 & 0.1 \\
    0.3 & 0.5 & 0.2 \\
    0.1 & 0.1 & 0.8
\end{pmatrix} = \begin{pmatrix} \pi_S & \pi_P & \pi_L \end{pmatrix}$
along with the constraint $\pi_S + \pi_P + \pi_L = 1$.

The existence and uniqueness of a stationary distribution depend on certain properties of the Markov chain (such as being irreducible and aperiodic), which are fascinating topics for more advanced study. However, the core idea is that for many practical applications, a Markov chain will eventually converge to a stable equilibrium in its state probabilities, regardless of its initial starting state. This powerful concept allows us to understand the ultimate, long-term behavior and tendencies of the system.

## Wrap-Up
Markov chains are an indispensable tool for modeling systems that evolve probabilistically and possess the unique "memoryless" property. By clearly defining states, understanding transitions, and organizing these probabilities into a transition probability matrix, we gain the ability to predict both the short-term evolution and the long-term equilibrium of these dynamic systems. The concept of a stationary distribution, in particular, reveals the stable balance that many Markov chains eventually reach, offering profound insights into their ultimate tendencies. As you continue your journey, you'll find Markov chains applied across diverse fields, from finance and biology to computer science and social sciences. In the next lesson, we'll explore specific applications and delve into further properties of these remarkable chains.