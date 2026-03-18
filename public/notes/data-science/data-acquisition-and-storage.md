# Data Acquisition and Storage

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the fundamental process of data acquisition and common methods used to obtain data.
- Identify and differentiate between common data formats like CSV, JSON, and Parquet.
- Understand the core purpose of data storage in a [data science](../data-science/introduction-to-data-science.md) workflow.
- Distinguish between relational (SQL) and non-relational (NoSQL) databases and their appropriate use cases.
- Describe the characteristics and primary [functions](../python/functions.md) of data warehouses and data lakes.

## Introduction
Imagine you're a chef preparing a delicious meal. Before you can even think about chopping vegetables or seasoning meat, you need to gather your ingredients from various sources – the grocery store, a farmer's market, or perhaps even your own garden. Similarly, in the world of [data science](../data-science/introduction-to-data-science.md), before you can analyze data, build models, or create insightful visualizations, you first need to **acquire** that data and then **store** it in a way that makes it accessible and usable.

This lesson will guide you through these essential first steps of any [data science](../data-science/introduction-to-data-science.md) project. We'll explore where data comes from, how it's structured in different formats, and the various ways we can store it efficiently for future use. Getting these foundational steps right is crucial for the success of all your subsequent data endeavors.

## Concept Progression

### Data Acquisition: Gathering Your Ingredients
Data acquisition, often called data collection or data sourcing, is the process of gathering information from various sources. Think of it as finding and collecting all the "ingredients" for your [data science](../data-science/introduction-to-data-science.md) "meal." Data can come from an incredible variety of places, and the method you use often depends on the source and type of data you need.

Here are some common methods for acquiring data:

1.  **Databases:** Many organizations already store their operational data in databases. As a data professional, you might query these databases directly to extract the specific information you need. This is often the most reliable and structured way to get internal company data.
2.  **APIs (Application Programming Interfaces):** Websites and services often provide APIs that allow programs to request and receive data in a structured format. This is a common way to get data from external services. For example, social media platforms, weather services, or financial data providers often have APIs that allow developers to access their data programmatically.
    ```python
    import requests

    # Example: A hypothetical API call to get weather data for a city
    api_key = "YOUR_API_KEY" # In a real scenario, keep this secure!
    city = "London"
    url = f"http://api.weather-service.com/current?city={city}&key={api_key}"

    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        print(f"Current temperature in {city}: {weather_data['main']['temp']}°C")
    else:
        print(f"Error fetching data: {response.status_code}")
    ```
3.  **Web Scraping:** This involves programmatically extracting data from websites that don't offer an API. It's like reading a webpage and copying down specific pieces of information, but done automatically by a script. This method requires careful consideration of a website's terms of service and legal implications, as not all websites permit scraping.
4.  **Files:** Data is frequently shared or stored in various file formats (which we'll discuss next). These could be spreadsheets (like Excel files), plain text files, or specialized data files that you receive from a colleague or download from a public repository.
5.  **Sensors and IoT Devices:** In many modern applications, data is continuously collected from physical sensors (e.g., temperature, pressure, location) or Internet of Things (IoT) devices. This often generates a continuous stream of data that needs to be captured and processed.

[IMAGE_PLACEHOLDER: A flowchart illustrating the data acquisition process. Start with "Various Data Sources" (e.g., Databases, APIs, Web, Sensors). Arrows point to "Data Acquisition Methods" (e.g., Querying, API Calls, Scraping, File Reads). These methods then lead to "Raw Data Collected". The style should be clean and easy to follow, using simple icons for sources.]

### Data Formats: Understanding Your Ingredients' Packaging
Once you've acquired data, it rarely comes as a shapeless blob. Instead, it's usually packaged in a specific format. Understanding these formats is crucial because it dictates how you'll read, process, and ultimately store the data. Let's look at some of the most common ones, moving from simple to more complex or specialized.

#### CSV (Comma-Separated Values)
CSV is one of the simplest and most widely used formats. It's essentially a plain text file where each line represents a row of data, and values within that row are separated by a comma (or another delimiter like a semicolon or tab). The first line often contains the column headers.

**Example:**
```csv
Name,Age,City
Alice,30,New York
Bob,24,London
Charlie,35,Paris
```
**When to use:** CSV is excellent for simple tabular data, making it easy to read by both humans and machines. It's widely supported across almost all data tools and programming languages.
**Limitations:** Since values are stored as plain text strings, the consuming application needs to interpret data types (e.g., "30" as an integer). The format itself doesn't explicitly define or enforce data types, nor can it easily represent complex nested structures.

#### JSON (JavaScript Object Notation)
JSON is a lightweight, human-readable format for storing and exchanging data. It's become incredibly popular, especially for web applications and APIs, because it's easy for both humans to read and machines to parse. It's built on two basic structures:
1.  A collection of name/value pairs (like a Python dictionary or JavaScript object).
2.  An ordered list of values (like a Python list or JavaScript array).

**Example:**
```json
[
  {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "interests": ["reading", "hiking"]
  },
  {
    "name": "Bob",
    "age": 24,
    "city": "London",
    "interests": ["gaming", "cooking"]
  }
]
```
**When to use:** JSON is excellent for hierarchical or semi-structured data, making it ideal for representing objects with nested properties, like user profiles or product catalogs. It's the de facto standard for data exchange over web APIs.
**Limitations:** While human-readable, JSON can be less efficient for very large datasets compared to binary formats, as it takes up more space and can be slower to parse.

#### XML (Extensible Markup Language)
XML is a markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable. It uses tags to define elements, similar to HTML, but with the flexibility to define your own tags.

**Example:**
```xml
<people>
  <person>
    <name>Alice</name>
    <age>30</age>
    <city>New York</city>
  </person>
  <person>
    <name>Bob</name>
    <age>24</age>
    <city>London</city>
  </person>
</people>
```
**When to use:** XML is good for complex, hierarchical data and is often used in enterprise systems, document storage, and configuration files where strict validation and schema definition are important.
**Limitations:** It is generally more verbose than JSON, meaning it takes up more space and can be heavier to parse, which has led to JSON largely replacing it for web-based data exchange.

#### Parquet
Parquet is a columnar storage file format optimized for use with big data processing frameworks like Apache Spark and Hadoop. Unlike row-oriented formats (like CSV or JSON, where all data for a single row is stored together), Parquet stores data column by column.

**Example (conceptual):**
Imagine a table:
| Name    | Age | City      |
|---------|-----|-----------|
| Alice   | 30  | New York  |
| Bob     | 24  | London    |

In a **row-oriented** format (like CSV), it's stored conceptually as: `(Alice, 30, New York), (Bob, 24, London)`
In a **columnar** format (Parquet), it's stored conceptually as: `(Alice, Bob), (30, 24), (New York, London)`

**When to use:** Parquet is ideal for analytical queries on very large datasets where you often only need to access a subset of columns. By storing columns together, it offers excellent compression and significantly faster query performance for analytical workloads, as it only needs to read the relevant columns from disk.
**Limitations:** It is not human-readable and requires specialized libraries to read and write, making it less suitable for simple data exchange or manual inspection.

### Data Storage: Organizing Your Pantry
Once you've acquired data and understand its format, you need a reliable place to keep it safe, organized, and accessible for future analysis. This is where data storage comes in. Just as a chef organizes their pantry with different containers for different ingredients, data professionals choose storage solutions based on the type of data, its volume, how frequently it changes, and how they plan to use it.

[IMAGE_PLACEHOLDER: A simple diagram showing "Raw Data Collected" flowing into a central "Data Storage" box. From the "Data Storage" box, arrows point to "Analysis", "Reporting", and "Machine Learning Models", illustrating its role as a central repository for various data science tasks.]

We can broadly categorize data storage solutions into several types, each with its strengths and weaknesses, designed for different purposes.

### Relational Databases (SQL Databases): The Structured Shelf
Relational databases are the traditional workhorses of data storage, designed for highly structured data. They organize data into tables, which are similar to spreadsheets, with rows and columns. Each table represents a specific entity (e.g., `Customers`, `Orders`, `Products`). The "relational" part comes from the ability to define relationships between these tables using common columns, known as keys.

**Key Characteristics:**
*   **Structured Data:** Data must fit into a predefined schema (columns, data types) before it can be stored. This ensures consistency.
*   **SQL (Structured Query Language):** This powerful language is used to manage and query the data (e.g., `SELECT` to retrieve, `INSERT` to add, `UPDATE` to modify, `DELETE` to remove).
*   **ACID Properties:** Relational databases are designed to ensure data integrity through Atomicity, Consistency, Isolation, and Durability, making them reliable for critical applications.
*   **Examples:** MySQL, PostgreSQL, Oracle, SQL Server.

**Example:**
Imagine two tables: `Customers` and `Orders`.

**Customers Table:**
| CustomerID | Name  | City     |
|------------|-------|----------|
| 1          | Alice | New York |
| 2          | Bob   | London   |

**Orders Table:**
| OrderID | CustomerID | Product   | Amount |
|---------|------------|-----------|--------|
| 101     | 1          | Laptop    | 1200   |
| 102     | 2          | Keyboard  | 75     |
| 103     | 1          | Mouse     | 25     |

You can link an order to a customer using the `CustomerID`. To find out what Alice ordered, you'd "join" these tables using SQL:

```sql
SELECT c.Name, o.Product, o.Amount
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE c.Name = 'Alice';
```
**When to use:** Relational databases are ideal when your data is highly structured, relationships between data are important, and data integrity (accuracy and consistency) is paramount. Common use cases include financial transactions, inventory management, and user authentication systems.

### NoSQL Databases (Non-Relational Databases): The Flexible Bins
NoSQL (often interpreted as "Not only SQL") databases emerged to address the limitations of relational databases, especially when dealing with massive volumes of unstructured or semi-structured data, and the need for extreme scalability and flexibility. They don't adhere to the traditional table-based relational model.

There are several types of NoSQL databases, each optimized for different data models:

1.  **Document Databases:** These store data in flexible, semi-structured documents, often in JSON or BSON (Binary JSON) format. Each document can have a different structure, offering great flexibility.
    *   **Examples:** MongoDB, Couchbase.
    *   **Use Case:** User profiles, content management systems, product catalogs, where data structure might evolve frequently.
    ```json
    // Example document in MongoDB
    {
      "_id": "user123",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "zip": "12345"
      },
      "orders": [
        {"orderId": "A1", "item": "Laptop"},
        {"orderId": "A2", "item": "Mouse"}
      ]
    }
    ```

2.  **Key-Value Stores:** These are the simplest NoSQL databases, storing data as a collection of unique keys and their associated values. They are extremely fast for simple lookups.
    *   **Examples:** Redis, DynamoDB.
    *   **Use Case:** Caching frequently accessed data, session management for web applications, user preferences.

3.  **Column-Family Stores:** These databases store data in columns rather than rows, optimized for wide tables with many columns and efficient retrieval of specific columns across many rows.
    *   **Examples:** Cassandra, HBase.
    *   **Use Case:** Time-series data, large-scale analytics, IoT data, where you might have billions of rows but only query a few columns at a time.

4.  **Graph Databases:** These databases store data in nodes (entities) and edges (relationships between entities), making them highly efficient for representing and querying complex relationships.
    *   **Examples:** Neo4j, Amazon Neptune.
    *   **Use Case:** Social networks (finding friends of friends), recommendation engines, fraud detection (identifying unusual connections).

**When to use:** NoSQL databases are ideal when dealing with large volumes of unstructured or semi-structured data, requiring high scalability (distributing data across many servers), flexible schemas that can change quickly, or specific data models (like graphs) that don't fit well into relational tables.

### Data Warehouses: The Organized Archive
A data warehouse is a large, central repository designed specifically for reporting and data analysis. Unlike operational databases that handle day-to-day transactions (like processing a single order), data warehouses store historical data from multiple operational sources, transformed and structured for optimal querying and analytical performance.

**Key Characteristics:**
*   **Subject-Oriented:** Organized around major business subjects (e.g., customers, products, sales) rather than the processes that generate the data.
*   **Integrated:** Data from various disparate sources is cleaned, transformed, and integrated into a consistent format, resolving inconsistencies.
*   **Time-Variant:** Data is stored with a historical perspective, allowing for trend analysis and comparisons over time.
*   **Non-Volatile:** Once data is in the warehouse, it generally doesn't change; new data is added incrementally, preserving historical records.
*   **Optimized for Reads:** Designed for fast, complex analytical queries (e.g., "What were our sales trends in the last quarter by region?"), not for frequent writes or updates.
*   **Examples:** Amazon Redshift, Google BigQuery, Snowflake.

[IMAGE_PLACEHOLDER: A diagram illustrating the flow of data into a data warehouse. Multiple "Operational Databases" (e.g., CRM, ERP, Sales) feed into an "ETL Process" (Extract, Transform, Load). The ETL process then loads the cleaned, transformed, and integrated data into a central "Data Warehouse". From the data warehouse, arrows point to "Business Intelligence Tools" and "Reporting".]

**When to use:** Data warehouses are essential for business intelligence, historical analysis, strategic decision-making, and when you need a single, reliable source of truth for your organization's analytical needs.

### Data Lakes: The Raw Ingredient Pantry
A data lake is a centralized repository that allows you to store all your structured and unstructured data at any scale. The key differentiator is that you can store your data **as-is**, in its native format, without first having to structure it or define a schema. This offers immense flexibility for future analysis.

**Key Characteristics:**
*   **Raw Data Storage:** Stores data in its native format (raw, unstructured, semi-structured, structured) from various sources.
*   **Schema-on-Read:** The schema (how the data is organized and interpreted) is applied when the data is read and processed by an analytical tool, not when it's stored. This contrasts sharply with data warehouses' "schema-on-write" approach.
*   **Cost-Effective:** Often uses cheap, scalable storage (like cloud object storage such as Amazon S3 or Azure Data Lake Storage).
*   **Flexible:** Supports various data types and is ideal for future, potentially unknown analytical needs, allowing data scientists to experiment with raw data.
*   **Examples:** Amazon S3, Azure Data Lake Storage, Google Cloud Storage.

[IMAGE_PLACEHOLDER: A diagram comparing a data warehouse and a data lake. On one side, "Data Warehouse" shows structured data flowing through ETL into a structured repository, then to BI tools. On the other side, "Data Lake" shows raw, unstructured, semi-structured data flowing directly into a raw repository, with "Schema-on-Read" applied by various analytics tools (e.g., Spark, Machine Learning) that access it. Emphasize the "raw" and "schema-on-read" aspects of the data lake.]

**When to use:** Data lakes are perfect when you need to store vast amounts of diverse data (including raw, unstructured data like social media feeds, sensor data, or clickstreams) for future, potentially unknown analytical purposes, [machine learning](../data-science/introduction-to-machine-learning.md) model training, or advanced analytics that require access to the most granular, untransformed data.

## Wrap-Up
Congratulations! You've taken the crucial first steps into the world of [data science](../data-science/introduction-to-data-science.md) by understanding how data is acquired and stored. We've explored various methods for sourcing data, common file formats that dictate how data is structured, and different storage solutions ranging from highly structured relational databases to flexible data lakes.

Choosing the right acquisition method and storage solution is fundamental to any successful data project. It impacts everything from data quality and accessibility to the performance of your analyses and the types of insights you can derive. In the next lesson, we'll move on to what happens after data is acquired and stored: cleaning and preparing it for analysis, ensuring your "ingredients" are ready for cooking!