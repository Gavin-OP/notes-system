<a id="concept-data-acquisition-and-storage"></a>
# Data Acquisition and Storage

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the importance of data acquisition and storage in the data science workflow.
- Identify common sources for acquiring data, including databases, APIs, and web scraping.
- Understand the basic principles of relational databases and use simple SQL queries.
- Interact with web APIs to retrieve data using Python.
- Perform basic web scraping to extract information from web pages.
- Store and retrieve data using common file formats like CSV and JSON.

## Introduction
Imagine you're a chef, and you want to bake a delicious cake. Before you can even think about mixing ingredients or preheating the oven, you need to gather all your ingredients and make sure they're properly stored. [Data](../data-science/data-fundamentals-and-types.md#concept-data) science is very similar! Before you can analyze data, build models, or create stunning visualizations, you first need to **acquire** that data and then **store** it in a way that makes it accessible and usable.

This lesson is your guide to the foundational steps of any data project: finding the data you need and saving it effectively. We'll explore various methods to get data from different places and look at the popular ways to keep that data organized for future use.

## The Journey Begins: Acquiring Your Data

<a id="concept-data-acquisition"></a>
### Data Acquisition: The First Step
**Data acquisition**, often called data collection, is the process of gathering information from various sources. It's the very first stage in the data science pipeline, as without data, there's nothing to analyze. The quality and relevance of the data you acquire directly impact the insights you can gain. Think of it as filling your pantry before you start cooking; if you don't have the right ingredients, or if they're stale, your final dish won't be good.

Data can come from countless places: internal company records, public datasets, social media feeds, sensors, and more. The method you choose to acquire data depends heavily on where the data resides and how it's made available.

<!-- IMAGE_SLOT: img-001 -->
![A flowchart showing the data science pipeline: "Data Acquisition" (highlighted) -> "Data Cleaning" -> "Data Analysis" -> "Modeling"](../../../../../image/data_science/data-acquisition-and-storage/img-001.png)


### Databases: Organized Data Repositories
One of the most common and organized places to find data is in a **database**. A database is essentially an organized collection of information, or data, structured in such a way that it can be easily accessed, managed, and updated. Databases are the backbone of almost every application and website you use daily, from online stores to banking systems.

<a id="concept-sql"></a>
#### Relational Databases and SQL
The most prevalent type of database is the **relational database**. In a relational database, [data](../data-science/data-fundamentals-and-types.md#concept-data) is organized into one or more tables (also called relations), with each table consisting of rows and columns. Each row represents a unique record, and each column represents a specific attribute of that record. These tables can be "related" to each other through common columns, allowing for complex [data structures](../python/python-data-structures.md#concept-python-data-structures).

To interact with relational databases, we use a special language called **SQL** (Structured Query Language). SQL allows you to perform various operations, such as:
-   **Querying data:** Retrieving specific information.
-   **Inserting data:** Adding new records.
-   **Updating data:** Modifying existing records.
-   **Deleting data:** Removing records.

Let's look at a simple example. Imagine a database for an online bookstore. It might have a `Books` table and an `Authors` table.

<!-- IMAGE_SLOT: img-002 -->
![A diagram illustrating a simple relational database schema. On the left, a table named 'Authors' with columns: 'author_id'](../../../../../image/data_science/data-acquisition-and-storage/img-002.png)


To get the titles of all books written by 'Jane Doe', you might use a SQL query like this:

```sql
SELECT Books.title
FROM Books
JOIN Authors ON Books.author_id = Authors.author_id
WHERE Authors.first_name = 'Jane' AND Authors.last_name = 'Doe';
```

In Python, you can connect to databases using libraries like `sqlite3` (for SQLite databases) or `psycopg2` (for PostgreSQL). Here's how you might query a local SQLite database:

```python
import sqlite3

# Connect to a database file named 'bookstore.db' (it will be created if it doesn't exist)
conn = sqlite3.connect('bookstore.db')
cursor = conn.cursor() # A cursor allows you to execute SQL commands

# Create the Authors table if it doesn't already exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Authors (
        author_id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT
    )
''')

# Create the Books table if it doesn't already exist, with a foreign key linking to Authors
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Books (
        book_id INTEGER PRIMARY KEY,
        title TEXT,
        publication_year INTEGER,
        author_id INTEGER,
        FOREIGN KEY (author_id) REFERENCES Authors(author_id)
    )
''')

# Insert some sample data into the Authors table.
# 'INSERT OR IGNORE' prevents errors if you run the script multiple times.
cursor.execute("INSERT OR IGNORE INTO Authors (author_id, first_name, last_name) VALUES (1, 'Jane', 'Doe')")
cursor.execute("INSERT OR IGNORE INTO Authors (author_id, first_name, last_name) VALUES (2, 'John', 'Smith')")

# Insert some sample data into the Books table
cursor.execute("INSERT OR IGNORE INTO Books (book_id, title, publication_year, author_id) VALUES (101, 'The Data Journey', 2020, 1)")
cursor.execute("INSERT OR IGNORE INTO Books (book_id, title, publication_year, author_id) VALUES (102, 'Python for Beginners', 2019, 2)")
cursor.execute("INSERT OR IGNORE INTO Books (book_id, title, publication_year, author_id) VALUES (103, 'Advanced SQL', 2021, 1)")

# Commit the changes to the database
conn.commit()

# Now, let's query for books written by 'Jane Doe'
cursor.execute('''
    SELECT Books.title
    FROM Books
    JOIN Authors ON Books.author_id = Authors.author_id
    WHERE Authors.first_name = 'Jane' AND Authors.last_name = 'Doe'
''')

# Fetch all the results from the query
jane_doe_books = cursor.fetchall()
print("Books by Jane Doe:", [book[0] for book in jane_doe_books])

# Close the database connection when done
conn.close()
```

#### NoSQL Databases (Brief Mention)
While relational databases are excellent for [structured data](../data-science/data-fundamentals-and-types.md#concept-structured-data), **NoSQL databases** (like MongoDB or Cassandra) are designed for more flexible, unstructured, or semi-structured data. They don't use tables, rows, and columns in the same way, offering different ways to store and retrieve information, often at a very large scale. For this introductory lesson, we'll focus on the more common relational approach.

### APIs: Programmatic Data Access
Moving beyond structured databases, many online services and platforms offer their data through an **API** (Application Programming Interface). Think of an API as a waiter in a restaurant. You (the client, perhaps your Python script) tell the waiter (the API) what you want (e.g., "give me today's specials"), and the waiter goes to the kitchen (the server/database), gets the information, and brings it back to you. You don't need to know how the kitchen works, just how to communicate with the waiter.

APIs provide a structured and controlled way to access data, ensuring that you only get the information you're allowed to see and in a consistent format (often JSON or XML). This is much more reliable and efficient than trying to guess how a website's data is organized.

<!-- IMAGE_SLOT: img-003 -->
![A diagram showing a client (e.g., a Python script) making an API request to a server. The request](../../../../../image/data_science/data-acquisition-and-storage/img-003.png)


In Python, the `requests` library is the standard way to make HTTP requests to APIs.

```python
import requests

# A public API endpoint for fetching a random user
api_url = "https://randomuser.me/api/"

try:
    # Make a GET request to the API
    response = requests.get(api_url)
    response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

    data = response.json() # Parse the JSON response into a Python dictionary

    # Extract some information from the nested dictionary structure
    user = data['results'][0] # The API returns a list of results, we take the first one
    name = user['name']
    email = user['email']

    print(f"Acquired data for: {name['first']} {name['last']}")
    print(f"Email: {email}")

except requests.exceptions.RequestException as e:
    print(f"Error fetching data from API: {e}")
```
This example fetches data from a public API that provides random user information. The `response.json()` method automatically parses the JSON data into a Python dictionary, making it easy to work with.

<a id="concept-web-scraping"></a>
### Web Scraping: When APIs Aren't Enough
Sometimes, the data you need is available on a website, but there's no public API to access it programmatically. In such cases, **web scraping** (or data scraping) can be used. Web scraping involves writing code to automatically extract data from web pages. It's like manually copying information from a website, but done by a program.

**Important Considerations for Web Scraping:**
-   **Legality and Ethics:** Always check a website's `robots.txt` file (e.g., `www.example.com/robots.txt`) and Terms of Service to see if scraping is allowed. Respect their rules. Scraping personal data or copyrighted content without permission can have serious consequences.
-   **Rate Limiting:** Don't bombard a website with too many requests too quickly, as this can overload their servers and get your IP address blocked. Be polite and add delays (`time.sleep()`) between requests.
-   **Website Changes:** Websites can change their structure (e.g., HTML element names, classes), which can break your scraping code. Web scraping often requires maintenance.

For web scraping in Python, `requests` is used to download the web page content, and then a library like `BeautifulSoup` is used to parse the HTML and extract the desired information.

```python
import requests
from bs4 import BeautifulSoup
import time # Import time for adding delays

# Example URL (using a simple, static page designed for scraping practice)
url = "http://quotes.toscrape.com/"

try:
    response = requests.get(url)
    response.raise_for_status() # Check for HTTP errors

    # Parse the HTML content of the page
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all elements that contain a quote text (they have a specific class)
    quotes = soup.find_all('span', class_='text')
    # Find all elements that contain the author's name
    authors = soup.find_all('small', class_='author')

    print("--- Scraped Quotes ---")
    for i in range(len(quotes)):
        print(f'"{quotes[i].get_text()}" - {authors[i].get_text()}')
    
    # Add a small delay to be polite to the server
    time.sleep(1) 

except requests.exceptions.RequestException as e:
    print(f"Error during web scraping: {e}")
```
This script fetches quotes and their authors from a sample website. It demonstrates how `BeautifulSoup` helps navigate the HTML structure to pinpoint specific elements (like `<span>` tags with a `class='text'`) and extract their content.

## Storing Your Data: Common File Formats
Once you've successfully acquired data, the next crucial step is to store it persistently. This allows you to reuse it, share it, and continue your analysis without having to re-acquire it every time. Choosing the right storage format depends on the data's structure, size, and how you plan to use it.

### CSV Files: Simple Tabular Data
**CSV** (Comma Separated Values) is one of the simplest and most widely used file formats for storing tabular data. Each line in a CSV file typically represents a data record (like a row in a spreadsheet), and each record consists of one or more fields (like columns) separated by commas. It's essentially a plain text version of a spreadsheet.

**Example CSV Structure:**
```csv
Name,Age,City
Alice,30,New York
Bob,24,London
Charlie,35,Paris
```

CSV files are easy to read and write, making them a popular choice for exchanging data between different applications. Python's built-in `csv` module or the `pandas` library (which you'll likely use a lot in data science) can handle them easily.

```python
import csv

# Data to be written to the CSV file
data_to_write = [
    ['Product', 'Price', 'Quantity'], # Header row
    ['Laptop', 1200, 10],
    ['Mouse', 25, 50],
    ['Keyboard', 75, 30]
]

# Open the file in write mode ('w'), 'newline=''' is important to prevent extra blank rows
with open('products.csv', 'w', newline='') as file:
    writer = csv.writer(file) # Create a CSV writer object
    writer.writerows(data_to_write) # Write all rows at once
print("products.csv created.")

# Reading data from the CSV file
print("\nReading from products.csv:")
with open('products.csv', 'r') as file:
    reader = csv.reader(file) # Create a CSV reader object
    for row in reader:
        print(row) # Each row is read as a list of strings
```

### JSON Files: Flexible, Hierarchical Data
**JSON** (JavaScript Object Notation) is another very popular data format, especially for data exchanged over the web (like from APIs, as we saw earlier). Unlike CSV, JSON is semi-structured and can represent hierarchical data, meaning data can contain nested objects (like Python dictionaries) and arrays (like Python lists). It's human-readable and easy for machines to parse.

**Example JSON Structure:**
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
Notice how JSON can easily store a list of interests for each person, something that's harder to represent cleanly in a simple CSV without creating many columns.

JSON's flexibility makes it suitable for more complex data structures where a simple table might not be sufficient. Python has a built-in `json` module to work with JSON data.

```python
import json

# Data to be written to the JSON file (a list of dictionaries)
data_to_write = [
    {"name": "Alice", "age": 30, "city": "New York", "interests": ["reading", "hiking"]},
    {"name": "Bob", "age": 24, "city": "London", "interests": ["gaming", "cooking"]}
]

# Open the file in write mode ('w')
with open('users.json', 'w') as file:
    # json.dump writes Python objects to a JSON file
    # indent=4 makes the output human-readable with nice formatting
    json.dump(data_to_write, file, indent=4) 
print("users.json created.")

# Reading data from the JSON file
print("\nReading from users.json:")
with open('users.json', 'r') as file:
    # json.load reads JSON data from a file and converts it to Python objects
    loaded_data = json.load(file)
    for user in loaded_data:
        print(f"Name: {user['name']}, Age: {user['age']}, City: {user['city']}, Interests: {', '.join(user['interests'])}")
```

<!-- IMAGE_SLOT: img-004 -->
![Two side-by-side examples of data representation. On the left, a small CSV file snippet showing 'Name,Age,City\nAlice,30,New York\nBob,24,London'. On](../../../../../image/data_science/data-acquisition-and-storage/img-004.png)
`. The JSON example should clearly show key-value pairs and potentially nested elements if space allows, contrasting with the flat CSV.]

## Wrap-Up
Congratulations! You've taken your first crucial steps into the world of data science by learning how to acquire and store data. We've covered various methods, from querying structured databases with SQL and interacting with web APIs, to carefully scraping data from websites. You also learned about two fundamental file formats, CSV and JSON, for saving your precious data.

Remember, getting the right data is paramount. The skills you've gained here are the foundation for every data project. In the next lesson, we'll move on to the equally important step of cleaning and preparing this acquired data, making it ready for analysis.