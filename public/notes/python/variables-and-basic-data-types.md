<a id="concept-variables-and-basic-data-types"></a>
# Variables and Basic Data Types

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what a variable is and why it's essential in programming.
- Declare variables and assign values to them in Python.
- Identify and use Python's fundamental data types: integers, floating-point numbers, strings, and booleans.
- Understand the concept of dynamic typing in Python and how it affects variable usage.
- Use the `type()` function to check a variable's data type.

## Introduction
Imagine you're writing a story, and you need to keep track of different pieces of information: the main character's name, their age, whether they are a hero or a villain, and how much gold they have. As the story unfolds, these details might change. In programming, we have a very similar need to store, retrieve, and manage information that can change over time. This is precisely where **variables** come in!

[Variables](../data-science/python-fundamentals.md#concept-variables) are like named containers or labels that point to specific pieces of data in your program's memory. Just as you might label a box "Toys" to know what's inside, you give a variable a name to easily refer to the data it holds. This lesson will introduce you to these fundamental building blocks: variables and the basic types of data they can hold, known as **[data types](../data-science/python-fundamentals.md#concept-data-types)**. Mastering these concepts is crucial for writing any meaningful Python program, as they allow your programs to interact with and process information.

## Concept Progression

### What are Variables? Your Program's Memory Labels
Think of your computer's memory as a vast collection of storage lockers. When your Python program needs to remember something – like a user's name, a calculation result, or a true/false condition – it uses a variable. A variable is simply a friendly name you give to a specific piece of data (an "object") stored in one of these memory lockers. Instead of remembering complex memory addresses, you just use the variable's name.

Why are variables so important? Because data in a program is rarely static! If you're building a game, the player's score will constantly go up and down. If you're making a calculator, the numbers you're working with will be different each time. Variables provide a flexible way to refer to these changing pieces of information using a consistent, easy-to-understand name.

In Python, creating a variable and making it point to a value is called **assignment**. You choose a meaningful name for your variable, and then use the single equals sign (`=`) operator to assign a value to it.

Here's how it looks in action:

```python
# Assigning the value 10 to a variable named 'score'
score = 10

# Assigning the text "Python" to a variable named 'language'
language = "Python"

# Once assigned, you can use these variables by their names
print(score)      # This will print the value 10
print(language)   # This will print the value "Python"
```

When you run this code, Python first creates an [integer](../python/python-data-types-and-variables.md#concept-integer) object `10` in memory and a string object `"Python"` in memory. Then, it makes the variable name `score` *refer* to the `10` object, and the variable name `language` *refer* to the `"Python"` object. If you later assign a new value to `score`, it will simply refer to a different object in memory.

[IMAGE_PLACEHOLDER: A diagram illustrating computer memory as a grid of cells. One cell contains the number 10, and an arrow labeled "score" points to it. Another cell contains the text "Python", and an arrow labeled "language" points to it. Style: Simple, clear, with distinct labels.]

**Rules for Naming [Variables](../data-science/python-fundamentals.md#concept-variables):**
Python has a few straightforward rules and conventions for naming your variables:
*   **Allowed Characters:** Names can contain letters (a-z, A-Z), numbers (0-9), and underscores (`_`).
*   **Starting Character:** Names **cannot** start with a number. They must begin with a letter or an underscore.
*   **Case-Sensitive:** Python is case-sensitive, meaning `age` is considered a completely different variable from `Age` or `AGE`.
*   **Reserved Keywords:** Avoid using Python's reserved keywords (like `print`, `if`, `for`, `while`, `True`, `False`, `None`, etc.) as variable names, as these have special meanings in the language.
*   **Readability (Convention):** It's a widely accepted good practice to use descriptive names (e.g., `user_age` instead of `ua`) and to use `snake_case` (lowercase words separated by underscores) for variable names.

### Understanding Data Types: What Kind of Information is This?
Just like you wouldn't try to add a word to a number in real life, computers need to know what kind of data they are dealing with. Is it a whole number? A number with decimals? Text? A true/false statement? This "kind" or category of data is called its **[data type](../python/python-data-types-and-variables.md#concept-data-type)**. Knowing the data type helps Python understand how to store the data, what operations can be performed on it, and how to interpret it.

A great feature of Python is that you don't have to explicitly declare the data type of a variable when you create it. Python automatically figures out the data type of a value when you assign it to a variable.

Let's explore some of the most common and fundamental [data types](../data-science/python-fundamentals.md#concept-data-types) you'll encounter in Python:

<a id="concept-integer"></a>
#### 1. Integers (`int`)
Integers are whole numbers, meaning they have no fractional part. They can be positive, negative, or zero. Integers are perfect for counting things, representing ages, quantities, or anything that doesn't require decimal precision.

```python
number_of_apples = 5
temperature = -10
year = 2023
big_number = 1000000

print(f"Number of apples: {number_of_apples}")
print(f"Current temperature: {temperature}")
print(f"The current year: {year}")
print(f"A big number: {big_number}")
```

To confirm the data type of any variable, Python provides a handy built-in [function](../python/functions-in-python.md#concept-function) called `type()`. You pass the variable name to it, and it tells you its type:

```python
print(type(number_of_apples)) # Output: <class 'int'>
print(type(temperature))      # Output: <class 'int'>
```

<a id="concept-floating-point-number"></a>
#### 2. Floating-Point Numbers (`float`)
Floating-point numbers, often shortened to "floats," are numbers that include a decimal point. They are used for measurements, prices, mathematical calculations that require precision, and anything that can have fractional values.

```python
price = 19.99
pi_value = 3.14159
percentage = 0.75
height_in_meters = 1.83

print(f"Product price: ${price}")
print(f"Value of Pi: {pi_value}")
print(f"Completion percentage: {percentage}")
print(f"My height: {height_in_meters}m")
```

Even a whole number written with a decimal point is considered a float by Python:

```python
exact_value = 5.0
print(f"Exact value: {exact_value}")
print(type(exact_value)) # Output: <class 'float'>
```

#### 3. Strings (`str`)
Strings are sequences of characters, which can include letters, numbers, symbols, and spaces. They are used to represent text. In Python, strings are always enclosed in either single quotes (`'`) or double quotes (`"`). It doesn't matter which you use, as long as you start and end with the same type of quote.

```python
greeting = "Hello, Python!"
user_name = 'Alice'
message = "The answer is 42."
empty_string = "" # An empty string is also a valid string

print(f"A friendly greeting: {greeting}")
print(f"User's name: {user_name}")
print(f"A secret message: {message}")
print(type(greeting)) # Output: <class 'str'>
```

You can combine strings using the `+` operator, a process known as **concatenation**:

```python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name # We add a space in between
print(f"Full name: {full_name}") # Output: John Doe
```

<a id="concept-boolean-value"></a>
#### 4. Booleans (`bool`)
Booleans represent one of two fundamental values: `True` or `False`. These are absolutely essential for making decisions and controlling the flow of your program. For example, "Is the user logged in?" (True/False) or "Is this number greater than 10?" (True/False). Notice that `True` and `False` must start with a capital letter in Python.

```python
is_logged_in = True
has_permission = False
is_admin = True
game_over = False

print(f"Is the user logged in? {is_logged_in}")
print(f"Does the user have permission? {has_permission}")
print(type(is_logged_in)) # Output: <class 'bool'>
```

Booleans often result from comparisons or logical tests:

```python
is_greater = (10 > 5) # Is 10 greater than 5? Yes, so True.
is_equal = (7 == 7)   # Is 7 equal to 7? Yes, so True.
is_less = (3 < 1)     # Is 3 less than 1? No, so False.

print(f"Is 10 greater than 5? {is_greater}") # Output: True
print(f"Is 7 equal to 7? {is_equal}")       # Output: True
print(f"Is 3 less than 1? {is_less}")       # Output: False
print(type(is_greater)) # Output: <class 'bool'>
```

[IMAGE_PLACEHOLDER: A diagram showing four distinct icons representing data types: a stack of numbered blocks for 'int', a ruler with decimal markings for 'float', a speech bubble with text for 'str', and a light switch in both ON (True) and OFF (False) positions for 'bool'. Each icon is clearly labeled with its type and a small example.]

<a id="concept-dynamic-typing"></a>
### Dynamic Typing: Python's Flexibility
One of Python's key characteristics, and a feature that often surprises newcomers from other languages, is **dynamic typing**. This means two important things:

1.  **No Explicit Declaration:** You don't have to specify the [data type](../python/python-data-types-and-variables.md#concept-data-type) of a variable when you declare it. Python automatically infers the type based on the value you assign.
2.  **Type Can Change:** A variable can be made to refer to an object of a completely different type *after* it has been created. The variable name simply points to a new object in memory.

Let's see this flexibility in action:

```python
my_variable = 10        # Initially, 'my_variable' refers to an integer object
print(f"Value: {my_variable}, Type: {type(my_variable)}") # Output: Value: 10, Type: <class 'int'>

my_variable = "Hello"   # Now, 'my_variable' refers to a string object
print(f"Value: {my_variable}, Type: {type(my_variable)}") # Output: Value: Hello, Type: <class 'str'>

my_variable = 3.14      # And now it refers to a float object
print(f"Value: {my_variable}, Type: {type(my_variable)}") # Output: Value: 3.14, Type: <class 'float'>

my_variable = True      # Finally, it refers to a boolean object
print(f"Value: {my_variable}, Type: {type(my_variable)}") # Output: Value: True, Type: <class 'bool'>
```

This dynamic nature can be very convenient, making Python code often shorter and easier to write, as you don't get bogged down in explicit type declarations. However, it also means you need to be mindful of what type of data object a variable currently refers to, especially when performing operations. For instance, trying to directly add a number to a string (like `10 + "hello"`) will result in an error, because Python expects compatible types for such operations.

## Wrap-Up
Congratulations! In this lesson, you've taken a significant step in your Python journey by learning about variables and basic data types. You now understand that variables are named references to data objects in your program's memory, providing a flexible way to manage information. You've also explored the fundamental data types: integers for whole numbers, floats for decimals, strings for text, and booleans for true/false logic. Finally, you grasped the concept of Python's dynamic typing, which allows variables to refer to objects of different data types during program execution.

These concepts are truly foundational. As you continue to learn, you'll find that almost every piece of code you write will involve creating variables and working with these different data types. In the next lesson, we'll build on this knowledge by exploring how to perform operations with these data types using Python's operators, allowing your programs to do much more than just store information!