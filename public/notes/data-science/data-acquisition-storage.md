# Data Acquisition and Storage

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what data is and distinguish between structured and unstructured data.
- Identify common sources from which data can be acquired.
- Understand the basic concepts of relational databases and how they store structured data.
- Write simple SQL queries to retrieve information from a relational database.
- Describe how APIs and web scraping are used to acquire data from the internet.

## Introduction
Imagine you're a chef preparing a meal. Before you can even think about cooking, you need ingredients. Where do you get them? From a grocery store, a farmer's market, or perhaps your own garden. In the world of data, "ingredients" are data points, and "acquiring" them means collecting them from various sources. Once you have your ingredients, you need a place to store them – a pantry, a fridge, or a spice rack – each organized for different types of items. Similarly, data needs to be stored in an organized way so it can be easily accessed and used later.

This lesson will introduce you to the fundamental concepts of data acquisition (where to get data) and storage (how to keep it organized). These are the very first steps in any data-driven project, laying the groundwork for everything from analysis to [machine learning](../data-science/introduction-to-machine-learning.md). Without good data, properly acquired and stored, even the most advanced techniques are useless.

## Concept Progression

### What is Data and Why Do We Need It? (and Types of Data)
At its core, **data** is simply a collection of facts, figures, or information. It could be anything from the temperature outside, to the number of likes on a social media post, to the text of an email. We need data because it helps us understand the world, make informed decisions, and build intelligent systems.

Data comes in various forms and levels of organization. We generally categorize data into two main types: [structured-data](../data-science/structured-data.md) and [unstructured-data](../data-science/unstructured-data.md).

**Structured Data** is highly organized and follows a predefined format. Think of it like a neatly organized spreadsheet or a database table. Each piece of information has a specific place, and its meaning is clear from its context (e.g., a column header).
*   **Example**: A customer database where each row represents a customer, and columns are clearly labeled for `CustomerID`, `Name`, `Email`, `PurchaseDate`, and `AmountSpent`. You know exactly what kind of information to expect in each column.

**Unstructured Data** is the opposite. It doesn't have a predefined format or organization. It's often text-heavy and can be difficult for computers to process directly without advanced techniques.
*   **Example**: The full text of a book, a collection of customer reviews, images, audio files, or videos. While these contain information, extracting specific facts (like "the sentiment of this review is positive") requires more complex methods than simply reading a column.

Most real-world projects involve a mix of both, but understanding the distinction is crucial for choosing the right tools and methods for acquisition and storage.

[IMAGE_PLACEHOLDER: A diagram illustrating structured vs. unstructured data. On the left, a table with rows and columns (e.g., "Name", "Age", "City") filled with data, representing structured data. On the right, a cloud of text, an image, and an audio waveform icon, representing unstructured data. Arrows point from each type to descriptive labels.]

Now that we understand what data is and its different forms, let's explore where we can find it.

### Where Does Data Come From? (Data Sources)
Before you can analyze data, you need to find it. A [data-source](../data-science/data-source.md) is simply the original location or system from which data is collected. Data can come from an incredible variety of places. Here are some common categories:

1.  **Internal Systems**: Data generated within an organization, such as sales records, customer relationship management (CRM) systems, employee databases, or website analytics.
2.  **External Files**: Data stored in common file formats like CSV (Comma Separated Values), Excel spreadsheets, JSON (JavaScript Object Notation), XML, or plain text files. These can be shared between systems or downloaded from websites.
3.  **Databases**: Specialized systems designed for efficient storage and retrieval of large amounts of structured data. We'll dive deeper into these shortly.
4.  **Web**: The internet is a vast source of data. This can be accessed through official channels like APIs or by extracting information directly from web pages (web scraping).
5.  **Sensors/IoT**: Devices like smart thermostats, fitness trackers, industrial sensors, or weather stations constantly generate streams of data.

The choice of data source often dictates the method of acquisition and the initial format of the data. Among these sources, **databases** are particularly important for storing structured data efficiently, which leads us to our next topic.

### Storing Structured Data: Relational Databases
When dealing with large amounts of [structured-data](../data-science/structured-data.md), simply using spreadsheets or individual files quickly becomes unwieldy. This is where **relational databases** come in.

Think of a relational database like a highly organized library. Instead of just throwing all books into one giant pile, you have different sections (tables) for different categories (e.g., "Fiction," "Non-Fiction," "Biographies"). Within each section, books are organized by specific attributes (author, title, publication year).

In a relational database:
*   Data is organized into one or more **tables** (also called relations).
*   Each table has a specific purpose and stores data about a particular entity (e.g., `Customers`, `Products`, `Orders`).
*   Each table consists of **rows** (also called records or tuples), where each row represents a single instance of the entity (e.g., one specific customer).
*   Each table has **columns** (also called fields or attributes), where each column represents a specific piece of information about the entity (e.g., `customer_name`, `product_price`).
*   Tables can be **related** to each other using common columns (keys), allowing you to link information across different tables (e.g., linking an `Order` to a `Customer`).

This structured approach ensures data consistency, reduces redundancy, and makes it efficient to query and manage data.

[IMAGE_PLACEHOLDER: A simple relational database schema diagram. Show two tables: "Customers" with columns like CustomerID (PK), Name, Email; and "Orders" with columns like OrderID (PK), CustomerID (FK), OrderDate, TotalAmount. An arrow should connect CustomerID in "Customers" to CustomerID in "Orders", indicating a one-to-many relationship.]

But how do we actually *interact* with these organized databases to get the specific information we need? This is where SQL comes in.

### Talking to Databases: SQL
To interact with relational databases – to store new data, update existing data, or retrieve specific information – we use a special language called [sql](../data-science/sql.md) (Structured Query Language). SQL is the standard language for managing and manipulating relational databases.

Even if you're not a database administrator, knowing basic SQL is incredibly valuable for any data professional, as it's the primary way to extract the data you need for analysis.

Let's look at a very common SQL operation: retrieving data. The `SELECT` statement is used for this.

**Example: Retrieving all data from a table**
Imagine you have a table named `Products` with columns like `ProductID`, `ProductName`, `Price`, and `StockQuantity`. To get all the information about all products, you would write:

```sql
SELECT *
FROM Products;
```
*   `SELECT *`: This means "select all columns." The asterisk `*` is a wildcard representing all columns.
*   `FROM Products`: This specifies that you want to retrieve data from the table named `Products`.

**Example: Retrieving specific columns**
If you only wanted the product names and their prices, you could specify the columns:

```sql
SELECT ProductName, Price
FROM Products;
```

SQL allows for much more complex queries, including filtering data (`WHERE`), sorting (`ORDER BY`), and combining data from multiple tables (`JOIN`), but these basic `SELECT` statements are your entry point.

While databases are excellent for storing structured data, much of the world's information resides on the internet, often presented in web pages. To access this data, we turn to other methods, starting with APIs.

### Getting Data from the Web: APIs
The internet is a treasure trove of data, and one of the most common and structured ways to access it is through an [api](../data-science/api.md) (Application Programming Interface).

Think of an API like a menu in a restaurant. You don't go into the kitchen and rummage through ingredients yourself. Instead, you look at the menu, choose what you want (e.g., "get me today's weather forecast," or "give me the latest stock price for Google"), and the waiter (the API) takes your order to the kitchen (the server that holds the data). The kitchen then prepares your dish (the data) and sends it back to you in a predictable format.

APIs are sets of rules and protocols that allow different software applications to communicate with each other. Many websites and services (like Twitter, Google Maps, weather services, financial data providers) offer APIs that allow developers to programmatically request specific pieces of data.

*   **How it works (conceptually)**: Your program sends a request (often an HTTP request, like visiting a webpage) to a specific URL provided by the API. This request might include parameters (like a city name for weather, or a stock ticker). The API server processes your request and sends back the data, usually in a structured format like JSON or XML.

**Example (conceptual Python code using a hypothetical weather API):**

```python
import requests # A common Python library for making HTTP requests

city = "London"
api_key = "YOUR_API_KEY" # You'd get this from the API provider

# Construct the URL for the API request
url = f"https://api.weather-service.com/forecast?city={city}&key={api_key}"

response = requests.get(url) # Send the request
weather_data = response.json() # Parse the JSON response

print(f"Current temperature in {city}: {weather_data['main']['temp']}°C")
```
This example shows how a program can "ask" an API for data and receive a structured response, which can then be used in your application.

However, not all websites offer convenient APIs. For those cases, we might need a more direct approach: web scraping.

### Getting Data from the Web: Web Scraping
Sometimes, a website doesn't offer an API, but you still need data that's displayed on its pages. This is where [web-scraping](../data-science/web-scraping.md) comes in.

Web scraping is the process of extracting data from websites by programmatically reading and parsing their HTML content. It's like manually copying information from a webpage, but done automatically by a script.

*   **Contrast with APIs**: APIs are designed for machines to communicate and provide data in a clean, structured format. Web scraping involves extracting data from human-readable web pages, which often means dealing with inconsistent layouts, advertisements, and other elements not intended for programmatic access.

*   **How it works (conceptually)**: A web scraping script typically:
    1.  Sends an HTTP request to a website to get its HTML content.
    2.  Parses the HTML to find the specific elements (e.g., text within a certain `<div>` or `<span>` tag) that contain the desired data.
    3.  Extracts that data and stores it in a structured format (like a CSV file or a database).

**Example (conceptual Python code using `requests` and `BeautifulSoup` for parsing):**

```python
import requests
from bs4 import BeautifulSoup # A common Python library for parsing HTML

url = "https://example.com/news-headlines"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser') # Parse the HTML content

# Find all headline elements (e.g., assuming they are in <h2> tags)
headlines = soup.find_all('h2', class_='headline-title')

for headline in headlines:
    print(headline.get_text()) # Print the text content of each headline
```

**Important Considerations for Web Scraping:**
*   **Legality and Ethics**: Always check a website's `robots.txt` file and terms of service. Some sites explicitly forbid scraping. Respect their rules and don't overload their servers with too many requests.
*   **Maintenance**: Websites change their layouts frequently. A scraper that works today might break tomorrow if the HTML structure changes.
*   **Complexity**: Scraping can be much more complex than using an API, as it requires navigating HTML, handling pagination, and sometimes even simulating browser behavior.

## Wrap-Up
In this lesson, we've explored the crucial initial steps of any data project: acquiring and storing data. We learned about the fundamental difference between structured and unstructured data, and how this impacts our approach. We then delved into various [data-source](../data-science/data-source.md)s, focusing on [relational-database](../data-science/relational-database.md)s for structured storage and the powerful language of [sql](../data-science/sql.md) for querying them. Finally, we covered two primary methods for gathering data from the vast expanse of the internet: using [api](../data-science/api.md)s for structured access and [web-scraping](../data-science/web-scraping.md) for extracting information directly from web pages.

Understanding these concepts is foundational. With this knowledge, you're now equipped to think about where your data comes from and how to get it into a usable format, setting the stage for the exciting steps of data cleaning, analysis, and modeling that lie ahead.