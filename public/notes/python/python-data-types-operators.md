<a id="concept-python-data-types-operators"></a>
# Python Fundamentals: Data Types and Operators

## Learning Objectives
By the end of this lesson, you will be able to:
- Identify and differentiate between Python's core data types: integers, floats, strings, and booleans.
- Understand why data types are essential for writing correct and predictable code.
- Use arithmetic operators to perform mathematical calculations in Python.
- Employ the assignment operator to store values in variables.
- Utilize comparison operators to compare values and make decisions in your programs.

## Introduction
Imagine you're organizing a kitchen. You wouldn't store milk in the spice rack, nor would you try to measure flour with a stopwatch. Each item has a specific type, and you use different tools to interact with them.

In programming, it's very similar! When you write code, you're constantly working with different kinds of information: numbers, text, true/false values, and more. Python, like a good kitchen organizer, needs to know what *type* of [data](../data-science/data-fundamentals-and-types.md#concept-data) it's dealing with so it can handle it correctly. These categories are called **data types**.

Once you have your data neatly categorized, you'll want to do things with it – add numbers, combine text, or check if one value is greater than another. This is where **operators** come in. Operators are special symbols that tell Python to perform specific actions on your data.

Understanding data types and operators is fundamental to writing any meaningful Python program. They are the building blocks that allow you to store information, perform calculations, and create logical decisions in your code. Let's dive in and explore these essential concepts!

## Concept Progression

### What are Data Types?
At its core, a **data type** is simply a [classification](../data-science/supervised-learning-classification.md#concept-classification) that specifies what kind of value a piece of data represents. It tells Python how to interpret the data and what operations can be performed on it. Think of data types as labels for your data, helping Python understand its nature.

For example, if you have the number `5`, Python knows it's a whole number and you can perform mathematical operations like addition or multiplication with it. If you have the word `"hello"`, Python knows it's text (a sequence of characters) and you can't, for instance, multiply it by another word.

Python is a "dynamically typed" language. This means you don't have to explicitly declare the data type of a variable when you create it; Python figures it out automatically based on the value you assign. However, understanding these types is crucial for *you*, the programmer, to write effective and error-free code.

Let's look at some of the most common built-in data types in Python.

[IMAGE_PLACEHOLDER: A visual showing different data types (Integer, Float, String, Boolean) as distinct, labeled boxes. Each box contains an example value of that type. For instance, the "Integer" box has `42`, "Float" has `3.14`, "String" has `"Python"`, and "Boolean" has `True`. The overall composition should illustrate data categorization.]

<a id="concept-integer-data-type"></a>
#### Integers (`int`)
**Integers** are whole numbers, meaning they have no fractional part. They can be positive, negative, or zero.

**Why they matter:** You'll use integers for counting items, representing ages, years, or any quantity that naturally occurs in whole units.

**Example:**
```python
# Here are some examples of integers
number_of_students = 30
temperature = -5
year = 2023

print(type(number_of_students)) # Output: <class 'int'>
print(type(temperature))        # Output: <class 'int'>
```
In the example above, `type()` is a built-in Python [function](../python/functions-in-python.md#concept-function) that's very useful for checking the [data](../data-science/data-fundamentals-and-types.md#concept-data) type of any variable.

<a id="concept-float-data-type"></a>
#### Floating-Point Numbers (`float`)
**Floating-point numbers**, often just called **floats**, are numbers that include a decimal point. They are used to represent real numbers and are essential for calculations that require precision beyond whole numbers.

**Why they matter:** Floats are used for measurements (like height or weight), prices, scientific calculations, or anything that might have a fractional component.

**Example:**
```python
# Here are some examples of floats
price = 19.99
pi_value = 3.14159
percentage = 0.75

print(type(price))      # Output: <class 'float'>
print(type(pi_value))   # Output: <class 'float'>
```

<a id="concept-string-data-type"></a>
#### Strings (`str`)
**Strings** are sequences of characters, like letters, numbers, or symbols. They are used to represent text. In Python, strings are always enclosed in either single quotes (`'...'`) or double quotes (`"..."`).

**Why they matter:** Strings are everywhere in programming! Names, addresses, messages, file paths, and web content are all handled as strings.

**Example:**
```python
# Here are some examples of strings
greeting = "Hello, Python!"
user_name = 'Alice'
message = "The answer is 42."

print(type(greeting))   # Output: <class 'str'>
print(type(user_name))  # Output: <class 'str'>
```
Notice that even numbers can be part of a string if they are enclosed in quotes. Python treats `"42"` as text, not a numerical value that you can perform math on.

<a id="concept-boolean-data-type"></a>
#### Booleans (`bool`)
**Booleans** represent one of two fundamental values: `True` or `False`. These are crucial for making decisions and controlling the flow of your program.

**Why they matter:** Booleans are the basis of all logical operations. Is a condition met? Is a user logged in? Is a number positive? The answers to these questions are often `True` or `False`, guiding your program's behavior.

**Example:**
```python
# Here are some examples of booleans
is_logged_in = True
has_permission = False
is_admin = True

print(type(is_logged_in))    # Output: <class 'bool'>
print(type(has_permission))  # Output: <class 'bool'>
```
It's important to remember that `True` and `False` are capitalized in Python.

Now that we've explored how Python categorizes different kinds of information, let's learn how to actively work with that data using operators.

### Operators: Doing Things with Data
We've learned about data types – the "nouns" of your Python programs. Now, let's introduce **operators**, which are the "verbs." Operators are special symbols or keywords that perform operations on one or more values (called operands). They tell Python what action to take with your data.

<a id="concept-arithmetic-operators"></a>
#### Arithmetic Operators
**Arithmetic operators** are used to perform common mathematical calculations. You're probably already familiar with most of these from basic math!

**Why they matter:** These are essential for any program that needs to perform calculations, from simple sums to complex scientific formulas.

[IMAGE_PLACEHOLDER: A table or diagram listing common arithmetic operators. Columns: "Operator", "Description", "Example", "Result". Examples: `+` (Addition, `5 + 3`, `8`), `-` (Subtraction, `10 - 4`, `6`), `*` (Multiplication, `2 * 6`, `12`), `/` (Division, `15 / 3`, `5.0`), `//` (Floor Division, `10 // 3`, `3`), `%` (Modulo, `10 % 3`, `1`), `**` (Exponentiation, `2 ** 3`, `8`).]

Let's look at the main arithmetic operators:

| Operator | Description           | Example       | Result |
| :------- | :-------------------- | :------------ | :----- |
| `+`      | Addition              | `5 + 3`       | `8`    |
| `-`      | Subtraction           | `10 - 4`      | `6`    |
| `*`      | Multiplication        | `2 * 6`       | `12`   |
| `/`      | Division              | `15 / 3`      | `5.0`  |
| `//`     | Floor Division        | `10 // 3`     | `3`    |
| `%`      | Modulo (Remainder)    | `10 % 3`      | `1`    |
| `**`     | Exponentiation (Power)| `2 ** 3`      | `8`    |

**Examples:**
```python
# Addition
result_add = 10 + 5
print(f"10 + 5 = {result_add}") # Output: 10 + 5 = 15

# Subtraction
result_sub = 20 - 7
print(f"20 - 7 = {result_sub}") # Output: 20 - 7 = 13

# Multiplication
result_mul = 4 * 6
print(f"4 * 6 = {result_mul}") # Output: 4 * 6 = 24

# Division (always returns a float, even if the result is a whole number)
result_div = 10 / 3
print(f"10 / 3 = {result_div}") # Output: 10 / 3 = 3.3333333333333335

# Floor Division (divides and discards the fractional part, returning an integer)
result_floor_div = 10 // 3
print(f"10 // 3 = {result_floor_div}") # Output: 10 // 3 = 3

# Modulo (returns the remainder of the division)
result_modulo = 10 % 3
print(f"10 % 3 = {result_modulo}") # Output: 10 % 3 = 1

# Exponentiation (raises the first number to the power of the second)
result_power = 2 ** 4 # 2 to the power of 4 (2*2*2*2)
print(f"2 ** 4 = {result_power}") # Output: 2 ** 4 = 16
```
These arithmetic operators are your tools for performing calculations. But how do you store the results of these calculations, or any other data, for later use? That's where the [assignment operator](../python/python-data-types-operators.md#concept-assignment-operator) comes in.

<a id="concept-assignment-operator"></a>
### Assignment Operator
The **assignment operator** (`=`) is used to assign a value to a variable. It's how you store data for later use in your program, giving a name to a piece of information.

**Why it matters:** Variables are like named containers for data. The assignment operator is how you put things into those containers. Without it, you couldn't store information or refer to it by a meaningful name!

**Example:**
```python
# Assigning an integer to a variable named 'my_age'
my_age = 25
print(f"My age is: {my_age}") # Output: My age is: 25

# Assigning a string to a variable named 'my_name'
my_name = "Charlie"
print(f"My name is: {my_name}") # Output: My name is: Charlie

# You can also assign the result of an operation to a variable
total_score = 85 + 10
print(f"Total score: {total_score}") # Output: Total score: 95
```
It's crucial to remember that in programming, the single equals sign (`=`) means "assign the value on the right to the variable on the left." It does *not* mean "is equal to" in a mathematical sense. For checking equality, we use a different operator, which we'll see next!

<a id="concept-comparison-operators"></a>
### Comparison Operators
**Comparison operators** are used to compare two values. They always evaluate to a Boolean value (`True` or `False`), indicating whether the comparison is true or false.

**Why they matter:** These operators are fundamental for making decisions in your code. You'll use them extensively in conditional statements (like `if` statements) to control what your program does based on whether certain conditions are met.

[IMAGE_PLACEHOLDER: A visual showing two values (e.g., `x = 10`, `y = 5`) being compared using different comparison operators. For each operator, show the comparison (e.g., `x == y`), and the resulting boolean output (`False`). Include `==`, `!=`, `<`, `>`, `<=`, `>=` with clear labels and examples.]

Here are the main comparison operators:

| Operator | Description              | Example         | Result |
| :------- | :----------------------- | :-------------- | :----- |
| `==`     | Equal to                 | `5 == 5`        | `True` |
| `!=`     | Not equal to             | `5 != 10`       | `True` |
| `>`      | Greater than             | `10 > 5`        | `True` |
| `<`      | Less than                | `5 < 10`        | `True` |
| `>=`     | Greater than or equal to | `10 >= 10`      | `True` |
| `<=`     | Less than or equal to    | `5 <= 5`        | `True` |

**Examples:**
```python
x = 10
y = 15
z = 10

# Equal to (==) - Checks if two values are the same
print(f"Is x equal to y? {x == y}") # Output: Is x equal to y? False
print(f"Is x equal to z? {x == z}") # Output: Is x equal to z? True

# Not equal to (!=) - Checks if two values are different
print(f"Is x not equal to y? {x != y}") # Output: Is x not equal to y? True

# Greater than (>) - Checks if the left value is larger than the right
print(f"Is x greater than y? {x > y}") # Output: Is x greater than y? False

# Less than (<) - Checks if the left value is smaller than the right
print(f"Is x less than y? {x < y}") # Output: Is x less than y? True

# Greater than or equal to (>=) - Checks if the left value is larger than or the same as the right
print(f"Is x greater than or equal to z? {x >= z}") # Output: Is x greater than or equal to z? True

# Less than or equal to (<=) - Checks if the left value is smaller than or the same as the right
print(f"Is y less than or equal to x? {y <= x}") # Output: Is y less than or equal to x? False
```
You can compare different data types, but be careful! For example, comparing a number to a string (e.g., `5 == "5"`) will usually result in `False` because Python treats them as fundamentally different types, even if their content looks similar.

## Wrap-Up
In this lesson, you've taken a crucial step in your Python journey by understanding **data types** and **operators**. You learned that data types categorize information, allowing Python to process it correctly, and you explored the fundamental types: integers, floats, strings, and booleans. You also discovered how **operators** act as instructions, enabling you to perform calculations with arithmetic operators, store values with the assignment operator, and make logical comparisons with comparison operators.

These concepts are the bedrock of programming logic. As you continue to build more complex programs, you'll find yourself using these tools constantly to manage information and control your program's behavior. In the next lesson, we'll explore how to organize your code even further using variables and comments, building on the strong foundation you've established here.