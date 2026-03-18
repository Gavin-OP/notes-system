# Error Handling and Debugging

## Learning Objectives
- Understand what exceptions are and why they occur in Python programs.
- Learn how to gracefully handle runtime errors using `try`, `except`, and `finally` blocks.
- Be able to raise custom exceptions to signal specific error conditions in your code.
- Develop basic debugging skills to identify and fix logical errors in Python programs.

## Introduction
Imagine you've spent hours crafting a brilliant Python script. You run it, full of anticipation, and suddenly... an error message pops up! Your program crashes, leaving you scratching your head. This is a common experience for every programmer, from beginners to seasoned professionals. But what if you could prevent your program from crashing, or even better, understand exactly *why* it crashed and fix it?

That's where **Error Handling** and **Debugging** come in. **Error handling** is about anticipating problems and writing code that can gracefully recover or respond to them, rather than just giving up. **Debugging** is the art of finding and fixing mistakes (often called "bugs") in your code. Together, these skills are crucial for writing robust, reliable, and user-friendly Python applications. In this lesson, we'll explore how Python helps us manage these challenges, turning frustrating errors into opportunities for improvement.

## Concept Progression

### Exceptions: When Things Go Wrong (Gracefully)

In Python, when something unexpected or problematic happens during the execution of your program, Python doesn't just silently fail. Instead, it raises an **exception**. Think of an exception as Python's way of shouting, "Hey, something went wrong here, and I can't continue normally!" When an exception is raised, it interrupts the normal flow of your program.

Why is this useful? Because it gives *you*, the programmer, a chance to intervene. Without exceptions, your program might just produce incorrect results or freeze without any explanation. Exceptions provide detailed information about what went wrong and where, making it much easier to diagnose and fix issues.

Let's look at a common example: trying to divide by zero.

```python
# This code will cause an error
numerator = 10
denominator = 0
result = numerator / denominator
print(result)
```

If you run this code, you'll see an error message like this:

```
Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
ZeroDivisionError: division by zero
```

Here, `ZeroDivisionError` is the specific *type* of exception Python raised. The `Traceback` tells us exactly where in our code the problem occurred (line 3 in this case) and what kind of problem it was: we tried to divide by zero. Other common exceptions you might encounter include:
*   `NameError`: When you try to use a variable that hasn't been defined.
*   `TypeError`: When an operation is applied to an object of an inappropriate type (e.g., trying to add a number to a string).
*   `FileNotFoundError`: When you try to open a file that doesn't exist.

Understanding these messages is the first step in handling errors. They tell you *what* kind of problem occurred, allowing you to anticipate and address it.

### The `try`, `except`, and `finally` Blocks: Handling Exceptions

While exceptions are helpful for identifying problems, we don't want our programs to crash every time one occurs. This is where the `try`, `except`, and `finally` blocks come in. They allow you to "catch" exceptions and execute alternative code, preventing your program from stopping abruptly and instead allowing it to respond gracefully.

Here's the basic idea:
*   The `try` block contains the code that *might* raise an exception. This is the code you want to "monitor" for potential errors.
*   The `except` block contains the code that *runs if* a specific exception (or any exception) occurs within the `try` block. This is where you handle the error.
*   The `finally` block contains code that *always* runs, regardless of whether an exception occurred or not, or if it was handled. It's often used for cleanup operations.

Let's revisit our division by zero example and handle it gracefully:

```python
def safe_divide(a, b):
    try:
        # This code might cause a ZeroDivisionError or TypeError
        result = a / b
        print(f"The result of {a} / {b} is: {result}")
    except ZeroDivisionError:
        # This code runs if a ZeroDivisionError occurs in the 'try' block
        print("Error: Cannot divide by zero!")
    except TypeError:
        # You can catch multiple types of exceptions with separate 'except' blocks
        print("Error: Please provide numbers for division.")
    except Exception as e:
        # This is a general exception handler for any other unexpected errors
        # 'as e' allows you to access the exception object itself
        print(f"An unexpected error occurred: {e}")
    finally:
        # This code always runs, useful for cleanup or final messages
        print("Division attempt complete.")

print("--- Attempt 1: Valid Division ---")
safe_divide(10, 2)

print("\n--- Attempt 2: Division by Zero ---")
safe_divide(10, 0)

print("\n--- Attempt 3: Invalid Type ---")
safe_divide(10, "hello")

print("\n--- Attempt 4: Another Unexpected Error (e.g., NameError if 'a' was undefined) ---")
# For demonstration, let's simulate another error type
try:
    raise IndexError("Just a test index error")
except IndexError as e:
    print(f"Caught a simulated error: {e}")
finally:
    print("Simulated error handling complete.")
```

**Explanation of the `safe_divide` function:**
1.  In "Attempt 1", `10 / 2` executes successfully within the `try` block. The `except` blocks are skipped, and the `finally` block still runs.
2.  In "Attempt 2", `10 / 0` raises a `ZeroDivisionError`. Python immediately jumps to the `except ZeroDivisionError:` block, prints its specific error message, and then proceeds to the `finally` block. The program doesn't crash!
3.  In "Attempt 3", `10 / "hello"` raises a `TypeError`. Python jumps to the `except TypeError:` block, prints its message, and then proceeds to the `finally` block.
4.  The `except Exception as e:` block is a catch-all. It will catch any exception not caught by the more specific `except` blocks above it. It's good practice to catch specific exceptions first, then a general one if necessary, to provide more targeted error messages.

The `finally` block is particularly useful for ensuring that resources are properly closed or cleaned up, regardless of whether an error occurred. For example, if you open a file, you'd want to close it in a `finally` block to prevent resource leaks.

[IMAGE_PLACEHOLDER: A flowchart illustrating the execution flow of a try-except-finally block. It starts with 'Start Try Block'. If no exception, it goes to 'Code after Try/Except' and then 'Finally Block'. If an exception occurs, it branches to 'Except Block (if matching exception)'. After the 'Except Block', it goes to 'Finally Block' and then 'Code after Try/Except'. If no matching except block, it shows the program crashing.]

### Raising Exceptions: Creating Your Own Errors

While catching exceptions is crucial for handling unexpected problems, sometimes *you* might want to signal that something has gone wrong, even if Python hasn't raised an exception itself. This is where the `raise` statement comes in. You can `raise` an exception to stop the normal flow of execution and alert the calling code (or the user) about a problem you've detected.

Why would you want to do this?
*   **Input Validation:** A function might receive invalid input that it cannot process according to its design.
*   **Business Logic Violations:** Your program might reach a state that violates a core rule or assumption.
*   **Custom Error Types:** You might want to define your own specific types of errors for clarity and more precise handling.

Here's an example where we raise exceptions for invalid input to a function:

```python
def calculate_square_root(number):
    if not isinstance(number, (int, float)):
        # Raise a TypeError if the input is not a number
        raise TypeError("Input must be a number.")
    if number < 0:
        # Raise a ValueError if the number is negative
        raise ValueError("Cannot calculate square root of a negative number.")
    
    # In a real scenario, you'd use math.sqrt()
    print(f"Calculating square root of {number}...")
    # Simulate calculation
    return number ** 0.5

# Test cases using try-except to handle our raised exceptions
print("--- Valid Input ---")
try:
    print(f"Square root of 9: {calculate_square_root(9)}")
except (ValueError, TypeError) as e:
    print(f"Caught an error: {e}")

print("\n--- Negative Number Input ---")
try:
    print(f"Square root of -4: {calculate_square_root(-4)}") # This will raise a ValueError
except ValueError as e:
    print(f"Caught an error: {e}")
except TypeError as e: # This block won't be hit for -4
    print(f"Caught an unexpected type error: {e}")

print("\n--- Non-Numeric Input ---")
try:
    print(f"Square root of 'hello': {calculate_square_root('hello')}") # This will raise a TypeError
except TypeError as e:
    print(f"Caught an error: {e}")
except ValueError as e: # This block won't be hit for 'hello'
    print(f"Caught an unexpected value error: {e}")
```

In this `calculate_square_root` function, we explicitly check for invalid conditions (non-numeric input, negative number) and `raise` appropriate exceptions. This makes our function more robust and communicates clearly to anyone using it what kind of input it expects.

You can even define your own custom exception types by inheriting from Python's built-in `Exception` class. This allows you to create highly specific error conditions that are unique to your application:

```python
class InsufficientFundsError(Exception):
    """Custom exception raised when a withdrawal exceeds the account balance."""
    pass # 'pass' means this class does nothing extra beyond being an Exception

def withdraw(account_balance, amount):
    if amount <= 0:
        raise ValueError("Withdrawal amount must be positive.")
    if amount > account_balance:
        # Raise our custom exception with a descriptive message
        raise InsufficientFundsError(f"Attempted to withdraw {amount}, but only {account_balance} available.")
    
    new_balance = account_balance - amount
    print(f"Successfully withdrew {amount}. New balance: {new_balance}")
    return new_balance

# Example usage with custom exception handling
my_balance = 100
print(f"Initial balance: {my_balance}")

print("\n--- Valid Withdrawal ---")
try:
    my_balance = withdraw(my_balance, 50)
except (InsufficientFundsError, ValueError) as e:
    print(f"Transaction failed: {e}")

print(f"Balance after valid withdrawal: {my_balance}")

print("\n--- Excessive Withdrawal ---")
try:
    my_balance = withdraw(my_balance, 150) # This will raise InsufficientFundsError
except InsufficientFundsError as e:
    print(f"Transaction failed: {e}")
except ValueError as e:
    print(f"Invalid withdrawal: {e}")

print("\n--- Invalid Amount Withdrawal ---")
try:
    my_balance = withdraw(my_balance, -10) # This will raise ValueError
except InsufficientFundsError as e:
    print(f"Transaction failed: {e}")
except ValueError as e:
    print(f"Invalid withdrawal: {e}")
```
Custom exceptions make your code more readable and allow for more specific error handling by the calling code, as demonstrated by catching `InsufficientFundsError` separately.

### Debugging: Finding and Fixing Logic Errors

So far, we've focused on **runtime errors** (exceptions) that stop our program's execution. But what about errors where the program *runs* without crashing, but produces incorrect results? These are called **logic errors**, and they are often much harder to spot because Python doesn't tell you they've happened. For these, we need **debugging**.

Debugging is like being a detective for your code. You're looking for clues to understand why your program isn't behaving as expected, tracing its execution to find the exact point where your logic went astray.

#### 1. The `print()` Statement Method (The Beginner's Best Friend)

The simplest and most common debugging technique is to strategically place `print()` statements in your code. By printing the values of variables at different points, you can trace the flow of your program and see if variables hold the values you expect them to. This helps you pinpoint where your logic deviates from your intentions.

```python
def calculate_average(numbers):
    total = 0
    # Let's assume we want to calculate the sum of numbers
    # but there's a potential logic error in how 'total' is updated
    for num in numbers:
        total += num # Correct: total = total + num
        print(f"DEBUG: After adding {num}, current total is {total}") # Debug print
    
    count = len(numbers)
    print(f"DEBUG: Total numbers in list: {count}") # Debug print
    
    if count == 0:
        print("DEBUG: List is empty, returning 0.")
        return 0 # Or raise an error, depending on desired behavior for empty lists
    
    average = total / count
    print(f"DEBUG: Calculated average: {average}") # Debug print
    return average

print("--- Calculating average for [10, 20, 30] ---")
data = [10, 20, 30]
avg = calculate_average(data)
print(f"The final average is: {avg}")

print("\n--- Calculating average for an empty list ---")
empty_data = []
avg_empty = calculate_average(empty_data)
print(f"The final average of empty data is: {avg_empty}")
```

By observing the `DEBUG` output, you can follow the program's execution step-by-step. If `total` or `count` had an unexpected value at any point, the `print` statements would reveal it, helping you narrow down the location of the logic error. Once you've found and fixed the bug, remember to remove or comment out your `print()` statements.

#### 2. Using a Debugger (PDB: Python Debugger)

While `print()` statements are great for quick checks, a dedicated debugger offers much more power and control, especially for complex programs. Python comes with a built-in debugger called `pdb` (Python Debugger). It allows you to pause your program's execution at any point, step through code line by line, inspect variables, and even change their values on the fly.

To use `pdb`, you can insert `breakpoint()` (available in Python 3.7+) or `import pdb; pdb.set_trace()` (for older Python versions) into your code where you want to pause execution.

```python
def factorial(n):
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    if n == 0:
        return 1
    
    result = 1
    for i in range(1, n + 1):
        # We want to pause here and see what's happening in each iteration
        # import pdb; pdb.set_trace() # Use this for Python < 3.7
        breakpoint() # Use this for Python 3.7+
        result *= i
    return result

print("Calculating factorial of 3...")
print(factorial(3))
```

When you run this code, it will pause at the `breakpoint()` line and present you with a `(Pdb)` prompt in your terminal. This prompt indicates that the debugger is active and waiting for your commands. Here are some common `pdb` commands:

*   `n` (next): Execute the current line and move to the next line in the *current* function. It "steps over" function calls.
*   `s` (step): Execute the current line and step *into* any function calls on that line. Useful for debugging inside other [functions](../python/functions.md).
*   `c` (continue): Continue execution until the next breakpoint or the end of the program.
*   `p <variable_name>` (print): Print the value of a variable (e.g., `p result`, `p i`).
*   `l` (list): Show the code around the current line, helping you see where you are.
*   `q` (quit): Exit the debugger and terminate the program.

[IMAGE_PLACEHOLDER: A screenshot of a terminal showing a Python script paused at a `(Pdb)` prompt. The code snippet for the `factorial` function is visible, with an arrow pointing to the current line of execution. Below the code, a user has typed `p result` and `p i`, showing the output of these variables.]

Using a debugger takes a little practice, but it's an incredibly powerful tool for understanding complex code, tracking down elusive bugs, and gaining deep insight into your program's execution flow.

## Wrap-Up

Congratulations! You've learned two fundamental skills for writing robust Python programs: error handling and debugging. We started by understanding that **exceptions** are Python's way of signaling runtime problems, and how `try`, `except`, and `finally` blocks allow us to gracefully manage these situations, preventing crashes. We then explored how to `raise` our own exceptions to enforce rules and communicate specific error conditions within our code. Finally, we delved into **debugging**, learning how `print()` statements and the powerful `pdb` debugger can help us find and fix **logic errors** that don't crash our programs but lead to incorrect results.

Mastering these techniques will significantly improve the quality and reliability of your code, making you a more confident and effective Python developer. In the next lesson, we'll build on these foundations by exploring more advanced [file operations](../python/file-io.md), where robust error handling is often essential.