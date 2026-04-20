<a id="concept-functions"></a>
# Functions

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain why functions are essential for writing organized and reusable code.
- Define your own functions in Python using the `def` keyword.
- Call functions and understand how to pass information to them.
- Differentiate between parameters and arguments.
- Utilize `return` statements to get results back from functions.
- Understand the concept of variable scope (local vs. global) within functions.
- Write clear documentation for your functions using docstrings.

## Introduction
Imagine you're building a complex machine, like a robot. Would you construct it as one giant, tangled piece of metal and wires? Probably not! Instead, you'd break it down into smaller, manageable parts: an arm, a leg, a head, each designed to do a specific job. These individual parts can be built, tested, and even reused in other robots.

Programming is very similar. As your Python programs grow, you'll find yourself writing certain blocks of code repeatedly, or you'll have a large task that can be broken down into smaller, more focused sub-tasks. This is where **[functions](../data-science/python-fundamentals.md#concept-functions)** come in!

Functions are like those individual, specialized parts of your robot. They are self-contained blocks of code designed to perform a specific action or calculation. By using functions, you make your code:
1.  **Organized**: Easier to read, understand, and manage, much like a well-organized toolbox.
2.  **Reusable**: Write a piece of code once and use it many times throughout your program, or even in different programs, avoiding repetition.
3.  **Easier to Debug**: If something goes wrong, you can isolate the problem to a specific [function](../python/functions-in-python.md#concept-function), making troubleshooting much simpler.

Let's dive in and see how we can start building these powerful code blocks to make our programs more efficient and elegant!

## Building Blocks: Defining and Using Functions

<a id="concept-function"></a>
### Defining and Calling Your First Function
At its core, a function is a named sequence of statements that performs a computation. In Python, you define a function using the `def` keyword, followed by the function's name, parentheses `()`, and a colon `:`. The code block that makes up the function's body is indented, just like loops or [conditional statements](../python/conditional-statements.md#concept-conditional-statements).

Think of defining a function like writing a recipe. You give the recipe a name (the function name), list any ingredients it needs (we'll get to those soon!), and then provide the step-by-step instructions (the function body).

Here's how you define a very simple function that just prints a greeting:

```python
def greet():
    """This function prints a simple greeting."""
    print("Hello, Python learner!")
```

Defining the function with `def` doesn't actually run the code inside it. It just tells Python that this "recipe" exists and what steps it contains. To make the function execute its instructions, you need to **call** it. You call a function by typing its name followed by parentheses `()`.

```python
# Define the function (create the recipe)
def greet():
    """This function prints a simple greeting."""
    print("Hello, Python learner!")

# Call the function to execute its code (make the recipe!)
greet()
```

When you run this code, you'll see:
```
Hello, Python learner!
```

The real power of [functions](../data-science/python-fundamentals.md#concept-functions) comes from their reusability. You can call the `greet()` function as many times as you want, and it will perform the same action each time, without you having to rewrite the `print` statement.

```python
greet()
greet()
greet()
```

Output:
```
Hello, Python learner!
Hello, Python learner!
Hello, Python learner!
```

### Functions with Parameters and Arguments
While our first function was simple, most useful functions need to work with specific pieces of information. For example, a function that calculates the area of a rectangle needs to know its length and width. This information is passed to the function using **parameters** and **arguments**.

Let's clarify the difference:
-   A **parameter** is a variable listed inside the parentheses in the [function](../python/functions-in-python.md#concept-function)'s `def` statement. It acts as a placeholder for the data the function expects to receive when it's called.
-   An **argument** is the actual value that is passed to the function when it is called. These values fill the placeholders defined by the parameters.

Let's extend our `greet` function to greet a specific person. We'll add a `name` parameter:

```python
def greet_person(name): # 'name' is a parameter
    """This function greets the person passed as an argument."""
    print(f"Hello, {name}!")

# Calling the function with arguments
greet_person("Alice") # "Alice" is an argument for the 'name' parameter
greet_person("Bob")   # "Bob" is an argument for the 'name' parameter
```

Output:
```
Hello, Alice!
Hello, Bob!
```

In this example:
-   `name` is the **parameter** defined in `greet_person()`. It's a variable that will hold whatever value is passed into the function.
-   `"Alice"` and `"Bob"` are **arguments** passed when `greet_person()` is called. When `greet_person("Alice")` is executed, the string `"Alice"` is assigned to the `name` parameter inside the function.

You can define functions with multiple parameters, separating them with commas. The order of arguments typically matters, as they are matched to parameters by position.

```python
def add_numbers(num1, num2): # num1 and num2 are parameters
    """This function adds two numbers and prints the result."""
    sum_result = num1 + num2
    print(f"The sum is: {sum_result}")

add_numbers(10, 5) # 10 and 5 are arguments, matching num1 and num2 respectively
add_numbers(100, 200)
```

Output:
```
The sum is: 15
The sum is: 300
```

When you call `add_numbers(10, 5)`, the value `10` is assigned to `num1` and `5` is assigned to `num2` within the function's execution.

### Returning Values from Functions
So far, our functions have performed actions like printing messages. But what if you want a function to perform a calculation and then give you the *result* so you can use it elsewhere in your program? This is where the `return` statement comes in.

The `return` statement allows a function to send a value back to the part of the code that called it. This is how functions "communicate" their results.

Let's modify our `add_numbers` function to return the sum instead of just printing it:

```python
def add_numbers_return(num1, num2):
    """This function adds two numbers and returns their sum."""
    sum_result = num1 + num2
    return sum_result # The function sends sum_result back to the caller

# Call the function and store the returned value in a variable
result1 = add_numbers_return(7, 3)
print(f"The first sum is: {result1}") # We can now use 'result1'

result2 = add_numbers_return(25, 10)
print(f"The second sum is: {result2}")

# You can also use the returned value directly in expressions
print(f"Double the sum of 4 and 6 is: {add_numbers_return(4, 6) * 2}")
```

Output:
```
The first sum is: 10
The second sum is: 35
Double the sum of 4 and 6 is: 20
```

A few important points about `return`:
-   When a `return` statement is executed, the function immediately stops, and the specified value is sent back to the caller. Any code after `return` in that function will not be executed.
-   A function can return any type of Python object (numbers, strings, lists, dictionaries, etc.).
-   If a function doesn't have an explicit `return` statement, or if it has a `return` statement without a value (e.g., `return`), it implicitly returns `None`. `None` is a special Python value that represents the absence of a value.

```python
def do_nothing():
    """This function does nothing and has no explicit return statement."""
    pass # 'pass' is a placeholder statement that does nothing

value = do_nothing()
print(value)
```

Output:
```
None
```
This shows that even without `return`, a function always sends *something* back, which defaults to `None`.

<a id="concept-variable-scope"></a>
### Variable Scope: Local vs. Global
When you define variables inside a function, they exist within that function's own isolated space, called its **local scope**. These variables are distinct from any variables with the same name defined outside the function, which reside in the **global scope**. This concept is called **variable scope**, and it determines where in your program a variable can be accessed or modified.

Think of it like this:
1.  **Global Scope**: This is the main "public area" of your program. Variables defined here are accessible from anywhere.
2.  **Local Scope**: Each function creates its own "private workspace." Variables defined inside this workspace are only visible and usable within that specific function.

Let's look at an example:

```python
global_message = "I am a global message." # This is a global variable

def my_function():
    local_message = "I am a local message." # This is a local variable
    print(local_message) # Accessible: local_message is in my_function's local scope
    print(global_message) # Accessible: global_message is in global scope, so functions can read it

my_function()

# Trying to access local_message outside the function will cause an error
# print(local_message) # Uncommenting this line would cause a NameError!

print(global_message) # Accessible: global_message is in global scope
```

Output:
```
I am a local message.
I am a global message.
I am a global message.
```
As you can see, `local_message` only exists while `my_function` is running. Once the function finishes, `local_message` is gone.

**Important Rule for Modifying Global Variables:**
While you can *read* global variables from inside a function, directly *modifying* them inside a function is generally discouraged. This is because it can lead to unexpected behavior (often called "side effects") and make your code harder to understand and debug. If you absolutely need to modify a global variable from within a function, you must explicitly declare your intention using the `global` keyword.

```python
counter = 0 # Global variable

def increment_counter():
    global counter # Declare that we intend to modify the global 'counter'
    counter += 1 # Now this modifies the global 'counter'
    print(f"Counter inside function: {counter}")

print(f"Counter before call: {counter}")
increment_counter()
print(f"Counter after call: {counter}")
```

Output:
```
Counter before call: 0
Counter inside function: 1
Counter after call: 1
```
Using `global` should be done sparingly. It's usually better practice to pass values into functions as arguments and return modified values. This makes functions more independent, predictable, and easier to test, as they don't rely on or directly alter external state.

### Documenting Functions with Docstrings
Good code isn't just about what it does, but also how easy it is for others (and your future self!) to understand. This is where **docstrings** come in. A docstring (documentation string) is a multi-line string used to explain what a function does, its parameters, and what it returns. It's a crucial part of writing professional and maintainable Python code.

Docstrings are placed immediately after the `def` line of a function, enclosed in triple quotes (`"""Docstring goes here"""`).

```python
def calculate_area(length, width):
    """
    Calculates the area of a rectangle.

    This function takes the length and width of a rectangle
    and returns its calculated area.

    Parameters:
        length (float): The length of the rectangle.
        width (float): The width of the rectangle.

    Returns:
        float: The calculated area of the rectangle.
    """
    area = length * width
    return area

# You can access a function's docstring using the built-in help() function
# or by accessing its special .__doc__ attribute.
help(calculate_area)
print("\n--- Accessing .__doc__ attribute ---")
print(calculate_area.__doc__)
```

Output from `help(calculate_area)`:
```
Help on function calculate_area in module __main__:

calculate_area(length, width)
    Calculates the area of a rectangle.

    This function takes the length and width of a rectangle
    and returns its calculated area.

    Parameters:
        length (float): The length of the rectangle.
        width (float): The width of the rectangle.

    Returns:
        float: The calculated area of the rectangle.
```

Output from `print(calculate_area.__doc__)`:
```

--- Accessing .__doc__ attribute ---
    Calculates the area of a rectangle.

    This function takes the length and width of a rectangle
    and returns its calculated area.

    Parameters:
        length (float): The length of the rectangle.
        width (float): The width of the rectangle.

    Returns:
        float: The calculated area of the rectangle.
```

Using docstrings helps you and others quickly grasp the purpose and usage of your functions without having to read through all the implementation details. Many Integrated Development Environments (IDEs) and documentation generation tools also use docstrings to provide helpful information as you write code.

## Wrap-Up
Congratulations! You've taken a significant step in your programming journey by learning about functions. You now understand why functions are vital for creating organized, reusable, and manageable code. You can define functions, pass information to them using parameters and arguments, retrieve results with `return` statements, navigate variable scope, and document your work with docstrings.

Functions are the fundamental building blocks of larger, more complex programs. As you continue to learn Python, you'll find yourself using and creating functions constantly to break down problems and build robust solutions. In the next lesson, we'll explore more advanced ways to define functions and handle arguments, giving you even more flexibility and power in your code!