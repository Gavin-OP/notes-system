# Introduction to Base Python (Part 1)

## Learning Objectives

By the end of this lesson, you'll be able to:
Write simple Python programs.
[PAUSE_SHORT]
These programs will perform basic tasks like arithmetic calculations, showing output, and taking input from a user.
[PAUSE_SHORT]
You'll also learn to recognize Python's fundamental built-in data types.
[PAUSE_SHORT]
And you'll be able to choose the right structures for basic data storage.
[PAUSE_SHORT]
Finally, you'll understand foundational data structure concepts.
[PAUSE_SHORT]
This includes how to use methods and attributes to interact with your data.

[PAUSE_LONG]

## Introduction

Welcome to the exciting world of Python programming!
[PAUSE_SHORT]
If you're new to coding, you've picked a fantastic language to start with.
[PAUSE_SHORT]
Python is celebrated for its clear, readable code.
[PAUSE_SHORT]
It's also incredibly versatile.
[PAUSE_SHORT]
People use it for web development, data science, artificial intelligence, and automation.
[PAUSE_SHORT]
It's truly a Swiss Army knife for programmers.

[PAUSE_SHORT]

In this first part of our Python journey, we'll lay the essential groundwork.
[PAUSE_SHORT]
We'll learn how to make Python "talk" to us.
[PAUSE_SHORT]
We'll see how to give it instructions.
[PAUSE_SHORT]
And how it remembers different kinds of information.
[PAUSE_SHORT]
Think of it as learning the basic vocabulary and grammar before you start writing your first story.
[PAUSE_SHORT]
By the end of this lesson, you'll be able to write simple programs that perform calculations, interact with the user, and store various types of data.
[PAUSE_SHORT]
Let's dive in!

[PAUSE_LONG]

## Your First Steps: Output and Basic Arithmetic

Every journey starts with a single step.
[PAUSE_SHORT]
In programming, that often means making your program say "Hello!".
[PAUSE_SHORT]
Python makes this incredibly easy with the `print()` function.
[PAUSE_SHORT]
A function is like a mini-program or a command that does a specific task.
[PAUSE_SHORT]
And `print()`'s job is to show information on your screen, which we call the console.

[PAUSE_SHORT]

Let's try it out.
[PAUSE_SHORT]
Open your Python interpreter or a Python file and type:

[PAUSE_SHORT]

Code cue: This code uses the `print` function to display text.
```python
print("Hello, Python!")
```

[PAUSE_SHORT]

When you run this code, you'll see "Hello, Python!" appear.
[PAUSE_SHORT]
The text inside the parentheses and quotes is called a **string**.
[PAUSE_SHORT]
It's a sequence of characters that Python treats as text.

[PAUSE_SHORT]

Now, Python isn't just for displaying text.
[PAUSE_SHORT]
It's also a powerful calculator.
[PAUSE_SHORT]
You can do basic math operations directly in your code.
[PAUSE_SHORT]
Here are some of the most common ones:

*   `+` for addition
*   `-` for subtraction
*   `*` for multiplication
*   `/` for division. This always gives you a `float`, even if the result is a whole number.
*   `//` for floor division. This throws away the decimal part, giving you an `int`.
*   `%` for modulo. This gives you the remainder of a division.
*   `**` for exponentiation. This means raising a number to a power.

[PAUSE_SHORT]

Let's see these in action:

[PAUSE_SHORT]

Code cue: This block shows examples of different arithmetic operations using the `print` function.
```python
print(10 + 5)    # Output: 15 (Addition)
print(20 - 7)    # Output: 13 (Subtraction)
print(4 * 6)     # Output: 24 (Multiplication)
print(10 / 3)    # Output: 3.3333333333333335 (Standard division, results in a float)
print(10 // 3)   # Output: 3 (Floor division, discards the decimal part)
print(10 % 3)    # Output: 1 (Modulo, the remainder of 10 divided by 3)
print(2 ** 3)    # Output: 8 (Exponentiation, 2 to the power of 3)
```

[PAUSE_SHORT]

You can even combine these operations.
[PAUSE_SHORT]
Python follows the standard order of operations, just like in math class.
[PAUSE_SHORT]
You might remember this as PEMDAS or BODMAS.
[PAUSE_SHORT]
That's Parentheses or Brackets, Exponents or Orders, Multiplication and Division, then Addition and Subtraction.

[PAUSE_SHORT]

Code cue: These examples show how Python handles the order of operations in arithmetic expressions.
```python
print(5 + 3 * 2)   # Output: 11 (Multiplication 3*2=6 happens before addition 5+6=11)
print((5 + 3) * 2) # Output: 16 (Parentheses (5+3=8) happen first, then 8*2=16)
```

[PAUSE_SHORT]

This ability to perform calculations and display results is a fundamental building block.
[PAUSE_SHORT]
It's used in almost any program you'll ever write.

[PAUSE_LONG]

## Making Programs Interactive: User Input

A program that only talks to itself isn't very useful.
[PAUSE_SHORT]
To make our programs truly interactive, we need a way for them to "listen" to the user.
[PAUSE_SHORT]
This is where the `input()` function comes in.

[PAUSE_SHORT]

When `input()` is called, your program will pause.
[PAUSE_SHORT]
It waits for the user to type something and press Enter.
[PAUSE_SHORT]
Whatever the user types is then returned as a string.

[PAUSE_SHORT]

Let's ask for the user's name:

[PAUSE_SHORT]

Code cue: This code uses `input` to ask for a name and then `print` to greet the user.
```python
# The text inside input() is a prompt shown to the user
user_name = input("What is your name? ")
print("Hello, " + user_name + "!")
```

[PAUSE_SHORT]

When you run this, the program will display "What is your name? " and wait.
[PAUSE_SHORT]
If you type "Alice" and press Enter, it will then print "Hello, Alice!".

[PAUSE_SHORT]

Notice the `user_name = ...` part.
[PAUSE_SHORT]
This introduces the concept of a **variable**.
[PAUSE_SHORT]
A variable is like a labeled box in your computer's memory.
[PAUSE_SHORT]
You can store information in it.
[PAUSE_SHORT]
Here, we're storing the user's input in a variable named `user_name`.
[PAUSE_SHORT]
We can then use this variable later in our program.
[PAUSE_SHORT]
For example, to print a personalized greeting.

[PAUSE_SHORT]

A crucial point about `input()`: it *always* returns the user's input as a string.
[PAUSE_SHORT]
Even if they type numbers.
[PAUSE_SHORT]
If you want to do calculations with user-provided numbers, you'll need to convert them first.
[PAUSE_SHORT]
We can do this using functions like `int()` for whole numbers.
[PAUSE_SHORT]
Or `float()` for numbers with decimal points.

[PAUSE_SHORT]

Code cue: This example shows how to convert user input from a string to an integer so you can perform calculations.
```python
age_str = input("How old are you? ") # User input is always a string, e.g., "30"
age_int = int(age_str)               # Convert the string "30" to an integer 30

print("In 5 years, you will be", age_int + 5, "years old.")

# You can also combine these steps for a more concise code:
# current_age = int(input("How old are you? "))
# print("In 5 years, you will be", current_age + 5, "years old.")
```

[PAUSE_SHORT]

If you tried to do `age_str + 5` without converting, Python would give you an error.
[PAUSE_SHORT]
That's because you can't directly add a number to a string in this way.
[PAUSE_SHORT]
This process of **type conversion** is a common and important task in programming.

[PAUSE_LONG]

## Remembering Things: Variables and Basic Data Types

As we saw with `user_name` and `age_int`, variables are essential for storing data.
[PAUSE_SHORT]
This is data that your program needs to use or manipulate.
[PAUSE_SHORT]
When you create a variable, you give it a name.
[PAUSE_SHORT]
Python automatically figures out what *type* of data you're storing.

[PAUSE_SHORT]

Python has several fundamental built-in data types.
[PAUSE_SHORT]
Each one is designed to hold a specific kind of information:

[PAUSE_SHORT]

1.  **Numbers:**
    *   `int` for integers: These are whole numbers, positive or negative, without decimal points. For example, `5`, `-100`, or `0`.
    *   `float` for floating-point numbers: These are numbers with decimal points. For example, `3.14`, `-0.5`, or `2.0`.

[PAUSE_SHORT]

2.  **Text:**
    *   `str` for strings: These are sequences of characters.
    *   They are enclosed in single quotes, like `'...'`, or double quotes, like `"..."`.
    *   For example, `"Hello"` or `'Python is fun!'`.

[PAUSE_SHORT]

3.  **Truth Values:**
    *   `bool` for booleans: These represent one of two values: `True` or `False`.
    *   They are fundamental for making decisions in your code.
    *   For example, "Is the light on?".

[PAUSE_SHORT]

4.  **Nothingness:**
    *   `NoneType` for `None`: This represents the absence of a value.
    *   It's often used to show that a variable or function result doesn't have a meaningful value yet.
    *   Or that something is empty.

[PAUSE_SHORT]

Let's see these in action and how to check their types:

[PAUSE_SHORT]

Code cue: This code block demonstrates how to declare variables of different basic data types and how to use the `type()` function to check their types.
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

[PAUSE_SHORT]

Understanding these basic data types is crucial.
[PAUSE_SHORT]
They dictate what operations you can perform on your data.
[PAUSE_SHORT]
And how your program will behave.
[PAUSE_SHORT]
For example, you can add two `int`s.
[PAUSE_SHORT]
But you can't directly add an `int` to a `str` without converting one of them first.

[PAUSE_LONG]

## Organizing Collections: Built-in Data Structures

While individual variables are great for single pieces of information, real-world programs often need to handle collections of data.
[PAUSE_SHORT]
Imagine you want to store a list of your favorite movies.
[PAUSE_SHORT]
Or the names of all students in a class.
[PAUSE_SHORT]
Or a person's entire profile.
[PAUSE_SHORT]
Python provides several powerful built-in **data structures** for this purpose.

[PAUSE_SHORT]

These structures allow you to group related data together in organized ways.
[PAUSE_SHORT]
Let's look at the most common ones:

[PAUSE_SHORT]

1.  **Lists (`list`):**
    *   An **ordered** collection of items.
    *   They are **mutable**. This means you can change, add, or remove items after creation.
    *   Defined using square brackets `[]`.
    *   Items are accessed by their **index**, which is their position.
    *   The first item is at index `0`.

[PAUSE_SHORT]

Code cue: This code shows how to create a list, access items by index, add items, and change items.
```python
my_list = ["apple", "banana", "cherry"]
print(my_list[0]) # Output: apple (Accessing the first item)

my_list.append("orange") # Add an item to the end
print(my_list) # Output: ['apple', 'banana', 'cherry', 'orange']

my_list[1] = "blueberry" # Change an item at a specific index
print(my_list) # Output: ['apple', 'blueberry', 'cherry', 'orange']
```

[PAUSE_SHORT]

Lists are incredibly versatile.
[PAUSE_SHORT]
They are one of the most frequently used data structures in Python.

[PAUSE_SHORT]

2.  **Tuples (`tuple`):**
    *   An **ordered** collection of items, similar to lists.
    *   However, they are **immutable**. Once created, you cannot change, add, or remove items.
    *   Defined using parentheses `()`.
    *   Also accessed by index.

[PAUSE_SHORT]

Code cue: This example demonstrates creating a tuple and accessing its elements. It also shows a commented-out line that would cause an error, highlighting a tuple's immutability.
```python
my_tuple = ("red", "green", "blue")
print(my_tuple[1]) # Output: green

# my_tuple.append("yellow") # This would cause an error! Tuples cannot be modified.
```

[PAUSE_SHORT]

Tuples are often used for fixed collections of related items.
[PAUSE_SHORT]
Like geographical coordinates `(latitude, longitude)`.
[PAUSE_SHORT]
Or RGB color values `(red, green, blue)`.
[PAUSE_SHORT]
Their immutability can make your code safer and sometimes more efficient.

[PAUSE_SHORT]

3.  **Sets (`set`):**
    *   An **unordered** collection of **unique** items.
    *   They are **mutable**. You can add or remove items.
    *   But the set itself does not maintain any specific order.
    *   Defined using curly braces `{}`.
    *   Or `set()` for an empty set.
    *   Sets automatically remove duplicate entries when created or added.

[PAUSE_SHORT]

Code cue: This code shows how to create a set, noting that duplicates are automatically removed, and how to add a new item.
```python
my_set = {"cat", "dog", "mouse", "cat"} # 'cat' appears twice
print(my_set) # Output: {'dog', 'mouse', 'cat'} (Order might vary, duplicates are removed)

my_set.add("bird") # Add a new item
print(my_set) # Output: {'dog', 'mouse', 'cat', 'bird'} (Again, order might vary)
```

[PAUSE_SHORT]

Sets are excellent for quickly checking if an item is present in a collection.
[PAUSE_SHORT]
Or for efficiently removing duplicate entries from a list of items.

[PAUSE_SHORT]

4.  **Dictionaries (`dict`):**
    *   An **unordered** collection of **key-value pairs**.
    *   They are **mutable**. You can add, remove, or change key-value pairs.
    *   Defined using curly braces `{}` with `key: value` pairs.
    *   These pairs are separated by commas.
    *   Keys must be unique and immutable, like strings or numbers.
    *   Values can be anything.

[PAUSE_SHORT]

Code cue: This example demonstrates creating a dictionary, accessing values by their keys, changing existing values, and adding new key-value pairs.
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

[PAUSE_SHORT]

Dictionaries are incredibly useful for representing structured data.
[PAUSE_SHORT]
Like a record for a person, configuration settings, or any situation where you need to look up information using a specific label rather than a numerical index.

[PAUSE_SHORT]

Choosing the right data structure depends on your specific needs.
[PAUSE_SHORT]
Do you need items to stay in a particular order?
[PAUSE_SHORT]
Can the collection change after it's created?
[PAUSE_SHORT]
Do you need to ensure all items are unique?
[PAUSE_SHORT]
Do you need to look up values by a specific descriptive label?

[PAUSE_LONG]

## Working with Collections: Methods and Attributes

Data structures in Python aren't just passive containers.
[PAUSE_SHORT]
They are "objects" that come with their own built-in behaviors and characteristics.
[PAUSE_SHORT]
These behaviors are called **methods**.
[PAUSE_SHORT]
And characteristics are called **attributes**.

[PAUSE_SHORT]

Think of an object like a remote control.
[PAUSE_SHORT]
It has buttons, which are like methods, that perform actions.
[PAUSE_SHORT]
Like changing the channel or volume.
[PAUSE_SHORT]
And it has characteristics, which are like attributes.
[PAUSE_SHORT]
Such as its color or battery level.

[PAUSE_SHORT]

You access methods and attributes using **dot notation**, which is a period.

[PAUSE_SHORT]

**Methods:**
Methods are functions that "belong" to an object.
[PAUSE_SHORT]
They operate specifically on that object.
[PAUSE_SHORT]
For example, a list has methods to add items, remove items, sort itself, and so on.
[PAUSE_SHORT]
A string has methods to convert itself to uppercase, find a substring, and more.

[PAUSE_SHORT]

Code cue: This block demonstrates various methods for lists, strings, and dictionaries, showing how they modify or interact with the data.
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

[PAUSE_SHORT]

**Attributes:**
Attributes are pieces of data associated with an object.
[PAUSE_SHORT]
Think of them as the object's properties or characteristics.
[PAUSE_SHORT]
For example, a `file` object might have a `name` attribute.
[PAUSE_SHORT]
Or a `person` object might have an `age` attribute.
[PAUSE_SHORT]
While it's less common to directly access *simple data attributes* for basic built-in types in simple scenarios, they are fundamental to how objects store their internal state.
[PAUSE_SHORT]
You will encounter them more frequently when you start creating your own custom objects later in your Python journey.

[PAUSE_SHORT]

For now, focus on understanding that methods are actions an object can perform.
[PAUSE_SHORT]
And you call them using the dot, followed by the method name and parentheses.
[PAUSE_SHORT]
This concept of objects having methods and attributes is a cornerstone of object-oriented programming.
[PAUSE_SHORT]
You'll explore that more deeply later.

[PAUSE_LONG]

## Wrap-Up

Congratulations!
[PAUSE_SHORT]
You've just taken your first significant steps into the world of Python.
[PAUSE_SHORT]
We started by making Python say "Hello!" and perform basic math.
[PAUSE_SHORT]
Then we learned how to make our programs interactive by taking user input.
[PAUSE_SHORT]
We explored how Python remembers information using variables.
[PAUSE_SHORT]
And we understood the fundamental built-in data types.
[PAUSE_SHORT]
Like numbers, text, booleans, and `None`.
[PAUSE_SHORT]
Finally, we organized collections of data using lists, tuples, sets, and dictionaries.
[PAUSE_SHORT]
And we discovered how to interact with these structures using their built-in methods and attributes.

[PAUSE_SHORT]

These concepts are the bedrock of almost every Python program you'll encounter.
[PAUSE_SHORT]
You now have the tools to store and manipulate basic information.
[PAUSE_SHORT]
In the next lesson, we'll build on this foundation.
[PAUSE_SHORT]
We'll learn how to make our programs make decisions and repeat actions.
[PAUSE_SHORT]
This will unlock even more powerful programming capabilities!