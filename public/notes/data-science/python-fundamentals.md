<a id="concept-python-fundamentals"></a>
# Python Fundamentals for Data Science

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand why Python is a cornerstone programming language for data science.
- Identify and correctly use fundamental Python data types like integers, floats, strings, and booleans.
- Work effectively with variables to store and manage data within your programs.
- Implement control flow structures, including `if-else` statements and loops, to create dynamic and repetitive actions.
- Define and call functions to organize code, promote reusability, and improve readability.
- Grasp the basic principles of Object-Oriented Programming (OOP) through classes and objects.
- Handle common errors gracefully using `try-except` blocks to make your code more robust.
- Utilize modules and packages to extend Python's capabilities and access powerful data science tools.

## Introduction
Welcome to the exciting world of [Python](../python/introduction-to-python-programming.md#concept-python) programming for data science! If you're new to coding, you've picked an excellent language to start with. Python is renowned for its simplicity, readability, and incredible versatility, making it the go-to language for [data scientists](../data-science/intro-to-data-science.md#concept-data-scientist), analysts, and [machine learning](../python/python-for-data-science-core-libraries.md#concept-machine-learning) engineers worldwide.

Why Python? Imagine you have a vast collection of raw data – numbers, text, images. To extract meaningful insights, build predictive models, or create stunning visualizations, you need a powerful tool. Python, with its rich ecosystem of specialized libraries (like NumPy, [Pandas](../python/python-for-data-science-core-libraries.md#concept-pandas), and Scikit-learn), acts as your Swiss Army knife, allowing you to tackle complex data challenges with elegant and efficient code.

This lesson will lay the groundwork, introducing you to the core concepts of Python programming. Think of it as learning the alphabet and basic grammar before you can write a novel. By the end, you'll have a solid foundation to start manipulating data and building your first data science projects.

## Concept Progression

<a id="concept-python-programming-language"></a>
### The Python Programming Language: Your Gateway to Data Science
At its heart, Python is a high-level, interpreted, general-purpose programming language. What does that mean for you as a budding data scientist?

*   **High-level:** You write code that's closer to human language (like English) than to the complex instructions a computer directly understands. This makes Python much easier to learn, read, and write.
*   **Interpreted:** Unlike some languages that require you to "compile" your entire program into machine code before running it, Python executes your instructions line by line. This speeds up the development process, as you can test small pieces of code immediately.
*   **General-purpose:** While we're focusing on data science, Python's versatility means it can be used for almost anything – from building websites and games to automating repetitive tasks on your computer.

For data science, [Python](../python/introduction-to-python-programming.md#concept-python)'s biggest strength lies in its extensive collection of specialized libraries. These are pre-written sets of code that provide powerful functionalities, saving you from reinventing the wheel for common data tasks. We'll touch upon these later, but for now, let's start with the very basics of writing Python code.

Let's begin with a classic first step in any programming language: printing a message to the screen.

```python
print("Hello, Data Science World!")
```

When you run this code, Python simply displays the text "Hello, Data Science World!" in your output. The `print()` [function](../python/functions-in-python.md#concept-function) is one of Python's many built-in functions, used to show information to the user.

<a id="concept-data-types"></a>
### Data Types: The Building Blocks of Information
Just as real-world information comes in different forms (numbers, text, true/false statements), data in Python also has different fundamental types. Understanding these types is crucial because they dictate what kinds of operations you can perform on your data and how Python stores it.

#### Integers (`int`)
Integers are whole numbers, positive or negative, without a decimal point. They are used for counting or representing discrete quantities.

```python
number_of_students = 30
age = -5 # Yes, negative integers are valid!
```

#### Floats (`float`)
Floats (or floating-point numbers) are numbers that have a decimal point. They are used to represent measurements or quantities that can have fractional parts.

```python
temperature = 25.5
pi_value = 3.14159
```

#### Strings (`str`)
Strings are sequences of characters, used to represent text. You define a string by enclosing the text in single quotes (`'`) or double quotes (`"`). It's good practice to be consistent, but either works!

```python
name = "Alice"
greeting = 'Hello there!'
sentence = "Python is fun for data science!"
```

You can combine strings using the `+` operator, which is called **concatenation**:

```python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
print(full_name) # Output: John Doe
```

#### Booleans (`bool`)
Booleans represent truth values: either `True` or `False`. They are fundamental for making decisions in your code (as we'll see with `if-else` statements). Note that `True` and `False` must always be capitalized.

```python
is_raining = True
has_permission = False
```

You can always check the type of any data or variable using the `type()` function. This is very useful for debugging and understanding your data.

```python
print(type(number_of_students)) # Output: <class 'int'>
print(type(temperature))        # Output: <class 'float'>
print(type(name))               # Output: <class 'str'>
print(type(is_raining))         # Output: <class 'bool'>
```

[IMAGE_PLACEHOLDER: A diagram illustrating the four basic Python data types: Integer (e.g., 42), Float (e.g., 3.14), String (e.g., "Hello"), and Boolean (e.g., True). Each type should have a small icon representing it and an example value, with arrows pointing from the value to its type label. The pedagogical intent is to visually differentiate and exemplify each core data type.]

<a id="concept-variables"></a>
### Variables: Naming and Storing Your Data
Now that you know about different data types, how do you store and refer to specific pieces of information in your programs? That's where **variables** come in. A variable is essentially a named storage location in your computer's memory that holds a value. You can think of it as a labeled box where you put your data.

To create a variable in Python, you simply choose a name and use the assignment operator (`=`) to give it a value. Python is smart enough to infer the [data type](../python/python-data-types-and-variables.md#concept-data-type) based on the value you assign.

```python
# Assigning an integer to a variable
my_age = 30

# Assigning a string to a variable
city = "New York"

# Assigning a float to a variable
price = 99.99

# Assigning a boolean to a variable
is_active = True
```

Once a variable is assigned, you can use its name to refer to the value it holds. This makes your code much more readable and manageable.

```python
print(my_age)    # Output: 30
print(city)      # Output: New York
```

You can also change the value a variable holds at any time; this is called **reassignment**. The variable `score` below first holds `100`, then `150`.

```python
score = 100
print(score) # Output: 100

score = 150 # Reassigning a new value
print(score) # Output: 150
```

**Variable Naming Rules and Conventions:**
To keep your code clean and avoid errors, follow these guidelines:
*   **Rules (must follow):**
    *   Variable names must start with a letter (a-z, A-Z) or an underscore (`_`).
    *   They cannot start with a number.
    *   They can only contain alpha-numeric characters (A-z, 0-9, and `_`).
    *   Variable names are case-sensitive (`age` is different from `Age`).
    *   Avoid using Python's reserved keywords (like `if`, `else`, `for`, `while`, `print`, `def`, `class`, etc.).
*   **Conventions (best practices for readability):**
    *   Use `snake_case` (all lowercase, words separated by underscores) for variable names, e.g., `total_sales`, `user_name`. This is the most common convention in Python.
    *   Choose meaningful names that describe the data they hold.

[IMAGE_PLACEHOLDER: A simple diagram showing a variable. On the left, a label "my_variable_name" (the variable name). An arrow points from this label to a box in the center representing a memory location, which contains a value, e.g., "42". Below the box, the data type "int" is indicated. The pedagogical intent is to visually explain how a variable name points to a stored value in memory.]

<a id="concept-control-flow"></a>
### Control Flow: Making Decisions and Repeating Actions
In real-world data science tasks, your programs rarely execute a simple sequence of steps from top to bottom. Instead, they often need to make decisions based on data or perform repetitive operations. Control flow statements are the tools that allow your program to execute different blocks of code depending on certain conditions or to repeat actions multiple times.

#### If-Else Statements: Making Decisions
The `if-else` statement allows your program to make choices. It checks if a condition is `True`; if so, it executes a specific block of code. Otherwise, it can execute a different block.

**Intuition:** "If it's raining, take an umbrella. Otherwise, enjoy the sunshine."

```python
weather = "sunny"

if weather == "raining": # Check if the weather is exactly "raining"
    print("Don't forget your umbrella!")
else: # If the condition above is False
    print("Enjoy the beautiful weather!")
# Output: Enjoy the beautiful weather!
```

You can add more conditions using `elif` (short for "else if") to handle multiple possibilities:

```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80: # Only checked if the first 'if' was False
    print("Grade: B")
elif score >= 70: # Only checked if the previous 'if' and 'elif' were False
    print("Grade: C")
else: # If none of the above conditions are True
    print("Grade: F")
# Output: Grade: B
```
**Important Note on Indentation:** Python uses indentation (typically 4 spaces) to define code blocks. All lines within an `if`, `elif`, or `else` block must be indented at the same level. This is crucial for Python's syntax and readability!

[IMAGE_PLACEHOLDER: A flowchart illustrating an if-elif-else statement. Start node -> Condition 1 (e.g., "Score >= 90?") -> if True, "Print A"; if False, go to Condition 2 (e.g., "Score >= 80?") -> if True, "Print B"; if False, go to Condition 3 (e.g., "Score >= 70?") -> if True, "Print C"; if False, "Print F". All paths converge to an End node. The pedagogical intent is to visually represent the decision-making logic.]

#### Loops: Repeating Actions
Loops allow you to execute a block of code multiple times. This is incredibly useful when you need to process each item in a list of data, perform a calculation repeatedly, or iterate until a certain condition is met.

##### For Loops: Iterating Over Sequences
A `for` loop is used to iterate over a sequence (like a list of items, characters in a string, or a range of numbers) or other iterable objects. It's perfect when you know how many times you want to repeat an action, or when you want to process each item in a collection.

**Intuition:** "For each fruit in the basket, tell me its name."

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits: # 'fruit' takes on each value from the 'fruits' list, one by one
    print(f"I have a {fruit}.") # f-strings are a neat way to embed variables directly into strings
# Output:
# I have a apple.
# I have a banana.
# I have a cherry.
```

##### While Loops: Repeating While a Condition is True
A `while` loop repeatedly executes a block of code as long as a given condition remains `True`. This is useful when you don't know in advance how many times you need to loop, but you have a condition that will eventually become `False`.

**Intuition:** "Keep counting down as long as the number is greater than zero."

```python
count = 3

while count > 0: # The loop continues as long as 'count' is greater than 0
    print(count)
    count = count - 1 # Decrement the count, moving closer to the condition becoming False
print("Blast off!")
# Output:
# 3
# 2
# 1
# Blast off!
```
**Caution:** Be very careful with `while` loops! If the condition never becomes `False` (e.g., if you forget `count = count - 1`), you'll create an **infinite loop**, and your program will run forever (or until you manually stop it, which usually involves pressing `Ctrl+C` in your terminal).

<a id="concept-functions"></a>
### Functions: Organizing Your Code for Reusability
As your programs grow, you'll find yourself performing similar tasks repeatedly. Copying and pasting code is inefficient, makes your program longer, and is prone to errors if you need to make changes later. This is where functions come in. A function is a block of organized, reusable code that performs a single, related action.

**Why use functions?**
1.  **Reusability:** Write a piece of code once, and then call (use) it many times throughout your program.
2.  **Modularity:** Break down complex problems into smaller, more manageable, and understandable pieces. Each function handles a specific part of the overall task.
3.  **Readability:** Well-named functions make your code easier to understand, both for yourself and for others.
4.  **Maintainability:** If you need to fix a bug or change how a specific task is done, you only need to modify it in one place (the function definition).

You define a function using the `def` keyword, followed by the function name, parentheses `()`, and a colon `:`. Any inputs the function needs are called **parameters** and go inside the parentheses.

```python
# Defining a simple function that prints a greeting
def greet():
    print("Hello there!")

# Calling the function to execute its code
greet() # Output: Hello there!
```

Functions can also take **arguments** (the actual values passed to the parameters when you call the function) and return a value using the `return` keyword. The `return` statement sends a result back to the part of the code that called the function.

```python
# Function with arguments and a return value
def add_numbers(a, b): # 'a' and 'b' are parameters, placeholders for values
    sum_result = a + b
    return sum_result # The function sends 'sum_result' back

# Calling the function with arguments (actual values)
result = add_numbers(5, 3) # 5 and 3 are arguments passed to 'a' and 'b'
print(result) # Output: 8

another_result = add_numbers(10, 20)
print(another_result) # Output: 30
```

[IMAGE_PLACEHOLDER: A diagram illustrating a function. On the left, an "Input" box (e.g., "a=5, b=3"). An arrow points to a central "Function" box labeled "add_numbers(a, b)" with internal text "sum_result = a + b". An arrow points from the function box to an "Output" box (e.g., "return 8"). The pedagogical intent is to visually explain the concept of a function taking inputs and producing an output.]

<a id="concept-object-oriented-programming"></a>
### Object-Oriented Programming (OOP) Concepts: A Glimpse
Object-Oriented Programming (OOP) is a powerful paradigm that helps organize complex code by modeling real-world entities as "objects." While a deep dive into OOP is beyond this introductory lesson, understanding the basic concepts will be beneficial as you encounter Python libraries built with OOP principles, which are very common in data science.

**Intuition:** Instead of just having data and functions floating around separately, OOP lets you bundle related data (attributes) and functions (methods) into a single unit called an **object**. Think of a blueprint for a car (a **class**) and the actual cars built from that blueprint (the **objects**). Each car has its own color, model, and speed (attributes), and can perform actions like driving or braking (methods).

Let's define the core terms:
*   **Class:** A blueprint or a template for creating objects. It defines the attributes (data) and methods (functions) that all objects of that class will have.
*   **Object:** An instance of a class. It's a concrete entity created from the blueprint. You can create many objects from a single class.
*   **Attributes:** Variables that belong to an object, representing its characteristics or state (e.g., a dog's name, breed, age).
*   **Methods:** Functions that belong to an object, representing its behaviors or actions (e.g., a dog barking, running, eating).

Let's look at a very simple example using a `Dog` class:

```python
class Dog:
    # The __init__ method is a special method called a "constructor."
    # It's automatically run when you create a new Dog object.
    # 'self' refers to the instance of the class being created.
    def __init__(self, name, breed):
        self.name = name   # 'name' is an attribute of the Dog object
        self.breed = breed # 'breed' is an attribute of the Dog object

    # This is a method (function) that belongs to the Dog class
    def bark(self):
        print(f"{self.name} says Woof!")

# Creating objects (instances) of the Dog class
# We're using the 'Dog' blueprint to create two specific dogs.
my_dog = Dog("Buddy", "Golden Retriever")
your_dog = Dog("Lucy", "Labrador")

# Accessing attributes of the objects
print(f"My dog's name is {my_dog.name} and she is a {my_dog.breed}.")
# Output: My dog's name is Buddy and she is a Golden Retriever.

# Calling methods on the objects
my_dog.bark()   # Output: Buddy says Woof!
your_dog.bark() # Output: Lucy says Woof!
```
In this example, `Dog` is the class (the blueprint). `my_dog` and `your_dog` are individual objects (the actual dogs). `name` and `breed` are attributes that describe each dog, and `bark()` is a method that defines an action a dog can perform.

[IMAGE_PLACEHOLDER: A simple class diagram for the 'Dog' example. A box labeled "Dog" at the top. Below it, a section for attributes: "- name: str", "- breed: str". Below that, a section for methods: "+ __init__(name, breed)", "+ bark()". Two smaller boxes below, labeled "my_dog: Dog" and "your_dog: Dog", with arrows pointing from them to the "Dog" class box, indicating they are instances. The pedagogical intent is to visually represent the relationship between a class and its objects, attributes, and methods.]

<a id="concept-error-handling"></a>
### Error Handling: Dealing with the Unexpected
Even the most carefully written code can encounter problems during execution. These problems are called **errors** or **exceptions**. For example, trying to divide by zero, accessing a file that doesn't exist, or trying to convert text into a number when it's not a valid number. When an unhandled exception occurs, your program will crash.

Good programming practice involves anticipating these issues and handling them gracefully, rather than letting your program abruptly stop. Python provides the `try-except` block for this purpose.

**Intuition:** "Try to do this task. If something goes wrong (an exception occurs), then do this alternative action instead of crashing."

```python
# Example of an error without handling
# result = 10 / 0 # This line would cause a ZeroDivisionError and crash the program

# Using try-except to handle a ZeroDivisionError
try:
    numerator = 10
    denominator = 0 # This will cause an error
    result = numerator / denominator
    print(result) # This line will not be reached if an error occurs above
except ZeroDivisionError: # This block runs ONLY if a ZeroDivisionError occurs in the 'try' block
    print("Error: Cannot divide by zero!")
# Output: Error: Cannot divide by zero!
```

You can catch different types of exceptions and provide specific handling for each, making your error messages more informative:

```python
try:
    user_input = input("Enter a number: ")
    number = int(user_input) # This might raise a ValueError if input is not a number
    result = 100 / number    # This might raise a ZeroDivisionError if number is 0
    print(f"Your result is: {result}")
except ValueError:
    print("That's not a valid number! Please enter digits only.")
except ZeroDivisionError:
    print("You tried to divide by zero! Please enter a non-zero number.")
except Exception as e: # This is a general catch-all for any other unexpected error
    print(f"An unexpected error occurred: {e}")

# Example usage:
# If user enters "hello": Output: That's not a valid number! Please enter digits only.
# If user enters "0": Output: You tried to divide by zero! Please enter a non-zero number.
# If user enters "5": Output: Your result is: 20.0
```
The `except Exception as e` syntax is a general way to catch any error not specifically caught by previous `except` blocks and store its message in the variable `e`. It's good practice to catch specific errors first, then a general `Exception` as a fallback for robustness.

<a id="concept-modules-and-packages"></a>
### Modules and Packages: Extending Python's Power
One of Python's greatest strengths, especially for data science, is its vast ecosystem of pre-written code, organized into **modules** and **packages**. These allow you to leverage code written by others, saving you immense time and effort, and providing highly optimized tools for complex tasks.

**Intuition:** Imagine you're building a house. Instead of making every brick, window, and door from scratch, you buy them pre-made from a supplier. Modules and packages are like these pre-made components for your code – they provide ready-to-use functions and classes.

*   **Module:** A single Python file (`.py`) containing functions, classes, and variables. When you import a module, you get access to everything defined within it. Think of it as a single toolbox with specific tools.
*   **Package:** A collection of related modules organized in a directory hierarchy (a folder containing multiple module files). A package often includes a special `__init__.py` file (which can be empty in modern Python) to signify it's a package. Think of it as a larger workshop containing many specialized toolboxes.

To use a module or package, you use the `import` statement:

```python
# Importing the entire 'math' module, which provides mathematical functions
import math

# Now you can use functions and constants from the math module by prefixing them with 'math.'
print(math.sqrt(25)) # Output: 5.0 (calculates square root)
print(math.pi)       # Output: 3.141592653589793 (the value of pi)
```

You can also import specific parts of a module or give a module/package a shorter alias (a nickname) for convenience:

```python
# Importing a specific function ('date') from the 'datetime' module
from datetime import date

today = date.today()
print(f"Today's date is: {today}") # Output: Today's date is: YYYY-MM-DD (current date)

# Importing a package with an alias (very common for data science libraries)
import pandas as pd # 'pd' is a widely used alias for the powerful pandas library

# Now you can use pandas functions via the shorter 'pd' alias
# For example, to read a CSV file into a DataFrame (a table-like structure):
# data = pd.read_csv("my_data.csv")
# print(data.head()) # Displays the first few rows of the data
```

For data science, you'll frequently use packages like:
*   **NumPy:** For numerical operations, especially with large, multi-dimensional arrays and matrices.
*   **Pandas:** For data manipulation and analysis, providing powerful data structures like DataFrames (think spreadsheets in Python).
*   **Matplotlib/Seaborn:** For creating static, interactive, and animated visualizations in Python.
*   **Scikit-learn:** For machine learning algorithms, including classification, regression, clustering, and more.

[IMAGE_PLACEHOLDER: A hierarchical diagram showing the relationship between modules and packages. At the top, a "Package" folder icon labeled "my_package". Inside it, two "Module" file icons labeled "module_a.py" and "module_b.py". Below "module_a.py", a box shows "function_x()" and "class_Y". Below "module_b.py", a box shows "variable_z". An arrow from an external "Your Script" box points to "my_package", illustrating the `import` statement. The pedagogical intent is to visually explain how modules are files and packages are folders that organize these files.]

## Wrap-Up
Congratulations! You've just taken your first significant steps into the world of Python programming, covering the fundamental concepts that will serve as your bedrock for data science. We've explored:
*   The power and versatility of the Python language.
*   Essential data types like integers, floats, strings, and booleans.
*   How to use variables to store and manage your data.
*   Control flow mechanisms (`if-else` statements and loops) for decision-making and repetition.
*   The importance of functions for writing organized and reusable code.
*   A brief introduction to Object-Oriented Programming (OOP) for structuring complex programs.
*   Techniques for handling errors gracefully with `try-except` blocks.
*   How to extend Python's capabilities using modules and packages.

These concepts are the basic tools in your data science toolkit. The best way to solidify your understanding is through practice. Experiment with the code examples, try to modify them, and challenge yourself to write small programs that use these new skills.

In upcoming lessons, we'll build upon this foundation, diving deeper into Python's data structures (like lists and dictionaries) and then moving on to the specialized libraries that make Python indispensable for data science. Keep practicing, and you'll be manipulating and analyzing data like a pro in no time!