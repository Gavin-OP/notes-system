<a id="concept-data-acquisition"></a>
# Sourcing and Acquiring Data

## Learning Objectives
By the end of this lesson, you will be able to:
- Identify various common types of data sources and their typical formats.
- Understand how to retrieve structured data from relational databases using SQL.
- Explain the role of APIs in programmatic data acquisition.
- Grasp the basics of web scraping for extracting data from websites.
- Recognize the importance of cloud storage for managing large datasets.
- Understand fundamental data privacy considerations when acquiring data.

## Introduction
Imagine you're a chef, and you want to bake a delicious cake. You can't just start baking; first, you need ingredients! In the world of data science, data is our primary ingredient. Before we can analyze, model, or visualize anything, we need to find and gather the right data. This process is called **data acquisition**, and it's the crucial first step in any data project.

Sourcing and acquiring data involves understanding where data lives, how to access it, and what format it comes in. It's not always as simple as downloading a file; sometimes, you need to interact with complex systems or even build tools to extract the information you need. This lesson will guide you through the most common methods of obtaining data, from structured databases to web-based sources, ensuring you have the ingredients for your data science recipes.

## Concept Progression

Now that we understand the 'why,' let's dive into the 'how' by exploring the most common methods for data acquisition, starting with the fundamental concepts of data sources and formats.

### Understanding Data Sources and Formats

Every piece of data you work with comes from somewhere – that "somewhere" is its **data source**. Data sources can be incredibly diverse, ranging from simple files on your computer to complex systems managed by large organizations. The way data is organized within these sources often dictates its **data format**.

Think of data sources like different types of containers, and data formats like the specific way the contents are arranged inside.

[IMAGE_PLACEHOLDER: A diagram showing various data sources feeding into a central data processing unit. Sources include: a file icon labeled "CSV/JSON Files", a database icon labeled "Relational Databases", a cloud icon labeled "Cloud Storage", and a globe icon labeled "Websites/APIs". Arrows point from each source to the central unit, illustrating data flow. Below each source, common data formats like CSV, JSON, XML, and Parquet are listed.]

Some common data sources include:
*   **Files:** These are often the simplest data sources. You might receive data in a spreadsheet, a text file, or a specialized data file.
*   **Databases:** Organized collections of data, designed for efficient storage and retrieval.
*   **Websites and Web Services:** Data can be found on public websites or accessed through specific interfaces provided by web applications.
*   **Sensors and IoT Devices:** Devices that collect real-time data from the physical world.

When you acquire data, it will almost always come in a specific **data format**. Understanding these formats is key to knowing how to read and process the data.

Let's look at a couple of very common formats:

**1. CSV (Comma Separated Values):**
This is one of the simplest and most widely used formats. It's essentially a plain text file where each line represents a row of data, and values within that row are separated by commas (or sometimes other delimiters like semicolons or tabs).

**Example: A simple CSV file (`students.csv`)**
```csv
Name,Age,Grade
Alice,10,5
Bob,11,6
Charlie,10,5
```

You can easily read CSV files in [Python](../python/introduction-to-python-programming.md#concept-python) using the `pandas` library:

```python
import pandas as pd

# Read a CSV file named 'students.csv' into a pandas DataFrame
df_students = pd.read_csv('students.csv')
print(df_students)
```
This code will output a table-like structure of your student data.

**2. JSON (JavaScript Object Notation):**
JSON is another very popular format, especially for data exchanged over the web. It's human-readable and organized into key-value pairs, similar to Python dictionaries.

**Example: A simple JSON structure (`products.json`)**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 1200
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 25
  }
]
```

Reading JSON in Python is also straightforward:

```python
import json

# Open and read the JSON file
with open('products.json', 'r') as f:
    products_data = json.load(f)

# Access data from the loaded JSON structure
print(products_data[0]['name']) # Output: Laptop
```
This snippet demonstrates how to load JSON data and access specific elements, much like you would with a list of dictionaries in Python.

Other formats you might encounter include **XML** (Extensible Markup Language), which is more verbose than JSON but also uses tags to define data structure, and **Parquet**, a columnar storage format optimized for big data analytics.

### Structured Data from Relational Databases

While files are a great starting point, much of the world's structured data resides in more organized systems: **relational databases**. These databases are designed to store highly structured data in tables, where each table has a predefined set of columns (fields) and each row represents a record. The "relational" part comes from the ability to define relationships between different tables.

Imagine a library: you might have one table for "Books" and another for "Borrowers." These tables can be linked, for example, by a "borrower ID" in the "Books" table, showing who currently has which book.

[IMAGE_PLACEHOLDER: A simple diagram of two relational database tables. Table 1: "Customers" with columns (CustomerID, Name, City). Table 2: "Orders" with columns (OrderID, CustomerID, Product, Quantity). An arrow points from CustomerID in "Orders" to CustomerID in "Customers", indicating a relationship.]

To interact with relational databases, we use a special language called **SQL** (Structured Query Language). SQL allows you to perform various operations, such as:
*   **SELECT:** Retrieve data from tables (your primary tool for acquisition).
*   **INSERT:** Add new data.
*   **UPDATE:** Modify existing data.
*   **DELETE:** Remove data.

For data acquisition, `SELECT` is your primary tool.

**Example: Retrieving data using SQL**

Let's say we have a database with a table called `Employees` that looks like this:

| EmployeeID | Name    | Department | Salary |
|------------|---------|------------|--------|
| 1          | Alice   | Sales      | 60000  |
| 2          | Bob     | Marketing  | 55000  |
| 3          | Charlie | Sales      | 70000  |

To get the names and salaries of all employees from the 'Sales' department, you would write a SQL query like this:

```sql
SELECT Name, Salary
FROM Employees
WHERE Department = 'Sales';
```

In [Python](../python/introduction-to-python-programming.md#concept-python), you can connect to various databases (like SQLite, PostgreSQL, MySQL) using libraries such as `sqlite3` (built-in for SQLite) or `psycopg2` for PostgreSQL.

```python
import sqlite3
import pandas as pd

# Connect to an in-memory SQLite database for demonstration purposes.
# This database exists only for the duration of the script.
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Create the Employees table and insert some sample data
cursor.execute('''
    CREATE TABLE Employees (
        EmployeeID INTEGER PRIMARY KEY,
        Name TEXT,
        Department TEXT,
        Salary INTEGER
    )
''')
cursor.execute("INSERT INTO Employees (Name, Department, Salary) VALUES ('Alice', 'Sales', 60000)")
cursor.execute("INSERT INTO Employees (Name, Department, Salary) VALUES ('Bob', 'Marketing', 55000)")
cursor.execute("INSERT INTO Employees (Name, Department, Salary) VALUES ('Charlie', 'Sales', 70000)")
conn.commit() # Save the changes to the database

# Define the SQL query to select employees from the 'Sales' department
query = "SELECT Name, Salary FROM Employees WHERE Department = 'Sales';"

# Execute the query and load the results directly into a pandas DataFrame
df_sales_employees = pd.read_sql_query(query, conn)

print(df_sales_employees)

conn.close() # Close the database connection
```
This code snippet demonstrates how to connect to a database, execute a SQL query, and load the results directly into a [pandas DataFrame](../data-science/python-libraries.md#concept-pandas-dataframe), which is a common and powerful practice in data science for further analysis.

### Programmatic Access with APIs

But what if the data you need isn't in a database you can directly query, but rather managed by an online service or application? This is where an **API** (Application Programming Interface) comes in.

Think of an API as a menu in a restaurant. You don't go into the kitchen to cook your food; you tell the waiter (the API) what you want from the menu, and they bring it to you. The API defines a set of rules and protocols for how software applications can communicate with each other. For data acquisition, this means you can request specific data from a service, and the API will deliver it in a structured format, often JSON.

[IMAGE_PLACEHOLDER: A diagram illustrating API interaction. On the left, a "Client Application" (e.g., a Python script) sends a "Request" (e.g., "Give me weather data for London") to a central "API Gateway". The API Gateway processes the request and fetches data from a "Data Source" (e.g., a weather database). The API Gateway then sends a "Response" (e.g., JSON data of London weather) back to the Client Application.]

APIs are incredibly common for accessing data from social media platforms, financial services, weather data providers, and many other online services. They offer a controlled and efficient way to get data, often with limits on how much data you can request to prevent abuse.

**Example: Using a public API in Python**

Many public APIs don't require authentication for simple requests. Let's imagine we want to get some public post data from a dummy API like JSONPlaceholder.

```python
import requests # A popular library for making HTTP requests in Python
import json     # For working with JSON data

# The URL for the specific API endpoint we want to access
api_url = "https://jsonplaceholder.typicode.com/posts/1"

# Make a GET request to the API endpoint
response = requests.get(api_url)

# Check if the request was successful (HTTP status code 200 means OK)
if response.status_code == 200:
    # Parse the JSON response body into a Python dictionary
    post_data = response.json()
    print("Post Title:", post_data['title'])
    print("Post Body:", post_data['body'])
else:
    # If the request failed, print the status code
    print(f"Failed to retrieve data. Status code: {response.status_code}")
```
In this example, the `requests` library in Python makes an HTTP GET request to the API endpoint. The API responds with data, which we then parse from JSON into a Python dictionary, allowing us to easily access specific pieces of information like the post title and body.

<a id="concept-web-scraping"></a>
### Extracting Data from Websites: Web Scraping

Sometimes, however, a website might contain valuable data but doesn't offer a convenient API. In such scenarios, we might need to resort to a more direct, albeit often more complex, method: **web scraping**. Web scraping is the process of automatically extracting data from websites by downloading web pages and parsing their HTML content to find the desired information.

It's like reading a book and manually copying down specific sentences or facts you need, but doing it with a program that can read hundreds or thousands of pages much faster.

[IMAGE_PLACEHOLDER: A diagram showing the web scraping process. On the left, a "Web Scraper" (represented by a Python script icon) sends an HTTP request to a "Website Server" (represented by a server rack icon). The server sends back an "HTML Page" (represented by a document icon with HTML tags). The Web Scraper then "Parses HTML" (magnifying glass over HTML) to "Extract Data" (data table icon), which is then stored in a "Database/File".]

Common tools for web scraping in Python include:
*   **`requests`:** For making [HTTP](../python/python-for-web-development.md#concept-http) requests to download web page content.
*   **`BeautifulSoup`:** For parsing HTML and XML documents, making it easy to navigate and search the parse tree.
*   **`Scrapy`:** A more powerful and comprehensive framework for large-scale web scraping projects.

**Important Considerations for Web Scraping:**
*   **Legality and Ethics:** Always check a website's `robots.txt` file (e.g., `www.example.com/robots.txt`) and Terms of Service. Some websites explicitly forbid scraping. Respect intellectual property and do not overload servers with too many requests.
*   **Website Structure Changes:** Websites can change their layout, which can break your scraping code, requiring frequent maintenance.
*   **Rate Limiting:** Websites might block your IP address if you make too many requests too quickly. Implement delays between requests to avoid this.

**Example: Simple Web Scraping with `requests` and `BeautifulSoup`**

Let's say we want to get the title of a webpage and the text of its first quote from a practice scraping site.

```python
import requests
from bs4 import BeautifulSoup # The main library for parsing HTML

# The URL of the webpage to scrape
url = "http://quotes.toscrape.com/" # A website specifically designed for scraping practice

# Send a GET request to the URL to fetch the page content
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content of the page using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the title tag and extract its text
    page_title = soup.title.string
    print("Page Title:", page_title)

    # Find the first <span> tag with the class 'text' and extract its text
    first_quote = soup.find('span', class_='text').text
    print("First Quote:", first_quote)
else:
    print(f"Failed to retrieve webpage. Status code: {response.status_code}")
```
This example shows how to fetch a webpage and then use `BeautifulSoup` to locate specific elements (like the page title or a quote) within its HTML structure by searching for tags and their attributes.

### Storing Data in the Cloud

Once you've successfully acquired your data, whether from files, databases, APIs, or web scraping, the next crucial step is to store it effectively. For modern data projects, especially those dealing with large volumes, **cloud data storage** offers a powerful solution. Cloud storage refers to storing digital data in logical pools, which are physical storage environments managed by a cloud provider (like Amazon Web Services, Google Cloud, or Microsoft Azure).

[IMAGE_PLACEHOLDER: A diagram showing a large cloud icon labeled "Cloud Data Storage" at the center. Arrows point from various sources (e.g., "Local Computer", "On-Premise Server", "Mobile Device") to the cloud, indicating data upload. Arrows also point from the cloud to various destinations (e.g., "Analytics Platform", "Other Applications", "User Devices"), indicating data access and download. Icons for AWS S3 and Google Cloud Storage are subtly placed within the cloud.]

Benefits of cloud data storage include:
*   **Scalability:** Easily increase or decrease storage capacity as your data needs change, without needing to buy new hardware.
*   **Accessibility:** Access your data from anywhere with an internet connection, facilitating collaboration.
*   **Durability and Reliability:** Cloud providers offer high levels of data redundancy and backup, protecting against data loss.
*   **Cost-Effectiveness:** Pay only for the storage you use, avoiding large upfront hardware investments and maintenance costs.

Popular cloud storage services include:
*   **AWS S3 (Amazon Simple Storage Service):** A highly scalable object storage service, often called "storage for the internet."
*   **Google Cloud Storage:** Google's equivalent object storage service, deeply integrated with other Google Cloud products.
*   **Azure Blob Storage:** Microsoft's object storage solution, part of the Azure ecosystem.

These services often support various data formats, including the CSV and JSON we discussed, as well as optimized formats like **Parquet** and **ORC** which are designed for efficient analytical queries on large datasets. Storing data in the cloud is a foundational step for building scalable data pipelines and [machine learning](../python/python-for-data-science-core-libraries.md#concept-machine-learning) applications.

<a id="concept-data-privacy"></a>
### Ethical and Legal Considerations: Data Privacy

As we gather and store more data, it's paramount to remember that data often represents individuals. This brings us to the critical ethical and legal considerations of **data privacy**. Data privacy refers to the protection of personal information and ensuring that individuals have control over how their data is collected, stored, and used.

Ignoring data privacy can lead to severe legal penalties, damage to reputation, and erosion of public trust.

Key aspects of data privacy include:
*   **Consent:** Obtaining explicit permission from individuals before collecting their personal data, especially sensitive information.
*   **Transparency:** Being clear about what data is collected, why it's collected, and how it will be used.
*   **Data Minimization:** Only collecting the data that is absolutely necessary for a specific purpose, avoiding unnecessary data hoarding.
*   **Security:** Implementing robust measures to protect data from unauthorized access, breaches, and misuse.
*   **Right to be Forgotten:** Allowing individuals to request that their data be deleted or anonymized.

Major regulations like **GDPR** (General Data Protection Regulation) in Europe and **CCPA** (California Consumer Privacy Act) in the US set strict rules for handling personal data, with significant fines for non-compliance.

One common technique to protect privacy while still using data for analysis is **data anonymization**. This involves removing or encrypting personally identifiable information (PII) so that individuals cannot be identified from the data. For example, replacing names with unique IDs, blurring faces in images, or aggregating data so individual responses are not visible.

Always ask yourself these critical questions when acquiring data:
*   Do I have the legal and ethical right to collect this data?
*   Is the data sensitive, and does it contain personally identifiable information?
*   How will I protect it from unauthorized access or misuse?
*   What are the potential risks if this data is exposed or used improperly?

Responsible data acquisition means not just getting the data, but getting it *right* and handling it *responsibly*.

## Wrap-Up

Congratulations! You've taken your first steps into the exciting world of data acquisition. We've covered the essential methods for sourcing data, from understanding various file formats and querying structured databases with SQL, to programmatically interacting with APIs and carefully scraping websites. We also explored the benefits of cloud storage for managing your data and, crucially, the ethical and legal responsibilities surrounding data privacy.

Acquiring data is often the most challenging part of a data science project, but mastering these techniques will equip you with the foundational skills to gather the raw materials for any analysis. In the next lessons, we'll move on to cleaning and preparing this newly acquired data, transforming it from raw ingredients into something ready for insightful exploration.