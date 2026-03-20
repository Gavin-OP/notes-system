<a id="concept-file-io-and-exception-handling"></a>
# File I/O and Exception Handling

## Learning Objectives
By the end of this lesson, you will be able to:
- Read data from and write data to text files using Python.
- Understand what exceptions are and why they occur in Python programs.
- Implement `try-except` blocks to gracefully handle common errors.
- Use the `finally` block to ensure critical cleanup operations always execute.
- Employ the `with` statement for safe and efficient resource management, especially with files.
- Utilize `assert` statements for debugging and validating program assumptions.

## Introduction
Imagine you've written a fantastic Python program that calculates complex statistics or generates personalized reports. That's great for the current run, but what if you want to save the results for later, or load data that someone else prepared? This is where **File Input/Output (File I/O)** comes in. It allows your programs to interact with the outside world by reading from and writing to files on your computer's disk.

However, interacting with external resources like files isn't always smooth sailing. What if the file you want to read doesn't exist? Or what if your program tries to write to a file but the disk is full? These unexpected events, known as **exceptions** or **errors**, can crash your program if not handled properly. Learning **exception handling** is crucial for writing robust and user-friendly applications that can gracefully recover from problems instead of abruptly stopping.

In this lesson, we'll first explore how to perform basic file operations. Then, we'll dive into the essential techniques for handling errors, ensuring your Python programs are both functional and resilient.

## Concept Progression

### Working with Files: The Basics (Writing and Reading)
At its core, working with files involves two main steps: opening the file and then performing an operation (reading or writing), followed by closing the file. Think of it like opening a book, reading or writing in it, and then closing it to put it back on the shelf.

Python provides the built-in `open()` [function](../python/functions-in-python.md#concept-function) to establish a connection with a file. When you open a file, you need to specify its name and the *mode* in which you want to open it.

Here are some common modes:
-   `'r'` (read mode): Opens a file for reading. The file must exist.
-   `'w'` (write mode): Opens a file for writing. If the file exists, its contents are truncated (erased). If it doesn't exist, a new file is created.
-   `'a'` (append mode): Opens a file for writing. If the file exists, new data is written to the end of the file. If it doesn't exist, a new file is created.

Let's start by writing some data to a file.

```python
# 1. Open the file in write mode ('w')
# If 'my_notes.txt' doesn't exist, Python creates it.
# If it exists, its content will be overwritten.
file_object = open('my_notes.txt', 'w')

# 2. Write some lines to the file
file_object.write("Hello, Python learners!\n")
file_object.write("This is a new line in the file.\n")
file_object.write("We are learning File I/O.\n")

# 3. Close the file
# This is crucial to save changes and free up system resources.
file_object.close()

print("Data written to my_notes.txt")
```

After running this code, you should find a new file named `my_notes.txt` in the same directory as your Python script, containing the three lines of text.

Now that we've written data, let's read the content back from `my_notes.txt`:

```python
# 1. Open the file in read mode ('r')
file_object = open('my_notes.txt', 'r')

# 2. Read the entire content of the file
content = file_object.read()
print("Content of the file:")
print(content)

# 3. Close the file
file_object.close()
```

The `read()` method reads the entire file content as a single string. If you want more control, like reading line by line, you can use `readline()` or iterate over the file object directly:

```python
# Reading line by line
file_object = open('my_notes.txt', 'r')
first_line = file_object.readline()
second_line = file_object.readline()
print(f"First line: {first_line.strip()}") # .strip() removes trailing newline characters
print(f"Second line: {second_line.strip()}")
file_object.close()

print("\n--- Reading with a loop (most common and efficient way) ---")
# Iterating through the file object
file_object = open('my_notes.txt', 'r')
for line_num, line in enumerate(file_object, 1):
    print(f"Line {line_num}: {line.strip()}")
file_object.close()
```

**Why is `file_object.close()` so important?**
When you open a file, your operating system allocates resources to manage that file. If you forget to call `close()`, these resources might remain locked, leading to:
-   Data not being saved correctly (especially for writing).
-   Other programs being unable to access the file.
-   Resource leaks, potentially slowing down your system or causing issues in long-running programs.

[IMAGE_PLACEHOLDER: A simple diagram showing a Python script box, an arrow labeled "open('filename', 'w')", a file icon on a disk, an arrow labeled "write()", then an arrow labeled "close()". Below, another Python script box, an arrow labeled "open('filename', 'r')", the file icon, an arrow labeled "read()", and then "close()".]

### When Things Go Wrong: Understanding Exceptions
Even with careful coding, things can go wrong when your program runs, especially when interacting with external resources like files. These "things" are called **exceptions**. An exception is an event that occurs during the execution of a program that disrupts the normal flow of instructions. When an exceptional event occurs, Python stops what it's doing and creates an "exception object." If this object isn't handled, the program will terminate abruptly and print a traceback (an error message).

Let's see an example of an exception related to file operations. If we try to read a file that doesn't exist, our program will crash:

```python
# This code will cause an error if 'non_existent_file.txt' does not exist
# Uncomment the following lines to see the program crash:
# file_object = open('non_existent_file.txt', 'r')
# content = file_object.read()
# print(content)
# file_object.close()
```
If you uncomment and run the lines above, Python will raise a `FileNotFoundError` and your program will stop. This is not ideal for a user who might just mistype a filename or for a program that needs to continue running even if one file is missing.

Common types of built-in exceptions include:
-   `FileNotFoundError`: When a file or directory is requested but doesn't exist.
-   `IOError`: For general I/O errors (e.g., disk full, permission denied).
-   `ValueError`: When a [function](../python/functions-in-python.md#concept-function) receives an argument of the correct type but an inappropriate value (e.g., trying to convert "hello" to an [integer](../python/python-data-types-and-variables.md#concept-integer)).
-   `TypeError`: When an operation or function is applied to an object of an inappropriate type (e.g., adding a number to a string without conversion).
-   `ZeroDivisionError`: When division or modulo by zero takes place.
-   `IndexError`: When an index is out of range for a sequence (like a list or tuple).
-   `KeyError`: When a dictionary key is not found.

The goal of exception handling is not to ignore errors, but to anticipate them and provide a controlled, graceful response, allowing your program to continue running or exit cleanly.

### Graceful Recovery: `try-except` Blocks
To prevent our programs from crashing due to exceptions, Python provides the `try` and `except` statements. The code that might raise an exception is placed inside the `try` block. If an exception occurs within the `try` block, Python immediately jumps to the corresponding `except` block, allowing you to handle the error without stopping the program.

Here's the basic structure:

```python
try:
    # Code that might raise an exception
    # ...
except ExceptionType:
    # Code to handle the specific exception
    # ...
```

Let's refine our file reading example to handle the `FileNotFoundError` we saw earlier, and also consider other potential issues:

```python
filename = 'my_notes.txt' # Or 'non_existent_file.txt' to test the error
try:
    file_object = open(filename, 'r')
    content = file_object.read()
    print(f"Successfully read from {filename}:\n{content}")
    file_object.close()
except FileNotFoundError:
    print(f"Oops! The file '{filename}' could not be found. Please check the filename and path.")
except PermissionError:
    print(f"You don't have permission to access '{filename}'. Please check your file permissions.")
except Exception as e: # Catch any other unexpected errors
    print(f"An unexpected error occurred while trying to read '{filename}': {e}")
```

In this example:
1.  The code inside `try` attempts to open and read the file.
2.  If a `FileNotFoundError` occurs (e.g., if `filename` is `'non_existent_file.txt'`), the first `except` block executes, printing a user-friendly message.
3.  If a `PermissionError` occurs (e.g., the file exists but you don't have rights to read it), the second `except` block executes.
4.  If *any other* exception occurs, the general `except Exception as e:` block catches it. This is a good fallback for unforeseen issues, but it's generally better to catch specific exceptions when possible, as it allows for more targeted error handling.

[IMAGE_PLACEHOLDER: A flowchart illustrating the try-except block. Start node -> "Code in try block" -> (If no exception) -> "Continue program" -> End node. From "Code in try block" -> (If ExceptionType occurs) -> "Code in except block" -> "Continue program" -> End node.]

### Ensuring Cleanup: The `finally` Block
What if an exception occurs *after* you've opened a file but *before* you've had a chance to close it? The `except` block might handle the error, but the file could remain open, leading to resource leaks.

This is where the `finally` block comes in handy. Code inside a `finally` block is **always executed**, regardless of whether an exception occurred in the `try` block or was handled by an `except` block. It's perfect for critical cleanup operations like closing files, releasing network connections, or ensuring data is saved.

```python
filename = 'my_notes.txt'
file_object = None # Initialize to None to handle cases where open() fails
try:
    file_object = open(filename, 'r')
    content = file_object.read()
    print(f"Successfully read from {filename}:\n{content}")
    # Imagine an error happens here, e.g., trying to divide by zero
    # result = 1 / 0
except FileNotFoundError:
    print(f"Oops! The file '{filename}' could not be found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    if file_object: # Check if the file was actually opened before trying to close
        file_object.close()
        print(f"File '{filename}' is now closed.")
```

In this revised example, even if an error like `ZeroDivisionError` (if `result = 1 / 0` was uncommented) or `FileNotFoundError` occurs, the `finally` block will ensure that `file_object.close()` is called, provided `file_object` was successfully assigned (i.e., the file was opened). This guarantees that system resources are properly released.

[IMAGE_PLACEHOLDER: A flowchart illustrating the try-except-finally block. Start node -> "Code in try block" -> (If no exception) -> "Code in finally block" -> "Continue program" -> End node. From "Code in try block" -> (If ExceptionType occurs) -> "Code in except block" -> "Code in finally block" -> "Continue program" -> End node.]

### The Pythonic Way: `with` Statements and Context Managers
While `try-finally` works well for resource management, Python offers an even cleaner and more idiomatic way for objects that need to be set up and then torn down: the `with` statement. The `with` statement is designed to simplify resource management by ensuring that a resource is properly acquired and released, even if errors occur.

Objects that can be used with a `with` statement are called **context managers**. File objects in Python are excellent examples of context managers. When you use `with open(...)`, Python automatically handles the opening and, most importantly, the closing of the file for you. You don't need to explicitly call `close()`, making your code cleaner and less prone to resource leaks.

```python
filename = 'my_notes.txt'

try:
    with open(filename, 'r') as file_object:
        content = file_object.read()
        print(f"Successfully read from {filename}:\n{content}")
    # The file is automatically closed here, even if an error occurred inside the 'with' block.
except FileNotFoundError:
    print(f"Oops! The file '{filename}' could not be found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

print("\nAttempting to write with 'with' statement:")
new_filename = 'daily_log.txt'
try:
    with open(new_filename, 'w') as log_file:
        log_file.write("Today's entry: All systems nominal.\n")
        log_file.write("Another event occurred.\n")
    print(f"Data written to {new_filename} and file closed automatically.")
except IOError as e: # IOError is a general exception for I/O operations
    print(f"Error writing to file: {e}")
```

The `with` statement is a powerful feature that aligns with the **Resource Acquisition Is Initialization (RAII)** principle, which states that resource acquisition should happen in the setup phase and resource release in the teardown phase. Python's context managers handle this automatically, making your code safer and more readable.

[IMAGE_PLACEHOLDER: A diagram showing a "Resource (e.g., File)" box. An arrow points from "Python Program" to "Resource" labeled "with open(...) as file_object:". Inside the `with` block, an arrow labeled "Operations (read/write)" points between "file_object" and "Resource". An automatic, dashed arrow from the end of the `with` block points back to "Resource" labeled "Automatic cleanup (close())".]

### Debugging with `assert` Statements
While `try-except` blocks are for handling runtime errors that you anticipate might happen in a deployed application (e.g., a user provides bad input, a file is missing), `assert` statements are primarily for **debugging** and for catching logical errors during development. An `assert` statement checks if a condition is true. If the condition is `False`, it raises an `AssertionError`, immediately signaling that an assumption in your code has been violated.

The syntax is simple:

```python
assert condition, "Optional error message"
```

Consider a function that expects a positive number:

```python
def calculate_square_root(number):
    assert number >= 0, "Input must be a non-negative number to calculate square root."
    # In a real scenario, you'd import math and use math.sqrt()
    return number ** 0.5

print(calculate_square_root(25))
# print(calculate_square_root(-4)) # Uncomment this line to see an AssertionError
```

When you uncomment and run `print(calculate_square_root(-4))`, it will raise an `AssertionError` with the message "Input must be a non-negative number to calculate square root.". This immediately tells the developer that an assumption about the input was violated, helping to pinpoint bugs early.

**When to use `assert` vs. `try-except`:**
-   **`assert`**: Use for internal sanity checks, to verify assumptions that *should always be true* if the code is working correctly. They are typically used during development and testing. In production environments, `assert` statements can be removed or ignored (when Python is run with the `-O` or `--optimize` flag), as they are not meant for handling expected user errors.
-   **`try-except`**: Use for handling external events or user input errors that are *expected* to occur occasionally and from which the program should gracefully recover. These are part of the program's normal error handling logic for users.

## Wrap-Up
In this lesson, you've gained essential skills for making your Python programs more powerful and robust. You learned how to interact with the file system to store and retrieve data, a fundamental capability for almost any real-world application. More importantly, you discovered how to anticipate and handle errors using `try-except-finally` blocks, and how to simplify resource management with the elegant `with` statement. Finally, you saw how `assert` statements can be a valuable tool during development to catch logical flaws early.

By mastering these concepts, you're well on your way to writing Python code that is not only functional but also resilient and user-friendly. In the next lesson, we'll build on these foundations by exploring more advanced data structures.