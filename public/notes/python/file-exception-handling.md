<a id="concept-file-exception-handling"></a>
# File Handling and Exception Handling

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the fundamental concepts of file input/output (I/O) in Python.
- Read from and write to text files using various Python methods.
- Differentiate between text and binary file handling and know when to use each.
- Implement robust error handling using `try`, `except`, and `finally` blocks.
- Create and raise custom exceptions to manage specific error conditions in your programs.

## Introduction
Imagine you're writing a brilliant Python program that calculates complex [data](../data-science/data-fundamentals-and-types.md#concept-data), generates reports, or even manages a small inventory. What happens to all that valuable information when your program finishes running or your computer shuts down? Poof! It's gone, lost forever in the temporary memory of your computer.

This is where **file handling** comes in. Just like you use a notebook to save important thoughts or a spreadsheet to store financial records, your Python programs can interact with files on your computer's hard drive. This allows your programs to read existing data, save new data, and persist information even after the program has closed. It's how your programs remember things!

But what if something goes wrong during this process? What if the file your program needs doesn't exist, or you try to write to a disk that's full? Without a plan, your program would simply crash, leaving users frustrated and data potentially corrupted. This is where **[exception handling](../python/file-exception-handling.md#concept-exception-handling)** becomes your superhero. It's a way to gracefully manage unexpected problems, allowing your program to recover, inform the user, or at least shut down without a dramatic failure.

In this lesson, we'll explore both of these crucial topics, starting with how to talk to files and then learning how to handle those inevitable "oops" moments with confidence.

## Concept Progression

<a id="concept-file-io"></a>
### Understanding File Input/Output (I/O)
At its core, **File I/O** (Input/Output) is about your program communicating with files stored on your computer's permanent storage, like a hard drive or SSD. Think of your program as a chef in a kitchen. The ingredients are the data, and the recipes are your code.

When your program is running, it holds data in its temporary memory (RAM), which is like the chef's cutting board – fast to access, but everything disappears when the chef stops working. Files, on the other hand, are like the pantry or a cookbook. They store ingredients ([data](../data-science/data-fundamentals-and-types.md#concept-data)) and recipes (code) permanently.

**Why do we need File I/O?**
1.  **Persistence**: Save data so it's not lost when the program ends.
2.  **Sharing**: Exchange data with other programs or users.
3.  **Large Data**: Work with datasets too big to fit into memory all at once.

The basic steps for file I/O are usually:
1.  **Open** the file.
2.  **Perform operations** (read or write).
3.  **Close** the file.

Forgetting to close a file can lead to data corruption or resource leaks, so it's a critical step!

[IMAGE_PLACEHOLDER: A diagram illustrating file I/O. On one side, a computer screen with Python code. On the other side, a hard drive icon representing permanent storage. An arrow labeled "Write Data" goes from the code to the hard drive. Another arrow labeled "Read Data" goes from the hard drive to the code. The process is cyclical, showing data moving between program memory and disk storage.]

### Working with Text Files
Most of the time, when you're dealing with human-readable information like configuration settings, logs, or simple data, you'll be working with **text files**. These files store characters (letters, numbers, symbols) that can be easily viewed and edited with a standard text editor.

Python makes handling text files straightforward. Let's look at how to write to a text file first.

#### Writing to a Text File
To write to a file, you first need to `open()` it. The `open()` [function](../python/functions-in-python.md#concept-function) takes at least two arguments: the file path and the mode. For writing, we use the mode `'w'` (write) or `'a'` (append).

-   `'w'` mode: **W**rites to the file. If the file exists, its content will be **truncated** (emptied) before writing. If it doesn't exist, a new file will be created. Use this when you want to start with a fresh, empty file.
-   `'a'` mode: **A**ppends to the file. If the file exists, new data is added to the end of its current content. If it doesn't exist, a new file will be created. Use this when you want to add to existing data without deleting it.

Let's write some simple text to a file:

```python
# Open a file in write mode ('w')
# If 'my_notes.txt' exists, its content will be erased.
# If it doesn't exist, it will be created.
file_object = open('my_notes.txt', 'w')

# Write a string to the file.
# The '\n' character adds a newline, just like pressing Enter.
file_object.write("Hello, Python learners!\n")
file_object.write("This is a new line in my file.\n")

# It's crucial to close the file to save changes and free up resources.
file_object.close()

print("Text written to my_notes.txt")
```

After running this code, you'll find a file named `my_notes.txt` in the same directory as your Python script, containing the two lines of text.

#### Reading from a Text File
To read from a file, you open it in `'r'` (read) mode.

```python
# Open the file in read mode ('r')
file_object = open('my_notes.txt', 'r')

# Read the entire content of the file as a single string
content = file_object.read()
print("\nContent of the file:")
print(content)

# Close the file
file_object.close()
```

This will print the content you just wrote.

#### The `with` Statement: A Safer and Cleaner Way
Manually calling `close()` can be easily forgotten, especially if an error occurs before `close()` is reached. If you forget to close a file, it can lead to data corruption, resource leaks, or even prevent other programs from accessing the file.

Python offers a much safer and cleaner way to handle files using the `with` statement. The `with` statement ensures that the file is automatically closed, even if errors occur within the block of code. This is often referred to as a "context manager."

```python
# Writing with the 'with' statement
# The file is automatically closed when the 'with' block is exited.
with open('my_notes.txt', 'w') as file_object:
    file_object.write("This is the first line.\n")
    file_object.write("And this is the second line.\n")

print("File written using 'with' statement.")

# Reading with the 'with' statement
with open('my_notes.txt', 'r') as file_object:
    content = file_object.read()
    print("\nContent read using 'with' statement:")
    print(content)

# Reading line by line is often more memory-efficient for large files
with open('my_notes.txt', 'r') as file_object:
    print("\nReading line by line:")
    for line in file_object:
        # .strip() removes leading/trailing whitespace, including the newline character
        print(line.strip())
```

The `with` statement is the preferred way to handle files in Python because it simplifies resource management and prevents common errors, making your code more robust and reliable.

### Handling Binary Files
While text files are great for human-readable data, sometimes you need to work with data that isn't meant to be read directly by humans, such as images, audio, video, or compiled programs. These are **binary files**.

The main difference when handling binary files is the mode you use: you add `'b'` to the mode string (e.g., `'wb'` for write binary, `'rb'` for read binary). When you read or write binary files, Python handles the data as raw `bytes` objects, not as text characters. This means you can't use methods like `write()` with a regular string; you must provide a `bytes` object.

```python
# Example: Writing binary data
# We'll write a sequence of bytes.
# The 'b' prefix indicates a bytes literal.
binary_data = b'\x48\x65\x6c\x6c\x6f\x20\x57\x6f\x72\x6c\x64' # This represents "Hello World" in hex bytes

with open('my_binary_file.bin', 'wb') as file_object:
    file_object.write(binary_data)

print("Binary data written to my_binary_file.bin")

# Example: Reading binary data
with open('my_binary_file.bin', 'rb') as file_object:
    read_data = file_object.read()
    print("\nContent read from binary file (as bytes object):")
    print(read_data)
    
    # If you know the original encoding, you can decode the bytes back into a string
    try:
        print(f"Decoded content: {read_data.decode('utf-8')}")
    except UnicodeDecodeError:
        print("Could not decode binary data as UTF-8 text.")
```

Notice the `b` prefix before the string literal `b'\x48...'`. This indicates a bytes literal. When reading, the `read()` method returns a `bytes` object. You can then `decode()` it into a string if you know the original encoding (like 'utf-8'), but be aware that not all binary data can be meaningfully decoded into text.

[IMAGE_PLACEHOLDER: A diagram comparing text file and binary file handling. On the left, a "Text File" icon with readable characters inside. An arrow points to a Python script, showing `open('file.txt', 'r')` and `read()` returning a string. On the right, a "Binary File" icon with abstract blocks of data. An arrow points to a Python script, showing `open('file.bin', 'rb')` and `read()` returning a bytes object. A small "b" is next to the file mode for binary.]

<a id="concept-exception-handling"></a>
### Introduction to Exception Handling
Now that we know how to interact with files, let's talk about what happens when things don't go as planned. In programming, these "things that go wrong" are called **exceptions**. An exception is an event that disrupts the normal flow of a program.

**Why is exception handling important?**
Imagine your program tries to open a file that doesn't exist. Without exception handling, your program would immediately stop running and display a traceback error message, which can be confusing and unhelpful to a user.

Let's see what happens when we try to open a non-existent file without any error handling:

```python
# This code will cause an error if 'non_existent_file.txt' doesn't exist
# Try running this block of code by itself:
# file_object = open('non_existent_file.txt', 'r')
# print(file_object.read())
# file_object.close()
```
If you run the commented-out code above, your program will crash and you'll see a `FileNotFoundError` traceback. This is an example of an exception.

**Exception handling** is your program's way of saying, "Okay, something unexpected happened, but I know how to deal with it without crashing." It allows you to define a block of code that should be executed when a specific type of error occurs, allowing your program to recover gracefully, inform the user, or log the issue before safely shutting down.

<a id="concept-try-except-finally-block"></a>
### The `try-except-finally` Block
Python provides the `try`, `except`, `else`, and `finally` keywords to implement robust [exception handling](../python/file-exception-handling.md#concept-exception-handling). This structure allows you to "try" a block of code, "catch" specific exceptions if they occur, execute code "else" if no exception happened, and "finally" execute cleanup code regardless of whether an exception occurred.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `try-except-finally` block. It starts with "Start `try` block". An arrow leads to "Execute code in `try`". From there, two paths: "No Exception" leads to "Skip `except` blocks" and then "Execute `else` block (if present)", then "Execute `finally` block". "Exception Occurs" leads to "Check `except` blocks". If a matching `except` is found, it goes to "Execute matching `except` block" and then "Execute `finally` block". If no matching `except` is found, it goes to "Uncaught Exception (Program Terminates)". All paths converge before "End `try-except-finally` block".]

#### `try` and `except`
The most common form is `try-except`. You put the code that might raise an exception inside the `try` block. If an exception occurs within the `try` block, Python immediately stops executing the rest of the `try` block and jumps to the appropriate `except` block.

```python
try:
    # Code that might cause an error, like trying to open a non-existent file
    file_name = "my_secret_data.txt"
    with open(file_name, 'r') as f:
        content = f.read()
        print(f"File content: {content}")
except FileNotFoundError:
    # This block runs ONLY if a FileNotFoundError occurs in the 'try' block
    print(f"Error: The file '{file_name}' was not found. Please check the path.")
except PermissionError:
    # This block runs ONLY if a PermissionError occurs
    print(f"Error: You don't have permission to access '{file_name}'.")
except Exception as e:
    # This is a general except block. It catches ANY other unexpected errors.
    # 'as e' allows us to capture the exception object and print its message.
    print(f"An unexpected error occurred: {e}")

print("Program continues after exception handling.")
```

In this example:
-   If `my_secret_data.txt` doesn't exist, the `FileNotFoundError` block runs, and the program prints a helpful message instead of crashing.
-   If there's a permission issue (e.g., trying to write to a protected system directory), `PermissionError` runs.
-   If any other type of error occurs (e.g., a `TypeError` if we tried to do something incompatible with the file object), the general `except Exception as e:` block catches it, and `e` will contain the specific error message.

You can have multiple `except` blocks to handle different types of exceptions. It's generally good practice to handle specific exceptions (like `FileNotFoundError`) before a more general `Exception`, as this allows for more precise error recovery.

#### The `else` Block (Optional)
You can also include an `else` block after `except` blocks. The code inside the `else` block will execute *only if no exception occurred* in the `try` block. This is useful for code that should only run when the `try` block was completely successful.

```python
try:
    num1 = int(input("Enter a number: "))
    num2 = int(input("Enter another number: "))
    result = num1 / num2
except ValueError:
    print("Invalid input. Please enter integers only.")
except ZeroDivisionError:
    print("Cannot divide by zero!")
else:
    # This block runs only if NO exception occurred in the 'try' block
    print(f"The result of division is: {result}")
print("Operation complete.")
```
In this example, if both inputs are valid numbers and the second number is not zero, the `else` block will execute and print the result. If any `ValueError` or `ZeroDivisionError` occurs, the corresponding `except` block runs, and the `else` block is skipped.

#### The `finally` Block
The `finally` block is used for cleanup actions that *must* be executed regardless of whether an exception occurred or not. This is perfect for ensuring resources like files or network connections are closed, or that temporary data is deleted. The code in the `finally` block will always run, even if an exception is caught, or if an unhandled exception causes the program to terminate.

```python
file_handle = None # Initialize to None to ensure it exists even if open() fails

try:
    file_handle = open("important_log.txt", "w")
    file_handle.write("Logging some data.\n")
    # Uncomment the line below to simulate an error and see 'finally' still run
    # raise ValueError("Something went wrong during logging!")
except ValueError as e:
    print(f"Caught a specific error: {e}")
except Exception as e:
    print(f"Caught an unexpected error: {e}")
finally:
    # This block ALWAYS runs, whether an exception occurred or not.
    if file_handle: # Check if the file was actually opened before trying to close it
        file_handle.close()
        print("File closed in finally block.")
    else:
        print("File was not opened (or handle is None).")

print("End of program.")
```
Even if the `ValueError` is raised (by uncommenting the `raise` line), the `finally` block will still execute, ensuring `file_handle.close()` is called if `file_handle` is not `None`. This demonstrates why the `with` statement is so powerful for files, as it essentially provides this `finally` behavior automatically, making file management even simpler and safer.

<a id="concept-custom-exceptions"></a>
### Creating Custom Exceptions
Sometimes, the built-in Python exceptions (like `ValueError`, `TypeError`, `FileNotFoundError`) don't quite fit the specific error conditions you want to signal in your own code. For these situations, you can define your **custom exceptions**. This makes your code more readable, allows users of your code to catch very specific errors, and improves the clarity of your program's error messages.

To create a custom exception, you simply define a new class that inherits from Python's built-in `Exception` class (or a more specific exception like `ValueError` if your custom exception is a type of value error).

```python
class InsufficientFundsError(Exception):
    """
    Custom exception raised when an account has insufficient funds for a withdrawal.
    """
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        # Create a user-friendly message for the exception
        self.message = f"Attempted to withdraw {amount} but only {balance} available."
        # Call the base class constructor with the message
        super().__init__(self.message)

def withdraw(account_balance, withdrawal_amount):
    if withdrawal_amount > account_balance:
        # Raise our custom exception if the condition is met
        raise InsufficientFundsError(account_balance, withdrawal_amount)
    else:
        account_balance -= withdrawal_amount
        print(f"Withdrawal successful. New balance: {account_balance}")
        return account_balance

# Example usage:
my_balance = 100

try:
    print(f"Current balance: {my_balance}")
    my_balance = withdraw(my_balance, 50) # Successful withdrawal
    print(f"Current balance: {my_balance}")
    my_balance = withdraw(my_balance, 70) # This will raise the custom exception
except InsufficientFundsError as e:
    # We can specifically catch our custom exception
    print(f"\nTransaction failed due to insufficient funds: {e.message}")
    print(f"Details: Balance: {e.balance}, Attempted: {e.amount}")
except Exception as e:
    # Catch any other unexpected errors
    print(f"\nAn unexpected error occurred: {e}")

print("\nProgram finished.")
```
In this example:
-   We define `InsufficientFundsError` inheriting from `Exception`.
-   Its `__init__` method customizes the error message and stores relevant details (`balance`, `amount`).
-   The `withdraw` [function](../python/functions-in-python.md#concept-function) `raises` this custom exception when the condition (`withdrawal_amount > account_balance`) is met.
-   The `try-except` block then specifically catches `InsufficientFundsError`, allowing for tailored error handling and access to the custom attributes (`e.balance`, `e.amount`).

Custom exceptions help you create more meaningful, precise, and robust error reporting in your applications, making your code easier to debug and more user-friendly.

## Wrap-Up
In this lesson, we've covered the essential skills for interacting with files and making your programs resilient to errors. You learned how to read and write both text and binary data to files, with a strong emphasis on using the `with` statement for safe and automatic file operations. We then delved into the world of exception handling, understanding why it's crucial for robust applications and how to use `try`, `except`, `else`, and `finally` blocks to manage unexpected events gracefully. Finally, you saw how to create your own custom exceptions to make your error reporting more precise and user-friendly.

Mastering file I/O and exception handling are fundamental steps toward writing professional, reliable Python applications that can interact with the real world and gracefully handle its unpredictable nature. Keep practicing these concepts, as they will be invaluable in your programming journey!