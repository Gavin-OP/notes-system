# Variables and Basic Data Types

## Learning Objectives
- Understand what a variable is and why it's essential for storing information in Python.
- Learn how to declare variables and assign different types of values to them.
- Identify and differentiate between fundamental Python data types: integers, floating-point numbers, strings, and booleans.
- Apply basic rules and conventions for naming variables effectively.
- Perform simple type conversions between different data types.

## Introduction
Imagine you're trying to remember a phone number, a shopping list, or a friend's birthday. You probably write it down, right? In programming, we often need to store pieces of information – like a user's name, a product's price, or whether a light is on or off. This is where **variables** come in!

Variables are like labeled containers or storage boxes in your computer's memory. They allow your program to remember and work with different pieces of data. Without them, your programs would be very rigid and unable to adapt to new information. In this lesson, we'll learn how to create these storage boxes, give them meaningful names, and understand the different kinds of "stuff" (data types) you can put inside them.

## Concept Progression

### What are Variables? Your Program's Memory Boxes

At its core, a variable is a name that refers to a value stored in the computer's memory. Think of it like this: you have a physical box, you put something inside it, and then you put a label on the outside of the box so you know what's inside without having to open it every time.

[IMAGE_PLACEHOLDER: A simple diagram showing a physical cardboard box. On the front of the box, a label reads "age". Inside the box, a number "30" is visible. An arrow points from the label "age" to the value "30" inside, illustrating that the variable name points to the stored value.]

**Why do we use variables?**
1.  **To store information:** This is the primary purpose. Any data your program needs to remember, from a user's input to a calculated result, can be stored in a variable.
2.  **To reuse information:** Once a value is stored in a variable, you can use that variable's name multiple times throughout your code without having to re-type the actual value.
3.  **To make code flexible:** If a value changes (like a user's age next year, or a product's price update), you only need to update it in one place (where the variable is defined), and all other parts of your code that use that variable will automatically get the new value.

**How do we create a variable?**
In Python, creating a variable and putting a value into it is called **assignment**. We use the single equals sign (`=`), which is known as the [assignment-operator](../python/assignment-operator.md). It's important to remember that `=` in programming means "assign the value on the right to the variable on the left," not "is equal to" like in mathematics.

Here's how it works:

```python
# Create a variable named 'user_name' and store the text "Alice" in it
user_name = "Alice"

# Create a variable named 'age' and store the number 30 in it
age = 30

# Create a variable named 'is_student' and store the truth value True in it
is_student = True

# Now we can use these variables
print(user_name)
print(age)
print(is_student)
```

When you run this code, Python creates these "boxes" in memory, puts the values in, and labels them. Then, `print()` uses those labels to retrieve and display the values.

Variables are also flexible! You can change the value stored in a variable at any time:

```python
score = 100
print(score) # Output: 100

score = 150 # The 'score' box now holds a new value
print(score) # Output: 150
```

### Naming Your Variables: Giving Your Boxes Good Labels

Just like you wouldn't label a box "stuff" if you wanted to find your shoes later, giving your variables clear and meaningful names is crucial. Good variable names make your code much easier to read, understand, and maintain for yourself and others.

Python has a few strict rules for naming variables:

1.  **Start with a letter or an underscore (`_`):** You cannot start a variable name with a number.
    *   `my_variable` (Good)
    *   `_internal_value` (Good, often used for special purposes)
    *   `1st_number` (Bad - starts with a number)
2.  **Can contain letters, numbers, and underscores:** No spaces or other special characters (like `!`, `@`, `#`, `$`, `%`, etc.).
    *   `total_score` (Good)
    *   `item_price_2` (Good)
    *   `user name` (Bad - contains a space)
    *   `product-id` (Bad - contains a hyphen, which Python interprets as a subtraction operator, not part of a name)
3.  **Case-sensitive:** `age`, `Age`, and `AGE` are considered three different variables.
    *   `my_age = 25`
    *   `My_Age = 30`
    *   These are two distinct variables in Python.
4.  **Avoid Python keywords:** Words that Python uses for its own syntax (like `if`, `for`, `while`, `print`, `True`, `False`, `None`) cannot be used as variable names. Using them would confuse Python and lead to errors.

**Naming Conventions (Best Practices):**
While the rules tell you what you *can't* do, conventions suggest what you *should* do for readability. In Python, the most common convention for variable names is **snake_case**:
*   All letters are lowercase.
*   Words are separated by underscores (`_`).

```python
# Good variable names (following snake_case convention)
first_name = "John"
last_name = "Doe"
total_items_in_cart = 5
is_logged_in = True

# Bad examples (violating rules or conventions)
# 2nd_item = "apple"  # Rule violation: starts with a number
# user-email = "john@example.com" # Rule violation: hyphen interpreted as subtraction
# UserName = "Jane" # Convention violation: not snake_case (this is PascalCase)
# totalItems = 10 # Convention violation: not snake_case (this is camelCase)
```

Sticking to `snake_case` makes your Python code consistent and easier for other Python developers (and your future self!) to understand.

### What are Data Types? The Kind of Stuff in Your Boxes

Now that we know how to create and name our memory boxes (variables), let's talk about the *kind* of stuff we can put inside them. When you put something into a variable, it's not just "stuff"; it's a specific *kind* of stuff. Is it a whole number? A number with a decimal? Text? A true/false statement? This "kind of stuff" is what we call a **data type**.

[IMAGE_PLACEHOLDER: A diagram showing four distinct boxes. Each box has a label: "Integer", "Float", "String", "Boolean". Inside the "Integer" box is "42". Inside the "Float" box is "3.14". Inside the "String" box is "Hello World!". Inside the "Boolean" box is "True". Arrows point from the label to the content, emphasizing the type of data.]

**Why do data types matter?**
Python needs to know what kind of data it's dealing with because different types of data behave differently and have different operations you can perform on them.
*   You can add two numbers (`5 + 3`).
*   You can combine two pieces of text (`"hello" + "world"`).
*   You can't "add" a number and text in the same way (`"hello" + 5` would cause an error because Python doesn't know how to combine these different types directly).
*   You can check if a boolean is `True` or `False` to make decisions in your code.

Python is a "dynamically typed" language, meaning you don't have to explicitly tell it the data type when you create a variable. Python figures it out automatically based on the value you assign. However, understanding these types is fundamental to writing correct and effective code.

You can always check the data type of a variable using the built-in `type()` function:

```python
my_variable = 10
print(type(my_variable)) # Output: <class 'int'>

another_variable = "Python"
print(type(another_variable)) # Output: <class 'str'>
```

Let's look at the most common basic data types:

### Integers (`int`): Whole Numbers

An [integer](../python/integer.md) is any whole number, positive or negative, without a decimal point. They are used for counting things, ages, years, scores, or anything that doesn't require fractional parts.

```python
# Examples of integers
number_of_apples = 10
my_age = 30
year = 2023
temperature = -5

print(type(number_of_apples)) # Output: <class 'int'>
```

You can perform standard arithmetic operations (addition, subtraction, multiplication, division, etc.) with integers.

### Floating-Point Numbers (`float`): Numbers with Decimals

A [floating-point-number](../python/floating-point-number.md) (often just called a "float") is a number that has a decimal point. These are used for measurements, prices, temperatures that aren't whole, or any value that requires fractional precision.

```python
# Examples of floats
price = 19.99
pi_value = 3.14159
temperature_celsius = 23.5
account_balance = 1000.50

print(type(price)) # Output: <class 'float'>
```

It's important to note that even if a number *could* be an integer, if you write it with a decimal point, Python will treat it as a float:

```python
# This is an integer
whole_number = 10

# This is a float, even though it has no fractional part
decimal_number = 10.0

print(type(whole_number))   # Output: <class 'int'>
print(type(decimal_number)) # Output: <class 'float'>
```

### Strings (`str`): Text and Characters

A [string](../python/string.md) is a sequence of characters, like letters, numbers, symbols, and spaces. Strings are used to represent text, such as names, messages, addresses, or any other textual data.

In Python, you create a string by enclosing the text in either single quotes (`'`) or double quotes (`"`). It doesn't matter which you use, as long as you're consistent within a single string.

```python
# Examples of strings
greeting = "Hello, world!"
user_name = 'Alice Smith'
product_code = "P123-XYZ"
sentence = "Python is fun!"

print(type(greeting)) # Output: <class 'str'>
```

If your string itself contains quotes, you can use the other type of quote to define the string to avoid syntax errors:

```python
message_with_single_quote = "He said, 'Hello!'"
message_with_double_quote = 'She replied, "Hi there!"'

print(message_with_single_quote)
print(message_with_double_quote)
```

### Booleans (`bool`): True or False

A [boolean](../python/boolean.md) is the simplest data type, representing one of two possible values: `True` or `False`. Booleans are fundamental for making decisions in your code, allowing your program to follow different paths based on conditions. They are often the result of comparison operations (e.g., is `x` greater than `y`?).

Notice that `True` and `False` start with a capital letter in Python – this is crucial!

```python
# Examples of booleans
is_active = True
has_permission = False
is_admin = True

print(type(is_active)) # Output: <class 'bool'>

# Booleans are often used in comparisons, which we'll cover more later
is_greater = (10 > 5) # Is 10 greater than 5? Yes, so this is True
is_equal = (7 == 7)   # Is 7 equal to 7? Yes, so this is True
is_less = (3 < 1)     # Is 3 less than 1? No, so this is False

print(is_greater) # Output: True
print(is_equal)   # Output: True
print(is_less)    # Output: False
```

### Type Conversion (Type Casting): Changing Data Types

Sometimes, you'll have data in one type, but you need it in another. For example, if a user types their age into an input box, Python will read it as text (a string), but you'll need to convert it to a number (an integer) to perform calculations. This process of changing a value from one data type to another is called [type-conversion](../python/type-conversion.md) or **type casting**.

Python provides built-in [functions](../python/functions.md) for this: `int()`, `float()`, `str()`, and `bool()`. You simply pass the value you want to convert inside the parentheses.

```python
# Converting a string to an integer
string_number = "123"
integer_number = int(string_number)
print(f"'{string_number}' as an integer: {integer_number}") # Output: '123' as an integer: 123
print(type(integer_number)) # Output: <class 'int'>

# Converting an integer to a float
my_int = 5
my_float = float(my_int)
print(f"{my_int} as a float: {my_float}") # Output: 5 as a float: 5.0
print(type(my_float)) # Output: <class 'float'>

# Converting a float to an integer (Important: it truncates, it does NOT round!)
price_float = 29.99
price_int = int(price_float)
print(f"{price_float} as an integer: {price_int}") # Output: 29.99 as an integer: 29
print(type(price_int)) # Output: <class 'int'>

# Converting a number to a string
age = 25
age_as_string = str(age)
print(f"{age} as a string: '{age_as_string}'") # Output: 25 as a string: '25'
print(type(age_as_string)) # Output: <class 'str'>

# Converting to boolean (understanding "truthiness" and "falsiness")
# In Python, many values are considered "truthy" or "falsy" when converted to a boolean.
# Falsy values (which become False): 0, 0.0, empty strings "", empty lists [], empty tuples (), empty dictionaries {}, None, and False itself.
# All other values are generally considered truthy (which become True).
value_true = bool(10)      # Non-zero number is True
value_false = bool(0)      # Zero is False
string_true = bool("hello") # Non-empty string is True
string_false = bool("")    # Empty string is False
none_false = bool(None)    # None is False
print(f"10 -> {value_true}, 0 -> {value_false}, 'hello' -> {string_true}, '' -> {string_false}, None -> {none_false}")
# Output: 10 -> True, 0 -> False, 'hello' -> True, '' -> False, None -> False
```

**Important Note:** Not all conversions are possible! For example, you cannot convert a string that doesn't represent a valid number into an integer or float. Attempting to do so will cause a `ValueError`:

```python
# This will cause an error!
# invalid_string = "hello"
# invalid_int = int(invalid_string) # ValueError: invalid literal for int() with base 10: 'hello'
```

Always ensure the data you're trying to convert is compatible with the target type to avoid runtime errors.

## Wrap-Up

Congratulations! You've taken a huge step in understanding how Python handles information. We've learned that variables are your program's way of remembering values, acting like labeled storage boxes. We also explored the fundamental data types:
*   **Integers (`int`)** for whole numbers.
*   **Floating-point numbers (`float`)** for numbers with decimals.
*   **Strings (`str`)** for text.
*   **Booleans (`bool`)** for `True`/`False` values.

Understanding variables and data types is foundational to all programming. They are the building blocks for storing and manipulating information. In the next lesson, we'll start putting these concepts to work by performing various operations with these data types, allowing your programs to do more than just store information – they'll be able to process it and make decisions!