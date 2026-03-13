# Error Handling (try-except)

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what an "exception" is and why programs need error handling.
- Use `try` and `except` blocks to gracefully catch and manage common errors.
- Handle different types of exceptions using multiple `except` blocks.
- Understand and apply the `else` block for code that runs only when no errors occur.
- Utilize the `finally` block for essential cleanup tasks that must always execute.

## Introduction
Imagine you've poured your effort into writing a brilliant Python program. It works flawlessly on your machine, but then someone else tries to use it, and suddenly, it crashes! Perhaps they accidentally typed text instead of a number, or maybe a crucial file your program needed wasn't where it was supposed to be. These unexpected hiccups are a natural, albeit frustrating, part of programming.

In Python, when something goes wrong that the program can't immediately resolve, it "raises an exception." If your code isn't prepared to "catch" this exception, your program will abruptly halt, often displaying a long, technical, and confusing error message (a "traceback") to the user. This isn't just inconvenient; it makes your program seem unreliable and difficult to use.

This lesson is dedicated to equipping you with the tools to anticipate these potential problems and teach your program how to respond gracefully. Instead of crashing, your program can display a friendly message, attempt an alternative action, or simply ensure all resources are properly closed before exiting. By mastering error handling, you'll make your code more robust, reliable, and user-friendly.

## Concept Progression

### What are Errors and Why Do They Happen?
In programming, an "error" or "exception" is an event that disrupts the normal flow of a program. Think of it like hitting an unexpected roadblock on a journey. If you don't have a plan to navigate around it, your journey (or program) comes to an abrupt halt.

Let's explore some common scenarios where these "roadblocks" frequently appear:

1.  **Trying to divide by zero:** Mathematically, this is undefined, and Python enforces this rule.
    ```python
    numerator = 10
    denominator = 0
    result = numerator / denominator # This line will cause a ZeroDivisionError!
    print(result)
    ```
    If you run this code, Python will raise a `ZeroDivisionError`.

2.  **Asking for a file that doesn't exist:** Your program might need to read data from a file, but what if the user deleted it, moved it, or simply typed the wrong name? (This builds on your knowledge from the `file-io` lesson!)
    ```python
    # Imagine 'non_existent_file.txt' is not in the current directory
    with open('non_existent_file.txt', 'r') as file: # This line will cause a FileNotFoundError!
        content = file.read()
    print(content)
    ```
    Running this will result in a `FileNotFoundError`.

3.  **Getting the wrong type of input:** If you ask a user for their age (expecting a number) but they type "twenty", your program will struggle to convert "twenty" into an integer.
    ```python
    age_str = input("Enter your age: ") # User types "hello"
    age_int = int(age_str) # This line will cause a ValueError!
    print(f"Your age is {age_int}")
    ```
    This would lead to a `ValueError`.

When these kinds of problems occur, Python doesn't just stop; it creates an "exception object" (an object representing the specific error) and "raises" it. If no part of your code is prepared to "catch" this exception, the program stops dead in its tracks, prints a traceback (that often long and scary-looking error message), and exits. Our primary goal is to catch these exceptions and handle them gracefully, preventing crashes and improving the user experience.

### The `try` and `except` Blocks: Catching Errors
To prevent our programs from crashing due to anticipated problems, Python provides the `try` and `except` blocks. These blocks work together like a safety net.

-   The `try` block contains the code that *might* cause an exception. It's like saying, "Try to run this code, but be aware it might encounter a problem."
-   The `except` block contains the code that runs *only if* a specific exception occurs within the `try` block. It's your plan B, your way of saying, "If something goes wrong here, specifically this type of error, then do this instead."

Let's revisit our division by zero example and add error handling:

```python
print("Starting the division program...")

try:
    numerator = 10
    # The user might enter 0, causing ZeroDivisionError, or text, causing ValueError
    denominator = int(input("Enter a denominator: "))
    result = numerator / denominator
    print(f"The result is: {result}")
except ZeroDivisionError:
    # This block executes if a ZeroDivisionError occurs in the try block
    print("Error: You cannot divide by zero!")
except ValueError:
    # This block executes if a ValueError occurs (e.g., non-integer input)
    print("Error: Invalid input. Please enter a whole number.")

print("Program finished.")
```

**What's happening here?**
1.  The code inside the `try` block is executed first.
2.  If the user enters `0` for the denominator, a `ZeroDivisionError` is raised. Python immediately stops executing the rest of the `try` block (the `result = ...` line is skipped) and jumps to the `except ZeroDivisionError:` block, executing its code.
3.  If the user enters text (like "abc"), `int(input(...))` will raise a `ValueError`. Python then jumps to the `except ValueError:` block.
4.  If no error occurs (e.g., the user enters `2`), the `try` block completes successfully, and *all* `except` blocks are skipped.
5.  Crucially, in all cases (whether an error occurred and was handled, or no error occurred), the program continues to execute the code *after* the `try-except` structure, printing "Program finished."

This is a significant improvement! Instead of crashing, the program provides a helpful message and continues running, making it much more user-friendly.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `try-except` flow. Start node "Program Start". Arrow to "Try Block". From "Try Block", two arrows: one labeled "No Exception" going to "Code after try-except", and another labeled "Exception Occurs" going to "Except Block". From "Except Block", an arrow goes to "Code after try-except". End node "Program End".]

### Handling Multiple Specific Exceptions
As you saw in the previous example, you can include multiple `except` blocks, each designed to catch a different type of exception. This is considered good practice because it allows you to provide specific, tailored error messages or recovery actions for different problems.

Let's consider a scenario where we're trying to read a number from a file, which could fail in a couple of ways:

```python
def read_number_from_file(filename):
    try:
        # Attempt to open the file
        with open(filename, 'r') as file:
            content = file.read() # Read the file's content
            number = int(content) # Try to convert content to an integer
            print(f"Successfully read number: {number}")
            return number
    except FileNotFoundError:
        # This block runs if the file doesn't exist
        print(f"Error: The file '{filename}' was not found.")
        return None
    except ValueError:
        # This block runs if the file exists but its content isn't a valid integer
        print(f"Error: The content of '{filename}' is not a valid integer.")
        return None
    except Exception as e: # A general catch-all for any other unexpected errors
        # This block catches any other type of exception not caught above
        print(f"An unexpected error occurred: {e}")
        return None

# Let's test our function with different scenarios:

print("--- Test 1: File exists with valid number ---")
with open("numbers.txt", "w") as f: # Create a temporary file for testing
    f.write("123")
read_number_from_file("numbers.txt") # Expected: Success

print("\n--- Test 2: File does not exist ---")
read_number_from_file("non_existent.txt") # Expected: FileNotFoundError

print("\n--- Test 3: File exists with invalid content ---")
with open("bad_number.txt", "w") as f: # Create another temporary file
    f.write("hello")
read_number_from_file("bad_number.txt") # Expected: ValueError
```

In this example:
-   `FileNotFoundError` is caught if the specified file doesn't exist.
-   `ValueError` is caught if the file exists but its content cannot be converted into an integer.
-   `except Exception as e:` is a general catch-all. It will catch *any* other type of exception that wasn't specifically caught by the preceding `except` blocks. We use `as e` to store the actual exception object in a variable `e`, which often contains useful information about the error. While useful for catching unforeseen issues, it's generally better practice to catch specific exceptions when you know what they might be, as a broad `Exception` catch can sometimes mask underlying bugs.

### The `else` Block: Code to Run When No Errors Occur
Sometimes, you have code that should *only* execute if the `try` block completes successfully, without raising any exceptions. This is precisely where the `else` block becomes incredibly useful.

The `else` block is executed *only if* the `try` block finishes without raising an exception. It's a perfect place to put code that logically depends on the successful execution of the `try` block's operations.

Let's refine our division example to include an `else` block:

```python
def safe_divide():
    try:
        num_str = input("Enter the numerator: ")
        den_str = input("Enter the denominator: ")

        numerator = int(num_str)
        denominator = int(den_str)

        result = numerator / denominator
    except ValueError:
        print("Error: Please enter valid whole numbers.")
    except ZeroDivisionError:
        print("Error: Cannot divide by zero.")
    else:
        # This code only runs if NO exceptions occurred in the try block
        print(f"Division successful! Result: {result}")
        print("Calculation complete.")
    finally:
        # We'll learn about 'finally' next, but it's included here for context
        print("Attempted division operation finished.")

print("--- Scenario 1: Successful division ---")
safe_divide()
# Expected output: prompts, then "Division successful!...", "Calculation complete.", "Attempted division operation finished."

print("\n--- Scenario 2: ZeroDivisionError ---")
safe_divide() # User enters 10, then 0
# Expected output: prompts, then "Error: Cannot divide by zero.", "Attempted division operation finished."

print("\n--- Scenario 3: ValueError ---")
safe_divide() # User enters "abc", then 2
# Expected output: prompts, then "Error: Please enter valid whole numbers.", "Attempted division operation finished."
```

Notice how the "Division successful!" and "Calculation complete." messages only appear when both inputs are valid numbers and the division is mathematically possible. If any error occurs, the `else` block is skipped entirely.

### The `finally` Block: Code That Always Runs
What if you have code that *must* execute, regardless of whether an exception occurred or not? For instance, if your program opens a file, it's crucial to close that file to release system resources, even if an error happened while reading or processing its content. This is the exact purpose of the `finally` block.

The code within the `finally` block is *always* executed. It runs after the `try` block, and after any `except` or `else` blocks, just before the entire `try-except-else-finally` statement concludes.

Let's use a file operation example to clearly illustrate the power of `finally`:

```python
def process_file_safely(filename):
    file = None # Initialize file to None; important if open() fails
    try:
        file = open(filename, 'r') # This might raise FileNotFoundError
        content = file.read()
        print(f"File content: {content}")
        # Imagine some processing that might raise another error
        if "error" in content.lower(): # Check for 'error' keyword (case-insensitive)
            raise ValueError("Content contains 'error' keyword!")
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
    except ValueError as e:
        print(f"Processing error: {e}")
    finally:
        # This block ALWAYS runs, whether an error occurred, was handled, or not.
        if file: # Only try to close if the file was actually opened (i.e., not None)
            file.close()
            print(f"File '{filename}' has been closed.")
        else:
            print(f"File '{filename}' was not opened.")

print("--- Scenario 1: File exists and processed successfully ---")
with open("data.txt", "w") as f: # Create a temporary file
    f.write("Hello world!")
process_file_safely("data.txt")

print("\n--- Scenario 2: File not found ---")
process_file_safely("missing.txt")

print("\n--- Scenario 3: File exists, but processing error ---")
with open("error_data.txt", "w") as f: # Create another temporary file
    f.write("This content has an error keyword.")
process_file_safely("error_data.txt")
```

In all three scenarios, the `finally` block ensures that if `file` was successfully opened (i.e., it's not `None`), `file.close()` is called. This is absolutely crucial for proper resource management, preventing issues like file locks or memory leaks.

[IMAGE_PLACEHOLDER: A detailed flowchart showing the full `try-except-else-finally` flow. Start node "Program Start". Arrow to "Try Block".
From "Try Block":
1. "No Exception" -> "Else Block" -> "Finally Block" -> "Code after try-except-else-finally".
2. "Exception Occurs" -> "Except Block (matching type)" -> "Finally Block" -> "Code after try-except-else-finally".
3. "Exception Occurs (no matching except)" -> "Finally Block" -> "Propagate Exception (program crashes)".
From "Finally Block", an arrow goes to "Code after try-except-else-finally". End node "Program End".]

## Wrap-Up
You've now learned the fundamental tools for robust error handling in Python! By skillfully using `try`, `except`, `else`, and `finally` blocks, you can write programs that not only anticipate problems but also respond gracefully, providing a much smoother and more reliable experience for your users.

Let's quickly recap the roles of each block:
-   `try`: Encloses the code that might raise an exception.
-   `except`: Your specific plan B for when a particular type of error occurs within the `try` block.
-   `else`: Contains code that runs *only if* the `try` block executes completely without any exceptions.
-   `finally`: Holds code that *always* runs, regardless of whether an exception occurred or not, making it ideal for cleanup tasks.

Mastering error handling is a critical step towards writing professional, resilient, and user-friendly Python applications. In future lessons, you might explore more advanced topics like creating your own custom exceptions or intentionally raising exceptions to signal specific problems within your own functions.