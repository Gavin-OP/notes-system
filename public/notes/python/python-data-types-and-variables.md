<a id="concept-python-data-types-and-variables"></a>
# Python Data Types and Variables

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what data types are and why they are essential in programming.
- Understand the concept of variables and how to assign values to them in Python.
- Identify and use common built-in Python data types, including integers, floating-point numbers, booleans, and strings.
- Differentiate between mutable and immutable data types in Python.
- Write simple Python code to declare variables and work with basic data types.

## Introduction
Imagine you're organizing a kitchen. You have different kinds of food: some are solid, some are liquid, some are spices. You wouldn't store milk in a spice jar, or sugar in a liquid bottle, right? You use different containers for different types of food.

Programming is very similar! When you write code, you're constantly working with different kinds of information: numbers, text, true/false values, and more. Just like in the kitchen, your computer needs to know what *kind* of information it's dealing with so it can store it correctly and perform the right operations. This is where **data types** come in.

In Python, we also need a way to remember these pieces of information. Instead of writing down a number every time we need it, we can give it a name, like a label on a container. These names are called **variables**. In this lesson, we'll explore how Python handles different types of data and how you can use variables to store and manage that data in your programs.

## Concept Progression

<a id="concept-data-type"></a>
### What is a Data Type?
To begin our journey, let's define what we mean by "data type." In Python, a **data type** is simply a classification that specifies which type of value a variable has. It tells Python what kind of data you're working with. Why does this matter? Because different types of data behave differently and require different amounts of memory to store.

Think of it this way:
- If you have the number `5`, Python knows it's a whole number. You can do math with it, like `5 + 2`.
- If you have the word `"hello"`, Python knows it's text. You can't do `"hello" + 2` in the same way you do with numbers (though you can combine text in other ways!).
- If you have `True` or `False`, Python knows these are logical values used for making decisions.

Python is a **dynamically typed** language. This means you don't have to explicitly declare the data type of a variable when you create it. Python figures it out automatically based on the value you assign. This makes Python very flexible and often quicker to write code in compared to some other languages.

Let's see this in action:

```python
# Python automatically knows 30 is an integer
age = 30
print(type(age)) # Output: <class 'int'>

# Python automatically knows "Alice" is a string (text)
name = "Alice"
print(type(name)) # Output: <class 'str'>

# Python automatically knows 3.14 is a floating-point number
pi_value = 3.14
print(type(pi_value)) # Output: <class 'float'>
```

When you run this code, `type()` is a built-in Python function that tells you the data type of a value or variable. You'll see output like `<class 'int'>`, `<class 'str'>`, and `<class 'float'>`.

[IMAGE_PLACEHOLDER: A diagram showing different shapes of containers, each labeled with a Python data type (e.g., a square box for 'int' containing '10', a speech bubble for 'str' containing '"Hello"', a wavy container for 'float' containing '3.14', a light switch for 'bool' showing 'True'). Arrows point from the data to its respective container/type. Pedagogical intent: Illustrate the concept of data types as different "kinds" of data that need appropriate "containers" for storage and processing.]

### Variables: Naming Your Data
Now that we understand *what* data types are, how do we actually *store* and *label* these different kinds of information in our programs? We use **variables**.

A variable is essentially a name that refers to a value stored in the computer's memory. It's like putting a label on one of your kitchen containers. The label (`age`) doesn't *become* the milk; it just points to where the milk is stored. In Python, when you create a variable, you're not putting the data *into* the variable; you're making the variable a *reference* to an object (the data) in memory.

The process of giving a value to a variable is called **assignment**. You use the single equals sign (`=`) for this.

Here's how it works:

```python
# Assign the integer 10 to the variable 'score'
score = 10
print(score) # Output: 10

# Assign the string "Python" to the variable 'language'
language = "Python"
print(language) # Output: Python

# You can change the value a variable refers to
score = 15
print(score) # Output: 15

# Due to dynamic typing, you can even change the type of data a variable refers to
score = "Excellent!"
print(score) # Output: Excellent!
print(type(score)) # Output: <class 'str'>
```

Notice how the `score` variable first referred to an integer, and then later to a string. This flexibility is a key characteristic of Python's dynamic typing.

[IMAGE_PLACEHOLDER: A diagram illustrating variable assignment. On the left, a variable name (e.g., 'my_number') is shown as a label. An arrow points from this label to a memory address, which in turn contains a data object (e.g., the integer '42'). Below, another variable 'greeting' points to a string object '"Hello Python!"'. The diagram emphasizes that variables are names that *reference* data objects, not containers holding data directly. Pedagogical intent: Clarify the concept of variables as references to objects in memory.]

### Common Built-in Data Types
With variables in hand, let's now explore the most fundamental data types Python offers, which you'll use constantly in your coding journey.

<a id="concept-integer"></a>
#### 1. Integers (`int`)
Integers are whole numbers, positive or negative, without a decimal point. In Python, integers have **arbitrary-precision arithmetic**, meaning they can be as large or as small as your computer's memory allows, unlike in some other programming languages where integers have a fixed size limit.

```python
# Examples of integers
num1 = 100
num2 = -5
big_number = 12345678901234567890 # Python handles very large integers automatically
print(num1, num2, big_number)
print(type(num1)) # Output: <class 'int'>
```

<a id="concept-floating-point-number"></a>
#### 2. Floating-Point Numbers (`float`)
Floating-point numbers (or simply "floats") are numbers that have a decimal point. They are used to represent real numbers. Python's standard `float` type typically uses **double-precision** to store these numbers, offering a good balance of range and precision. However, it's important to remember that floating-point arithmetic can sometimes lead to small precision errors due to how computers store these numbers.

```python
# Examples of floating-point numbers
price = 19.99
temperature = -2.5
pi = 3.14159
print(price, temperature, pi)
print(type(price)) # Output: <class 'float'>
```

<a id="concept-character-string"></a>
#### 3. Character Strings (`str`)
A **character string** (often just called a "string") is a sequence of characters. Strings are used to represent text. You can define a string literal in Python using single quotes (`'...'`), double quotes (`"..."`), or even triple quotes (`"""..."""` or `'''...'''`) for multi-line strings.

```python
# Examples of strings
greeting = "Hello, world!"
name = 'Alice'
multi_line_text = """This is a string
that spans multiple lines."""
print(greeting)
print(name)
print(multi_line_text)
print(type(greeting)) # Output: <class 'str'>

# You can combine strings using the '+' operator (string concatenation)
full_name = name + " Smith"
print(full_name) # Output: Alice Smith

# Python also supports f-strings for easy string interpolation (formatting)
age = 30
message = f"My name is {name} and I am {age} years old."
print(message) # Output: My name is Alice and I am 30 years old.

# Raw strings (r"...") are useful when you don't want backslashes to be interpreted as escape characters
path = r"C:\Users\NewFolder\file.txt"
print(path) # Output: C:\Users\NewFolder\file.txt

# Python 3 handles text as Unicode by default, supporting a wide range of characters
emoji_string = "Hello 👋"
print(emoji_string) # Output: Hello 👋
```

<a id="concept-boolean-value"></a>
#### 4. Boolean Values (`bool`)
Boolean values represent truth values: `True` or `False`. These are fundamental for making decisions and controlling the flow of your program. They are often the result of comparison operations.

```python
# Examples of booleans
is_student = True
has_license = False
print(is_student, has_license)
print(type(is_student)) # Output: <class 'bool'>

# Booleans are often used in conditional statements
if is_student:
    print("This person is a student.")
else:
    print("This person is not a student.")
```

[IMAGE_PLACEHOLDER: A collage or infographic showing icons representing each common data type: a whole number '42' for Integer, a decimal number '3.14' for Float, a speech bubble with 'Hello!' for String, and a toggle switch (on/off) for Boolean. Each icon is clearly labeled with its Python type name (int, float, str, bool). Pedagogical intent: Provide a quick visual reference and summary of the basic data types.]

<a id="concept-immutable-object"></a>
### Mutability vs. Immutability
As you work with these data types, an important characteristic to understand is whether they can be changed *after* they're created. This brings us to the concept of **mutability** versus **immutability**.

An **immutable object** is an object whose state cannot be modified after it is created. If you try to "change" an immutable object, Python actually creates a *new* object with the modified value, and your variable then refers to this new object.

Think of it like a stone tablet: once you carve something into it, you can't change it. If you want different text, you need a new tablet.

**Immutable Data Types in Python (that we've covered):**
-   **Integers (`int`)**: You can't change the value of `5` to `6`. If you do `x = 5` and then `x = 6`, `x` now refers to a *new* integer object `6`.
-   **Floating-point numbers (`float`)**: Similar to integers.
-   **Boolean values (`bool`)**: `True` is always `True`, `False` is always `False`.
-   **Character strings (`str`)**: You cannot change individual characters within an existing string.

Let's look at an example with strings to illustrate this:

```python
my_string = "hello"
print(f"Original string: {my_string}, ID: {id(my_string)}")

# When we "change" my_string, Python actually creates a *new* string object "world".
# The variable 'my_string' then points to this new object.
my_string = "world"
print(f"New string: {my_string}, ID: {id(my_string)}")

# If you try to modify a character directly within an existing string, it will cause an error:
# my_string[0] = 'W' # This would raise a TypeError: 'str' object does not support item assignment
```
The `id()` function returns the unique identity (memory address) of an object. You'll notice that the ID changes, confirming that `my_string` is now pointing to a different object in memory.

**Mutable Data Types in Python:**
In contrast, a **mutable** object *can* be changed after it's created. You can modify its contents without creating a new object. Think of it like a whiteboard: you can erase and write new things on the same board.

We'll cover mutable types like `list` in detail in upcoming lessons, but for now, just know that they exist and behave differently. For example, you can add or remove elements from a list without creating a whole new list object.

Understanding mutability is crucial for predicting how your data will behave, especially when passing variables around in functions or when multiple variables refer to the same object.

[IMAGE_PLACEHOLDER: A split diagram showing "Immutable" on one side and "Mutable" on the other. Under "Immutable", show an integer '5' in a box, and an arrow pointing to a *new* box with '6' when an operation occurs, with the original '5' box remaining unchanged. Under "Mutable", show a list `[1, 2, 3]` in a box, and an arrow pointing to the *same* box now containing `[1, 2, 3, 4]` after an append operation. Use distinct colors or icons for each side. Pedagogical intent: Clearly illustrate the core difference between mutable and immutable objects through visual examples of their behavior upon "modification".]

## Wrap-Up
Congratulations! You've taken a significant step in your Python journey by understanding data types and variables. We've learned that data types categorize information (like numbers or text), and variables are the names we give to these pieces of data so we can use them in our programs. We also touched upon the important distinction between mutable and immutable data types, which will become even more relevant as you explore more complex data structures.

In the next lesson, we'll dive deeper into how you can perform operations with these data types, combining them, comparing them, and making your programs even more interactive and powerful. Keep practicing with these basic types, and you'll build a strong foundation for everything that comes next!