# User Input and Output

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand why programs need to interact with users.
- Display information to the user using the `print()` function.
- Format output effectively using `print()`'s arguments and f-strings.
- Get information from the user using the `input()` function.
- Convert user input from strings to other [data types](/note/python/python-basics-and-variables.md) like integers or floats.

## Introduction
Imagine trying to have a conversation with someone who never responds or to whom you can't say anything. That wouldn't be much of a conversation, would it? The same principle applies to computer programs! For a program to be truly useful and interactive, it needs a way to "talk" to the user (display information) and "listen" to the user (get input).

This ability to communicate is fundamental to almost every program you'll ever write. Whether it's showing results, asking for preferences, or gathering data, input and output are the backbone of user interaction. In this lesson, we'll learn the essential Python tools for making your programs interactive and engaging.

## Concept Progression

### Displaying Information with `print()`

**Why do programs need to display information?**
Programs often calculate results, ask questions, or simply need to inform the user about what's happening. Without a way to show this information, the user would be left in the dark, unsure if the program is even running or what it's doing!

In Python, the primary way to display information to the user is with the `print()` function. Think of `print()` as your program's voice. Whatever you put inside its parentheses, it will "speak" out to the console – the text-based window where your program runs.

Let's start with a simple example:

```python
print("Hello, world!")
```

When you run this code, you'll see:

```
Hello, world!
```

You can print not just text (which we call "strings"), but also numbers, the values stored in variables, and even the results of calculations:

```python
name = "Alice"
age = 30
pi_value = 3.14159

print(name)
print(age)
print(pi_value * 2)
```

This will output:

```
Alice
30
6.28318
```

Notice that each `print()` call, by default, adds a newline character at the end. This means that subsequent output will automatically appear on the next line, keeping your console output tidy.

**Printing Multiple Items and Basic Formatting**
You can also print multiple items with a single `print()` call by separating them with commas. By default, `print()` will automatically put a space between each item.

```python
city = "New York"
temperature = 25

print("The city is", city, "and the temperature is", temperature, "degrees Celsius.")
```

Output:

```
The city is New York and the temperature is 25 degrees Celsius.
```

The `print()` function has two useful optional arguments that give you more control over its output: `sep` (separator) and `end`.
-   `sep`: This argument allows you to change what's used to separate items when you print multiple values. The default separator is a single space.
-   `end`: This argument changes what's printed at the very end of the line. The default is a newline character (`\n`), which moves the cursor to the next line.

Let's see them in action:

```python
print("apple", "banana", "cherry", sep="-") # Separates items with a hyphen instead of a space
print("This is the first part.", end=" ") # Ends with a space instead of a newline
print("This is the second part, on the same line.")
```

Output:

```
apple-banana-cherry
This is the first part. This is the second part, on the same line.
```

**F-strings for Powerful Formatting**
While `sep` and `end` are useful for basic adjustments, for more complex and readable output formatting, Python offers "f-strings" (formatted string literals). F-strings allow you to embed expressions (like variables or calculations) directly inside a string literal by simply prefixing the string with `f` or `F`. This makes your output much clearer and easier to construct.

```python
item = "laptop"
price = 1200.50
quantity = 2

# Using an f-string to create a descriptive message
print(f"You bought {quantity} {item}s for a total of ${price * quantity:.2f}.")
```

Output:

```
You bought 2 laptops for a total of $2401.00.
```

In the example above, `{price * quantity:.2f}` calculates the total cost and then formats it to exactly two decimal places, which is perfect for displaying currency. F-strings are generally the preferred way to format output in modern Python because they are concise, powerful, and very easy to read.

Now that your program knows how to speak, let's teach it how to listen!

### Getting Information with `input()`

**Why do programs need to get information?**
Just as programs need to tell us things, they also need to ask us things. Imagine a program that calculates your age, but it doesn't know your birth year! Or a game that needs your name to personalize the experience. This is where getting input from the user becomes essential.

Python's `input()` function is how your program "listens" to the user. When `input()` is called, the program pauses its execution, waits for the user to type something and press the Enter key, and then takes whatever was typed as a string.

Here's how it works:

```python
# The string inside input() is a prompt that will be shown to the user
user_name = input("What is your name? ")
print(f"Hello, {user_name}! Nice to meet you.")
```

When you run this, the program will display "What is your name? " and then wait for you to type. If you type "Charlie" and press Enter, the output will be:

```
What is your name? Charlie
Hello, Charlie! Nice to meet you.
```

**Important Note: `input()` Always Returns a String**
This is a crucial point for beginners and a common source of confusion: no matter what the user types, the `input()` function *always* returns the value as a string. Even if the user types "123", `input()` will treat it as the string `"123"`, not the number `123`.

Let's see why this distinction matters:

```python
num1_str = input("Enter the first number: ")
num2_str = input("Enter the second number: ")

# If you try to add them directly, Python will concatenate them as strings
# For example, if you enter 5 and 3, it will print "53"
print("The sum (incorrectly) is:", num1_str + num2_str)
```

If you enter `5` for the first number and `3` for the second, the output will be:

```
Enter the first number: 5
Enter the second number: 3
The sum (incorrectly) is: 53
```

This happens because Python sees `num1_str` as the string `"5"` and `num2_str` as the string `"3"`. When you use the `+` operator with strings, Python joins them together (this is called **concatenation**). To perform mathematical operations, we need actual numbers, not strings that look like numbers.

### Converting Input Types

**Why is type conversion necessary?**
Since `input()` always gives us a string, if we want to perform calculations, comparisons, or any other operation that requires numbers (like integers or floating-point numbers), we need to convert the string input into the appropriate numeric type. This process is called **type conversion** or **type casting**.

Python provides built-in [functions](/note/python/functions.md) specifically for this purpose:
-   `int()`: Converts a value to an integer (a whole number).
-   `float()`: Converts a value to a floating-point number (a number with a decimal point).

Let's fix our previous addition example using type conversion to ensure we're working with numbers:

```python
num1_str = input("Enter the first number: ")
num2_str = input("Enter the second number: ")

# Convert the string inputs to integers using int()
num1_int = int(num1_str)
num2_int = int(num2_str)

# Now that they are integers, we can perform mathematical addition
total = num1_int + num2_int
print("The correct sum is:", total)
```

If you enter `5` and `3` now, the output will correctly be:

```
Enter the first number: 5
Enter the second number: 3
The correct sum is: 8
```

You can also combine the `input()` call and the type conversion into a single, more concise line, which is a very common pattern in Python programming:

```python
num1 = int(input("Enter the first number: ")) # Get input and convert to int immediately
num2 = int(input("Enter the second number: ")) # Get input and convert to int immediately

total = num1 + num2
print(f"The sum of {num1} and {num2} is {total}.")
```

**What if the user enters invalid input?**
What happens if the user types "hello" when your program is expecting a number for `int(input(...))`? Python will raise an error (specifically, a `ValueError`) because it doesn't know how to convert the text "hello" into an integer. For now, just be aware that this can happen. In future lessons, you'll learn how to handle such errors gracefully so your program doesn't crash.

[IMAGE_PLACEHOLDER: A flowchart illustrating the interaction between a user and a Python program. The flow starts with "Program starts". An arrow points to "Program uses `print()` to display a message (e.g., 'Enter your name:')". An arrow points to "User types input and presses Enter". An arrow points to "Program uses `input()` to read the user's text (always as a string)". An arrow points to "Program optionally uses `int()` or `float()` to convert the string to a number". An arrow points to "Program processes the input". An arrow points back to "Program uses `print()` to display results or another message". This loop continues until "Program ends".]

## Wrap-Up
You've now learned the fundamental ways your Python programs can interact with the outside world! The `print()` function allows your program to communicate information to the user, and with f-strings, you can make that output clear and well-formatted. The `input()` function enables your program to "listen" and receive information from the user. Remember the critical detail that `input()` always returns a string, and you'll often need to use `int()` or `float()` to convert that string into a number for calculations.

With these powerful tools, you can start building programs that are not just functional, but also engaging and user-friendly. In the next lesson, we'll explore how to make your programs make decisions based on the input they receive, adding another layer of intelligence to your code.