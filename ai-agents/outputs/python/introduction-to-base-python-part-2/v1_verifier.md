# Introduction to Base Python (Part 2)

## Learning Objectives
- Translate simple problem ideas into pseudocode and executable Python steps.
- Apply conditionals, loops, and functions to structure program flow.
- Handle basic file input and output reliably.

## Introduction
In "Introduction to Base Python (Part 1)," you learned about fundamental data types like numbers, strings, and lists, and how to perform basic operations. That's like learning the alphabet and basic words of a language. Now, it's time to learn how to form sentences, paragraphs, and even entire stories!

This lesson will teach you how to make your Python programs *do things* based on conditions, *repeat actions*, *organize your code* into reusable blocks, and *interact with files* on your computer. These are the building blocks for creating dynamic, useful, and well-structured programs that can solve real-world problems.

## Concept Progression

### Thinking Like a Programmer: From Idea to Code
Before we even write a single line of Python, let's talk about how programmers approach problems. It's not about memorizing syntax; it's about breaking down a big problem into smaller, manageable steps. This process is often called "algorithmic thinking." An **algorithm** is a finite sequence of well-defined, computer-implementable instructions, typically used to solve a class of specific problems or to perform a computation. In simpler terms, it's a step-by-step recipe for solving a problem.

A great tool for planning your logic is **pseudocode**. Pseudocode is a plain language description of the steps in an algorithm, without worrying about the exact syntax of any specific programming language. It helps you plan your logic before getting bogged down in code details.

**Example: Checking if a number is even or odd**

Let's say you want to write a program that tells you if a number is even or odd.

**Pseudocode:**
1.  Prompt the user to enter a number.
2.  Read the number provided by the user.
3.  Calculate the remainder when the number is divided by 2.
4.  If the remainder is 0, then the number is even.
5.  Otherwise (if the remainder is not 0), the number is odd.
6.  Display the result to the user.

Now, let's translate this pseudocode into Python. We'll need to learn about making decisions first!

### Making Decisions: Conditional Statements (`if`, `elif`, `else`)
Programs often need to make choices. "If this condition is true, do X; otherwise, do Y." This is a fundamental aspect of **control flow**. Python uses `if`, `elif` (short for "else if"), and `else` to control the flow of your program based on whether certain conditions are met.

*   `if`: Executes a block of code *only if* its associated condition evaluates to `True`.
*   `elif`: Checks another condition *if* the preceding `if` (or `elif`) conditions were `False`. You can have multiple `elif` blocks.
*   `else`: Executes a block of code *if* all preceding `if` and `elif` conditions were `False`. It acts as a default or fallback.

**Example: Even or Odd in Python**

Let's implement our pseudocode for checking even/odd numbers:

```python
number = int(input("Enter an integer: ")) # Get input (which is a string) and convert it to an integer

if number % 2 == 0: # The '%' operator (modulo) gives the remainder of a division
    print(f"{number} is an even number.")
else:
    print(f"{number} is an odd number.")

print("Program finished.")
```

Notice the colon `:` after `if` and `else`, and the indentation. Indentation is crucial in Python; it defines which lines of code belong to which `if`/`else` block. Code within the same block must have the same level of indentation.

**Another Example: Grading System**

```python
score = int(input("Enter student's score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80: # This condition is only checked if 'score' was less than 90
    print("Grade: B")
elif score >= 70: # This condition is only checked if 'score' was less than 80
    print("Grade: C")
else: # This block is only executed if 'score' was less than 70
    print("Grade: F")
```

### Repeating Actions: Loops (`for` and `while`)
Many tasks in programming involve repetition. Instead of writing the same code multiple times, we use loops. Loops are another fundamental mechanism for **control flow**, allowing a block of code to be executed repeatedly. Python offers two main types of loops: `for` loops and `while` loops.

#### The `for` Loop: Iterating Over Collections
A `for` loop is used to iterate over a sequence (like a list, tuple, string, or range) or other iterable objects. It executes a block of code once for each item in the sequence.

**Example: Counting with `for`**

```python
# Using range() to generate numbers
print("Counting from 0 to 4:")
for i in range(5): # range(5) generates numbers 0, 1, 2, 3, 4
    print(i)

# Iterating over a list
fruits = ["apple", "banana", "cherry"]
print("\nMy favorite fruits:")
for fruit in fruits:
    print(f"I love {fruit}s!")

# Iterating over a string
name = "Python"
print("\nLetters in 'Python':")
for char in name:
    print(char)
```

#### The `while` Loop: Repeating Until a Condition is Met
A `while` loop repeatedly executes a block of code as long as a given condition evaluates to `True`. You need to be careful with `while` loops to ensure the condition eventually becomes `False`; otherwise, you'll create an "infinite loop" that never terminates.

**Example: Countdown with `while`**

```python
countdown = 3
print("Starting countdown...")
while countdown > 0:
    print(countdown)
    countdown -= 1 # Decrement countdown by 1 (shorthand for countdown = countdown - 1)
print("Blast off!")

# Example: User input until a specific word is entered
secret_word = "python"
guess = ""
while guess != secret_word:
    guess = input("Guess the secret word: ").lower() # .lower() converts input to lowercase for case-insensitive comparison
    if guess != secret_word:
        print("Try again!")
print("Congratulations! You guessed the word.")
```

### Organizing Code: Functions
As your programs grow, you'll find yourself writing blocks of code that perform a specific task and might be needed in multiple places. Copy-pasting code is bad practice (it leads to errors, makes updates difficult, and reduces readability). This is where **functions** come in.

A function is a named, reusable block of code that performs a specific task. It helps organize your code, makes it more readable, promotes modularity, and prevents repetition (adhering to the "Don't Repeat Yourself" - DRY principle).

You define a function using the `def` keyword, followed by the function name, parentheses `()`, and a colon `:`.

```python
# Defining a simple function
def greet():
    """This function prints a simple greeting.""" # This is a docstring, explaining what the function does
    print("Hello, welcome to the course!")

# Calling the function
greet() # This executes the code inside the greet function
greet() # You can call it multiple times
```

#### Arguments and Return Values
Functions can also take **arguments** (inputs) and **return** values (outputs).

*   **Arguments:** Information passed into a function. They are specified inside the parentheses when defining the function and act as local variables within the function's scope.
*   **Return Values:** A function can send a result back to the part of the code that called it using the `return` keyword. If a function doesn't explicitly `return` a value, it implicitly returns `None`.

**Example: Function with Arguments and Return Value**

```python
def calculate_area_rectangle(length, width):
    """
    Calculates the area of a rectangle.
    Takes length and width as arguments and returns their product.
    """
    area = length * width
    return area # Send the calculated area back to the caller

# Call the function with specific values
room_area = calculate_area_rectangle(5, 3)
print(f"The area of the room is: {room_area} square units.")

garden_area = calculate_area_rectangle(10, 4)
print(f"The area of the garden is: {garden_area} square units.")

# Functions can also perform actions without explicitly returning a value
def print_greeting(name):
    print(f"Hello, {name}!")

result = print_greeting("Alice")
print(f"The print_greeting function returned: {result}") # This will show 'None'
```

### Interacting with Files: Input and Output (I/O)
So far, our programs mostly interact with the user through the console. But what if you want to save data permanently or read data that already exists? This is where file input/output (I/O) comes in. Python makes it easy to read from and write to files.

The most common and recommended way to handle files is using the built-in `open()` function, often combined with the `with` statement. The `with` statement creates a context manager that ensures the file is properly closed automatically, even if errors occur during file operations. This is crucial for preventing data corruption and resource leaks.

#### Writing to a File
When you open a file for writing, if the file doesn't exist, Python creates it. If it does exist, its contents are usually overwritten (unless you open it in "append" mode).

```python
# 'w' mode for writing (creates a new file or overwrites an existing one)
with open("my_notes.txt", "w") as file:
    file.write("This is my first line of notes.\n")
    file.write("Python file I/O is super useful!\n")
    file.write("Don't forget to close files (or use 'with').")

print("Notes written to my_notes.txt")

# 'a' mode for appending (creates a new file or adds to the end of an existing one)
with open("my_notes.txt", "a") as file:
    file.write("\nAdding a new line later.")

print("Appended to my_notes.txt")
```

#### Reading from a File
To read from a file, you open it in "read" mode (`'r'`).

```python
# 'r' mode for reading
try: # Use a try-except block to gracefully handle potential FileNotFoundError
    with open("my_notes.txt", "r") as file:
        content = file.read() # Reads the entire file content as a single string
        print("\n--- Content of my_notes.txt (read all) ---")
        print(content)

    with open("my_notes.txt", "r") as file:
        print("\n--- Content of my_notes.txt (read line by line) ---")
        for line in file: # Iterating directly over the file object reads it line by line
            print(line.strip()) # .strip() removes leading/trailing whitespace, including the newline character

except FileNotFoundError:
    print("Error: The file 'my_notes.txt' was not found. Please ensure it exists.")
```

Common file modes:
*   `'r'`: Read (default mode). The file pointer is placed at the beginning of the file.
*   `'w'`: Write. Creates a new file if it doesn't exist or truncates (empties) the file if it exists.
*   `'a'`: Append. Creates a new file if it doesn't exist. If the file exists, new data is written to the end of the file.
*   `'x'`: Exclusive creation. Creates a new file, but fails if the file already exists.

## Wrap-Up
Congratulations! You've just taken a huge leap in your Python journey. You now understand how to think algorithmically, make your programs intelligent with conditional logic, automate tasks with loops, organize your code into reusable functions, and interact with the outside world through file I/O. These concepts are the bedrock of almost any useful program you'll ever write.

In the next lesson, we'll explore more advanced data structures and how to handle errors gracefully, building on the strong foundation you've established here.