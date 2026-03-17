# Error Handling with Exceptions

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between different types of errors in Python programs.
- Explain what an [exception](../python/exception.md) is and how to interpret a [traceback](../python/traceback.md).
- Implement basic [exception handling](../python/exception-handling.md) using `try` and `except` blocks.
- Utilize `else` and `finally` blocks to manage program flow and resources effectively.
- Understand when and how to use the `raise` statement to signal errors.

## Introduction
Imagine you're building a house. You have a blueprint, all the right tools, and you start working. But what happens if you accidentally use the wrong nail, or the wood isn't quite straight? Your house might not stand up, or it might have a serious flaw.

Programming is remarkably similar. We write precise instructions for the computer, but sometimes things go wrong. Maybe we made a typo, or the user entered unexpected data, or a crucial file we needed isn't where we expected it to be. When these "wrong things" happen, a program can crash, stopping abruptly and often losing unsaved work. This is frustrating for users and unprofessional for developers.

This lesson is all about making your programs more robust and user-friendly by learning how to anticipate and gracefully handle these problems. We'll explore how Python signals errors and, more importantly, how you can take control to prevent crashes and guide your program to a safe, predictable resolution.

## Concept Progression

### What are Errors? (And Why They Happen)
Before we can effectively handle errors, we first need to understand what they are and the different forms they can take in Python. Generally, errors fall into two main categories:

1.  **Syntax Errors:** These are like grammatical mistakes in English. Python can't understand your code because it violates the language's fundamental rules. These errors are usually caught *before* your program even starts running, during the parsing phase when Python first tries to make sense of your instructions. The Python interpreter will point them out immediately, preventing execution.

    **Example of a Syntax Error:**
    ```python
    # Missing a closing parenthesis
    print("Hello, world!"
    ```
    If you try to run this code, Python will immediately tell you:
    ```
      File "<stdin>", line 2
        print("Hello, world!"
                              ^
    SyntaxError: unexpected EOF while parsing
    ```
    The `^` symbol points to where Python expected something (in this case, a closing parenthesis) but didn't find it.

2.  **Runtime Errors (Exceptions):** These errors occur *while* your program is actually running. The code itself might be syntactically perfect, but something unexpected happens during execution that prevents it from continuing normally. For instance, trying to divide a number by zero, attempting to access a file that doesn't exist, or trying to convert a piece of text into a number when the text isn't a valid numerical string. When a runtime error occurs, Python "raises" an [exception](../python/exception.md). If this exception isn't explicitly handled by your code, your program will crash.

    **Example of a Runtime Error (Exception):**
    ```python
    # Trying to divide by zero
    result = 10 / 0
    print(result)
    ```
    Running this code will produce:
    ```
    Traceback (most recent call last):
      File "<stdin>", line 2, in <module>
    ZeroDivisionError: division by zero
    ```
    Here, `ZeroDivisionError` is the specific type of [exception](../python/exception.md) that Python raised because division by zero is mathematically undefined.

Understanding the difference is crucial: syntax errors prevent your code from ever starting, while runtime errors (exceptions) happen during execution and are the primary focus of our error-handling efforts in this lesson.

### Understanding Exceptions and Tracebacks
When a runtime error occurs and your program crashes, Python doesn't just stop; it provides a detailed report called a [traceback](../python/traceback.md). Think of a traceback as a "crime scene report" for your program – it tells you exactly what happened, where it happened, and the sequence of events that led to the crash. Learning to read these reports is an invaluable skill for any programmer.

Let's look at another common example, perhaps trying to open a file that doesn't exist (a scenario you might encounter often, especially with the `__MASK_0__` prerequisite):

```python
# Attempting to open a non-existent file
file_name = "non_existent_file.txt"
with open(file_name, 'r') as file:
    content = file.read()
print(content)
```

If `non_existent_file.txt` isn't in the same directory as your script, you'll see a traceback similar to this:

```
Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
FileNotFoundError: [Errno 2] No such file or directory: 'non_existent_file.txt'
```

**How to Read a Traceback:**
-   **"Traceback (most recent call last):"**: This line simply indicates the start of the traceback report.
-   **File and Line Number**: Each line starting with `File "..."` and `line ...` shows a step in the sequence of function calls that led to the error. Python executes code by calling [functions](../python/functions.md), and this part of the traceback shows the "call stack." The *last* `File` and `line` entry in the traceback is usually the most important for you, as it points to the exact location in your code (or a library function directly called by your code) where the exception was originally raised.
-   **Error Type and Message**: The very last line is the most critical. It clearly states the specific type of [exception](../python/exception.md) that occurred (e.g., `FileNotFoundError`, `ZeroDivisionError`, `ValueError`) and provides a brief, helpful message explaining what went wrong. This message often gives you enough information to understand and fix the problem.

Mastering the art of reading tracebacks is a fundamental skill for debugging and understanding why your programs fail.

### The `try` and `except` Blocks: Catching Exceptions
Now that we understand what exceptions are and how Python reports them, how do we prevent them from crashing our program? This is where [exception handling](../python/exception-handling.md) comes in, using the powerful `try` and `except` blocks.

The core idea is simple:
-   You place the code that *might* cause an exception inside a `try` block.
-   If an exception *does* occur within the `try` block, Python immediately stops executing the rest of the `try` block and jumps directly to the `except` block.
-   The `except` block contains the code that you want to execute to handle the error gracefully, allowing your program to continue running or exit cleanly.

**Basic `try-except` Structure:**
```python
try:
    # Code that might raise an exception
    # ...
except:
    # Code to execute if ANY exception occurs in the try block
    # ...
```

Let's revisit our division by zero example, but this time, we'll handle the potential error:

```python
try:
    numerator = int(input("Enter a numerator: "))
    denominator = int(input("Enter a denominator: "))
    result = numerator / denominator
    print(f"The result is: {result}")
except: # This catches ANY exception
    print("An error occurred! Please ensure you're not dividing by zero and enter valid numbers.")
```
If the user enters `0` for the denominator, instead of crashing, the program will print the friendly error message and continue.

While a general `except` block catches *any* exception, it's often better practice to catch specific types of exceptions. This allows you to provide more targeted error messages or handle different errors in different ways. Catching specific exceptions also prevents you from accidentally suppressing unexpected errors that you might not have anticipated.

```python
try:
    numerator = int(input("Enter a numerator: "))
    denominator = int(input("Enter a denominator: "))
    result = numerator / denominator
    print(f"The result is: {result}")
except ZeroDivisionError: # Catch only ZeroDivisionError
    print("Error: You cannot divide by zero!")
except ValueError: # Catch only ValueError (e.g., if input is not a number)
    print("Error: Please enter valid integer numbers.")
except Exception as e: # This is a catch-all for any other unexpected exception
    print(f"An unexpected error occurred: {e}")
```
In this improved example, we're specifically prepared for `ZeroDivisionError` (if the denominator is zero) and `ValueError` (if the user enters text instead of a number for input). The `except Exception as e:` block acts as a general fallback for any other unexpected exception. The `as e` part captures the exception object itself, allowing us to print its default message, which is often very informative. It's good practice to catch specific exceptions first, then a more general `Exception` if you need a final fallback. **Be cautious with a bare `except:` block, as it can hide important bugs by catching *all* errors, even those you didn't intend to handle.**

[IMAGE_PLACEHOLDER: A flowchart illustrating the `try-except` flow. Start node -> `try` block. From `try`, two paths: "No Exception" continues to "Code after try-except". "Exception Occurs" goes to `except` block, then to "Code after try-except".]

### The `else` Block: When No Exception Occurs
Sometimes, you have code that should *only* run if the `try` block completes successfully, without any exceptions being raised. This is where the `else` block comes in handy. The `else` block is executed immediately after the `try` block, but *only if* no exception was raised within the `try` block.

It's a great place for code that logically depends on the successful execution of the `try` block's operations.

**`try-except-else` Structure:**
```python
try:
    # Code that might raise an exception
except SpecificError:
    # Handle SpecificError
else:
    # Code to execute if the try block completed WITHOUT an exception
```

Let's refine our file reading example. We only want to process the file's content if we successfully opened and read it without any errors:

```python
file_name = "my_data.txt" # Make sure this file exists for testing!

try:
    with open(file_name, 'r') as file:
        content = file.read()
except FileNotFoundError:
    print(f"Error: The file '{file_name}' was not found.")
except IOError: # Catch other I/O related errors (e.g., permissions issues)
    print(f"Error: Could not read from file '{file_name}'.")
else:
    print(f"File '{file_name}' read successfully. Content length: {len(content)} characters.")
    # Now we can safely process 'content' because we know it was read without error
    words = content.split()
    print(f"Number of words: {len(words)}")
```
If `my_data.txt` exists and is readable, the `else` block will run, printing the content length and word count. If the file doesn't exist, the `FileNotFoundError` `except` block will run, and the `else` block will be entirely skipped, preventing any attempt to process non-existent content.

### The `finally` Block: Always Running Cleanup Code
What if you have code that absolutely *must* run, regardless of whether an exception occurred or not? This is common for "cleanup" operations, like closing a file, releasing a network connection, or ensuring a resource is freed. The `finally` block is specifically designed for this purpose.

The code inside a `finally` block will *always* execute. This holds true whether an exception was raised and handled, an exception was raised and *not* handled (leading to a crash), or no exception occurred at all. It guarantees that critical cleanup tasks are performed.

**`try-except-else-finally` Structure:**
```python
try:
    # Code that might raise an exception
except SpecificError:
    # Handle SpecificError
else:
    # Code if no exception occurred
finally:
    # Code that ALWAYS executes, regardless of exceptions
```

Consider our file example again. Even if an error occurs while reading, we want to ensure the file is properly closed. (While `with open(...)` handles file closing automatically, this example demonstrates the `finally` concept clearly for other resource types):

```python
file_object = None # Initialize to None outside the try block
try:
    file_name = "another_data.txt" # Replace with a real file for testing
    file_object = open(file_name, 'r') # This might raise FileNotFoundError
    content = file_object.read()
    print(f"File content: {content[:50]}...") # Print first 50 chars
except FileNotFoundError:
    print(f"Error: File '{file_name}' not found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    if file_object: # Check if the file was actually opened before trying to close
        file_object.close()
        print("File closed successfully in finally block.")
    else:
        print("File was not opened, so nothing to close.")
```
In this example, whether `another_data.txt` exists or not, or if some other error happens during reading, the `finally` block will execute. It checks if `file_object` was successfully assigned (meaning `open()` succeeded) and then closes it, ensuring no resources are left hanging open. This guaranteed execution makes `finally` invaluable for robust resource management.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `try-except-else-finally` flow. Start node -> `try` block. From `try`, three paths: "No Exception" goes to `else` block, then `finally` block. "Specific Exception" goes to `except` block, then `finally` block. "Unhandled Exception" (or any path) eventually leads to `finally` block before program termination or continuation. The `finally` block is a convergence point for all paths.]

### Raising Your Own Exceptions with `raise`
So far, we've focused on catching exceptions that Python automatically raises when something goes wrong. But what if *your* code detects a situation that is an error, even if Python doesn't automatically trigger an exception? For instance, a function might receive an invalid input that doesn't cause a `ValueError` but is still logically incorrect for your program's specific requirements.

The `raise` statement allows you to manually trigger an [exception](../python/exception.md). This is incredibly useful for:
-   Signaling an error condition in your own [functions](../python/functions.md) or methods when an invalid state is detected.
-   Re-raising an exception after you've partially handled it (e.g., logging the error, then letting it propagate up the call stack for further handling).
-   Enforcing specific constraints or business rules within your application.

**Syntax for `raise`:**
```python
raise ExceptionType("Optional error message")
```

Let's say you have a function that calculates the square root, but it should only work for non-negative numbers. While `math.sqrt()` would raise a `ValueError` for negative numbers, you might want to raise your own exception earlier or with a more specific message:

```python
import math

def calculate_square_root(number):
    if not isinstance(number, (int, float)):
        raise TypeError("Input must be a number (int or float).")
    if number < 0:
        # If the number is negative, it's an error for our function's logic
        raise ValueError("Cannot calculate square root of a negative number.")
    return math.sqrt(number)

# Example usage:
try:
    result1 = calculate_square_root(25)
    print(f"Square root of 25: {result1}")

    result2 = calculate_square_root(-9) # This will raise a ValueError
    print(f"Square root of -9: {result2}")

    result3 = calculate_square_root("hello") # This will raise a TypeError
    print(f"Square root of 'hello': {result3}")

except ValueError as e:
    print(f"Caught a ValueError: {e}")
except TypeError as e:
    print(f"Caught a TypeError: {e}")
```
When `calculate_square_root(-9)` is called, it explicitly `raise`s a `ValueError` with a custom message. Similarly, passing a string raises a `TypeError`. These exceptions are then caught by their respective `except` blocks, preventing the program from crashing and providing clear, specific error messages to the user or developer.

You can `raise` any built-in exception type, or for more complex applications, you can even define your own custom exception classes (a more advanced topic for later exploration).

## Wrap-Up
Congratulations! You've taken a significant step towards writing more robust and reliable Python programs. We started by understanding the fundamental difference between syntax errors and runtime errors (exceptions). You then learned how to interpret a [traceback](../python/traceback.md) to diagnose problems effectively and, most importantly, how to use the powerful `try`, `except`, `else`, and `finally` blocks to gracefully handle exceptions. Finally, you discovered how to use the `raise` statement to signal error conditions in your own code, making your [functions](../python/functions.md) more predictable and safer to use.

Mastering [exception handling](../python/exception-handling.md) is crucial for building applications that can withstand unexpected situations, provide meaningful feedback to users, and maintain a smooth operational flow. In future lessons, you might explore specific types of exceptions in more detail, learn how to create your own custom exception classes, or delve into more advanced error logging techniques. Keep practicing, and your programs will become significantly more resilient!