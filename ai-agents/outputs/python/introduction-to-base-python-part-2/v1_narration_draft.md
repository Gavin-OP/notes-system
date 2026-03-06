# Introduction to Base Python (Part 2)

## Learning Objectives

Welcome to the second part of our Python journey! [PAUSE_SHORT]

By the end of this lesson, you'll be able to translate simple problem ideas into steps a computer can understand. [PAUSE_SHORT] You'll also learn to use special tools like conditionals, loops, and functions to build your programs. [PAUSE_SHORT] And finally, you'll be able to handle basic file input and output, so your programs can talk to files on your computer.

## Introduction

Welcome back! [PAUSE_SHORT] In "Introduction to Base Python Part 1," you learned the fundamental building blocks. [PAUSE_SHORT] Things like numbers, strings, and lists, along with basic operations. [PAUSE_SHORT] Think of that as learning the alphabet and basic words of a language. [PAUSE_SHORT]

Now, it's time to learn how to form sentences, paragraphs, and even entire stories! [PAUSE_LONG]

This lesson will empower you to make your Python programs *intelligent* by making decisions. [PAUSE_SHORT] You'll make them *efficient* by repeating actions. [PAUSE_SHORT] You'll make them *organized* by structuring code into reusable blocks. [PAUSE_SHORT] And you'll make them *interactive* by communicating with files on your computer. [PAUSE_SHORT]

These core concepts—**control flow**, **code organization**, and **file I/O**—are the bedrock for creating dynamic, useful, and well-structured programs that can solve real-world problems.

## Concept Progression

### Thinking Like a Programmer: From Idea to Code

Before we dive into writing Python code, let's explore how experienced programmers approach a problem. [PAUSE_SHORT] It's not just about memorizing syntax. [PAUSE_SHORT] It's about developing a systematic way to break down a complex task into smaller, manageable steps. [PAUSE_SHORT] This process is often called **algorithmic thinking**. [PAUSE_LONG]

An **algorithm** is essentially a step-by-step recipe for solving a problem or performing a computation. [PAUSE_SHORT] It's a finite sequence of clear, unambiguous instructions that a computer can follow. [PAUSE_LONG]

A powerful tool for planning your logic before writing any code is **pseudocode**. [PAUSE_SHORT] Pseudocode is a plain language description of the steps in an algorithm. [PAUSE_SHORT] It helps you focus on the logic and flow of your program without getting bogged down in the exact syntax of a specific programming language. [PAUSE_SHORT] It acts as a bridge between your human thought process and the precise instructions a computer needs. [PAUSE_LONG]

Let's look at an example. [PAUSE_SHORT]

**Example: Checking if a number is even or odd**

Let's say you want to write a program that determines if a number is even or odd. [PAUSE_LONG]

Here's how you might write that in pseudocode:
1.  **START**
2.  **PROMPT** the user to enter an integer.
3.  **READ** the number provided by the user.
4.  **CALCULATE** the remainder when the number is divided by 2.
5.  **IF** the remainder is 0:
    6.  **THEN DISPLAY** "The number is even."
7.  **ELSE** (if the remainder is not 0):
    8.  **THEN DISPLAY** "The number is odd."
9.  **END**

[PAUSE_LONG]

This pseudocode clearly outlines the steps. [PAUSE_SHORT] Now, let's see how Python helps us translate these decisions into executable code!

### Making Decisions: Conditional Statements (`if`, `elif`, `else`)

Programs often need to make choices based on different situations. [PAUSE_SHORT] For example, "If this condition is true, do X; otherwise, do Y." [PAUSE_SHORT] This ability to make decisions is a fundamental aspect of **control flow**, which dictates the order in which instructions are executed. [PAUSE_SHORT] Python uses `if`, `elif` (which is short for "else if"), and `else` to manage these decisions. [PAUSE_LONG]

Let's break them down:
*   An `if` block of code executes *only if* its associated condition evaluates to `True`. [PAUSE_SHORT]
*   An `elif` block is checked *only if* the preceding `if` (and any `elif`s before it) conditions were `False`. [PAUSE_SHORT] You can include multiple `elif` blocks to check several conditions sequentially. [PAUSE_SHORT]
*   An `else` block acts as a default or fallback. [PAUSE_SHORT] Its code executes *only if* all preceding `if` and `elif` conditions were `False`. [PAUSE_LONG]

**Example: Even or Odd in Python**

Let's implement our pseudocode for checking even or odd numbers using Python's conditional statements. [PAUSE_LONG]

Code cue: Listen for how we get user input, convert it to a number, and then use `if` and `else` to check if it's even or odd.

```python
# Get input from the user. input() returns a string, so we convert it to an integer using int().
number = int(input("Enter an integer: "))

# The '%' operator (modulo) gives the remainder of a division.
# If the remainder when divided by 2 is 0, the number is even.
if number % 2 == 0:
    print(f"{number} is an even number.")
else: # If the 'if' condition was False, this 'else' block executes.
    print(f"{number} is an odd number.")

print("Program finished.")
```

[PAUSE_LONG]

A key takeaway here: notice the colon `:` after `if` and `else`, and the indentation. [PAUSE_SHORT] Indentation is not just for readability in Python. [PAUSE_SHORT] It's crucial for defining which lines of code belong to which `if` or `else` block. [PAUSE_SHORT] Code within the same block *must* have the same level of indentation. [PAUSE_LONG]

**Another Example: A Simple Grading System**

Here's how you might use `elif` to handle multiple conditions, like assigning grades based on a score. [PAUSE_LONG]

Code cue: Notice how `elif` allows us to check several conditions in order.

```python
score = int(input("Enter student's score: "))

if score >= 90:
    print("Grade: A")
elif score >= 80: # This condition is only checked if 'score' was less than 90.
    print("Grade: B")
elif score >= 70: # This condition is only checked if 'score' was less than 80.
    print("Grade: C")
else: # This block is only executed if 'score' was less than 70.
    print("Grade: F")
```

[PAUSE_LONG]

The conditions are evaluated in order. [PAUSE_SHORT] As soon as one condition is `True`, its corresponding block is executed, and the rest of the `elif` and `else` chain is skipped. [PAUSE_LONG]

### Repeating Actions: Loops (`for` and `while`)

Many programming tasks involve performing the same action multiple times. [PAUSE_SHORT] Instead of writing the same code over and over, we use **loops**. [PAUSE_SHORT] Loops are another fundamental mechanism for **control flow**, allowing a block of code to be executed repeatedly. [PAUSE_SHORT] Python offers two primary types of loops: `for` loops and `while` loops, each suited for different scenarios. [PAUSE_LONG]

#### The `for` Loop: Iterating Over Collections (Definite Iteration)

A `for` loop is used for **definite iteration**. [PAUSE_SHORT] This means you know in advance how many times you want to loop, or when you want to process each item in a sequence. [PAUSE_SHORT] A sequence could be a list, a tuple, a string, or a range of numbers. [PAUSE_SHORT] It executes a block of code once for each item in that sequence. [PAUSE_LONG]

**Example: Counting and Iterating with `for`**

Code cue: Listen for how `for` loops can count numbers, go through items in a list, and even characters in a string.

```python
# Using range() to generate a sequence of numbers
print("Counting from 0 to 4:")
for i in range(5): # range(5) generates numbers 0, 1, 2, 3, 4
    print(i)

# Iterating over items in a list
fruits = ["apple", "banana", "cherry"]
print("\nMy favorite fruits:")
for fruit in fruits: # 'fruit' takes on each value from the 'fruits' list in turn
    print(f"I love {fruit}s!")

# Iterating over characters in a string
name = "Python"
print("\nLetters in 'Python':")
for char in name: # 'char' takes on each character from the 'name' string
    print(char)
```

[PAUSE_LONG]

#### The `while` Loop: Repeating Until a Condition is Met (Indefinite Iteration)

A `while` loop is used for **indefinite iteration**. [PAUSE_SHORT] This is when you don't know exactly how many times you need to loop. [PAUSE_SHORT] Instead, you want to keep repeating a block of code *as long as* a certain condition remains `True`. [PAUSE_LONG]

You must be careful with `while` loops to ensure that the condition eventually becomes `False`. [PAUSE_SHORT] Otherwise, you'll create an "infinite loop" that never terminates, causing your program to hang. [PAUSE_LONG]

**Example: Countdown with `while`**

Code cue: See how the `while` loop continues as long as the `countdown` variable is greater than zero, and how we change `countdown` inside the loop.

```python
countdown = 3
print("Starting countdown...")
while countdown > 0: # The loop continues as long as 'countdown' is greater than 0
    print(countdown)
    countdown -= 1 # Decrement countdown by 1. This is crucial to eventually make the condition False.
print("Blast off!")
```

[PAUSE_SHORT]

Code cue: This next example shows a `while` loop that keeps asking for input until the correct secret word is entered.

```python
# Example: User input until a specific word is entered
secret_word = "python"
guess = "" # Initialize guess to an empty string so the loop condition is initially True
while guess != secret_word: # Loop continues until the user guesses the secret word
    guess = input("Guess the secret word: ").lower() # .lower() converts input to lowercase for case-insensitive comparison
    if guess != secret_word:
        print("Try again!")
print("Congratulations! You guessed the word!")
```

[PAUSE_LONG]

### Organizing Code: Functions

As your programs grow in size and complexity, you'll inevitably find yourself writing blocks of code that perform a specific task and might be needed in multiple places. [PAUSE_SHORT] Copy-pasting code is generally considered bad practice. [PAUSE_SHORT] It leads to errors, makes updates difficult, and reduces readability. [PAUSE_SHORT] This is where **functions** come to the rescue! [PAUSE_LONG]

A function is a named, reusable block of code designed to perform a specific task. [PAUSE_SHORT] Functions are essential for:
*   **Organization:** Breaking down a large program into smaller, manageable pieces.
*   **Readability:** Making your code easier to understand.
*   **Modularity:** Allowing you to reuse code without rewriting it.
*   **DRY Principle:** Adhering to the "Don't Repeat Yourself" principle. [PAUSE_LONG]

You define a function using the `def` keyword, followed by the function name, parentheses `()`, and a colon `:`. [PAUSE_LONG]

Code cue: Here's a simple function definition and how we call it.

```python
# Defining a simple function
def greet():
    """This function prints a simple greeting.""" # This is a docstring, explaining what the function does.
    print("Hello, welcome to the course!")

# Calling the function
greet() # This executes the code inside the greet function.
greet() # You can call it multiple times from different parts of your program.
```

[PAUSE_LONG]

#### Arguments and Return Values

Functions become even more powerful when they can accept **arguments** (which are inputs) and produce **return values** (which are outputs). [PAUSE_LONG]

*   **Arguments:** These are pieces of information you pass into a function when you call it. [PAUSE_SHORT] They are specified inside the parentheses when defining the function and act as local variables within that function's scope. [PAUSE_SHORT] This means variables defined inside a function, including arguments, are only accessible within that function. [PAUSE_SHORT]
*   **Return Values:** A function can send a result back to the part of the code that called it using the `return` keyword. [PAUSE_SHORT] If a function doesn't explicitly `return` a value, it implicitly returns `None`. [PAUSE_LONG]

**Example: Function with Arguments and Return Value**

Code cue: This function takes `length` and `width` as arguments, calculates an area, and then `return`s that area.

```python
def calculate_area_rectangle(length, width):
    """
    Calculates the area of a rectangle.
    Takes length and width as arguments and returns their product.
    """
    area = length * width
    return area # Send the calculated area back to the caller.

# Call the function with specific values
room_area = calculate_area_rectangle(5, 3) # 5 and 3 are arguments passed to length and width
print(f"The area of the room is: {room_area} square units.")

garden_area = calculate_area_rectangle(10, 4)
print(f"The area of the garden is: {garden_area} square units.")
```

[PAUSE_SHORT]

Code cue: This next example shows a function that prints something but doesn't explicitly return a value, so it implicitly returns `None`.

```python
# Functions can also perform actions without explicitly returning a value
def print_greeting(name):
    """Prints a personalized greeting."""
    print(f"Hello, {name}!")

result = print_greeting("Alice") # This function prints, but doesn't explicitly return anything.
print(f"The print_greeting function returned: {result}") # This will show 'None', as no value was returned.
```

[PAUSE_LONG]

### Interacting with Files: Input and Output (I/O)

So far, our programs primarily interact with the user through the console. [PAUSE_SHORT] But what if you want to save data permanently, load configuration settings, or process large datasets that already exist? [PAUSE_SHORT] This is where **file input/output (I/O)** comes in. [PAUSE_SHORT] Python provides straightforward ways to read from and write to files on your computer. [PAUSE_LONG]

The most common and recommended way to handle files in Python is using the built-in `open()` function, almost always combined with the `with` statement. [PAUSE_SHORT] The `with` statement creates a **context manager** that automatically ensures the file is properly closed when the block of code is exited, even if errors occur. [PAUSE_SHORT] This is crucial for preventing data corruption and resource leaks. [PAUSE_LONG]

#### Writing to a File

When you open a file for writing, Python will create the file if it doesn't exist. [PAUSE_SHORT] If the file *does* exist, its contents are typically overwritten, unless you open it in "append" mode. [PAUSE_LONG]

Code cue: This code shows how to write to a file using the `'w'` mode, which overwrites existing content.

```python
# 'w' mode for writing: creates a new file or overwrites (truncates) an existing one.
with open("my_notes.txt", "w") as file:
    file.write("This is my first line of notes.\n")
    file.write("Python file I/O is super useful!\n")
    file.write("Don't forget to close files (or use 'with').")

print("Notes written to my_notes.txt")
```

[PAUSE_SHORT]

Code cue: Now, we'll use the `'a'` mode to append new text to the *end* of the same file.

```python
# 'a' mode for appending: creates a new file or adds to the end of an existing one.
with open("my_notes.txt", "a") as file:
    file.write("\nAdding a new line later.") # The '\n' ensures the new text starts on a new line.

print("Appended to my_notes.txt")
```

[PAUSE_LONG]

#### Reading from a File

To read from a file, you open it in "read" mode, which is `'r'`. [PAUSE_LONG]

Code cue: This example shows two ways to read from a file: reading the entire content at once, and reading it line by line. Notice the `try-except` block to handle potential errors.

```python
# 'r' mode for reading
try: # Using a try-except block is good practice to handle potential FileNotFoundError gracefully.
    with open("my_notes.txt", "r") as file:
        content = file.read() # Reads the entire file content as a single string.
        print("\n--- Content of my_notes.txt (read all at once) ---")
        print(content)

    with open("my_notes.txt", "r") as file:
        print("\n--- Content of my_notes.txt (read line by line) ---")
        # Iterating directly over the file object is memory-efficient for large files,
        # as it reads one line at a time.
        for line in file:
            print(line.strip()) # .strip() removes leading/trailing whitespace, including the newline character.

except FileNotFoundError:
    print("Error: The file 'my_notes.txt' was not found. Please ensure it exists in the correct directory.")
```

[PAUSE_LONG]

Here are some common file modes you'll encounter:
*   `'r'`: This is for **Read** mode, and it's the default. [PAUSE_SHORT] The file pointer is placed at the beginning of the file. [PAUSE_SHORT]
*   `'w'`: This is for **Write** mode. [PAUSE_SHORT] It creates a new file if it doesn't exist. [PAUSE_SHORT] If the file *does* exist, it **truncates** (or empties) the file before writing. [PAUSE_SHORT]
*   `'a'`: This is for **Append** mode. [PAUSE_SHORT] It creates a new file if it doesn't exist. [PAUSE_SHORT] If the file exists, new data is written to the *end* of the file. [PAUSE_SHORT]
*   `'x'`: This is for **Exclusive creation**. [PAUSE_SHORT] It creates a new file, but fails with an error if the file already exists. [PAUSE_LONG]

## Wrap-Up

Congratulations! [PAUSE_SHORT] You've just taken a huge leap in your Python journey. [PAUSE_SHORT] You now understand how to think algorithmically, make your programs intelligent with conditional logic, automate repetitive tasks with loops, organize your code into reusable functions, and interact with the outside world through file I/O. [PAUSE_SHORT]

These concepts are the bedrock of almost any useful program you'll ever write. [PAUSE_SHORT] They enable you to build more dynamic, robust, and maintainable applications. [PAUSE_LONG]

In the next lesson, we'll explore more advanced data structures and how to handle errors gracefully, building on the strong foundation you've established here. [PAUSE_SHORT] Keep practicing, and happy coding!