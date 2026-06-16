<a id="concept-fixed-income"></a>
# Fixed Income

## Learning Objectives
By the end of this lesson, you will be able to:
- Define what a bond is and identify its key characteristics and components.
- Understand the major risks associated with investing in bonds.
- Explain the basic principles of bond valuation, including how future payments are discounted.
- Define Yield to Maturity (YTM) and understand its relationship with bond prices.
- Describe duration and convexity as measures of a bond's interest rate sensitivity.
- Grasp the concept of portfolio immunization as a strategy to manage interest rate risk.

## Introduction
Have you ever wondered how governments build new infrastructure or how large companies fund their expansion projects? Often, they do it by borrowing money directly from investors like you, through something called a **[bond](../finance/fixed-income.md#concept-bond)**. Bonds are a fundamental part of the financial world, representing a loan made by an investor to a borrower (typically a corporation or government). Unlike stocks, which represent ownership in a company, bonds represent debt. They are often seen as a more stable investment, but they come with their own set of complexities and risks.

In this lesson, we'll demystify fixed income securities, starting with the basics of what a bond is, how it pays you, and the factors that influence its value. We'll then explore key concepts like yield, [duration](../finance/fixed-income.md#concept-duration), and [convexity](../finance/fixed-income.md#concept-convexity), which are crucial for understanding how bonds behave and how to manage them effectively in an investment portfolio.

## Concept Progression

<a id="concept-bond"></a>
### What is a Bond? The Basics of Lending and Borrowing

At its core, a bond is a formal agreement where a borrower (the **bond issuer**) promises to pay back a lender (the **bondholder**) a specific amount of money (the **principal** or **face value**) on a future date (the **maturity date**), along with regular interest payments (the **coupons**) along the way. Think of it as a structured loan agreement, but instead of borrowing from a bank, the borrower is borrowing from many individual investors.

For example, if a company needs to raise money to expand its operations, instead of issuing new [stock](../finance/equity-market.md#concept-stock), it might issue bonds. Investors buy these bonds, essentially lending money to the company. In return, the company promises to pay interest to the bondholders periodically (e.g., every six months) and return the original amount borrowed when the bond matures.

Bonds are a massive part of the financial landscape, often dwarfing the [stock market](../finance/equity-market.md#concept-equity-market) in total value. Governments and corporations frequently issue bonds to raise funds, making them a cornerstone of global finance. For investors, high-quality government bonds are often considered a form of insurance during market downturns, providing stability to an investment portfolio.

### Understanding Bond Payments: Coupons and Principal

To truly understand bonds, let's break down the key terms that define a bond's payments and structure:

*   **Principal (Face Value or Par Value):** This is the original amount of money the bond issuer borrows and promises to repay at maturity. It's typically $1,000, but can vary. This is the amount you get back at the end of the bond's life.
*   **Coupon Rate:** This is the annual [interest rate](../finance/fixed-income.md#concept-duration) the issuer pays on the bond's face value. It can be a fixed rate (most common) or a floating rate.
*   **Coupon Payment:** This is the actual dollar amount of interest paid to the bondholder. It's usually paid semi-annually, but can be annual or quarterly. For example, a $1,000 bond with a 5% annual coupon rate would pay $50 per year, often split into two $25 payments every six months.
*   **Maturity Date:** This is the specific date when the bond issuer repays the principal to the bondholder. Once this date arrives, the bond ceases to exist.

Let's illustrate with a simple example:
Imagine you buy a bond with a face value of $1,000, a coupon rate of 4% paid annually, and a maturity of 5 years.
*   Each year, you would receive a coupon payment of $1,000 * 0.04 = $40.
*   At the end of the 5th year, you would receive your final $40 coupon payment PLUS the $1,000 principal back.

<!-- IMAGE_SLOT: img-001 -->
![A timeline diagram showing a bond's cash flows. The timeline starts at Year 0 (Bond Purchase) and extends](../../../../../image/finance/fixed-income/img-001.png)


### Why Bond Prices Change: Major Risks

While bonds are often perceived as "safer" than stocks, they are not risk-free. Several factors can cause a bond's price to fluctuate or affect the payments you receive. Understanding these risks is crucial for any bond investor.

1.  **Interest Rate Risk:** This is arguably the most significant risk for bondholders. When general market interest rates go up, the price of existing bonds (which pay a lower, fixed interest rate) tends to go down. Why? Because new bonds being issued will offer higher interest rates, making older bonds less attractive unless their price drops to compensate. Conversely, if market interest rates fall, existing bond prices tend to rise, as their higher fixed coupons become more desirable.
    *   *Example:* You own a bond paying 3% interest. If new bonds are suddenly issued paying 5%, your 3% bond is less desirable. To sell it, you'd have to lower its price significantly to attract buyers who could otherwise get 5% from a new bond.

2.  **Default / Credit Risk:** This is the risk that the bond issuer (the borrower) will fail to make its promised interest or principal payments. This risk is tied directly to the financial health of the issuer. Companies and governments are assigned credit ratings (e.g., by Moody's, S&P, Fitch) to indicate their likelihood of default. Bonds with lower credit ratings (often called "junk bonds" or "high-yield bonds") offer higher interest rates to compensate investors for this increased risk.
    *   *Example:* If a company's financial health deteriorates, its credit rating might be downgraded. This signals a higher risk of default, causing its bond prices to plummet as investors demand a higher return for the increased risk, or simply try to sell.

3.  **Liquidity Risk:** This is the risk that you might not be able to sell your bond quickly at a fair market price. Some bonds, especially those from smaller issuers or with unusual features, might not trade very often. This "thin" market can make it difficult to find a buyer when you want to sell, potentially forcing you to accept a lower price.
    *   *Example:* You own a bond from a small municipal project. If you need to sell it quickly, you might have to accept a lower price than you think it's worth because there aren't many interested buyers at that moment.

### How Bonds are Valued: Present Value of Future Payments

Now that we understand what bonds are and the risks involved, how do we determine their fair price? The value of any financial asset, including a bond, is fundamentally based on the **[present value](../finance/time-value.md#concept-present-value) of its expected future cash flows**. For a bond, these cash flows are the periodic coupon payments and the final principal repayment.

To calculate a bond's price, we discount each future payment back to today using an appropriate **discount rate**. This discount rate reflects the current market interest rates for similar bonds and the bond's specific risks. The sum of these present values gives us the bond's current market price.

Let's revisit our 5-year, $1,000 face value bond with a 4% annual coupon. If the current market discount rate (or the required yield investors demand for this type of bond) is 5%, we would calculate its price as follows:

*   **Year 1 Coupon:** $40 / (1 + 0.05)^1 = $38.10
*   **Year 2 Coupon:** $40 / (1 + 0.05)^2 = $36.28
*   **Year 3 Coupon:** $40 / (1 + 0.05)^3 = $34.55
*   **Year 4 Coupon:** $40 / (1 + 0.05)^4 = $32.90
*   **Year 5 Coupon + Principal:** ($40 + $1,000) / (1 + 0.05)^5 = $814.86

Summing these present values ($38.10 + $36.28 + $34.55 + $32.90 + $814.86) would give you the bond's current market price, which is approximately $956.69.

Notice that if the market discount rate (5%) is higher than the bond's coupon rate (4%), the bond's price will be less than its face value ($1,000). In this case, it trades at a **discount**. Conversely, if the market rate is lower than the coupon rate, it will trade at a **premium** (above par). If they are equal, it trades at **par** (at face value). This relationship is key to understanding bond pricing.

<a id="concept-yield"></a>
### The Concept of Yield: Your Return on Investment

When you invest in a [bond](../finance/fixed-income.md#concept-bond), you're ultimately interested in the return you'll get. This is where **Yield to Maturity (YTM)** comes in. YTM is the [total return](../finance/basic-definition.md#concept-rate-of-return) an investor can expect to receive if they hold the bond until it matures, assuming all coupon payments are reinvested at the same yield.

More formally, the YTM is the annual constant interest rate that makes the [present value](../finance/time-value.md#concept-present-value) of all associated future payments (coupons and principal) equal to the current market value of the bond. It's essentially the "internal rate of return" of the bond, taking into account its current market price, coupon payments, and face value.

*   **Relationship between YTM and Bond Price:** There's an inverse relationship. If a bond's price goes up, its YTM goes down, and vice-versa. This is because a higher price means you're paying more for the same stream of future payments, thus getting a lower effective return.

*   **Credit Spread:** YTM also helps us understand **credit spread**. This is the difference in yields between a private debt instrument (like a corporate bond) and a government security of comparable maturity. A higher credit spread indicates higher perceived default risk for the private issuer, as investors demand extra compensation for taking on that risk.
    *   *Formula:* `Credit Spread = Corporate Bond Yield - Government Bond Yield`
    *   *Example:* If a corporate bond from Company X yields 6% and a comparable government bond yields 3%, the credit spread is 3%. This 3% difference compensates investors for the additional risk of lending to Company X compared to the government.

<a id="concept-duration"></a>
### Measuring Interest Rate Sensitivity: Duration

We've discussed interest rate risk as a major concern for bond investors. But how do we *measure* this sensitivity? This is where **duration** comes in. Duration is a key measure of a bond's price sensitivity to changes in interest rates. It's expressed in years and indicates the approximate percentage change in a bond's price for a 1% (or 100 basis point) change in interest rates.

Intuitively, duration can also be thought of as the weighted average time until a bond's cash flows are received. This helps explain why:
*   Bonds with longer maturities tend to have higher durations (more sensitive to rate changes).
*   Bonds with lower coupon rates tend to have higher durations (because a larger portion of their total return comes from the principal repayment at maturity, which is further in the future).

*   **Why it matters:** Duration is a crucial tool for managing interest rate risk. If you expect interest rates to rise, you might want to hold bonds with shorter durations to minimize potential price declines. If you expect rates to fall, longer-duration bonds would benefit more from the price increase.

<!-- IMAGE_SLOT: img-002 -->
![A graph showing bond price on the y-axis and interest rate (yield) on the x-axis. The curve should](../../../../../image/finance/fixed-income/img-002.png)


<a id="concept-convexity"></a>
### Beyond Duration: Convexity

While duration provides a good linear approximation of how a bond's price will change with interest rates, the actual relationship is not perfectly linear. As shown in the graph above, the bond price-yield curve is actually curved. This non-linear aspect is captured by **convexity**.

*   **What it is:** Convexity measures the curvature of the bond's price-yield relationship. A bond with positive convexity means that its price increases more when interest rates fall than it decreases when interest rates rise by the same amount. In simpler terms, the gains are bigger than the losses for equal changes in interest rates.

*   **Why it's desirable:** Investors generally prefer bonds with higher positive convexity because it offers a favorable asymmetry: you gain more on the upside (when rates fall) and lose less on the downside (when rates rise). Duration is a good first-order approximation, but convexity provides a more accurate picture, especially for larger interest rate changes, making it a valuable refinement for bond analysis.

<a id="concept-immunization"></a>
### Protecting Your Portfolio: Immunization

Given the inherent risks associated with interest rate fluctuations, how can investors protect their portfolios, especially those with specific future financial obligations? One powerful strategy is **immunization**. Portfolio immunization is a technique used to minimize the impact of interest rate changes on the value of a portfolio, particularly for investors who have specific future liabilities (like a pension fund needing to pay retirees or an insurance company needing to pay claims).

The core idea is to match the duration of a portfolio's assets (e.g., bonds) with the duration of its liabilities. If the durations are matched, a change in interest rates will cause the value of the assets and liabilities to change by roughly the same amount and in the same direction, effectively canceling each other out and protecting the net worth of the portfolio.

*   *Example:* A pension fund knows it needs to pay out a certain amount of money in 10 years. By investing in bonds that have a duration of 10 years, the fund can "immunize" itself against interest rate risk. If rates rise, the value of its bond assets might fall, but the present value of its future liabilities would also fall, balancing the impact and ensuring the fund can still meet its obligations.

## Wrap-Up
Fixed income securities, primarily bonds, are essential components of financial markets, serving as a vital mechanism for governments and corporations to raise capital. We've explored their fundamental characteristics, including coupon payments and principal repayment, and delved into the major risks like interest rate, credit, and liquidity risk. Understanding how bonds are valued through the present value of future cash flows, and how their returns are measured by Yield to Maturity, is crucial. Finally, we introduced duration and convexity as sophisticated tools to measure and manage interest rate sensitivity, culminating in the concept of immunization for portfolio protection. These concepts provide a solid foundation for navigating the world of fixed income and making informed investment decisions.