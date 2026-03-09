# Introduction to Base Python (Part 1)

## Learning Objectives
By the end of this lesson, you will be able to:
- Write simple Python programs that perform arithmetic calculations, display output to the console, and accept user input.
- Recognize Python's built-in data types and choose appropriate structures for basic data storage tasks.
- Understand foundational data structure concepts, including how to use methods and attributes to interact with data.

## Introduction
Welcome to the exciting world of Python programming! If you're new to coding, you've picked a fantastic language to start with. Python is renowned for its clear, readable syntax and incredible versatility, making it a favorite for everything from web development and data science to artificial intelligence and automation. It's truly a Swiss Army knife for programmers.

In this first part of our Python journey, we'll lay the essential groundwork. We'll learn how to make Python "talk" to us, how to give it instructions, and how it remembers different kinds of information. Think of it as learning the basic vocabulary and grammar before you start writing your first story. By the end of this lesson, you'll be able to write simple programs that perform calculations, interact with the user, and store various types of data. Let's dive in!

## Concept Progression

### Your First Steps: Output and Basic Arithmetic
Every journey starts with a single step, and in programming, that often means making your program say "Hello!". Python makes this incredibly easy with the `print()` function. A function is like a mini-program that performs a specific task, and `print()`'s job is to display information on your screen (the console).

Let's try it out. Open your Python interpreter or a Python file and type:

```python
print("Hello, Python!")
```

When you run this code, you'll see `Hello, Python!` appear. The text inside the parentheses and quotes is called a **string** – a sequence of characters that Python treats as text.

Python isn't just for displaying text; it's also a powerful calculator. You can perform basic arithmetic operations directly within your code:

*   `+` for addition
*   `-` for subtraction
*   `*` for multiplication
*   `/` for division (results in a `float`, even if it's a whole number)
*   `//` for floor division (discards the fractional part, giving an `int`)
*   `%` for modulo (gives the remainder of a division)
*   `**` for exponentiation (raising to a power)

Let's see these in action:

```python
print(10 + 5)    # Output: 15 (Addition)
print(20 - 7)    # Output: 13 (Subtraction)
print(4 * 6)     # Output: 24 (Multiplication)
print(10 / 3)    # Output: 3.3333333333333335 (Standard division, results in a float)
print(10 // 3)   # Output: 3 (Floor division, discards the decimal part)
print(10 % 3)    # Output: 1 (Modulo, the remainder of 10 divided by 3)
print(2 ** 3)    # Output: 8 (Exponentiation, 2 to the power of 3)
```

You can even combine these operations, and Python follows the standard order of operations (often remembered as PEMDAS/BODMAS – Parentheses/Brackets, Exponents/Orders, Multiplication and Division, Addition and Subtraction):

```python
print(5 + 3 * 2)   # Output: 11 (Multiplication 3*2=6 happens before addition 5+6=11)
print((5 + 3) * 2) # Output: 16 (Parentheses (5+3=8) happen first, then 8*2=16)
```

This ability to perform calculations and display results is a fundamental building block for almost any program you'll ever write.

### Making Programs Interactive: User Input
A program that only talks to itself isn't very useful. To make our programs truly interactive, we need a way for them to "listen" to the user. This is where the `input()` function comes in.

When `input()` is called, your program will pause and wait for the user to type something and press Enter. Whatever the user types is then returned as a string.

Let's ask for the user's name:

```python
# The text inside input() is a prompt shown to the user
user_name = input("What is your name? ")
print("Hello, " + user_name + "!")
```

When you run this, the program will display "What is your name? " and wait. If you type "Alice" and press Enter, it will then print "Hello, Alice!".

Notice the `user_name = ...` part. This introduces the concept of a **variable**. A variable is like a labeled box in your computer's memory where you can store information. Here, we're storing the user's input in a variable named `user_name`. We can then use this variable later in our program, for example, to print a personalized greeting.

A crucial point about `input()`: it *always* returns the user's input as a string, even if they type numbers. If you want to perform calculations with user-provided numbers, you'll need to convert them to a numeric type first. We can do this using functions like `int()` (for whole numbers) or `float()` (for numbers with decimal points).

```python
age_str = input("How old are you? ") # User input is always a string, e.g., "30"
age_int = int(age_str)               # Convert the string "30" to an integer 30

print("In 5 years, you will be", age_int + 5, "years old.")

# You can also combine these steps for a more concise code:
# current_age = int(input("How old are you? "))
# print("In 5 years, you will be", current_age + 5, "years old.")
```

If you tried to do `age_str + 5` without converting, Python would give you an error because you can't directly add a number to a string in this way. This process of **type conversion** is a common and important task in programming.

### Remembering Things: Variables and Basic Data Types
As we saw with `user_name` and `age_int`, variables are essential for storing data that your program needs to use or manipulate. When you create a variable, you give it a name, and Python automatically figures out what *type* of data you're storing.

Python has several fundamental built-in data types, each designed to hold a specific kind of information:

1.  **Numbers:**
    *   `int` (integers): Whole numbers, positive or negative, without decimal points (e.g., `5`, `-100`, `0`).
    *   `float` (floating-point numbers): Numbers with decimal points (e.g., `3.14`, `-0.5`, `2.0`).

2.  **Text:**
    *   `str` (strings): Sequences of characters enclosed in single quotes (`'...'`) or double quotes (`"..."`) (e.g., `"Hello"`, `'Python is fun!'`).

3.  **Truth Values:**
    *   `bool` (booleans): Represents one of two values: `True` or `False`. These are fundamental for making decisions in your code (e.g., "Is the light on?").

4.  **Nothingness:**
    *   `NoneType` (`None`): Represents the absence of a value. It's often used to indicate that a variable or function result doesn't have a meaningful value yet, or that something is empty.

Let's see these in action and how to check their types:

```python
# Integers
my_age = 30
num_students = 25

# Floats
pi = 3.14159
price = 19.99

# Strings
greeting = "Good morning!"
city = 'New York'

# Booleans
is_active = True
has_permission = False

# None
no_data = None
user_preference = None # Could be set later

# You can check the type of any variable using the type() function
print(type(my_age))         # Output: <class 'int'>
print(type(pi))             # Output: <class 'float'>
print(type(greeting))       # Output: <class 'str'>
print(type(is_active))      # Output: <class 'bool'>
print(type(no_data))        # Output: <class 'NoneType'>
```

Understanding these basic data types is crucial because they dictate what operations you can perform on your data and how your program will behave. For example, you can add two `int`s, but you can't directly add an `int` to a `str` without converting one of them first.

### Organizing Collections: Built-in Data Structures
While individual variables are great for single pieces of information, real-world programs often need to handle collections of data. Imagine you want to store a list of your favorite movies, the names of all students in a class, or a person's entire profile. Python provides several powerful built-in **data structures** for this purpose.

These structures allow you to group related data together in organized ways. Let's look at the most common ones:

1.  **Lists (`list`):**
    *   An **ordered** collection of items.
    *   **Mutable**: You can change, add, or remove items after creation.
    *   Defined using square brackets `[]`.
    *   Items are accessed by their **index** (position), starting from `0` for the first item.

    ```python
    my_list = ["apple", "banana", "cherry"]
    print(my_list[0]) # Output: apple (Accessing the first item)

    my_list.append("orange") # Add an item to the end
    print(my_list) # Output: ['apple', 'banana', 'cherry', 'orange']

    my_list[1] = "blueberry" # Change an item at a specific index
    print(my_list) # Output: ['apple', 'blueberry', 'cherry', 'orange']
    ```
    Lists are incredibly versatile and are one of the most frequently used data structures.

2.  **Tuples (`tuple`):**
    *   An **ordered** collection of items, similar to lists.
    *   **Immutable**: Once created, you cannot change, add, or remove items.
    *   Defined using parentheses `()`.
    *   Also accessed by index.

    ```python
    my_tuple = ("red", "green", "blue")
    print(my_tuple[1]) # Output: green

    # my_tuple.append("yellow") # This would cause an error! Tuples cannot be modified.
    ```
    Tuples are often used for fixed collections of related items, like geographical coordinates `(latitude, longitude)` or RGB color values `(red, green, blue)`. Their immutability can make your code safer and sometimes more efficient.

3.  **Sets (`set`):**
    *   An **unordered** collection of **unique** items.
    *   **Mutable**: You can add or remove items, but the set itself does not maintain any specific order.
    *   Defined using curly braces `{}` (or `set()` for an empty set).
    *   Automatically removes duplicate entries when created or added.

    ```python
    my_set = {"cat", "dog", "mouse", "cat"} # 'cat' appears twice
    print(my_set) # Output: {'dog', 'mouse', 'cat'} (Order might vary, duplicates are removed)

    my_set.add("bird") # Add a new item
    print(my_set) # Output: {'dog', 'mouse', 'cat', 'bird'} (Again, order might vary)
    ```
    Sets are excellent for quickly checking if an item is present in a collection or for efficiently removing duplicate entries from a list of items.

4.  **Dictionaries (`dict`):**
    *   An **unordered** collection of **key-value pairs**.
    *   **Mutable**: You can add, remove, or change key-value pairs.
    *   Defined using curly braces `{}` with `key: value` pairs separated by commas.
    *   Keys must be unique and immutable (like strings or numbers). Values can be anything.

    ```python
    person = {
        "name": "Alice",
        "age": 30,
        "city": "Wonderland"
    }
    print(person["name"]) # Output: Alice (Access value by its unique key)

    person["age"] = 31 # Change the value associated with the "age" key
    person["occupation"] = "Adventurer" # Add a new key-value pair
    print(person) # Output: {'name': 'Alice', 'age': 31, 'city': 'Wonderland', 'occupation': 'Adventurer'}
    ```
    Dictionaries are incredibly useful for representing structured data, like a record for a person, configuration settings, or any situation where you need to look up information using a specific label rather than a numerical index.

Choosing the right data structure depends on your specific needs: do you need items to stay in a particular order? Can the collection change after it's created? Do you need to ensure all items are unique? Do you need to look up values by a specific descriptive label?

### Working with Collections: Methods and Attributes
Data structures in Python aren't just passive containers; they are "objects" that come with their own built-in behaviors and characteristics. These behaviors are called **methods**, and characteristics are called **attributes**.

Think of an object like a remote control. It has buttons (methods) that perform actions (like changing the channel or volume), and it has characteristics (attributes) like its color or battery level.

You access methods and attributes using **dot notation** (`.`).

**Methods:**
Methods are functions that "belong" to an object and operate specifically on that object. For example, a list has methods to add items, remove items, sort itself, etc. A string has methods to convert itself to uppercase, find a substring, and so on.

```python
# List methods
my_numbers = [1, 5, 2, 8]
my_numbers.append(10) # Adds 10 to the end of the list
print(my_numbers) # Output: [1, 5, 2, 8, 10]

my_numbers.sort() # Sorts the list in place (modifies the original list)
print(my_numbers) # Output: [1, 2, 5, 8, 10]

# String methods
message = "hello python"
upper_message = message.upper() # Returns a NEW string in uppercase (doesn't change 'message')
print(upper_message) # Output: HELLO PYTHON
print(message)       # Output: hello python (original 'message' is unchanged)

starts_with_h = message.startswith("h") # Checks if the string starts with 'h'
print(starts_with_h) # Output: True

# Dictionary methods
user_info = {"name": "Bob", "email": "bob@example.com"}
keys = user_info.keys() # Returns a view of all keys in the dictionary
print(keys) # Output: dict_keys(['name', 'email'])

value = user_info.get("age", "Not provided") # Safely get a value, with a default if key not found
print(value) # Output: Not provided (since 'age' key doesn't exist)
```

**Attributes:**
Attributes are pieces of data associated with an object. Think of them as the object's properties or characteristics. For example, a `file` object might have a `name` attribute, or a `person` object might have an `age` attribute. While less common to directly access *simple data attributes* for basic built-in types in simple scenarios, they are fundamental to how objects store their internal state. You will encounter them more frequently when you start creating your own custom objects later in your Python journey.

For now, focus on understanding that methods are actions an object can perform, and you call them using the dot (`.`) followed by the method name and parentheses `()`. This concept of objects having methods and attributes is a cornerstone of object-oriented programming, which you'll explore more deeply later.

## Wrap-Up
Congratulations! You've just taken your first significant steps into the world of Python. We started by making Python say "Hello!" and perform basic math, then learned how to make our programs interactive by taking user input. We explored how Python remembers information using variables and understood the fundamental built-in data types like numbers, text, booleans, and `None`. Finally, we organized collections of data using lists, tuples, sets, and dictionaries, and discovered how to interact with these structures using their built-in methods and attributes.

These concepts are the bedrock of almost every Python program you'll encounter. You now have the tools to store and manipulate basic information. In the next lesson, we'll build on this foundation by learning how to make our programs make decisions and repeat actions, which will unlock even more powerful programming capabilities!