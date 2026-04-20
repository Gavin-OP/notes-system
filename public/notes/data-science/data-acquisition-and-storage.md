<a id="concept-data-acquisition-and-storage"></a>
# Data Acquisition and Storage

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the importance of data acquisition and identify common data sources.
- Retrieve data from relational databases using SQL queries in Python.
- Interact with web APIs to programmatically fetch structured data.
- Understand the basics of web scraping for extracting data from websites.
- Store and load data using common file formats like CSV and JSON.

## Introduction
Imagine you're a chef, ready to create a delicious meal. You can't cook without ingredients, right? In [data](../data-science/data-fundamentals-and-types.md#concept-data) science, data is our main ingredient! Before we can analyze, model, or visualize anything, we first need to *get* the data and then *store* it in a way that's easy to work with. This two-part process of gathering information from various places and saving it is called **data acquisition and storage**.

This lesson will introduce you to the fundamental methods of acquiring data, from structured sources like databases and APIs to less structured web content. We'll also explore common file formats used to store this data, ensuring it's ready for your data science recipes.

## Concept Progression

<a id="concept-data-acquisition"></a>
### What is Data Acquisition?
**Data acquisition** is simply the process of collecting or gathering data from different sources. Think of it as finding and collecting all the raw materials you need for your project. Data can come from many places: company databases, public websites, social media feeds, sensors, or even spreadsheets created by hand. The goal is to get this raw data into a format and location where you can start working with it.

Why is this important? Because the quality and relevance of your data directly impact the insights you can gain. If you start with bad ingredients, you'll end up with a bad meal. Similarly, if your data is incomplete, inaccurate, or irrelevant, your analysis will suffer.

[IMAGE_PLACEHOLDER: A flowchart showing "Data Sources" (Databases, APIs, Webpages, Files) flowing into "Data Acquisition" (Python scripts, SQL queries) which then flows into "Raw Data Storage" (CSV, JSON, Database). Arrows indicate the flow of data.]

### Acquiring Data from Databases
Now that we understand *what* data acquisition is, let's dive into *how* we actually do it, starting with one of the most common sources: **databases**. A database is an organized collection of information, designed to store, manage, and retrieve [data](../data-science/data-fundamentals-and-types.md#concept-data) efficiently. Think of it like a highly organized digital filing cabinet where information is structured for quick access.

There are different types of databases, but two you'll encounter frequently are:
*   **Relational Databases:** These store data in tables, much like spreadsheets, with rows and columns. Tables are related to each other through common fields, allowing for complex queries across different datasets. Examples include PostgreSQL, MySQL, and SQLite.
*   **NoSQL Databases:** These are more flexible and don't use the traditional table structure. They're good for handling large amounts of unstructured or semi-[structured data](../data-science/data-fundamentals-and-types.md#concept-structured-data), like documents or key-value pairs. Examples include MongoDB and Cassandra.

For relational databases, we use a special language called **SQL** (Structured Query Language) to communicate with them. SQL allows us to ask the database questions, like "Show me all customers from New York" or "Give me the total sales for last month."

Let's see a simple Python example using `sqlite3` to connect to a local SQLite database and fetch some data. SQLite is a file-based database, meaning the entire database is stored in a single file, making it an excellent choice for learning and small projects without needing a separate server.

First, let's create a dummy database file and add some data:

```python
import sqlite3

# Connect to a database file named 'my_customers.db'.
# If the file doesn't exist, it will be created.
conn = sqlite3.connect('my_customers.db')
cursor = conn.cursor() # A cursor allows us to execute SQL commands

# Create a table named 'customers' if it doesn't already exist.
# It has columns for id (primary key), name, city, and age.
cursor.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY,
        name TEXT,
        city TEXT,
        age INTEGER
    )
''')

# Insert some sample data into the 'customers' table.
cursor.execute("INSERT INTO customers (name, city, age) VALUES ('Alice', 'New York', 30)")
cursor.execute("INSERT INTO customers (name, city, age) VALUES ('Bob', 'London', 24)")
cursor.execute("INSERT INTO customers (name, city, age) VALUES ('Charlie', 'New York', 35)")

# Save (commit) the changes to the database. Without this, changes might not be permanent.
conn.commit()
# Close the connection to the database. It's good practice to do this when done.
conn.close()

print("Database 'my_customers.db' created and populated.")
```

Now, let's acquire data from it using SQL queries within Python:

```python
import sqlite3

# Connect to the existing database file.
conn = sqlite3.connect('my_customers.db')
cursor = conn.cursor()

# Execute a SQL query to select all columns (*) from the 'customers' table.
cursor.execute("SELECT * FROM customers")

# Fetch all the results from the executed query. Each row will be a tuple.
rows = cursor.fetchall()

# Print the retrieved data.
print("All customers:")
for row in rows:
    print(row)

# Execute a SQL query to select only the 'name' and 'age' columns
# for customers where the 'city' is 'New York'.
cursor.execute("SELECT name, age FROM customers WHERE city = 'New York'")
ny_customers = cursor.fetchall()

print("\nCustomers from New York:")
for customer in ny_customers:
    print(customer)

# Close the connection to the database.
conn.close()
```

This example shows how Python, combined with SQL, can be a powerful tool for extracting specific information from databases. SQL is a fundamental skill for any data professional working with structured data.

### Acquiring Data via APIs
While databases are great for internal, structured data, much of the world's public data is accessed differently. This brings us to **APIs** (Application Programming Interfaces). Think of an API as a standardized menu that a restaurant provides. You don't need to know how the kitchen works (the internal logic of the service); you just need to know what you can order from the menu (the available API endpoints) and how to ask for it (the request format).

When you use an API, your program sends a request to a specific web address (an "endpoint"), and the API responds with the data you asked for, usually in a structured format like **JSON** (JavaScript Object Notation). This is a much more reliable and efficient way to get data than trying to guess how a website is structured.

Let's use Python's `requests` library, which is the standard for making HTTP requests, to fetch data from a public API. We'll use the JSONPlaceholder API, which provides fake online REST APIs for testing and prototyping.

```python
import requests # Import the requests library to make HTTP calls

# Define the API endpoint for a specific post (post with ID 1)
api_url = "https://jsonplaceholder.typicode.com/posts/1"

# Send a GET request to the API endpoint.
# A GET request is used to retrieve data.
response = requests.get(api_url)

# Check if the request was successful.
# A status code of 200 typically means "OK".
if response.status_code == 200:
    # Parse the JSON response body into a Python dictionary.
    data = response.json()
    print("Data acquired from API:")
    print(f"User ID: {data['userId']}")
    print(f"Title: {data['title']}")
    print(f"Body: {data['body']}")
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")

# Let's try fetching a list of posts for a specific user.
# We add a query parameter `userId=1` to filter the results.
api_url_list = "https://jsonplaceholder.typicode.com/posts?userId=1"
response_list = requests.get(api_url_list)

if response_list.status_code == 200:
    # This time, the response is a list of dictionaries (posts).
    posts = response_list.json()
    print(f"\nFound {len(posts)} posts for User ID 1:")
    for post in posts[:3]: # Print titles of the first 3 posts
        print(f"- {post['title']}")
else:
    print(f"Failed to retrieve list of posts. Status code: {response_list.status_code}")
```

This example demonstrates how easy it is to get data from an API. APIs are crucial for integrating with services like Twitter, weather data providers, financial data feeds, and many more, making them a cornerstone of modern data acquisition.

<a id="concept-web-scraping"></a>
### Acquiring Data through Web Scraping
What if the data you need isn't neatly organized in a database or offered through a convenient API? Sometimes, the information you're looking for lives directly on a website, embedded within its visual structure. This is where **web scraping** comes in. Web scraping is the process of extracting data from websites by programmatically reading and parsing their HTML content.

It's like manually copying information from a webpage, but doing it automatically with code. While powerful, web scraping comes with important ethical and legal considerations you must always keep in mind:
*   **Respect `robots.txt`:** Websites often have a `robots.txt` file that tells web crawlers which parts of the site they are allowed to access. Always check this file.
*   **Terms of Service:** Many websites' terms of service explicitly prohibit scraping. Violating these can lead to legal action.
*   **Rate Limiting:** Don't overload a server with too many requests in a short period. This can be seen as a denial-of-service attack and get your IP address blocked.
*   **Data Privacy:** Be mindful of privacy laws (like GDPR) when collecting personal data.

For web scraping in Python, popular libraries include `requests` (to download the webpage content) and `BeautifulSoup` (to parse the HTML and extract specific elements).

Let's scrape a simple, static HTML page. For this example, we'll assume a local HTML file named `simple_page.html` exists in the same directory as your Python script with the following content:

```html
<!-- simple_page.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My Simple Page</title>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p class="intro">This is an introductory paragraph.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
    <p>Another paragraph with some <a href="https://example.com">link</a>.</p>
</body>
</html>
```

Now, the Python code to scrape it:

```python
import requests
from bs4 import BeautifulSoup # BeautifulSoup helps parse HTML and XML documents

# For a real website, you'd typically use requests to download the page:
# url = "http://example.com"
# response = requests.get(url)
# html_content = response.text

# For our local file example, we read the HTML content from 'simple_page.html'.
try:
    with open('simple_page.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
except FileNotFoundError:
    print("Please create 'simple_page.html' in the same directory as this script.")
    # Fallback for demonstration if file doesn't exist, so the script can still run.
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>My Simple Page</title>
    </head>
    <body>
        <h1>Welcome to My Page</h1>
        <p class="intro">This is an introductory paragraph.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <p>Another paragraph with some <a href="https://example.com">link</a>.</p>
    </body>
    </html>
    """

# Parse the HTML content using BeautifulSoup.
# 'html.parser' is a built-in Python parser.
soup = BeautifulSoup(html_content, 'html.parser')

# Extract the text content of the <title> tag.
page_title = soup.title.string
print(f"Page Title: {page_title}")

# Extract the text content of the first <h1> tag.
main_heading = soup.h1.string
print(f"Main Heading: {main_heading}")

# Find all <li> tags and extract their text content.
list_items = soup.find_all('li') # find_all returns a list of all matching tags
print("List Items:")
for item in list_items:
    print(f"- {item.string}")

# Find the first <p> tag with the class 'intro' and extract its text.
intro_paragraph = soup.find('p', class_='intro').string # find returns the first matching tag
print(f"Intro Paragraph: {intro_paragraph}")

# Find the first <a> (link) tag.
link = soup.find('a')
if link:
    print(f"Link Text: {link.string}") # Extract the visible text of the link
    print(f"Link URL: {link['href']}") # Extract the 'href' attribute value
```

This example shows how `BeautifulSoup` helps navigate the HTML structure to pull out specific pieces of information. While powerful, remember to always scrape responsibly and ethically.

### Data Storage: Common File Formats
Regardless of how you acquire your data – whether from databases, APIs, or web scraping – the next crucial step is to store it effectively. This ensures it's persistent, shareable, and ready for your analysis. While databases are excellent for persistent storage, data scientists often work with flat files for temporary storage, sharing, or when dealing with smaller datasets. Let's look at two very common and versatile file formats: CSV and JSON.

<a id="concept-csv-file"></a>
#### CSV (Comma Separated Values)
A **CSV file** (Comma Separated Values) is a plain text file where each line represents a row of data, and values within each row are separated by commas. It's one of the simplest and most widely used formats for tabular data.

Think of a CSV file as a basic spreadsheet that can be opened by almost any data analysis tool. It's easy for both humans and computers to read.

**Example `data.csv` content:**
```csv
Name,Age,City
Alice,30,New York
Bob,24,London
Charlie,35,New York
```

Here's how you can write data to a CSV file and then read it back using Python's `pandas` library, which is a staple for data manipulation and analysis.

```python
import pandas as pd # pandas is a powerful library for working with tabular data

# Data to save, represented as a Python dictionary which pandas can easily convert to a DataFrame.
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [30, 24, 35],
    'City': ['New York', 'London', 'New York']
}
df = pd.DataFrame(data) # Create a pandas DataFrame from the dictionary

# Save the DataFrame to a CSV file.
# `index=False` prevents pandas from writing the DataFrame's row index as a column in the CSV.
df.to_csv('my_data.csv', index=False)
print("Data saved to 'my_data.csv'")

# Load data back from the CSV file into a new DataFrame.
loaded_df = pd.read_csv('my_data.csv')
print("\nData loaded from 'my_data.csv':")
print(loaded_df)
```

<a id="concept-json-file"></a>
#### JSON (JavaScript Object Notation)
While CSV is excellent for simple tabular data, many real-world datasets have a more complex, hierarchical structure. For these cases, **JSON** (JavaScript Object Notation) is often the preferred format. JSON is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It's built on two fundamental structures:
1.  A collection of name/value pairs (like Python dictionaries or JavaScript objects).
2.  An ordered list of values (like Python lists or JavaScript arrays).

JSON is particularly popular for web APIs because it can represent nested and complex data structures that CSV cannot easily handle.

**Example `config.json` content:**
```json
{
  "name": "Data Project",
  "version": "1.0",
  "settings": {
    "database": {
      "host": "localhost",
      "port": 5432
    },
    "features": ["analysis", "reporting"]
  },
  "users": [
    {"id": 1, "username": "alice"},
    {"id": 2, "username": "bob"}
  ]
}
```

Here's how to write and read JSON files in Python using the built-in `json` library:

```python
import json # The json library provides methods for working with JSON data

# Data to save, represented as a nested Python dictionary.
config_data = {
    "name": "Data Project",
    "version": "1.0",
    "settings": {
        "database": {
            "host": "localhost",
            "port": 5432
        },
        "features": ["analysis", "reporting"]
    },
    "users": [
        {"id": 1, "username": "alice"},
        {"id": 2, "username": "bob"}
    ]
}

# Save the Python dictionary to a JSON file.
# `json.dump()` serializes the Python object to a JSON formatted stream.
# `indent=4` makes the JSON file human-readable by adding indentation.
with open('my_config.json', 'w') as f:
    json.dump(config_data, f, indent=4)
print("Data saved to 'my_config.json'")

# Load data back from the JSON file into a Python dictionary.
# `json.load()` deserializes the JSON formatted stream to a Python object.
with open('my_config.json', 'r') as f:
    loaded_config = json.load(f)
print("\nData loaded from 'my_config.json':")
print(loaded_config)
print(f"Project Name: {loaded_config['name']}")
# Accessing nested data is similar to accessing nested dictionaries in Python.
print(f"Database Host: {loaded_config['settings']['database']['host']}")
```

Both CSV and JSON are fundamental for handling data in various data science workflows. Choosing between them often depends on the structure of your data and how it needs to be used: CSV for simple tables, JSON for more complex, hierarchical information.

## Wrap-Up
In this lesson, we've explored the crucial first steps in any data science project: acquiring and storing data. You've learned how to pull data from structured sources like databases using SQL, interact with web services through APIs, and even extract information from regular websites using web scraping. We also covered the practical aspects of storing your acquired data in common file formats like CSV for tabular data and JSON for more hierarchical structures.

Mastering these techniques provides you with the "raw ingredients" necessary to begin your data analysis journey. With these skills, you're now equipped to gather data from a wide variety of sources. In the next lessons, we'll move on to cleaning and preparing this data, which is often the most time-consuming but vital step before any meaningful analysis can begin.