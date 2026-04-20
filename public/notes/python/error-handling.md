<a id="concept-error-handling"></a>
# Error Handling

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between Syntax Errors and Runtime Errors (Exceptions) in Python.
- Understand why handling errors is crucial for robust programs.
- Implement basic error handling using `try` and `except` blocks.
- Utilize `else` and `finally` blocks to manage code execution flow during error handling.
- Apply error handling techniques to common scenarios like file operations and user input.

## Introduction
Imagine you're following a recipe to bake a cake. You carefully measure ingredients, mix them, and put the batter in the oven. But what if you misread a step, or an ingredient is missing? The cake might not turn out right, or worse, the oven might even smoke up!

Programming is a lot like following a recipe. You write instructions (your code) for the computer to follow. Most of the time, things go smoothly. But just like with a recipe, things can go wrong. Your program might encounter unexpected situations, like trying to divide by zero, or attempting to open a file that doesn't exist. When these unexpected situations occur, your program "breaks" or "crashes."

This is where **[Error Handling](../data-science/python-fundamentals.md#concept-error-handling)** comes in. It's about anticipating these problems and writing code that can gracefully deal with them, rather than just giving up and crashing. A program that can handle errors is more reliable, user-friendly, and robust. In Python, we primarily deal with errors using a mechanism called **Exception Handling**. Let's dive in and learn how to make our programs more resilient!

## Concept Progression

### What are Errors? The Two Main Types
Before we learn how to handle errors, we need to understand what kinds of errors we might encounter. In Python, errors generally fall into two main categories:

1.  **Syntax Errors**: These are like grammar mistakes in your recipe. The Python interpreter (the program that reads and runs your code) can't even understand what you're trying to say because your code doesn't follow Python's rules.
2.  **Runtime Errors (Exceptions)**: These are like problems that only appear *after* you start baking. Your recipe (code) might be perfectly written, but something unexpected happens *while* the computer is trying to execute it.

Let's look at each type in more detail.

### Syntax Errors
A **Syntax Error** occurs when you write code that violates Python's grammatical rules. The Python interpreter checks your code for these errors *before* it even tries to run it. If it finds a syntax error, it will stop immediately and tell you where the mistake is. Your program won't even start executing.

Think of it like trying to read a sentence with a missing period or a misspelled word. The meaning might be unclear, or the sentence might just be grammatically incorrect.

Here's an example:

```python
# This code has a syntax error
print("Hello, world!"

# The interpreter expects a closing parenthesis here
```

If you try to run this code, Python will give you an error message like this:

```
  File "<stdin>", line 2
    print("Hello, world!"
                         ^
SyntaxError: unexpected EOF while parsing
```

The `^` symbol points to where Python *expected* something but didn't find it, or where it found something it didn't expect. In this case, it expected a closing parenthesis `)` but reached the end of the file (EOF) instead.

[IMAGE_PLACEHOLDER: A simple diagram showing a Python script with a missing parenthesis in a `print()` statement. An arrow points to the end of the line where the parenthesis should be, and a red box highlights the `SyntaxError` message from the interpreter, emphasizing that the program didn't even start running.]

**Key takeaway**: Syntax errors prevent your program from starting. You must fix them before your code can run.

### Runtime Errors (Exceptions)
Unlike syntax errors, which stop your program before it even begins, **Runtime Errors** (also known as **Exceptions**) occur *during* the execution of your program. This means your code is syntactically perfect, and the Python interpreter understood your instructions, but something went wrong while it was trying to carry them out.

Consider our cake recipe again. The recipe might say "divide the batter into two equal parts." This instruction is perfectly clear. But what if you only have one bowl? Or what if the recipe says "bake at 350 degrees" but your oven is broken? These are problems that arise *during* the process, not because the recipe was badly written.

When a runtime error occurs, Python generates an **exception**. If this exception isn't handled, the program will terminate abruptly, displaying a "traceback" message that tells you what kind of error occurred and where in your code it happened.

Here are some common examples of runtime errors in Python:

**1. Division by Zero:**
You can't divide a number by zero in mathematics, and Python can't either.

```python
numerator = 10
denominator = 0
result = numerator / denominator # This will cause an error!
print(result)
```

Running this code will produce:

```
Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
ZeroDivisionError: division by zero
```

**2. Accessing a Non-Existent Variable:**
If you try to use a variable that hasn't been defined yet, Python won't know what you're talking about.

```python
print(undefined_variable) # This variable doesn't exist!
```

Output:

```
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'undefined_variable' is not defined
```

**3. Trying to Open a Non-Existent File:**
As you learned in the "File Input/Output" lesson, working with files can lead to errors if the file isn't where you expect it to be.

```python
# Assuming 'non_existent_file.txt' does not exist
file = open("non_existent_file.txt", "r")
content = file.read()
file.close()
print(content)
```

If `non_existent_file.txt` doesn't exist, you'll see a traceback like this:

```
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
FileNotFoundError: [Errno 2] No such file or directory: 'non_existent_file.txt'
```

[IMAGE_PLACEHOLDER: A flowchart showing a program execution path. One path shows normal execution. Another path shows a `ZeroDivisionError` occurring, leading to a "Program Crash" box with a "Traceback" message. The pedagogical intent is to show that runtime errors interrupt the normal flow.]

As you can see, when an exception is unhandled, your program stops dead in its tracks. This is usually not what we want in a user-friendly application. Fortunately, Python provides a way to "catch" these exceptions and respond to them gracefully.

### Handling Errors with `try` and `except`
Instead of letting our programs crash when an exception occurs, we can "catch" these exceptions and respond to them gracefully. This is done using `try` and `except` blocks. This mechanism allows your program to continue running even after an error, or at least to shut down in a controlled manner.

The basic idea is:
-   **`try`**: "Try to run this block of code. I suspect it might cause an exception."
-   **`except`**: "If an exception occurs in the `try` block, then run this code instead of crashing."

Here's the basic structure:

```python
try:
    # Code that might cause an exception
    # ...
except SomeExceptionType:
    # Code to run if SomeExceptionType occurs in the try block
    # ...
```

Let's revisit our division by zero example and make it robust:

```python
try:
    num1 = int(input("Enter a numerator: "))
    num2 = int(input("Enter a denominator: "))
    result = num1 / num2
    print(f"The result is: {result}")
except ZeroDivisionError:
    print("Error: You cannot divide by zero!")
```

In this example:
1.  Python first `try`s to execute the code inside the `try` block.
2.  If the user enters `0` for the denominator, a `ZeroDivisionError` occurs.
3.  Instead of crashing, Python immediately jumps to the `except ZeroDivisionError:` block.
4.  The message "Error: You cannot divide by zero!" is printed, and the program continues running (or ends gracefully), rather than crashing.

What if the user enters text instead of a number? The `int()` [function](../python/functions-in-python.md#concept-function) would raise a `ValueError`. We can handle that too by adding another `except` block:

```python
try:
    num1 = int(input("Enter a numerator: "))
    num2 = int(input("Enter a denominator: "))
    result = num1 / num2
    print(f"The result is: {result}")
except ZeroDivisionError:
    print("Error: You cannot divide by zero!")
except ValueError: # Catching a different type of exception
    print("Error: Invalid input. Please enter a number.")
```

Now, if the user types "hello" for a number, a `ValueError` will occur, and our second `except` block will handle it.

You can also catch multiple exceptions in a single `except` block using a tuple:

```python
try:
    num1 = int(input("Enter a numerator: "))
    num2 = int(input("Enter a denominator: "))
    result = num1 / num2
    print(f"The result is: {result}")
except (ZeroDivisionError, ValueError): # Catch both types of errors
    print("Error: Invalid input or division by zero occurred.")
```

Sometimes, you might want to catch *any* exception that occurs, especially during development or for very general error logging. You can do this by catching the base `Exception` class:

```python
try:
    # ... some code that might raise various exceptions ...
    value = int("abc") # This will cause a ValueError
    result = 10 / 0    # This will cause a ZeroDivisionError
except Exception as e: # Catches any exception and stores it in variable 'e'
    print(f"An unexpected error occurred: {e}")
```
While catching `Exception` can be useful, it's generally discouraged in production code unless you have a very specific reason. It can hide unexpected bugs by treating all errors the same way, making debugging harder. It's usually better to catch specific exceptions you anticipate.

Let's revisit our file example from earlier and apply `try-except` to prevent the crash:

```python
file_path = "non_existent_file.txt" # Assuming this file does not exist

try:
    with open(file_path, "r") as file: # Using 'with' statement for automatic closing
        content = file.read()
    print(f"File content: {content}")
except FileNotFoundError:
    print(f"Error: The file '{file_path}' was not found. Please check the path.")
except IOError as e: # Catch other I/O related errors (e.g., permissions)
    print(f"An I/O error occurred: {e}")
```
Now, if `non_existent_file.txt` doesn't exist, the program will print a helpful message instead of crashing, thanks to the `except FileNotFoundError` block.

### The `else` Block
Sometimes, you want to run a specific block of code *only if* the `try` block completed successfully, without any exceptions. This is where the `else` block comes in.

The `else` block is executed if and only if the `try` block finishes without raising an exception. It's a great place for code that depends on the `try` block's success.

```python
try:
    num1 = int(input("Enter a numerator: "))
    num2 = int(input("Enter a denominator: "))
    result = num1 / num2
except (ZeroDivisionError, ValueError):
    print("Error: Invalid input or division by zero occurred.")
else:
    # This code runs ONLY if no exception occurred in the try block
    print(f"Calculation successful! Result: {result}")
```

In this example, the "Calculation successful!" message will only appear if both inputs were valid numbers and the denominator was not zero. If any exception (like `ValueError` or `ZeroDivisionError`) occurs, the `else` block is skipped.

<a id="concept-finally-block"></a>
### The `finally` Block
The `finally` block is a powerful part of exception handling. The code inside the `finally` block will **always** be executed, regardless of whether an exception occurred in the `try` block, and regardless of whether it was caught by an `except` block.

This makes `finally` perfect for cleanup operations, like closing files, releasing network connections, or unlocking resources, ensuring they are always handled properly even if something goes wrong.

Let's look at a file operation example, which is a common scenario for `finally`:

```python
file_path = "my_data.txt"
file = None # Initialize file to None outside the try block

try:
    file = open(file_path, "r") # This might raise FileNotFoundError
    content = file.read()
    print(f"File content: {content}")
    # Imagine some other operation that might fail here
    # For example, processing content that causes another error
    # processed_content = 10 / 0
except FileNotFoundError:
    print(f"Error: The file '{file_path}' was not found.")
except Exception as e: # Catch any other unexpected errors
    print(f"An unexpected error occurred: {e}")
finally:
    # This block always runs, whether an error occurred or not
    if file: # Check if the file was actually opened before trying to close it
        file.close()
        print("File closed successfully.")
```

In this code:
1.  We initialize `file = None` outside the `try` block. This is important because if `open()` fails immediately (e.g., `FileNotFoundError`), the `file` variable would never be assigned inside `try`. Initializing it ensures `file` always exists for the `if file:` check in the `finally` block.
2.  We `try` to open and read a file.
3.  If `my_data.txt` doesn't exist, `FileNotFoundError` is caught, and the corresponding message is printed.
4.  If any other error occurs (e.g., `10 / 0` if uncommented), the generic `Exception` is caught.
5.  **Crucially**, the `finally` block will always execute. This ensures that `file.close()` is called, preventing resource leaks, even if an error stopped the `try` block prematurely. The `if file:` check is vital to prevent trying to close a file that was never successfully opened.

[IMAGE_PLACEHOLDER: A flowchart illustrating the execution flow of `try`, `except`, `else`, and `finally` blocks. It should show a main path for `try`. If an exception occurs, it branches to `except` and then to `finally`. If no exception occurs, it branches to `else` and then to `finally`. The `finally` block is shown as a common exit point for both success and failure paths.]

## Wrap-Up
Error handling is an essential skill for any programmer. By understanding the different types of errors and using `try`, `except`, `else`, and `finally` blocks, you can write Python programs that are more robust, reliable, and user-friendly. Instead of crashing, your programs can now gracefully inform users about problems and even attempt to recover or clean up resources.

In the next lesson, we'll explore more advanced ways to manage exceptions, including how to create your own custom exceptions and when it's appropriate to "raise" an exception yourself.