<a id="concept-time-series"></a>
# Time Series

## Learning Objectives
- Define what a time series is and identify common examples in various fields.
- Understand the fundamental difference between time series data and independent data.
- Explain the concept of stationarity and why it is crucial for time series analysis.
- Describe autocorrelation as a measure of dependence within a time series.
- Gain an intuitive understanding of how time series models are used for forecasting.

## Introduction
Imagine tracking the daily temperature in your city, the [stock](../finance/equity-market.md#concept-stock) price of your favorite company, or the number of customers visiting a store each hour. What do these all have in common? They are sequences of [data](../data-science/data-fundamentals-and-types.md#concept-data) points collected [over time](../statistics/time-series.md#concept-stationarity), in a specific order. This type of data is called a **time series**.

Unlike data where each observation is independent (like a random sample of people's heights or survey responses), time series data has a built-in structure: the past often influences the future. This temporal dependence makes time series analysis a unique and powerful field, allowing us to understand patterns, predict future values, and make informed decisions.

In this lesson, we'll explore the core concepts that make time series special and lay the groundwork for understanding how we can analyze and forecast them. By the end, you'll grasp the fundamental ideas that underpin time series analysis, preparing you for more advanced modeling techniques.

## Concept Progression

### What is a Time Series?
At its core, a time series is simply a collection of observations recorded at successive points in time. Each observation is associated with a specific timestamp, and crucially, the *order* of these observations matters. We often denote a time series as $X_t$, where $X$ represents the variable being measured, and $t$ represents the time index.

Think of it like a story unfolding over time. Each data point is a new chapter, and the sequence of these chapters is critical to understanding the narrative. If you shuffle the chapters, the story makes no sense. Similarly, if you shuffle time series data, you lose its inherent meaning.

**Example:**
Consider the daily closing price of a particular stock over a month.
- Day 1: $150.25
- Day 2: $151.10
- Day 3: $149.80
- ...
- Day 30: $155.50

Here, the stock price is $X$, and the day number is $t$. If we plot these values, we get a visual representation of the time series, showing its evolution over time.

<!-- IMAGE_SLOT: img-001 -->
![A line plot showing a time series. The x-axis is labeled 'Time (e.g., Day)', and the y-axis is](../../../../../image/statistics/time-series/img-001.png)


Time series [data](../data-science/data-fundamentals-and-types.md#concept-data) is ubiquitous and can be found in many fields:
-   **Economics:** GDP growth, inflation rates, unemployment figures.
-   **Finance:** [Stock](../finance/equity-market.md#concept-stock) prices, exchange rates, trading volumes.
-   **Meteorology:** Temperature, rainfall, wind speed.
-   **Healthcare:** Patient heart rates, disease incidence [over time](../statistics/time-series.md#concept-stationarity).
-   **Retail:** Monthly sales, website traffic, inventory levels.

The key characteristic that unites all these examples is that the order of observations matters significantly, as it often reveals underlying processes and relationships.

### Why Time Matters: The Role of Dependence
The most distinguishing feature of time series data is that observations are typically **dependent** on previous observations. This means that the value at time $t$ is often related to values at $t-1$, $t-2$, and so on. This is a fundamental departure from many statistical methods that assume observations are independent and identically distributed (i.i.d.), where each data point provides entirely new information unrelated to the others.

Imagine trying to predict tomorrow's temperature. You wouldn't just guess randomly; you'd likely consider today's temperature, yesterday's, and perhaps the general trend for the season. This is because temperature exhibits dependence over time – today's weather is a strong predictor of tomorrow's.

Some [stochastic processes](../statistics/simulation.md#concept-simulation), like a **Markov process**, exhibit a specific, simplified type of dependence. In a Markov process, the future state depends *only* on the current state, and is conditionally independent of past states given the current state. This is often referred to as the "memoryless" property. For example, if you know the current weather (sunny), predicting tomorrow's weather might only require knowing it's sunny today, not whether it was rainy two days ago. While this property simplifies modeling, many real-world time series have a longer memory, where values from several periods ago can still influence the present. Understanding this dependence, whether short-term or long-term, is crucial because it dictates how we analyze and model the data. We can't simply treat each data point as an isolated event; we must account for its relationship with the past.

<a id="concept-stationarity"></a>
### Stationarity: A Stable Foundation
To effectively model the dependence within a [time series](../statistics/time-series.md#concept-time-series), we often look for a particular characteristic called **stationarity**. Intuitively, a stationary time series is one whose statistical properties – like its mean, variance, and the way it correlates with its past values – do not change over time. It means that if you take any segment of the series, it should look statistically similar to any other segment of the same length. More formally, we often refer to *weak-sense stationarity*, where the mean, variance, and autocovariance (which determines [autocorrelation](../statistics/time-series.md#concept-autocorrelation)) are constant over time.

**Why is stationarity important?**
Imagine trying to predict the future behavior of a system that is constantly changing its fundamental characteristics. It would be incredibly difficult! Stationarity provides a stable basis for forecasting. If a series is stationary, we can assume that the patterns and relationships observed in the past will continue into the future. This allows us to build models based on historical data that remain valid for future predictions. Without stationarity, any patterns we identify might just be temporary, making our forecasts unreliable.

**Example:**
-   **Stationary Series:** A time series representing the daily *returns* (percentage change) of a highly diversified stock portfolio might be stationary. Its average return and volatility might remain relatively constant over long periods, fluctuating around a stable mean.
-   **Non-Stationary Series:** A time series representing the absolute *price* of a rapidly growing tech company stock would likely be non-stationary. It would have a clear upward trend (mean changes over time) and possibly increasing volatility (variance changes over time) as the company grows larger.

<!-- IMAGE_SLOT: img-002 -->
![Two line plots arranged vertically. The top plot shows a stationary time series: a horizontal line representing the](../../../../../image/statistics/time-series/img-002.png)


Common types of non-stationarity include:
-   **Trend:** A long-term increase or decrease in the mean of the series (e.g., population growth over decades).
-   **Seasonality:** Regular, predictable patterns that repeat over a fixed period (e.g., higher retail sales during holidays each year).
-   **Changing Variance:** The spread of the data points changes over time (also known as heteroscedasticity), meaning the fluctuations become larger or smaller.

Many techniques exist to transform non-stationary series into stationary ones, most commonly involving **differencing** (calculating the difference between consecutive observations to remove trends or seasonality).

<a id="concept-autocorrelation"></a>
### Autocorrelation: Measuring the Past's Influence
Once we understand the concept of dependence and the stability offered by stationarity, we need a way to quantify how much a time series is related to its own past values. This is where **autocorrelation** comes in. Autocorrelation measures the [correlation](../statistics/basic-statistics.md#concept-correlation) of a time series with a lagged (shifted) version of itself. In simpler terms, it tells us how much a data point at time $t$ is related to a data point at time $t-k$ (where $k$ is the "lag" or number of periods in the past).

-   **Lag 1 Autocorrelation:** Measures the correlation between $X_t$ and $X_{t-1}$ (today's value vs. yesterday's).
-   **Lag 2 Autocorrelation:** Measures the correlation between $X_t$ and $X_{t-2}$ (today's value vs. two days ago).
-   And so on.

The **Autocorrelation Function (ACF)** is a plot that displays the autocorrelation coefficients for various lags. It helps us understand the "memory" of the series. A high autocorrelation at a certain lag suggests a strong relationship between observations separated by that many periods. For example, a slow decay in the ACF often indicates a trend, while significant spikes at specific lags can point to seasonality.

The **Partial Autocorrelation Function (PACF)** is similar but measures the correlation between $X_t$ and $X_{t-k}$ *after removing the influence of the intermediate lags* ($X_{t-1}, X_{t-2}, \dots, X_{t-k+1}$). This helps pinpoint the *direct* relationship between $X_t$ and $X_{t-k}$, isolating the unique contribution of that specific lag, without it being mediated by closer past values.

**Example:**
If we look at daily temperature data, we'd expect a very high positive autocorrelation at lag 1 (today's temperature is highly correlated with yesterday's). We might also see some autocorrelation at lag 7 (weekly patterns, as temperature on a Monday might be correlated with the temperature on the previous Monday). The ACF would likely show a slow decay, while the PACF might show a strong spike at lag 1 and then quickly drop, indicating that most of the "memory" is captured by the immediate previous day.

<!-- IMAGE_SLOT: img-003 -->
![Two plots side-by-side. The left plot is an Autocorrelation Function (ACF) plot, showing bars extending from 0 for](../../../../../image/statistics/time-series/img-003.png)


ACF and PACF plots are powerful diagnostic tools for identifying patterns like trends, seasonality, and for selecting appropriate models for forecasting.

### Forecasting: Predicting the Future
With an understanding of dependence, stationarity, and how to measure past influence, we can now turn our attention to the ultimate goal for many time series analyses: **forecasting**. This involves using historical data to predict future values of the series, which is invaluable for planning, resource allocation, and strategic decision-making across various domains.

One of the most widely used and foundational models for time series forecasting is the **ARIMA** (AutoRegressive Integrated Moving Average) model. Let's break down its components intuitively:

-   **AR (AutoRegressive):** This part of the model suggests that the current value of the series, $X_t$, can be predicted using a linear combination of its *past values*. It's like saying, "Today's stock price is a weighted average of yesterday's, the day before's, and so on." The 'p' parameter in ARIMA(p,d,q) denotes the order of the AR part, indicating how many past observations are used in the prediction.
-   **I (Integrated):** This component deals with non-stationarity. If a time series is not stationary (e.g., it has a trend or seasonality), we can often make it stationary by taking the *difference* between consecutive observations. The "Integrated" part refers to this differencing process. The 'd' parameter in ARIMA(p,d,q) denotes the order of differencing, indicating how many times the series needs to be differenced to become stationary.
-   **MA (Moving Average):** This part of the model suggests that the current value of the series can be predicted using a linear combination of past *forecast errors* (also known as white noise or random shocks). It's like saying, "If we consistently underestimated sales last month, we should adjust our forecast upwards for this month, based on those past errors." The 'q' parameter in ARIMA(p,d,q) denotes the order of the MA part, indicating how many past forecast errors are used in the prediction.

By combining these three components, ARIMA models can capture a wide range of time series patterns, including trends, seasonality (with extensions like SARIMA), and various forms of dependence. While the underlying mathematics can get complex, the intuition is about intelligently using the series' own past behavior and past prediction mistakes to make future predictions.

**Example:**
A retail company might use an ARIMA model to forecast next quarter's sales based on several years of historical sales data. The 'I' component would handle any overall growth trend, the 'AR' component would capture how sales in one month relate to previous months, and the 'MA' component would correct for past forecasting inaccuracies. This forecast helps them manage inventory, staffing, and marketing campaigns more effectively.

## Wrap-Up
In this lesson, we've introduced the fascinating world of time series. We learned that time series data is unique because observations are ordered in time and often dependent on past values. We explored the critical concept of stationarity, which provides a stable foundation for analysis, and understood how autocorrelation helps us measure the influence of the past. Finally, we gained an intuitive grasp of forecasting and the components of the powerful ARIMA model. With these foundational concepts, you're now ready to delve deeper into the techniques used to analyze and predict the future behavior of time-dependent data.