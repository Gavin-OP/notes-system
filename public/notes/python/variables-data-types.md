# Variables and Basic Data Types

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what a variable is and why it's essential in programming.
- Declare and assign values to variables in Python, following naming conventions.
- Identify and differentiate between fundamental Python data types: integers, floats, strings, and booleans.
- Use the `type()` function to check a variable's data type.
- Perform basic type conversion (type casting) between different data types.

## Introduction
Imagine you're following a recipe. You might need to remember quantities like "2 cups of flour," "3 eggs," or instructions like "bake at 375 degrees." These pieces of information are crucial, and their values can change depending on the recipe or how many servings you're making.

In programming, we have a very similar need: to store pieces of information that our program can use, modify, and refer to later. This is where **variables** come in. They act like named containers or labels for data.

But not all data is the same! The number of eggs is different from a list of ingredients, which is different from a "yes" or "no" answer. This is where **data types** become important. Python needs to know what *kind* of data it's dealing with so it knows how to handle it correctly. For example, you can add numbers, but you can't "add" a word to a number in the same way.

In this lesson, we'll explore how to use variables to store information and dive into the most common types of data you'll encounter in Python. Understanding these foundational concepts is crucial for writing any meaningful program.

## Concept Progression

### What are Variables? Your Program's Memory Tags
Think of a variable as a labeled box in your computer's memory. You can put a value inside this box, and then refer to that value later simply by using the label on the box.

Why do we need them? Because programs often work with information that changes or needs to be remembered. For example, a game might need to remember a player's score, a website might need to remember a user's name, or a calculator might need to remember the result of a previous calculation. Variables give us a way to store and retrieve this information easily.

In Python, creating a variable and putting a value into it is called **assignment**. You use the equals sign (`=`) for this.

```python
# Assigning the number 10 to a variable named 'score'
score = 10

# Assigning the text "Alice" to a variable named 'player_name'
player_name = "Alice"

# You can then use these variables in your code
print(player_name)
print(score)
```
When you run this code, `player_name` holds the text "Alice" and `score` holds the number `10`. If you later want to change the score, you just assign a new value to the `score` variable:

```python
score = 10
print("Initial score:", score) # Output: Initial score: 10

score = 15 # The old value (10) is replaced by the new value (15)
print("New score:", score)     # Output: New score: 15
```

**Variable Naming Rules:**
Python has a few simple rules for naming your variables to keep your code organized and error-free:
1.  **Start with a letter or an underscore (`_`)**: `my_variable` is good, `_temp` is good, but `1st_variable` is bad (cannot start with a number).
2.  **Can contain letters, numbers, and underscores**: `user_id_1` is good.
3.  **Case-sensitive**: `age` is different from `Age` and `AGE`. Python treats them as three distinct variables.
4.  **Cannot be Python keywords**: Words like `if`, `for`, `while`, `print`, `True`, `False` are reserved by Python for special purposes.
5.  **Be descriptive**: Choose names that clearly explain what the variable holds (e.g., `user_age` instead of `x`, `total_price` instead of `tp`). This makes your code much easier to understand for yourself and others.

[IMAGE_PLACEHOLDER: A simple diagram showing a computer's memory as a grid of cells. One cell is highlighted and labeled "score" with the value "10" inside. Another cell is labeled "player_name" with "Alice" inside. Arrows point from the variable names to their respective memory locations, illustrating variables as labels for data in memory.]

### Understanding Data Types: Different Kinds of Information
Now that we know how to store information in variables, let's talk about the *kind* of information we can store. Just like you wouldn't try to add a banana to a car, you can't always perform the same operations on different kinds of data in programming. Python needs to know if a piece of data is a whole number, a decimal number, text, or a true/false value. This "kind" of data is called its **data type**.

Python is a "dynamically typed" language, which means you don't have to explicitly tell Python what type a variable will hold. Python figures it out automatically based on the value you assign. This makes writing code quicker, but it's still crucial for *you* to understand the types.

Let's look at the most common basic data types you'll use constantly:

[IMAGE_PLACEHOLDER: A visual representation of different data types. Four distinct sections: one for "Numbers" showing an integer (e.g., 42) and a float (e.g., 3.14), one for "Text" showing a string (e.g., "Hello World"), and one for "True/False" showing a boolean (e.g., True). Each section has an icon representing its type.]

### Integers (`int`): Whole Numbers
Integers are whole numbers, positive or negative, without any decimal point. They are perfect for counting items, representing ages, quantities, or anything that cannot be a fraction.

```python
# Examples of integers
number_of_students = 30
my_age = 25
temperature = -5
big_number = 1000000
```
You can perform standard arithmetic operations with integers:

```python
apples = 5
oranges = 3
total_fruit = apples + oranges # Addition
print("Total fruit:", total_fruit) # Output: Total fruit: 8

remaining_apples = apples - 2 # Subtraction
print("Remaining apples:", remaining_apples) # Output: Remaining apples: 3

# You can also multiply and divide (though division might result in a float!)
items_per_box = 10
num_boxes = 4
total_items = items_per_box * num_boxes
print("Total items:", total_items) # Output: Total items: 40
```

### Floating-Point Numbers (`float`): Numbers with Decimals
Floating-point numbers, or simply "floats," are numbers that have a decimal point. They are used for measurements, prices, temperatures that aren't whole, and anything that might have a fractional part.

```python
# Examples of floats
price = 19.99
pi_value = 3.14159
temperature_celsius = 23.5
distance_km = 12.75
```
Floats also support arithmetic operations, just like integers:

```python
item_cost = 15.50
tax_rate = 0.08 # Represents 8% tax
total_price = item_cost * (1 + tax_rate) # Multiplication and addition
print("Total price with tax:", total_price) # Output: Total price with tax: 16.74

average_score = (85 + 92 + 78) / 3 # Division often results in a float
print("Average score:", average_score) # Output: Average score: 85.0
```
**Important Note:** Due to how computers store floating-point numbers, sometimes you might see very tiny inaccuracies in calculations (e.g., `0.1 + 0.2` might result in `0.30000000000000004` instead of exactly `0.3`). For most everyday programming, this isn't an issue, but it's good to be aware of for very precise scientific or financial calculations.

### Strings (`str`): Text and Characters
Strings are sequences of characters, like letters, numbers, symbols, and spaces. They are used for names, messages, addresses, and any kind of text data. In Python, you create a string by enclosing the text in either single quotes (`'`) or double quotes (`"`). It doesn't matter which you use, as long as you're consistent within a single string.

```python
# Examples of strings
user_name = "Maria"
greeting = 'Hello, world!'
address = "123 Main St, Anytown"
message = "Python is fun!"
```
You can combine strings using the `+` operator; this process is called **concatenation**. It's like gluing pieces of text together.

```python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name # Adding a space in between
print("Full name:", full_name) # Output: Full name: John Doe

welcome_message = greeting + " " + user_name + "!"
print(welcome_message) # Output: Hello, world! Maria!
```

### Booleans (`bool`): True or False
Booleans represent one of two fundamental values: `True` or `False`. They are absolutely essential for making decisions and controlling the flow of your code. For example, you might ask: "Is the light on?", "Is the user logged in?", "Is this number greater than 10?". The answer to these questions is always either true or false.

```python
# Examples of booleans
is_logged_in = True
has_permission = False
is_admin = True
```
Booleans are often the result of comparison operations, which evaluate whether a statement is true or false:

```python
age = 20
is_adult = age >= 18 # Is age greater than or equal to 18?
print("Is adult:", is_adult) # Output: Is adult: True

temperature = 5
is_freezing = temperature < 0 # Is temperature less than 0?
print("Is freezing:", is_freezing) # Output: Is freezing: False
```
We'll explore how to use booleans for conditional logic (like `if` statements) in a future lesson, but for now, understand them as simple true/false flags.

### Checking a Variable's Type with `type()`
Sometimes, especially when you're new to Python or debugging your code, you might want to confirm what data type a variable holds. Python provides a handy built-in function called `type()` for this purpose. You simply pass the variable name to `type()`, and it will tell you its class (which corresponds to its data type).

```python
my_integer = 100
my_float = 3.14
my_string = "Python"
my_boolean = True

print(type(my_integer))   # Output: <class 'int'>
print(type(my_float))     # Output: <class 'float'>
print(type(my_string))    # Output: <class 'str'>
print(type(my_boolean))   # Output: <class 'bool'>
```
This function is very useful for understanding how Python is interpreting your data and can help you avoid type-related errors.

### Type Conversion (Type Casting): Changing Data Types
What if you have a number stored as a string (like `"30"`), but you need to do math with it? Or what if you have a number and want to display it as part of a sentence? This is where **type conversion**, also known as **type casting**, comes in handy. It allows you to convert data from one type to another, provided the conversion makes sense.

Python provides [functions](../python/functions.md) named after each basic type to perform these conversions:
-   `int()`: Converts a value to an integer.
-   `float()`: Converts a value to a floating-point number.
-   `str()`: Converts a value to a string.
-   `bool()`: Converts a value to a boolean.

Let's see some practical examples:

**1. String to Integer/Float:**
This is a very common scenario, especially when you get input from a user, as input is always read as a string by default.

```python
user_input_age = "30" # This is currently a string!
print("Type of user_input_age:", type(user_input_age)) # Output: <class 'str'>

# Convert to an integer to perform mathematical operations
age_as_int = int(user_input_age)
print("Type after conversion:", type(age_as_int)) # Output: <class 'int'>
print("Next year you will be:", age_as_int + 1) # Now we can add numbers!

# Similarly, convert a string to a float
price_str = "25.75"
price_float = float(price_str)
print("Type of price_float:", type(price_float)) # Output: <class 'float'>
print("Double the price:", price_float * 2)
```
**Important:** You can only convert a string to a number if the string actually *looks* like a valid number. Trying to convert `"hello"` to an `int` will cause a `ValueError`!

```python
# This will cause an error!
# invalid_number_str = "hello"
# int(invalid_number_str) # Uncomment to see the error!
```

**2. Number to String:**
This is useful when you want to combine numbers with text, as you can only concatenate strings with other strings.

```python
score = 95
# If you try to add a string and an integer directly, Python will raise an error.
# error_message = "Your score is: " + score # This would cause a TypeError!

# Convert the score to a string before concatenating
message = "Your score is: " + str(score)
print(message) # Output: Your score is: 95

temperature = 23.5
report = "The current temperature is " + str(temperature) + " degrees Celsius."
print(report) # Output: The current temperature is 23.5 degrees Celsius.
```

**3. Number to Boolean:**
When converting numbers to booleans:
-   `0` (for integers) or `0.0` (for floats) converts to `False`.
-   Any other non-zero number (positive or negative) converts to `True`.

```python
print(bool(0))    # Output: False
print(bool(1))    # Output: True
print(bool(-5))   # Output: True
print(bool(0.0))  # Output: False
print(bool(0.001))# Output: True
```

**4. String to Boolean:**
When converting strings to booleans:
-   An empty string `""` converts to `False`.
-   Any non-empty string (even if it contains spaces or the word "False") converts to `True`.

```python
print(bool(""))       # Output: False (empty string)
print(bool("hello"))  # Output: True (non-empty string)
print(bool(" "))      # Output: True (space is a character, so it's non-empty)
print(bool("False"))  # Output: True (because it's a non-empty string, not the boolean False itself)
```
This last example is a common point of confusion! The string `"False"` is not the same as the boolean `False`. When converting a string to a boolean using `bool()`, Python only cares if the string has content or not.

## Wrap-Up
You've taken a huge step in your programming journey! You now understand that **variables** are essential for storing and managing data in your programs, acting like labeled containers in your computer's memory. You've also learned about the fundamental **data types** in Python – `int` for whole numbers, `float` for decimals, `str` for text, and `bool` for true/false values – and why distinguishing between them is important for correct operations. Finally, you can now inspect a variable's type using `type()` and convert between types using [functions](../python/functions.md) like `int()`, `float()`, `str()`, and `bool()`.

These concepts are the absolute building blocks for almost everything you'll do in Python. With variables and data types under your belt, you're ready to start manipulating information in more complex ways. In the next lesson, we'll start putting these variables to work by performing various operations on them!