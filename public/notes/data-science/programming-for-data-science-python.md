<a id="concept-programming-for-data-science-python"></a>
# Programming for Data Science with Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the fundamental role of Python in data science.
- Utilize basic Python data structures like lists, tuples, dictionaries, and sets.
- Implement control flow statements (`if/else`, `for` loops, `while` loops) to manage program logic.
- Define and call custom functions to organize and reuse code.
- Explain the purpose of Python libraries and use core functionalities of NumPy and Pandas for data manipulation.

## Introduction
Welcome to the exciting world of [data](../data-science/data-fundamentals-and-types.md#concept-data) science! In an era where data is a crucial resource, Python stands out as the essential tool for extracting valuable insights. Its simplicity, extensive ecosystem of specialized libraries, and robust community support have made it the [programming language](../python/getting-started-with-python.md#concept-python-programming-language) of choice for data scientists worldwide.

Whether your goal is to clean messy datasets, build powerful predictive models, or visualize complex patterns, Python provides the comprehensive toolkit you need. This lesson will equip you with the foundational [Python programming](../data-science/programming-for-data-science-python.md#concept-python-programming) skills necessary to embark on your data science journey. We'll begin with the very basics of writing Python code and progressively move towards understanding powerful [data structures](../python/python-data-structures.md#concept-python-data-structures) and essential libraries that are indispensable for any data professional.

## Concept Progression

<a id="concept-python-programming"></a>
### Python Programming Fundamentals
At its core, programming is about giving clear, step-by-step instructions to a computer. Python excels at this, allowing us to write commands in a way that's easy for humans to read and understand. Think of Python as your personal translator, taking your ideas and turning them into actions the computer can perform.

Let's start with a fundamental instruction: displaying text. We use the `print()` [function](../python/functions-in-python.md#concept-function) for this purpose.

```python
# This is a comment. Python ignores lines starting with #,
# allowing you to add notes to your code.
print("Hello, Data Science!")
```
This simple line tells Python to show the message "Hello, Data Science!" on your screen.

Next, we often need to store information for later use. **Variables** are like labeled containers or boxes where you can store different types of data, such as numbers, text, or more complex structures. You give the box a name, and then you can put data inside it.

```python
# Storing a whole number (an integer) in a variable named 'age'
age = 30
print(age) # This will display the value stored in 'age'

# Storing text (a string) in a variable named 'name'
name = "Alice"
print(name) # This will display "Alice"

# You can also perform basic arithmetic operations with variables
num_students = 25
num_teachers = 2
total_people = num_students + num_teachers # Adds the values
print(total_people) # Output: 27
```
One of Python's beginner-friendly features is that it automatically figures out the type of data you're storing (e.g., an integer for `age`, a string for `name`). This flexibility makes it easier to get started without worrying about complex type declarations.

### Python Data Structures
As [data](../data-science/data-fundamentals-and-types.md#concept-data) scientists, we rarely work with single pieces of information. Instead, we deal with vast collections of data. Python offers several built-in **data structures** to organize and manage these collections efficiently, each suited for different scenarios.

<a id="concept-data-structures-python"></a>
#### Lists
Imagine a shopping list: it's an ordered collection of items, and you can easily add new items, remove old ones, or change existing entries. Python **lists** are just like that: ordered, changeable collections that can hold items of different data types. They are defined using square brackets `[]`.

```python
# A list of fruits
fruits = ["apple", "banana", "cherry", "apple"]
print(fruits)

# Accessing items by their position (index). Python lists are 0-indexed,
# meaning the first item is at index 0.
print(fruits[0]) # Output: apple

# Changing an item at a specific index
fruits[1] = "blueberry"
print(fruits) # Output: ['apple', 'blueberry', 'cherry', 'apple']

# Adding a new item to the end of the list
fruits.append("orange")
print(fruits) # Output: ['apple', 'blueberry', 'cherry', 'apple', 'orange']

# Removing the first occurrence of a specific item
fruits.remove("apple")
print(fruits) # Output: ['blueberry', 'cherry', 'apple', 'orange']
```
Lists are incredibly versatile and are one of the most frequently used [data structures](../python/python-data-structures.md#concept-python-data-structures) in Python for storing sequences of data.

<!-- IMAGE_SLOT: img-001 -->
![A diagram showing a Python list named 'fruits' with elements "apple", "banana", "cherry". Each element is in a](../../../../../image/data_science/programming-for-data-science-python/img-001.png)
' to "apple".]

#### Tuples
Sometimes, you have a collection of items that should *not* change after they're created, like the coordinates of a fixed point on a map or the days of the week. For these situations, Python offers **tuples**. Tuples are ordered and **unchangeable** (immutable) collections, defined using parentheses `()`.

```python
# A tuple representing RGB color values (Red, Green, Blue)
rgb_color = (255, 0, 0) # This represents pure red
print(rgb_color)

# You can access elements in a tuple just like in lists, using indices
print(rgb_color[0]) # Output: 255

# However, trying to change an element in a tuple will result in an error
# rgb_color[1] = 100 # If you uncomment this line, it would cause a TypeError
```
Tuples are often used for fixed collections of related items, ensuring that the data remains consistent and cannot be accidentally modified.

#### Dictionaries
What if you want to store information that's not just in an ordered list, but associated with specific labels? For example, a person's name, age, and city. This is where **dictionaries** come in handy. Dictionaries store data in `key: value` pairs, where each `key` is unique and maps to a specific `value`. They are defined using curly braces `{}`.

```python
# A dictionary storing information about a student
student = {
    "name": "John Doe",
    "age": 22,
    "major": "Computer Science",
    "gpa": 3.8
}
print(student)

# Accessing a value using its key
print(student["name"]) # Output: John Doe

# Changing a value associated with a key
student["age"] = 23
print(student) # The 'age' value is now 23

# Adding a new key-value pair
student["university"] = "State University"
print(student) # The dictionary now includes 'university'
```
Dictionaries are perfect for representing [structured data](../data-science/data-fundamentals-and-types.md#concept-structured-data), much like a record in a database or a row in a table, allowing you to retrieve information quickly using meaningful labels.

<!-- IMAGE_SLOT: img-002 -->
![A diagram illustrating a Python dictionary named 'student'. It shows key-value pairs: "name" -> "John Doe", "age" ->](../../../../../image/data_science/programming-for-data-science-python/img-002.png)


#### Sets
Imagine you have a collection of items, and you only care about whether an item is present or not, without any specific order or duplicates. **Sets** are unordered collections of unique items. They are defined using curly braces `{}` (similar to dictionaries, but without key-value pairs) or the `set()` constructor.

```python
# A set of unique numbers. Notice how the duplicate '3' is automatically removed.
numbers = {1, 2, 3, 3, 4, 5}
print(numbers) # Output might be {1, 2, 3, 4, 5} (order is not guaranteed)

# Adding an element to the set
numbers.add(6)
print(numbers)

# Trying to add a duplicate element has no effect
numbers.add(3)
print(numbers) # The set remains unchanged

# Removing an element from the set
numbers.remove(2)
print(numbers)
```
Sets are particularly useful for operations like checking for membership, efficiently removing duplicates from a list, and performing mathematical set operations (like union, intersection, and difference).

### Control Flow
Programs aren't always a straight line of instructions. Often, you need your program to make decisions or repeat actions based on certain conditions. This is where **control flow** comes in. It allows you to dictate the order in which your code executes, making your programs dynamic and responsive.

#### Conditional Statements (`if`, `elif`, `else`)
Conditional statements allow your program to execute different blocks of code based on whether certain conditions are true or false. This is how programs "make decisions."

```python
score = 85

if score >= 90:
    print("Excellent! Grade A")
elif score >= 70: # 'elif' is short for 'else if'
    print("Good job! Grade B")
else: # If none of the above conditions are true
    print("Keep practicing! Grade C or lower")

# Another example demonstrating nested conditions
temperature = 28

if temperature > 25:
    print("It's hot outside!")
    if temperature > 35: # This is a nested if statement, checked only if the outer 'if' is true
        print("Stay hydrated!")
elif temperature < 10:
    print("It's cold outside!")
else:
    print("The weather is mild.")
```
The `if` statement checks the first condition. If it's true, its block of code runs. If not, `elif` checks the next condition, and so on. If none of the `if` or `elif` conditions are true, the `else` block runs as a default.

#### Loops (`for` and `while`)
Loops allow you to repeat a block of code multiple times, which is incredibly useful for processing collections of data or performing repetitive tasks.

**`for` loops:** These are used for iterating over a sequence (like a list, tuple, string, or a range of numbers). You use a `for` loop when you know how many times you need to repeat an action, or when you want to process each item in a collection.

```python
# Iterating through a list of names
names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(f"Hello, {name}!") # f-strings are a modern way to format strings easily

# Iterating through a range of numbers
for i in range(5): # range(5) generates numbers from 0 up to (but not including) 5
    print(i) # Output: 0, 1, 2, 3, 4

# Iterating through each character in a string
for char in "Python":
    print(char)
```

**`while` loops:** These are used for repeating a block of code as long as a certain condition remains true. You use a `while` loop when you don't know beforehand how many times the loop needs to run, but you have a condition that will eventually become false.

```python
count = 0
while count < 3: # The loop continues as long as 'count' is less than 3
    print(f"Count is {count}")
    count += 1 # This is shorthand for count = count + 1. It's crucial for the loop to eventually stop.
print("Loop finished.")

# A simple countdown example
countdown = 5
while countdown > 0:
    print(countdown)
    countdown -= 1 # Decrement the countdown
print("Blast off!")
```
**Important:** Be very careful with `while` loops! If the condition never becomes false, your loop will run forever (an "infinite loop"), which can cause your program to freeze or crash. Always ensure there's a mechanism within the loop to eventually make the condition false.

### Functions
Imagine you have a specific task that you need to perform multiple times throughout your program, like calculating the average of a list of numbers or formatting a specific type of output. Instead of writing the same code over and over, you can define a **[function](../python/functions-in-python.md#concept-function)**. A function is a block of organized, reusable code that performs a single, related action.

```python
# Defining a function to greet someone
def greet(name):
    """This function takes a name as an argument and prints a greeting."""
    print(f"Hello, {name}!")

# Calling the function to execute its code
greet("Alice")
greet("Bob")

# Defining a function that takes arguments and returns a value
def add_numbers(a, b):
    """This function takes two numbers and returns their sum."""
    return a + b # The 'return' statement sends a value back from the function

# Calling the function and storing the result in a variable
result = add_numbers(10, 5)
print(f"The sum is: {result}") # Output: The sum is: 15

# You can also call a function directly within another statement, like print
print(f"Another sum is: {add_numbers(7, 3)}") # Output: Another sum is: 10
```
Functions make your code modular, easier to read, and simpler to debug. They are a cornerstone of good programming practice, allowing you to break down complex problems into smaller, manageable pieces.

<a id="concept-python-libraries"></a>
### Python Libraries
One of Python's greatest strengths for data science lies in its rich collection of **libraries** (also known as packages or modules). A library is essentially a collection of pre-written code (functions, classes, etc.) that you can import and use in your own programs. This means you don't have to "reinvent the wheel" for common, complex tasks; instead, you can leverage code that others have already written and optimized.

For data science, two libraries stand out as absolutely essential: **NumPy** and **[Pandas](../python/intro-scientific-computing.md#concept-pandas-library)**.

To use a library, you first need to `import` it into your Python script. It's common practice to import these libraries with shorter aliases for convenience.

```python
import numpy as np # 'np' is the conventional alias for NumPy
import pandas as pd # 'pd' is the conventional alias for Pandas
```
Once imported, you can access the library's functions and tools using its alias (e.g., `np.array()` or `pd.DataFrame()`).

### NumPy Arrays
**[NumPy](../python/intro-scientific-computing.md#concept-numpy-library)** (Numerical Python) is the fundamental package for numerical computation in Python. Its most important feature is the `ndarray` (N-dimensional array) object, which is a powerful and efficient way to store and manipulate large sets of numerical data. Think of it as a super-powered list specifically designed for numbers, capable of handling anything from simple lists to complex matrices.

Why use NumPy arrays instead of standard Python [lists](../data-science/programming-for-data-science-python.md#concept-data-structures-python) for numerical data?
1.  **Speed:** NumPy operations are often much faster because they are implemented in highly optimized C code behind the scenes.
2.  **Memory Efficiency:** NumPy arrays consume significantly less memory than Python lists for the same amount of numerical data, which is crucial for large datasets.
3.  **Functionality:** NumPy provides a vast array of mathematical functions that can operate on entire arrays at once, without needing explicit loops.

Let's see how to create and use NumPy arrays:

```python
import numpy as np

# Creating a 1-dimensional NumPy array from a Python list
data_list = [10, 20, 30, 40, 50]
numpy_array_1d = np.array(data_list)
print("1D Array:", numpy_array_1d)
print("Type:", type(numpy_array_1d)) # Output: <class 'numpy.ndarray'>

# Creating a 2-dimensional NumPy array (like a matrix or a simple table)
data_matrix = [[1, 2, 3], [4, 5, 6]]
numpy_array_2d = np.array(data_matrix)
print("\n2D Array:\n", numpy_array_2d)

# Basic arithmetic operations are applied element-wise across the entire array
array_a = np.array([1, 2, 3])
array_b = np.array([4, 5, 6])
sum_array = array_a + array_b # Adds corresponding elements: [1+4, 2+5, 3+6]
print("\nElement-wise sum:", sum_array) # Output: [5 7 9]

# Multiplying an array by a single number (scalar)
scaled_array = numpy_array_1d * 2 # Multiplies each element by 2
print("Scaled array:", scaled_array) # Output: [ 20  40  60  80 100]
```
NumPy arrays are the backbone for many data science operations, especially when dealing with numerical data for statistical analysis, scientific computing, or [machine learning](../data-science/introduction-to-data-science.md#concept-machine-learning) algorithms.

<!-- IMAGE_SLOT: img-003 -->
![A visual representation of a 2D NumPy array (matrix). It shows a grid of numbers, clearly labeled with](../../../../../image/data_science/programming-for-data-science-python/img-003.png)
,[4,5,6],[7,8,9]].]

<a id="concept-pandas-dataframe"></a>
### Pandas DataFrames
While NumPy is excellent for numerical arrays, real-world data often comes in a more structured, tabular format, much like spreadsheets or database tables, and can contain mixed data types (numbers, text, dates, etc.). This is where **Pandas** (Python Data Analysis Library) truly shines. Pandas introduces two primary data structures that are fundamental for data analysis:
-   **Series:** A one-dimensional labeled array capable of holding any data type. Think of it as a single column of a spreadsheet or a Python list with an index.
-   **DataFrame:** A two-dimensional labeled data structure with columns of potentially different types. This is the most commonly used Pandas object, resembling a spreadsheet, a SQL table, or a dictionary of Series objects.

DataFrames are incredibly powerful for data cleaning, transformation, analysis, and exploration.

```python
import pandas as pd

# Creating a Pandas Series
s = pd.Series([10, 20, 30, 40], name="My Numbers")
print("Pandas Series:\n", s)

# Creating a Pandas DataFrame from a dictionary.
# Each key becomes a column name, and its value becomes the column data.
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 40],
    'City': ['New York', 'London', 'Paris', 'Tokyo']
}
df = pd.DataFrame(data)
print("\nPandas DataFrame:\n", df)

# Accessing a single column (this returns a Pandas Series)
print("\nNames column:\n", df['Name'])

# Accessing multiple columns (this returns another DataFrame)
print("\nName and Age columns:\n", df[['Name', 'Age']])

# Getting basic information about the DataFrame, like column types and non-null counts
print("\nDataFrame Info:")
df.info()

# Generating descriptive statistics for numerical columns (like 'Age')
print("\nDescriptive Statistics for numerical columns:")
print(df.describe())
```
Pandas DataFrames will be your primary tool for handling tabular data in data science. They provide intuitive ways to load data from various sources (CSV files, Excel spreadsheets, databases), manipulate it, clean it, and prepare it for analysis or machine learning models.

<!-- IMAGE_SLOT: img-004 -->
![A visual representation of a Pandas DataFrame. It shows a table with labeled columns (e.g., 'Name', 'Age', 'City')](../../../../../image/data_science/programming-for-data-science-python/img-004.png)


## Wrap-Up
Congratulations! You've just taken your first significant steps into programming for data science with Python. We've covered the essentials, from basic Python syntax and fundamental data structures like lists, tuples, dictionaries, and sets, to controlling program flow with `if/else` statements and loops. You also learned how to create reusable code with functions and received a crucial introduction to the powerhouse libraries, NumPy and Pandas, which are indispensable for handling numerical and tabular data.

These foundational skills are the building blocks for more advanced data science techniques. In upcoming lessons, we'll dive deeper into using NumPy and Pandas for more complex data manipulation, cleaning, and analysis, setting the stage for statistical modeling and machine learning. Keep practicing these concepts, as hands-on experience is key to mastering programming and unlocking the full potential of data science.