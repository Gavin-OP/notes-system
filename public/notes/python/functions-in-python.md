<a id="concept-functions-in-python"></a>
# Functions in Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Define what a function is and explain its purpose in Python programming.
- Understand how to define a function using the `def` keyword and how to execute it by calling it.
- Learn to pass information into functions using arguments (also known as parameters).
- Explain how functions can send values back to your program using the `return` statement.
- Grasp the concept of variable scope, distinguishing between local and global variables within functions.
- Understand the importance of documenting your functions with docstrings.

## Introduction
Imagine you're building a complex machine, like a robot. Would you construct it as one giant, tangled piece of metal and wires? Probably not! You'd break it down into smaller, manageable parts: an arm, a leg, a head, each with its own specific job. This modular approach makes the robot easier to build, understand, and repair.

Programming works much the same way. As your Python programs grow, you'll often find yourself writing the same or very similar blocks of code multiple times. This repetition can lead to messy, hard-to-read, and difficult-to-maintain code. This is where **functions** come to the rescue!

Functions are like mini-programs within your main program. They allow you to group related statements together to perform a specific, well-defined task. Once defined, you can use this block of code over and over again without rewriting it. This makes your code more organized, reusable, and much easier to debug. Let's dive in and see how to build these powerful tools in Python.

## Concept Progression

<a id="concept-function"></a>
### What is a Function?
At its core, a **function** is a named block of code designed to perform a specific task. Think of it like a recipe: a recipe has a name (e.g., "Chocolate Chip Cookies"), a list of ingredients (inputs), a set of instructions (the code inside the function), and it produces something (the output, like delicious cookies!).

In Python, we define a function using the `def` keyword, followed by the function's chosen name, a pair of parentheses `()`, and a colon `:`. The code that belongs to the function must be indented below this definition line.

Let's look at a simple example:

```python
def greet(): # 'greet' is the function's name
    print("Hello, Python learner!")
    print("Welcome to functions!")

# Now, let's "call" or "use" our function to make it run
greet()
```

When you run this code, you'll see:
```
Hello, Python learner!
Welcome to functions!
```

Here, `greet` is the name of our function. The two `print` statements are the instructions it executes. When we write `greet()`, we are *calling* the function, telling Python to run the code inside it. Without calling it, the function's code would never execute.

<a id="concept-function-arguments"></a>
### Passing Information with Function Arguments
Our `greet()` [function](../python/functions-in-python.md#concept-function) is nice, but what if we want to greet a specific person? This is where **function arguments** come in. Arguments are pieces of information you can pass into a function, allowing it to perform its task more flexibly. Think of them as the specific ingredients you provide to your recipe each time you make it.

You define arguments (which are called *parameters* in the function definition) inside the parentheses when you define the function.

```python
def greet_person(name): # 'name' is a parameter
    print(f"Hello, {name}!")
    print("Welcome to the world of Python functions!")

# Now, let's call it with different names (these are the arguments)
greet_person("Alice")
greet_person("Bob")
```

Output:
```
Hello, Alice!
Welcome to the world of Python functions!
Hello, Bob!
Welcome to the world of Python functions!
```

In this example, `name` is a *parameter* – a placeholder for the value that will be passed into the function. When we call `greet_person("Alice")`, the string `"Alice"` is the *argument* passed to the `name` parameter. The function then uses this `name` to customize its greeting. You can have multiple arguments, separated by commas.

```python
def add_numbers(num1, num2): # num1 and num2 are parameters
    sum_result = num1 + num2
    print(f"The sum is: {sum_result}")

add_numbers(5, 3) # 5 and 3 are arguments
add_numbers(100, 200)
```

Output:
```
The sum is: 8
The sum is: 300
```
Notice how the same `add_numbers` function can perform different calculations based on the arguments we provide, making it highly reusable.

<a id="concept-return-statement"></a>
### Getting Results Back with the Return Statement
So far, our functions have just printed things to the console. But what if we want a function to *give back* a value that we can use later in our program, perhaps to store in a variable or use in another calculation? This is achieved using the **return statement**. The `return` keyword sends a value back to the place where the function was called.

Let's refine our `add_numbers` function to return the sum instead of just printing it:

```python
def add_numbers_and_return(num1, num2):
    sum_result = num1 + num2
    return sum_result # This sends the sum_result back to the caller

# Now, when we call the function, we can store its result in a variable
total = add_numbers_and_return(10, 5)
print(f"The total from the function is: {total}")

# We can also use the returned value directly in other operations
double_total = add_numbers_and_return(7, 3) * 2
print(f"Double the sum is: {double_total}")
```

Output:
```
The total from the function is: 15
Double the sum is: 20
```

A function can return any type of [data](../data-science/data-fundamentals-and-types.md#concept-data): numbers, strings, lists, or even other functions! Once a `return` statement is executed, the function immediately stops, and no further code within that function will run. If a function doesn't have an explicit `return` statement, it implicitly returns `None` (Python's way of saying "nothing").

<a id="concept-variable-scope"></a>
### Understanding Variable Scope
When you create variables inside a [function](../python/functions-in-python.md#concept-function), where can they be accessed? This brings us to the crucial concept of **variable scope**. Scope refers to the region of a program where a variable is accessible.

In Python, variables defined inside a function have **local scope**. This means they can only be accessed from within that specific function. Variables defined outside of any function have **global scope** and can be accessed from anywhere in the program, including inside functions.

Let's illustrate this difference:

```python
global_message = "I am a global variable!" # This variable has global scope

def my_function():
    local_variable = "I am a local variable!" # This variable has local scope
    print(global_message) # Can access global_message because it's global
    print(local_variable) # Can access local_variable because it's defined here

my_function()

print(global_message) # We can access global_message here too

# Trying to access local_variable outside the function will cause an error!
# print(local_variable) # Uncommenting this line would cause a NameError
```

Output:
```
I am a global variable!
I am a local variable!
I am a global variable!
```

If you were to uncomment `print(local_variable)` outside `my_function()`, you would get a `NameError`. This error occurs because `local_variable` only exists while `my_function` is running. Once the function finishes its execution, `local_variable` is destroyed and no longer accessible. Understanding scope is crucial to avoid unexpected behavior and bugs in your programs, ensuring your variables are used exactly where you intend them to be.

### Documenting Your Functions with Docstrings
As your functions become more complex, or if you're working in a team, it's incredibly important to explain what they do, what arguments they expect, and what they return. This is where **docstrings** come in. A docstring (short for documentation string) is a multi-line string placed immediately after the function definition line.

Docstrings are not just comments; they are part of the function's metadata and can be accessed programmatically. They are the standard and highly recommended way to document your code in Python, making it understandable for yourself and others.

```python
def calculate_area(length, width):
    """
    Calculates the area of a rectangle.

    Args:
        length (float or int): The length of the rectangle.
        width (float or int): The width of the rectangle.

    Returns:
        float or int: The calculated area of the rectangle.
    """
    area = length * width
    return area

# You can access the docstring using the built-in help() function
print(help(calculate_area))

print("\n--- Docstring via __doc__ attribute ---")
# Or directly via the function's __doc__ attribute
print(calculate_area.__doc__)

print(f"\nArea of a 4x6 rectangle: {calculate_area(4, 6)}")
```

Output (truncated for brevity, `help()` output is usually more verbose):
```
Help on function calculate_area in module __main__:

calculate_area(length, width)
    Calculates the area of a rectangle.

    Args:
        length (float or int): The length of the rectangle.
        width (float or int): The width of the rectangle.

    Returns:
        float or int: The calculated area of the rectangle.

None

--- Docstring via __doc__ attribute ---

    Calculates the area of a rectangle.

    Args:
        length (float or int): The length of the rectangle.
        width (float or int): The width of the rectangle.

    Returns:
        float or int: The calculated area of the rectangle.

Area of a 4x6 rectangle: 24
```

Using docstrings consistently makes your code much more professional, maintainable, and understandable for anyone who might use or modify your functions.

<a id="concept-lambda-function"></a>
### Quick Look: Anonymous Functions (Lambda Functions)
Sometimes, you need a small, simple function for a short period, perhaps to pass as an argument to another function. For these specific cases, Python offers **lambda functions**, also known as anonymous functions because they don't have a formal `def` name.

Lambda functions are defined using the `lambda` keyword. They can take any number of arguments but are restricted to a single expression. The result of this expression is implicitly returned.

```python
# A regular function to double a number
def double(x):
    return x * 2

print(f"Using regular function: {double(5)}")

# The equivalent lambda function
double_lambda = lambda x: x * 2
print(f"Using lambda function: {double_lambda(5)}")

# Lambda functions are often used directly where a function is needed,
# for example, with higher-order functions like map()
numbers = [1, 2, 3, 4, 5]
squared_numbers = list(map(lambda x: x * x, numbers))
print(f"Squared numbers using lambda with map: {squared_numbers}")
```

Output:
```
Using regular function: 10
Using lambda function: 10
Squared numbers using lambda with map: [1, 4, 9, 16, 25]
```

While powerful for quick, single-expression tasks, remember that lambda functions are limited in what they can do. For more complex logic, multiple statements, or better readability, a regular `def` function is always the better and more Pythonic choice.

## Wrap-Up
Congratulations! You've taken a significant step in your Python journey by mastering functions. Functions are a cornerstone of good programming practice, allowing you to break down complex problems into smaller, manageable pieces. This makes your code modular, reusable, and much easier to understand and debug.

You've learned how to:
- **Define** functions using `def` and **call** them to execute their code.
- Pass data into functions using **arguments** (parameters).
- Get results back from functions using the `return` statement.
- Understand **variable scope**, distinguishing between local and global variables.
- Document your functions effectively with **docstrings**.
- Even got a peek at the concise world of **lambda functions** for quick, single-expression tasks.

As you continue your Python journey, you'll find yourself using and creating functions constantly. They are essential for writing efficient, clean, and scalable code. In the next topic, we'll explore even more advanced ways to use arguments and parameters in your functions, giving you even greater control and flexibility.