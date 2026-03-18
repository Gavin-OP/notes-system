# Data Collection and Storage

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between structured and unstructured data and identify examples of each.
- Identify common sources from which data scientists collect data.
- Understand the fundamental differences between relational and NoSQL databases.
- Explain the basic principles of how data is stored and retrieved.
- Appreciate the importance of appropriate data collection and storage methods for [data science](../data-science/introduction-to-data-science.md) projects.

## Introduction
Imagine you're a chef, and your goal is to bake a delicious cake. Before you can even think about mixing ingredients or preheating the oven, you need to gather everything: flour, sugar, eggs, milk, and so on. You also need a place to keep these ingredients fresh and organized until you're ready to use them.

In the world of [data science](../data-science/introduction-to-data-science.md), data is our "ingredients." Just like a chef needs to know where to find the best flour and how to store eggs properly, a data scientist needs to understand where data comes from, what forms it takes, and how it's stored. This lesson will introduce you to the fundamental concepts of data collection and storage, equipping you with the foundational knowledge to interact with the raw material of data science. Without good data, properly collected and stored, even the most brilliant analysis won't yield meaningful results.

## Understanding Different Data Types

To effectively work with data, we first need to recognize its various forms. Not all data is created equal. Just as you wouldn't store milk the same way you store flour, you wouldn't treat a spreadsheet of numbers the same way you treat a collection of customer reviews. Understanding the different types of data is the first step in knowing how to collect, store, and ultimately analyze it. We primarily categorize data into two main types: **structured** and **unstructured**.

### Structured Data

Think of structured data as highly organized information that fits neatly into a predefined format. It's like data that lives in a spreadsheet or a well-organized filing cabinet. Each piece of information has a clear place, and its relationship to other pieces of information is well-defined.

**Characteristics of Structured Data:**
*   **Organized:** It typically resides in tables with rows and columns.
*   **Predefined Schema:** There's a clear structure (like column headers) that dictates what kind of data goes where, including data types (e.g., text, numbers, dates). This schema acts like a blueprint for the data.
*   **Easy to Search and Analyze:** Because of its organization, it's straightforward to query and perform calculations on using standard tools like SQL (Structured Query Language).

**Examples:**
*   **Customer records:** A table with columns like `CustomerID`, `Name`, `Email`, `PurchaseDate`, `AmountSpent`.
*   **Financial transactions:** A ledger with `TransactionID`, `Date`, `Type`, `Amount`, `AccountID`.
*   **Sensor readings:** A log of `Timestamp`, `Temperature`, `Humidity`, `SensorID` stored in a tabular format.

Here's a simple example of structured data you might see in a spreadsheet:

| OrderID | CustomerName | Product | Quantity | Price |
| :------ | :----------- | :------ | :------- | :---- |
| 101     | Alice        | Laptop  | 1        | 1200  |
| 102     | Bob          | Mouse   | 2        | 25    |
| 103     | Charlie      | Keyboard| 1        | 75    |

This table clearly shows what each piece of data represents and how it relates to the others, making it easy to understand and query.

### Unstructured Data

In contrast to the neat rows and columns of structured data, **unstructured data** is information that doesn't have a predefined data model or isn't organized in a traditional row-column database format. It's like a pile of notes, photos, or recordings – valuable, but not neatly categorized. This type of data makes up the vast majority of data generated today.

**Characteristics of Unstructured Data:**
*   **No Predefined Schema:** It doesn't fit into neat, rigid tables. Its internal structure, if any, is not enforced by a database schema.
*   **Varied Formats:** Can be text, images, audio, video, emails, social media posts, etc.
*   **Harder to Search and Analyze:** Requires more advanced techniques (like natural language processing for text or computer vision for images) to extract insights, as traditional query languages are less effective.

**Examples:**
*   **Text documents:** Emails, social media posts, customer reviews, articles, books, legal documents.
*   **Media files:** Photos, videos, audio recordings.
*   **Sensor data streams:** Raw, continuous data streams from IoT devices before they are parsed and stored in a structured format.

Imagine a collection of customer reviews for a product:
*   "This laptop is amazing! Super fast and the battery life is incredible. Highly recommend."
*   "The mouse is okay, but it feels a bit cheap. Good for the price, though."
*   "Keyboard arrived broken. Very disappointed with the quality."

Each review is a block of text, unique in length and content. While you can read them, extracting structured information like "overall sentiment" or "common complaints" requires more sophisticated tools than simply querying a table.

[IMAGE_PLACEHOLDER: A diagram illustrating the difference between structured and unstructured data. On the left, a clear, organized table with rows and columns representing structured data (e.g., customer details). On the right, a chaotic collage of various items like a text document, an image, an audio waveform, and a video frame, representing unstructured data. Arrows could point from structured data to "Relational Databases" and from unstructured data to "NoSQL Databases" or "Data Lakes" to hint at storage methods. The pedagogical intent is to visually reinforce the concept of organization vs. disorganization.]

## Where Does Data Come From? Common Data Sources

Now that we understand the different types of data, the next logical question is: where do we get it? Data scientists often act like detectives, sourcing information from various places. Here are some of the most common data sources you'll encounter:

1.  **Internal Databases and Data Warehouses:**
    *   Many organizations collect vast amounts of data about their operations, customers, and products. This data is often stored in internal operational databases (like those powering a website or an inventory system) or consolidated into larger "data warehouses" or "data lakes" designed specifically for analytical purposes.
    *   **Example:** A retail company's database containing all sales transactions, customer loyalty program data, and inventory levels. This is typically highly structured data.

2.  **APIs (Application Programming Interfaces):**
    *   APIs are like standardized doorways that allow different software applications to talk to each other. Many web services and platforms offer APIs that let you programmatically request and receive data in a structured format (often JSON or XML).
    *   **Example:** Using the Twitter API to collect tweets about a specific topic, or the Google Maps API to get geographical data.
    *   A simple Python request to an API might look like this:
        ```python
        import requests

        # This is a hypothetical API endpoint
        response = requests.get("https://api.example.com/products/123")
        product_data = response.json() # Converts the API response into a Python dictionary
        print(product_data)
        ```
        This code snippet demonstrates how easily structured data can be retrieved from an API.

3.  **Web Scraping:**
    *   Sometimes, the data you need is available on public websites but without a convenient API. Web scraping involves writing code to automatically extract information from web pages. It's powerful but requires careful consideration of website terms of service, legal implications, and ethical guidelines.
    *   **Example:** Gathering product reviews from an e-commerce site, or collecting real estate listings from a property portal. This often yields semi-structured or unstructured text data that needs further processing.

4.  **Data Feeds and Streams:**
    *   Data feeds provide a continuous flow of data, often in real-time or near real-time. This is common for financial market data, sensor data from IoT devices, or social media streams.
    *   **Example:** A live feed of stock prices, or a stream of temperature readings from smart home devices. This data can be structured (like stock prices) or unstructured (like raw sensor output).

5.  **Public Datasets:**
    *   Many organizations, governments, and research institutions make datasets publicly available for research and analysis. These can be found on platforms like Kaggle, UCI [Machine Learning](../data-science/introduction-to-machine-learning.md) Repository, or government data portals.
    *   **Example:** Census data, climate records, or datasets of movie ratings. These are often well-curated and structured.

Once you've successfully gathered your data from these diverse sources, the next critical step is to store it effectively so it can be accessed and analyzed whenever needed.

## Data Storage: Where Data Lives

Once you've collected your data, you need a place to store it reliably and efficiently so you can access it later for analysis. Just as you wouldn't store delicate pastries in a dusty cupboard, you need the right storage solution for your data. The two most common paradigms for data storage are **relational databases** and **NoSQL databases**.

### Relational Databases (SQL Databases)

Relational databases are the traditional workhorses of data storage, especially for structured data. They organize data into one or more tables (also called "relations") with a predefined schema. Each table consists of rows and columns, and tables can be linked together using common fields, forming "relationships."

**Key Concepts:**
*   **Tables:** Data is stored in tables, similar to spreadsheets.
*   **Rows (Records/Tuples):** Each row represents a single entry or record (e.g., one customer, one order).
*   **Columns (Fields/Attributes):** Each column represents a specific attribute or piece of information, with a defined data type (e.g., `Name` as text, `Age` as an integer).
*   **Relationships:** Tables are linked using common columns (e.g., a `CustomerID` column in an `Orders` table linking to a `CustomerID` in a `Customers` table). These relationships are crucial for maintaining data integrity and allowing complex queries.
*   **SQL (Structured Query Language):** This is the standard language used to interact with relational databases – to create, read, update, and delete data.

**Analogy:** Think of a relational database as a meticulously organized library. Each book (table) has a specific cataloging system (schema), and you can easily find related books (tables) by looking up shared keywords or authors (relationships). Everything has its place and is connected logically.

**Example:**
Imagine a database for an online store. You might have:
*   A `Customers` table: `CustomerID` (Primary Key), `Name`, `Email`
*   A `Products` table: `ProductID` (Primary Key), `ProductName`, `Price`
*   An `Orders` table: `OrderID` (Primary Key), `CustomerID` (Foreign Key), `OrderDate`
*   An `OrderItems` table: `OrderID` (Foreign Key), `ProductID` (Foreign Key), `Quantity`

The `Orders` table is linked to `Customers` by `CustomerID`, and `OrderItems` is linked to `Orders` by `OrderID` and to `Products` by `ProductID`. This allows you to answer questions like "Which products did Alice buy?" by joining these tables together.

Here's a simple SQL query to retrieve customer names and their order dates:

```sql
SELECT C.Name, O.OrderDate
FROM Customers C
JOIN Orders O ON C.CustomerID = O.CustomerID;
```
This query "joins" the `Customers` table (aliased as `C`) with the `Orders` table (aliased as `O`) using their common `CustomerID` to show which customer placed which order.

**When to use Relational Databases:**
*   When your data is highly structured and fits well into tables.
*   When data integrity, consistency, and atomicity (ACID properties – ensuring transactions are processed reliably) are paramount (e.g., financial transactions, inventory management).
*   When you need complex queries involving relationships between different pieces of data.

[IMAGE_PLACEHOLDER: A diagram showing two or three interconnected tables in a relational database. Each table should have columns and rows. Arrows should clearly indicate how primary keys in one table link to foreign keys in another, illustrating the concept of relationships. For example, a 'Customers' table linked to an 'Orders' table via 'CustomerID'. The pedagogical intent is to visually explain the structure and relationships within a relational database.]

### NoSQL Databases

While relational databases excel with structured data and strict relationships, they can sometimes struggle with very large volumes of unstructured or semi-structured data, or when requiring extreme scalability and flexibility. This is where **NoSQL** (which stands for "Not only SQL") databases come in. They emerged to address these limitations by offering different ways to store and retrieve data, moving away from the traditional table-based relational model.

**Key Characteristics:**
*   **Flexible Schema:** They don't enforce a rigid, predefined schema, allowing you to store data in various formats without strict structural constraints. This is great for rapidly changing data or diverse data types.
*   **Scalability:** Designed to scale horizontally across many servers (sharding), making them suitable for handling massive amounts of data and high traffic with high availability.
*   **Variety of Models:** Instead of a single model, NoSQL databases come in different types, each optimized for specific use cases:
    *   **Document Databases:** Store data in flexible, semi-structured "documents" (often JSON-like). Great for content management, user profiles, catalogs. (e.g., MongoDB, Couchbase)
    *   **Key-Value Stores:** Store data as simple key-value pairs. Very fast for simple lookups and caching. (e.g., Redis, DynamoDB)
    *   **Column-Family Stores:** Store data in columns rather than rows, optimized for analytical queries over large datasets and high write throughput. (e.g., Apache Cassandra, HBase)
    *   **Graph Databases:** Store data as nodes and edges, ideal for highly interconnected data like social networks, recommendation engines, or fraud detection. (e.g., Neo4j, Amazon Neptune)

**Analogy:** If a relational database is a meticulously organized library with a strict cataloging system, a NoSQL database is more like a modern digital archive. You can throw in all sorts of documents, images, and videos, and while there might be some tags or metadata, there's no single, rigid way everything has to be structured. You can add new types of "documents" without needing to redesign the entire archive.

**Example (Document Database):**
Instead of separate tables for customers and orders, a document database might store a customer's entire profile, including their orders, within a single document:

```json
{
  "customerID": "C001",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zip": "12345"
  },
  "orders": [
    {
      "orderID": "O101",
      "orderDate": "2023-01-15",
      "items": [
        {"productID": "P001", "quantity": 1},
        {"productID": "P002", "quantity": 2}
      ]
    },
    {
      "orderID": "O102",
      "orderDate": "2023-03-20",
      "items": [
        {"productID": "P003", "quantity": 1}
      ]
    }
  ]
}
```
This single document contains all relevant information for Alice, including her orders, without needing to join multiple tables. This can simplify application development and improve performance for certain access patterns, especially when retrieving all related information about a single entity.

**When to use NoSQL Databases:**
*   When dealing with large volumes of unstructured or semi-structured data.
*   When your data model is rapidly evolving or highly flexible.
*   When you need extreme horizontal scalability and high performance for specific access patterns (e.g., high read/write throughput).
*   For applications requiring real-time data processing, personalized user experiences, or handling diverse data types.

## Wrap-Up

In this lesson, we've taken our first steps into the crucial world of data collection and storage. We learned that data comes in different forms – structured and unstructured – each requiring different approaches for handling and analysis. We explored common sources where data scientists find their raw materials, from internal databases and APIs to web scraping and public datasets. Finally, we delved into the fundamental ways data is stored, contrasting the rigid, relationship-driven world of relational (SQL) databases with the flexible, scalable nature of NoSQL databases.

Understanding these concepts is vital because the quality and accessibility of your data directly impact the success of any [data science](../data-science/introduction-to-data-science.md) project. Just as a chef needs the right ingredients and proper storage to create a culinary masterpiece, a data scientist needs well-understood, properly collected, and efficiently stored data to derive meaningful insights. In the next lessons, we'll build upon this foundation, moving into how we prepare this collected and stored data for analysis.