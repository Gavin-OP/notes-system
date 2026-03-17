# Programming for Data Science with Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand why Python is a preferred language for [data science](../data-science/introduction-to-data-science.md).
- Define and use basic Python [data types](../data-science/data-acquisition-storage.md) and variables.
- Utilize fundamental Python [data structures](../python/data-structures-dictionaries-sets.md) like lists, tuples, and dictionaries to organize data.
- Implement [control flow](../python/control-flow-conditionals.md) mechanisms (conditionals and loops) to create dynamic programs.
- Write and call simple [functions](../python/functions.md) to make your code reusable.
- Explain the role of libraries in Python and perform basic operations using NumPy and Pandas for data manipulation.

## Introduction: Your Journey into Data Science with Python

Welcome to the exciting world of programming for [data science](../data-science/introduction-to-data-science.md)! If you're new to coding, you've picked an excellent starting point. Python is renowned for its clear, readable syntax and incredible versatility, making it the language of choice for data scientists, analysts, and developers across the globe.

But why Python specifically for [data science](../data-science/introduction-to-data-science.md)? Imagine you're an architect with a vast collection of building materials (your data) – bricks, wood, glass, and more. You want to construct something amazing, perhaps a skyscraper that reveals hidden patterns or a bridge that predicts future trends. Python is your ultimate toolkit. It provides specialized, easy-to-use tools for every step of your construction process: sorting through materials, cleaning them up, analyzing their properties, and even visualizing your finished structures. With Python, you can precisely instruct the computer on how to transform raw data into valuable insights and powerful predictive models.

In this lesson, we'll embark on a journey to learn the fundamentals of the `__MASK_0__`. We'll begin by understanding its basic "grammar" – how to store simple pieces of information. Next, we'll explore how to organize larger collections of data using Python's built-in `__MASK_1__`s. As we progress, you'll discover how to make your programs "smart" by controlling their flow, allowing them to make decisions and repeat actions. Finally, we'll introduce you to powerful `__MASK_2__`ies like `__MASK_3__` and `__MASK_4__`, which are indispensable tools that extend Python's capabilities, turning it into a [data science](../data-science/introduction-to-data-science.md) powerhouse.

Let's dive in and start building your programming foundation!

## Concept Progression

### The Python Programming Language: Your First Steps

At its heart, programming is about giving clear, step-by-step instructions to a computer. Python excels at this by making these instructions feel remarkably similar to plain English. Let's begin with the absolute basics: how to store information and perform simple actions.

#### Variables and Basic Data Types
Think of a **variable** as a labeled box or a container where you can store a piece of information. Each box has a name, and you can put different kinds of "stuff" (data) into it. Python is smart enough to automatically recognize the *type* of data you've stored.

Here are the fundamental types of data you'll encounter:
*   **Integers (`int`)**: Whole numbers, positive or negative, without a decimal point (e.g., `5`, `-100`, `0`).
*   **Floating-point numbers (`float`)**: Numbers that have a decimal point (e.g., `3.14`, `-0.5`, `99.99`).
*   **Strings (`str`)**: Sequences of characters, like words, sentences, or even single letters. They are always enclosed in single quotes (`'...'`) or double quotes (`"..."`) (e.g., `"Hello World"`, `'Data Science'`).
*   **Booleans (`bool`)**: Represent truth values, which can only be one of two states: `True` or `False`. These are crucial for making decisions in your code.

Let's see how to create variables and assign values to them:

```python
# Assigning values to variables
age = 30              # 'age' is an integer variable
height = 1.75         # 'height' is a float variable
name = "Alice"        # 'name' is a string variable
is_student = True     # 'is_student' is a boolean variable

# You can display the value stored in a variable using the print() function
print(age)
print(name)
```
When you run this code, Python will output `30` and `Alice` on separate lines.

#### Basic Operations
Just like a calculator, Python can perform arithmetic operations. You can use these operations directly with numbers or with variables that store numbers.

```python
# Arithmetic operations
x = 10
y = 3

sum_result = x + y       # Addition: 10 + 3 = 13
diff_result = x - y      # Subtraction: 10 - 3 = 7
prod_result = x * y      # Multiplication: 10 * 3 = 30
div_result = x / y       # Division: 10 / 3 = 3.333... (always results in a float)
floor_div = x // y       # Floor division: 10 // 3 = 3 (discards the fractional part)
remainder = x % y        # Modulo (remainder): 10 % 3 = 1 (the remainder after division)
power = x ** y           # Exponentiation: 10 ** 3 = 1000 (10 to the power of 3)

print(f"Sum: {sum_result}")
print(f"Division: {div_result}")
print(f"Remainder: {remainder}")

# Strings can also be combined using the '+' operator, which is called concatenation
greeting = "Hello, " + name + "!"
print(greeting)
```
The `f-string` (e.g., `f"Sum: {sum_result}"`) is a convenient way to embed variable values directly into strings.

Now that you know how to store individual pieces of data, let's explore how to manage collections of data.

### Data Structures: Organizing Your Information

In [data science](../data-science/introduction-to-data-science.md), you'll rarely work with just one number or one string. Instead, you'll deal with vast collections of data. Python provides several powerful, built-in `__MASK_0__`s to help you organize, store, and manage these collections efficiently. Choosing the right data structure can make your code much more effective.

#### Lists: Ordered, Changeable Collections
Imagine a shopping list: you can add items, remove items, and even change items on the list. Python **lists** are exactly like that – an ordered collection of items that you can modify after creation. They are defined using square brackets `[]`, and items are separated by commas.

```python
# Creating a list
fruits = ["apple", "banana", "cherry", "apple"]
numbers = [1, 2, 3, 4, 5]
mixed_list = ["text", 123, True, 3.14] # Lists can hold different data types

print(fruits) # Output: ['apple', 'banana', 'cherry', 'apple']

# Accessing items: Each item has an index, starting from 0 for the first item.
first_fruit = fruits[0]  # "apple" (the item at index 0)
last_fruit = fruits[-1]  # "apple" (negative index counts from the end, -1 is the last item)
print(f"First fruit: {first_fruit}")
print(f"Last fruit: {last_fruit}")

# Modifying a list: Lists are 'mutable', meaning you can change their contents.
fruits[1] = "orange"      # Change "banana" to "orange"
fruits.append("grape")    # Add "grape" to the end of the list
fruits.remove("apple")    # Remove the *first* occurrence of "apple" found

print(fruits) # Output: ['orange', 'cherry', 'apple', 'grape']
```

[IMAGE_PLACEHOLDER: A simple diagram illustrating a Python list. Show a horizontal row of boxes, each containing an item and its corresponding index (0, 1, 2, ...). An arrow points from `fruits[0]` to the first item, and another arrow from `fruits.append("grape")` showing a new box added at the end.]

#### Tuples: Ordered, Unchangeable Collections
Tuples are similar to lists in that they are ordered collections of items. However, a key difference is that once a tuple is created, you cannot change its contents – it is **immutable**. Tuples are defined using parentheses `()`. They are often used for fixed collections of items, such as geographical coordinates or database records that shouldn't be altered.

```python
# Creating a tuple
coordinates = (10.0, 20.5)
colors = ("red", "green", "blue")

print(coordinates)

# Accessing items: Just like lists, you access items by their index.
x_coord = coordinates[0] # 10.0
print(f"X-coordinate: {x_coord}")

# Trying to modify a tuple will result in an error because they are immutable
# coordinates[0] = 15.0 # This line would cause a TypeError: 'tuple' object does not support item assignment
```
The immutability of tuples can be useful for ensuring data integrity, as you know the data won't accidentally change.

#### Dictionaries: Key-Value Pairs
Imagine a real-world dictionary or a phone book. Each entry has a unique "key" (like a word or a person's name) and an associated "value" (like its definition or phone number). Python **dictionaries** store data in exactly this way: as unique key-value pairs. They are defined using curly braces `{}`.

```python
# Creating a dictionary
person = {
    "name": "Bob",
    "age": 25,
    "city": "New York"
}

print(person)

# Accessing values: You retrieve values by referring to their unique key.
person_name = person["name"]      # "Bob"
person_age = person.get("age")    # 25 (another safe way to access, returns None if key not found)
print(f"Person's name: {person_name}")

# Modifying or adding items: Dictionaries are mutable.
person["age"] = 26                # Update the value associated with the "age" key
person["occupation"] = "Engineer" # Add a new key-value pair

print(person) # Output: {'name': 'Bob', 'age': 26, 'city': 'New York', 'occupation': 'Engineer'}
```

[IMAGE_PLACEHOLDER: A diagram showing a Python dictionary. Illustrate key-value pairs as linked boxes, e.g., "name" -> "Bob", "age" -> 25, "city" -> "New York". Show how a key is used to retrieve its corresponding value.]

With these [data structures](../python/data-structures-dictionaries-sets.md), you can now store and organize complex information. But how do you make your programs respond to different situations or perform repetitive tasks? That's where [control flow](../python/control-flow-conditionals.md) comes in.

### Control Flow: Making Your Programs Smart

So far, our programs execute instructions one after another, from top to bottom. However, real-world problems often require programs to make decisions or repeat actions. This is where `__MASK_0__` mechanisms become essential, allowing your code to be dynamic and responsive.

#### Conditional Statements (`if`, `elif`, `else`)
Conditional statements enable your program to execute different blocks of code based on whether certain conditions are `True` or `False`. This is how your program "makes decisions."

```python
temperature = 28

if temperature > 25:
    print("It's hot outside!")
elif temperature > 15: # This condition is checked only if the first 'if' condition was False
    print("It's pleasant.")
else: # This block runs if all preceding 'if' and 'elif' conditions were False
    print("It's cold.")

# Output: It's hot outside! (because 28 > 25 is True)
```
**Important Note on Indentation:** Notice the spaces before `print()` statements within the `if`, `elif`, and `else` blocks. Python uses **indentation** (typically 4 spaces) to define code blocks, unlike many other languages that use curly braces. Consistent indentation is crucial for Python code to run correctly and is a key factor in its readability.

#### Loops (`for`, `while`)
Loops allow you to repeat a block of code multiple times, which is incredibly useful for processing collections of data or performing tasks until a certain condition is met.

**`for` loop**: Used for iterating over a sequence (like a list, tuple, or string) or other iterable objects, executing the code block once for each item in the sequence.

```python
# Iterating through a list of fruits
for fruit in fruits: # 'fruit' takes on the value of each item in 'fruits' one by one
    print(f"I like {fruit}")

# Iterating through numbers in a range
# range(3) generates a sequence of numbers: 0, 1, 2
for i in range(3):
    print(f"Counting: {i}")

# Output:
# I like orange
# I like cherry
# I like apple
# I like grape
# Counting: 0
# Counting: 1
# Counting: 2
```

**`while` loop**: Repeats a block of code as long as a specified condition remains `True`. You must ensure that the condition eventually becomes `False` to avoid an **infinite loop** (a program that never stops!).

```python
count = 0
while count < 3: # The loop continues as long as 'count' is less than 3
    print(f"Count is: {count}")
    count += 1 # This increments 'count' by 1 in each iteration, eventually making the condition False

# Output:
# Count is: 0
# Count is: 1
# Count is: 2
```

#### Functions: Reusable Blocks of Code
As your programs grow in complexity, you'll often find yourself writing similar pieces of code repeatedly. **[Functions](../python/functions.md)** allow you to group these instructions into a named, reusable block. This promotes code organization, makes your programs easier to read, and prevents you from repeating yourself (a principle known as "Don't Repeat Yourself" or DRY).

```python
# Defining a function using the 'def' keyword
def greet(name):
    """This function takes a name and prints a personalized greeting."""
    print(f"Hello, {name}!")

# Calling the function: To execute the code inside a function, you 'call' it by its name.
greet("Charlie")
greet("Eve")

# Output:
# Hello, Charlie!
# Hello, Eve!
```
[Functions](../python/functions.md) can also take multiple inputs (called **arguments** or **parameters**) and can return values using the `return` keyword.

```python
def add_numbers(a, b):
    """This function takes two numbers (a and b) and returns their sum."""
    return a + b # The 'return' statement sends the result back to where the function was called

result = add_numbers(5, 7) # The function is called, and its returned value (12) is stored in 'result'
print(f"The sum is: {result}") # Output: The sum is: 12
```
[Functions](../python/functions.md) are fundamental for writing clean, modular, and efficient code.

### Libraries: Expanding Python's Superpowers

While Python's built-in features are powerful, one of its greatest strengths for [data science](../data-science/introduction-to-data-science.md) lies in its vast ecosystem of `__MASK_0__`ies. A **library** is essentially a collection of pre-written code ([functions](../python/functions.md), classes, etc.) that extends Python's capabilities, allowing you to perform complex tasks without having to write everything from scratch. For data science, two libraries are absolutely indispensable: `__MASK_1__` and `__MASK_2__`.

To use a library, you first need to `import` it into your Python script.

#### NumPy: Numerical Python
`__MASK_0__` (short for Numerical Python) is the foundational package for numerical computation in Python. It provides support for large, multi-dimensional arrays and matrices, along with a comprehensive collection of high-level mathematical [functions](../python/functions.md) to operate on these arrays. NumPy arrays are significantly more efficient for numerical operations than standard Python lists, especially when dealing with large datasets.

```python
import numpy as np # It's a common convention to import NumPy and alias it as 'np'

# Creating a NumPy array from a Python list
data = [1, 2, 3, 4, 5]
np_array = np.array(data)
print("NumPy Array:", np_array)
print("Type:", type(np_array)) # Output: <class 'numpy.ndarray'>

# Performing operations on arrays: NumPy allows for very fast, element-wise operations.
# This is much faster and more concise than looping through a Python list.
squared_array = np_array ** 2 # Squares each element in the array
print("Squared Array:", squared_array) # Output: [ 1  4  9 16 25]

# More complex mathematical operations are built-in
mean_value = np_array.mean() # Calculates the average of all elements
print(f"Mean of array: {mean_value}") # Output: Mean of array: 3.0
```

[IMAGE_PLACEHOLDER: A visual comparison between a Python list and a NumPy array. Show a Python list as individual elements in memory, and a NumPy array as a contiguous block of memory, highlighting the efficiency for numerical operations. Illustrate an element-wise operation like squaring each number.]

#### Pandas: Data Manipulation and Analysis
`__MASK_0__` is a powerful `__MASK_1__` built on top of NumPy, specifically designed for flexible and robust data manipulation and analysis. It introduces two key `__MASK_2__`s that are central to [data science](../data-science/introduction-to-data-science.md) workflows:
1.  **Series**: A 1-dimensional labeled array, similar to a single column in a spreadsheet or a Python list with an index.
2.  **`__MASK_0__`**: A 2-dimensional labeled table, much like a spreadsheet or a SQL table, with rows and columns. DataFrames are the workhorse of [data science](../data-science/introduction-to-data-science.md) in Python, allowing you to store and analyze tabular data with ease.

```python
import pandas as pd # It's a common convention to import Pandas and alias it as 'pd'

# Creating a Pandas Series
s = pd.Series([10, 20, 30, 40], name="My Numbers")
print("Pandas Series:")
print(s)

# Creating a Pandas DataFrame from a dictionary
data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [24, 27, 22],
    "City": ["London", "Paris", "New York"]
}
df = pd.DataFrame(data)
print("\nOriginal DataFrame:")
print(df)

# Basic DataFrame operations:
# Accessing a column (like selecting a column in a spreadsheet)
names = df["Name"]
print("\nNames column:")
print(names)

# Filtering data (selecting rows based on a condition)
young_people = df[df["Age"] < 25]
print("\nPeople younger than 25:")
print(young_people)

# Adding a new column to the DataFrame
df["Is_Student"] = [True, False, True]
print("\nDataFrame with new column:")
print(df)
```

[IMAGE_PLACEHOLDER: A clear diagram of a Pandas DataFrame. Show it as a table with labeled rows (index) and labeled columns. Illustrate how to select a column, and how to filter rows based on a condition, visually highlighting the selected/filtered parts.]

Pandas DataFrames provide an intuitive and efficient way to handle structured data, making tasks like cleaning, transforming, and analyzing datasets much simpler.

## Wrap-Up: Your Foundation for Data Science

Congratulations! You've just taken your first significant steps into programming for [data science](../data-science/introduction-to-data-science.md) with Python. We've covered a tremendous amount of ground, laying a crucial foundation for your future endeavors.

Let's recap what you've learned:
*   You started with the fundamental building blocks of the `__MASK_0__` – understanding how to use variables to store different `__MASK_1__`s like integers, floats, strings, and booleans, and performing basic operations.
*   You then learned how to organize larger collections of data using essential `__MASK_0__`s: `lists` for ordered, changeable collections; `tuples` for ordered, unchangeable collections; and `dictionaries` for storing data as key-value pairs.
*   We explored `__MASK_0__` mechanisms (`if/elif/else` statements and `for`/`while` loops) to make your programs dynamic, allowing them to make decisions and repeat actions.
*   You also discovered the power of `functions` for writing reusable, organized, and efficient code.
*   Finally, you got a crucial introduction to the indispensable `__MASK_0__`ies for [data science](../data-science/introduction-to-data-science.md): `__MASK_1__` for efficient numerical operations with arrays, and `__MASK_2__` for robust data manipulation and analysis, especially with its powerful `__MASK_3__` structure.

This foundation is absolutely critical for everything you'll do in [data science](../data-science/introduction-to-data-science.md). In upcoming lessons, we'll dive deeper into these libraries, exploring more advanced techniques for data cleaning, transformation, analysis, and visualization. Keep practicing these core concepts – the more you code, the more intuitive it will become. You're now equipped to confidently start writing your own Python scripts to unlock insights from data!