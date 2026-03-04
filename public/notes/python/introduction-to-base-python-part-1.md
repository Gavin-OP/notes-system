# Introduction to Python: Basic Operations and Built-in Data Types

- slug: introduction-to-base-python-part-1
- prerequisites: computer-science-fundamentals
- difficulty: 1/5
- estimated_time_minutes: 25
- tags: python, basics, data-types, operators, io, numbers, strings, booleans

## Learning Objectives
- Write simple Python programs with arithmetic, console output, and user input
- Identify and use common built-in data types (numbers, booleans, strings) to store simple data

## Core Explanation
Python is a versatile and beginner-friendly language. This unit introduces fundamental concepts: performing calculations using arithmetic operators (+, -, *, /, //, %, **), displaying information to the console with `print()`, and getting input from users with `input()`. You'll learn about essential built-in data types: numbers (integers for whole numbers, floats for decimals), booleans (True/False for logical states), and strings (sequences of characters for text). Understanding these basic building blocks is crucial for writing any Python program.

## Worked Examples
- x = 10
y = 3
print(f"Sum: {x + y}")
print(f"Quotient: {x / y}")
print(f"Remainder: {x % y}")
This shows basic arithmetic operations and formatted output using an f-string.
- name = input("Enter your name: ")
age_str = input("Enter your age: ")
age = int(age_str)
print(f"Hello, {name}! You are {age} years old.")
This example demonstrates taking string input, converting it to an integer for calculations, and using it in an f-string.
- is_active = True
can_proceed = False
print(f"Active status: {is_active}")
print(f"Can proceed? {can_proceed}")
# Booleans are often results of comparisons
age = 25
is_adult = age >= 18
print(f"Is adult? {is_adult}")
This example demonstrates assigning and printing boolean values, and how a comparison operation yields a boolean.

## Common Pitfalls
- Forgetting to convert `input()` (which always returns strings) to numbers before performing arithmetic operations, leading to type errors or unexpected string concatenation.
- Confusing integer division (`//`) with float division (`/`), especially when expecting decimal results.

## Practice Tasks
- Write a program to calculate the area of a rectangle from user-provided length and width. Print the result.
- Experiment with different arithmetic operators (e.g., `**` for exponentiation) and observe their results with various number types (integers, floats).
- Create a program that asks for your favorite color and a number. Print a sentence combining this information, e.g., 'My favorite color is [color] and my lucky number is [number].'
