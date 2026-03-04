# Python Variables and Basic Types

- slug: python-variables
- prerequisites: none
- difficulty: 1/5
- estimated_time_minutes: 35
- tags: python, basics, types

## Learning Objectives
- Define variables using Python naming rules
- Differentiate int, float, str, and bool
- Use type conversion for simple input handling

## Core Explanation
Variables are names (or labels) that refer to objects in memory, where data is stored. In Python, you don't need to declare a variable's type explicitly; Python infers it based on the value assigned.

**Variable Naming Rules:**
*   Must start with a letter (a-z, A-Z) or an underscore (`_`).
*   Cannot start with a number.
*   Can contain letters, numbers, and underscores.
*   Are case-sensitive (`age` is different from `Age`).
*   Cannot be Python keywords (e.g., `for`, `if`, `while`).

The basic data types include:
- `int`: Whole numbers (e.g., 5, -10).
- `float`: Decimal numbers (e.g., 3.14, -0.5).
- `str`: Text, enclosed in single or double quotes (e.g., "hello", 'Python').
- `bool`: Boolean values, either `True` or `False`.

You can check a variable's type using the `type()` function. Python also allows **type conversion** using functions like `int()`, `float()`, and `str()`. These functions create new objects of the specified type from an existing value. This is crucial for tasks like handling user input, which is typically read as a string using the `input()` function and often needs to be converted to a numeric type for calculations.

## Worked Examples
- 1. Assigning and checking type:
   `age = 30`
   `name = "Alice"`
   `is_student = True`
   `print(type(age))` # Output: <class 'int'>
   `print(type(name))` # Output: <class 'str'>
- 2. Floating-point numbers:
   `pi_value = 3.14159`
   `temperature = -4.0`
   `print(type(pi_value))` # Output: <class 'float'>
- 3. Type conversion from string to integer:
   `user_input = "123"`
   `number = int(user_input)`
   `result = number + 7`
   `print(result)` # Output: 130
- 4. Type conversion from integer to string:
   `score = 100`
   `message = "Your score is " + str(score)`
   `print(message)` # Output: Your score is 100
- 5. Handling user input with type conversion:
   `user_age_str = input("Enter your age: ")` # user_age_str will be a string
   `user_age_int = int(user_age_str)`
   `print(f"In 5 years, you will be {user_age_int + 5} years old.")`
   `print(type(user_age_int))` # Output: <class 'int'>

## Common Pitfalls
- Using invalid variable names (e.g., starting with a number or using keywords).
- Forgetting to convert string input to numbers before performing arithmetic operations.
- Mixing incompatible types without explicit conversion, leading to `TypeError`.
- Confusing `int` (whole numbers) with `float` (decimal numbers).

## Quick Check Quiz
1. Which of the following is a valid Python variable name?
  - 0. 1st_name
  - 1. my-variable
  - 2. my_variable
  - 3. for
  - Answer: 2
  - Why: Variable names cannot start with a number or contain hyphens. 'for' is a reserved keyword.

2. What is the data type of the value `42.0`?
  - 0. int
  - 1. float
  - 2. str
  - 3. bool
  - Answer: 1
  - Why: Numbers with a decimal point are considered floats, even if the decimal part is zero.

3. What will be the output of `print(type(int("5") + 3))`?
  - 0. <class 'str'>
  - 1. <class 'int'>
  - 2. <class 'float'>
  - 3. <class 'bool'>
  - Answer: 1
  - Why: `int("5")` converts the string to an integer, then `5 + 3` results in an integer `8`.

4. Which function is used to check the data type of a variable in Python?
  - 0. data_type()
  - 1. get_type()
  - 2. type()
  - 3. typeof()
  - Answer: 2
  - Why: The built-in `type()` function returns the type of an object.

## Practice Tasks
- Create variables for your favorite book's title (str), publication year (int), and average rating (float). Print their types.
- Ask the user for their age using `input()`. Convert it to an integer and print their age in dog years (age * 7).
- Assign a boolean value to a variable `is_sunny`. Print a message based on its value (e.g., 'Wear sunglasses!' if True).
