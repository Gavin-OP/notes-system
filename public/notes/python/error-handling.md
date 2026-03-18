# Error Handling

## Learning Objectives
By the end of this lesson, you will be able to:
- Distinguish between different types of errors that can occur in Python programs.
- Understand what exceptions are and why they are a crucial part of robust programming.
- Implement `try-except` blocks to gracefully handle exceptions and prevent program crashes.
- Utilize the `finally` block for essential cleanup operations, regardless of errors.
- Raise custom exceptions to signal specific problems within your own code.
- Apply basic debugging techniques to identify and resolve issues in your programs.

## Introduction
Imagine you've written a fantastic Python program, but then someone uses it in a way you didn't expect, or a file it needs is missing. What happens? Often, the program crashes, displaying cryptic messages and stopping dead in its tracks. This isn't a great user experience!

In the real world, programs encounter unexpected situations all the time. Files might not exist, network connections might drop, or users might enter invalid data. **Error handling** is the art and science of anticipating these problems and writing code that can gracefully recover or at least inform the user what went wrong, rather than just giving up. It's about making your programs more robust, reliable, and user-friendly.

This lesson will guide you through understanding different types of errors, learning how Python signals problems using "exceptions," and mastering the tools to handle these exceptions like a pro.

## Concept Progression

### What are Errors? The Two Main Types

Before we can effectively handle errors, we first need to understand what they are and how Python categorizes them. In Python, errors generally fall into two main categories: **Syntax Errors** and **Runtime Errors**.

#### Syntax Errors: The Grammar Police
Think of Python as having its own strict grammar rules. A **Syntax Error** occurs when you write code that violates these rules. It's like writing a sentence in English with incorrect punctuation or word order – the meaning might be unclear, or it might not be a valid sentence at all.

The important thing about syntax errors is that Python catches them *before* your program even starts to run. The interpreter can't understand what you're trying to say, so it refuses to execute the code at all.

**Example:**
Let's say you forget a colon at the end of an `if` statement:

```python
# This code has a syntax error!
if 5 > 2
    print("Five is greater than two")
```

If you try to run this, Python will immediately tell you:

```
  File "<stdin>", line 2
    if 5 > 2
            ^
SyntaxError: expected ':'
```

Python points exactly to where it expected the colon. These errors are usually straightforward to fix once you know the language's rules.

#### Runtime Errors: Unexpected Events During Execution
While syntax errors prevent your program from starting, **Runtime Errors** occur *while* your program is actually running. The code itself is grammatically correct (no syntax errors), but something unexpected happens during its execution that prevents it from completing successfully.

These errors are trickier because they often depend on the specific conditions at the moment the program runs – like user input, whether a file exists, or the status of a network connection.

**Example:**
Consider a program that asks the user for two numbers and divides them. What if the user enters `0` as the second number?

```python
# This code is syntactically correct, but can cause a runtime error
num1 = int(input("Enter the first number: "))
num2 = int(input("Enter the second number: "))

result = num1 / num2
print(f"The result is: {result}")
```

If `num2` is `0`, you'll get:

```
Enter the first number: 10
Enter the second number: 0
Traceback (most recent call last):
  File "<stdin>", line 5, in <module>
ZeroDivisionError: division by zero
```

The program ran for a bit, asked for input, but then crashed when it tried to perform an impossible operation (division by zero). This is a classic runtime error.

[IMAGE_PLACEHOLDER: A flowchart illustrating the two types of errors. Start with "Python Code". One path leads to "Syntax Check" -> "Syntax Error (Program doesn't start)" with an example of missing colon. The other path leads to "Program Execution" -> "Runtime Error (Program crashes during execution)" with an example of division by zero. Arrows indicate flow.]

### Introducing Exceptions: Python's Way of Signaling Trouble

As we just saw, runtime errors cause your program to crash. In Python, these runtime errors are specifically called **exceptions**. When something goes wrong during execution, Python "raises" an exception. If this exception isn't "handled" by your code, the program stops abruptly.

Think of an exception as an alarm bell. When Python encounters a problem it can't solve on its own (like dividing by zero, trying to open a non-existent file, or accessing a list index that doesn't exist), it rings an alarm. If no one is listening for that alarm, the program just stops.

There are many built-in exception types in Python, each indicating a specific kind of problem:
*   `ZeroDivisionError`: As seen, trying to divide by zero.
*   `NameError`: Trying to use a variable or function name that hasn't been defined.
*   `TypeError`: An operation is applied to an object of an inappropriate type (e.g., trying to add a number to a string without conversion).
*   `FileNotFoundError`: Trying to open a file that doesn't exist.
*   `IndexError`: Trying to access an index in a list or tuple that is out of bounds.

**Example: `NameError`**

```python
# This will cause a NameError
message = "Hello"
print(greeting) # 'greeting' was never defined
```

Output:

```
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
NameError: name 'greeting' is not defined
```

The `Traceback` is Python's way of showing you the sequence of function calls that led to the error, helping you pinpoint where the problem occurred. The last line usually tells you the type of exception and a brief description.

The goal of error handling is to "catch" these exceptions when they are raised, so your program can respond gracefully instead of crashing.

### Handling Exceptions with `try-except` Blocks

Now that we know what exceptions are, how do we catch them and prevent our programs from crashing? Python provides the `try-except` block for this purpose. It's like saying, "Try to run this code. If an exception happens, *don't crash*, but instead do this other thing."

The basic structure looks like this:

```python
try:
    # Code that might raise an exception
    # (This is the "risky" code you want to monitor)
except ExceptionType:
    # Code to execute if ExceptionType occurs in the try block
    # (This is your "fallback" or "recovery" code)
```

Let's revisit our division example and make it robust using `try-except`:

```python
try:
    num1 = int(input("Enter the first number: "))
    num2 = int(input("Enter the second number: "))
    result = num1 / num2
    print(f"The result is: {result}")
except ZeroDivisionError:
    print("Error: You cannot divide by zero!")
    print("Please try again with a non-zero second number.")
```

**How it works:**
1.  **`try` block**: Python attempts to execute the code inside the `try` block.
2.  **No exception**: If no `ZeroDivisionError` occurs, the `except` block is skipped, and the program continues normally after the `try-except` block.
3.  **Exception occurs**: If a `ZeroDivisionError` *does* occur within the `try` block, Python immediately stops executing the rest of the `try` block and jumps directly to the `except ZeroDivisionError:` block. The code inside the `except` block is then executed.

This way, instead of crashing, our program prints a helpful message to the user, making it much more user-friendly.

#### Catching Multiple Exceptions
What if your `try` block can raise different types of exceptions? You can handle this by including multiple `except` blocks:

```python
try:
    value = int(input("Enter a number: ")) # Can raise ValueError
    result = 10 / value                   # Can raise ZeroDivisionError
    print(f"Result: {result}")
except ValueError: # Catches if input is not a valid integer (e.g., "hello")
    print("Error: Invalid input. Please enter a whole number.")
except ZeroDivisionError: # Catches if the number entered is 0
    print("Error: Cannot divide by zero.")
except Exception as e: # A general except block (catches any other unexpected exception)
    print(f"An unexpected error occurred: {e}")
```

**Important Notes on `except` Blocks:**
*   You can catch specific exceptions by name, as shown above.
*   You can catch multiple specific exceptions in one `except` block using a tuple: `except (ValueError, TypeError):`.
*   A bare `except:` (without specifying an exception type) will catch *any* exception. While convenient, it's generally better to catch specific exceptions so you know exactly what problem you're handling. Catching everything can hide unexpected bugs. When catching a general `Exception`, it's good practice to use `except Exception as e:` to get details about the error, which can be very helpful for debugging.
*   The order of `except` blocks matters. If you have a general `except` block (like `except Exception:`), it should always come *last*, after any specific exception handlers. This is because Python tries `except` blocks in order, and a general one would catch specific exceptions before they have a chance to be handled by their dedicated block.

[IMAGE_PLACEHOLDER: A flowchart showing the execution flow of a try-except block. Start with "Start try block". An arrow points to "Execute code in try block". From there, two paths: "No Exception" -> "Continue after try-except". The other path is "Exception Occurs" -> "Does it match an except block?". If "Yes" -> "Execute matching except block" -> "Continue after try-except". If "No" -> "Program crashes (unhandled exception)".]

### The `finally` Block: Always Running Cleanup

Sometimes, you have code that *must* run, regardless of whether an exception occurred or not. A common example is closing a file or releasing a network connection. Even if an error happens while processing the file, you still want to make sure it's closed to prevent resource leaks.

This is where the `finally` block comes in. Code inside a `finally` block will **always** be executed, whether an exception was raised and handled, an exception was raised and *not* handled, or no exception occurred at all.

The structure is:

```python
try:
    # Code that might raise an exception
except ExceptionType:
    # Code to handle the exception
finally:
    # Code that will always execute
    # (e.g., cleanup operations like closing files)
```

**Example: File Handling with `finally`**

```python
file_path = "my_data.txt"
file = None # Initialize file to None. This is important!

try:
    file = open(file_path, "r") # This might raise FileNotFoundError
    content = file.read()
    print("File content:", content)
    # Simulate another error, e.g., trying to divide by zero
    # result = 10 / 0
except FileNotFoundError:
    print(f"Error: The file '{file_path}' was not found.")
except Exception as e: # Catch any other potential errors that might occur after opening
    print(f"An unexpected error occurred: {e}")
finally:
    # This block always runs
    if file: # Check if the file object was successfully created and is not None
        file.close()
        print("File closed successfully.")
    else:
        print("No file was opened or an error occurred before opening.")

print("Program continues after try-except-finally block.")
```

In this example:
*   If `my_data.txt` exists and no other error occurs, the file is read, and then the `finally` block ensures it's closed.
*   If `my_data.txt` does *not* exist, `FileNotFoundError` is caught, a message is printed, and then `finally` still runs. Since `file` was never successfully assigned an open file object (it remains `None`), the `if file:` check prevents `file.close()` from being called on a non-existent object.
*   If the file exists but an error like `ZeroDivisionError` (commented out) occurs *after* opening the file, the `except Exception as e:` block would catch it, and then `finally` would still close the file.

The `finally` block ensures that critical cleanup tasks are performed reliably, making your programs more robust against resource leaks.

### Raising Your Own Exceptions

Up to this point, we've focused on handling exceptions that Python automatically raises. However, sometimes Python doesn't automatically raise an exception, but *you* as the programmer know that something has gone wrong based on your program's specific logic. In such cases, you can explicitly **raise** an exception using the `raise` keyword. This is incredibly useful for validating input, enforcing constraints, or signaling specific error conditions within your own [functions](../python/functions.md) or classes.

The syntax is simple: `raise ExceptionType("Error message")`.

**Example: Validating User Input in a Function**

Let's say you have a function that calculates a person's age, but you want to ensure the birth year provided is reasonable (e.g., not in the future, or too far in the past).

```python
import datetime

def calculate_age(birth_year):
    current_year = datetime.datetime.now().year
    
    if birth_year > current_year:
        # This is an invalid birth year, so we raise an exception
        raise ValueError("Birth year cannot be in the future.")
    elif birth_year < 1900: # Just an arbitrary lower bound for this example
        raise ValueError("Birth year seems too far in the past.")
    
    age = current_year - birth_year
    return age

# Now, let's try to use our function with error handling
print("--- Test Case 1: Future Birth Year ---")
try:
    my_age = calculate_age(2030) # Future year
    print(f"Your age is: {my_age}")
except ValueError as e:
    print(f"Error calculating age: {e}")

print("\n--- Test Case 2: Valid Birth Year ---")
try:
    another_age = calculate_age(1985) # Valid year
    print(f"Your age is: {another_age}")
except ValueError as e:
    print(f"Error calculating age: {e}")
```

Output:

```
--- Test Case 1: Future Birth Year ---
Error calculating age: Birth year cannot be in the future.

--- Test Case 2: Valid Birth Year ---
Your age is: 39
```

By raising a `ValueError`, our `calculate_age` function clearly communicates that the input was unacceptable, and the calling code can then handle this specific error using a `try-except` block. This makes your [functions](../python/functions.md) more robust and predictable, as they explicitly define what constitutes valid input.

### Basic Debugging: Finding the Root Cause

Even with excellent error handling, you'll inevitably encounter bugs – situations where your program doesn't behave as expected, even if it doesn't crash. **Debugging** is the process of finding and fixing these bugs. While advanced debugging tools exist, for beginners, one of the most effective and simple techniques is using `print()` statements.

#### The Power of `print()`
When your program isn't working right, you can strategically place `print()` statements throughout your code to inspect the values of variables at different points, confirm that certain parts of your code are being executed, or track the flow of your program. This helps you narrow down where the unexpected behavior is originating.

**Example: Debugging a Calculation**

Let's say you have a function that's supposed to calculate the average of a list of numbers, but it's giving you an incorrect result, or perhaps crashing with an unexpected error.

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    
    # What if numbers is empty? len(numbers) would be 0, causing a ZeroDivisionError!
    if not numbers:
        # For this example, we'll return 0, but raising an exception
        # like ValueError("Cannot calculate average of an empty list")
        # would also be a valid and often better approach for robust code.
        return 0 

    average = total / len(numbers)
    return average

data = [10, 20, 30, 40, 50]
avg = calculate_average(data)
print(f"The average is: {avg}") # Expected: 30. What if it's not?
```

If `avg` was coming out wrong, or if the function was crashing with an empty list, you could add `print()` statements to trace its execution:

```python
def calculate_average(numbers):
    print(f"DEBUG: Input numbers: {numbers}") # Check input at the start
    total = 0
    for num in numbers:
        total += num
        print(f"DEBUG: After adding {num}, total is: {total}") # Track total in loop
    
    if not numbers:
        print("DEBUG: List is empty, returning 0 to avoid division by zero.")
        return 0 

    # Before division, check the values
    print(f"DEBUG: Final total: {total}, Length of numbers: {len(numbers)}")
    average = total / len(numbers)
    print(f"DEBUG: Calculated average: {average}") # Check final calculation
    return average

data = [10, 20, 30, 40, 50]
avg = calculate_average(data)
print(f"The final average is: {avg}")

print("\n--- Testing with an empty list ---")
empty_data = []
avg_empty = calculate_average(empty_data)
print(f"The final average for empty data is: {avg_empty}")
```

By adding these `print` statements, you can see exactly what's happening step-by-step and identify where the logic deviates from your expectations. Once you've found and fixed the bug, you can remove or comment out the `DEBUG` print statements.

While `print()` debugging is simple, it's incredibly powerful for understanding your code's behavior and is often the first tool a programmer reaches for.

## Wrap-Up

Congratulations! You've taken a significant step towards writing more robust and reliable Python programs. We started by understanding the difference between syntax errors (which prevent your code from running) and runtime errors, which Python calls **exceptions** (problems that occur during execution). You learned how to use `try-except` blocks to gracefully handle these exceptions, preventing your programs from crashing and providing helpful feedback. We also explored the `finally` block for essential cleanup tasks that must always run, and discovered how to `raise` your own exceptions to enforce specific conditions in your code. Finally, you got a taste of basic debugging using `print()` statements to trace your program's execution.

Mastering error handling is a hallmark of a professional programmer. It makes your code more resilient, user-friendly, and easier to maintain. As you continue your programming journey, you might explore more advanced debugging tools or learn how to create your own custom exception classes for even more specific error signaling.