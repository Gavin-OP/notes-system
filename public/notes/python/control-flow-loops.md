# Control Flow - Loops

## Learning Objectives
- Understand the fundamental concept of a loop and why it's essential for automating repetitive tasks.
- Learn to use `for` loops to iterate over sequences like lists, strings, and the output of the `range()` function.
- Master the `range()` function for generating sequences of numbers to control loop iterations.
- Learn to use `while` loops to repeat code blocks as long as a specified condition remains true.
- Understand and apply `break` to exit a loop prematurely and `continue` to skip the current iteration.

## Introduction
In our previous lesson on [control-flow-conditionals](../python/control-flow-conditionals.md), we learned how to make our programs make decisions: "If this is true, do that; otherwise, do something else." This ability to choose different paths is incredibly powerful for one-time choices.

But what if you need to do the *same thing* many times? Imagine you have a list of 100 names and you want to print a personalized greeting for each one. Would you write 100 separate `print()` statements? What if the list had 1000 names, or if it changed frequently? Writing the same code over and over again is tedious, error-prone, and inefficient.

This is where **loops** come in! Loops are a fundamental concept in programming that allow you to execute a block of code repeatedly. They are the workhorses of automation, letting your programs perform tasks over and over without you having to write the same code many times. In this lesson, we'll explore the two main types of loops in Python: `for` loops and `while` loops, and learn how to control their behavior to make our programs more dynamic and efficient.

## Concept Progression

### What is a Loop? The Power of Repetition

At its core, a loop is simply a way to tell your computer, "Do this task again and again until I tell you to stop, or until a certain condition is met." Think about repetitive actions in your daily life:
*   **Brushing your teeth:** You repeat the brushing motion until your teeth are clean.
*   **Walking to the store:** You take one step after another until you reach your destination.
*   **Baking cookies:** You repeat the process of scooping dough, placing it on a tray, and baking until all the dough is used up.

In programming, loops allow us to automate these kinds of repetitive actions. This saves us from writing redundant code, makes our programs more efficient, and allows them to handle varying amounts of data dynamically. Instead of writing instructions for each individual step, we write one set of instructions and tell the computer to repeat them.

[IMAGE_PLACEHOLDER: A simple flowchart illustrating the concept of a loop. It starts with a "Start" node, leads to a "Condition Check" diamond. If the condition is true, an arrow points to a "Perform Task" rectangle, which then loops back to the "Condition Check". If the condition is false, an arrow points to an "End" node. This visually represents repeating a task as long as a condition holds.]

### The `for` Loop: Iterating Over Collections

The `for` loop is your go-to tool when you want to **iterate** over a sequence or other **iterable** objects. When we say "iterate," we mean to go through each item in the sequence, one by one, and do something with it. Sequences in Python include familiar [data types](../python/variables-data-types.md) like lists, tuples, strings, and even dictionaries (though iterating over dictionaries works a bit differently, usually giving you keys).

The basic structure of a `for` loop looks like this:

```python
for item in sequence:
    # Code block to execute for each item
    # 'item' will hold the current element from the sequence
```

Let's break down each part:
*   `for`: This keyword signals the start of a `for` loop.
*   `item`: This is a temporary variable that will hold the *current* item from the `sequence` during each pass (or "iteration") of the loop. You get to choose its name, making it descriptive (e.g., `number`, `fruit`, `char`).
*   `in`: This keyword specifies that we are looking `in` a sequence.
*   `sequence`: This is the collection of items you want to iterate over. It could be a list of names, a string of characters, or any other iterable object.
*   `:`: Just like with `if` statements, the colon indicates the start of the indented code block that will be executed repeatedly for each item.

**Example 1: Looping through a list of fruits**

Let's say we have a list of fruits and want to print a message for each one.

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I love {fruit}s!")

print("Finished listing fruits.")
```

**Output:**
```
I love apples!
I love bananas!
I love cherrys!
Finished listing fruits.
```

In this example, the `for` loop processes the `fruits` list. In the first iteration, the `fruit` variable temporarily holds `"apple"`, and `print(f"I love apples!")` is executed. Then, `fruit` becomes `"banana"`, and so on, until all fruits in the list are processed. After the last item, the loop finishes, and the code after the loop (the final `print` statement) runs.

**Example 2: Looping through characters in a string**

Strings are also sequences – sequences of characters! This means you can iterate over them character by character.

```python
my_string = "Python"

for char in my_string:
    print(char)
```

**Output:**
```
P
y
t
h
o
n
```
Here, the `char` variable takes on each character of "Python" in turn, printing it on a new line.

### The `range()` Function: Looping a Specific Number of Times

Sometimes, you don't want to loop over items in an existing collection, but rather you want to repeat an action a specific, fixed number of times. This is where the `range()` function comes in handy, especially when used with `for` loops.

The `range()` function generates a sequence of numbers. It's incredibly useful for controlling how many times a `for` loop runs, or for generating indices.

There are three common ways to use `range()`:

1.  **`range(stop)`:** Generates numbers starting from `0` up to (but **not including**) the `stop` value.
    *   `range(5)` will produce the sequence `0, 1, 2, 3, 4`.

2.  **`range(start, stop)`:** Generates numbers from `start` up to (but **not including**) the `stop` value.
    *   `range(2, 7)` will produce the sequence `2, 3, 4, 5, 6`.

3.  **`range(start, stop, step)`:** Generates numbers from `start` up to (but **not including**) the `stop` value, incrementing by `step` each time.
    *   `range(0, 10, 2)` will produce `0, 2, 4, 6, 8`.
    *   You can also use a negative `step` to count backwards: `range(5, 0, -1)` will produce `5, 4, 3, 2, 1`.

**Example 1: Looping a fixed number of times**

Let's say we want to print "Hello!" five times. We don't have a list of "Hello!"s, but we can use `range(5)` to make the loop run five times.

```python
for i in range(5):
    print("Hello!")
```

**Output:**
```
Hello!
Hello!
Hello!
Hello!
Hello!
```
In this case, `i` will take values `0, 1, 2, 3, 4`. The value of `i` itself isn't used in the `print` statement, but it ensures the loop runs exactly 5 times.

**Example 2: Looping with specific start and end points**

```python
for num in range(1, 4): # Numbers from 1 up to (but not including) 4
    print(f"Counting: {num}")
```

**Output:**
```
Counting: 1
Counting: 2
Counting: 3
```

**Example 3: Looping with a step**

```python
for even_num in range(0, 10, 2): # Start at 0, go up to 10, step by 2
    print(f"Even number: {even_num}")
```

**Output:**
```
Even number: 0
Even number: 2
Even number: 4
Even number: 6
Even number: 8
```

### The `while` Loop: Repeating Until a Condition is False

While `for` loops are excellent for iterating over a known sequence or a fixed number of times, `while` loops are used when you want to repeat a block of code *as long as a certain condition remains true*. The loop continues to execute until the condition becomes `False`. This makes `while` loops ideal for situations where you don't know in advance how many times the loop needs to run, but you have a clear stopping condition.

The structure of a `while` loop is:

```python
while condition:
    # Code block to execute repeatedly
    # IMPORTANT: Make sure something inside the loop
    # eventually changes the 'condition' to False!
```

**Important:** With `while` loops, it's absolutely crucial that something inside the loop eventually changes the `condition` to `False`. If the condition never becomes `False`, you'll create an **infinite loop**, and your program will run forever (or until you manually stop it, often by pressing `Ctrl+C` in your terminal!).

[IMAGE_PLACEHOLDER: A flowchart illustrating a while loop. It starts with a "Start" node, leads to a "Condition Check" diamond. If the condition is true, an arrow points to an "Execute Code Block" rectangle. From the "Execute Code Block", an arrow loops back to the "Condition Check". If the condition is false, an arrow points to an "Exit Loop" node, then to an "End" node. This emphasizes the continuous checking of the condition.]

**Example 1: Counting up to a number**

Let's use a `while` loop to count from 0 up to 4.

```python
count = 0 # Initialize our counter variable

while count < 5: # Condition: loop as long as count is less than 5
    print(f"Count is: {count}")
    count += 1 # Crucial: Increment count to eventually make the condition False

print("Loop finished!")
```

**Output:**
```
Count is: 0
Count is: 1
Count is: 2
Count is: 3
Count is: 4
Loop finished!
```
Here, the loop continues as long as `count` is less than 5. Inside the loop, `count` is incremented by 1 in each iteration. Once `count` becomes 5, the condition `count < 5` becomes `False`, and the loop terminates.

**Example 2: Simple user input loop**

A `while` loop is perfect for repeatedly asking a user for input until a correct response is given.

```python
password = "" # Initialize password to an empty string so the loop starts

while password != "secret": # Loop as long as the password is not "secret"
    password = input("Enter the password: ")
    if password != "secret":
        print("Incorrect password. Try again.")

print("Access granted!")
```

**Output (example interaction):**
```
Enter the password: wrong
Incorrect password. Try again.
Enter the password: guess
Incorrect password. Try again.
Enter the password: secret
Access granted!
```
This loop keeps asking for the password until the correct one ("secret") is entered. The condition `password != "secret"` controls the loop's execution.

### Controlling Loops: `break` and `continue`

Sometimes, the standard flow of a loop isn't quite enough. You might need to exit a loop early or skip certain iterations based on specific conditions. Python provides two powerful statements, `break` and `continue`, to give you more fine-grained control over your loops.

#### `break` Statement: Exiting the Loop Early

The `break` statement immediately terminates the current loop (whether it's a `for` or `while` loop) and transfers control to the statement immediately following the loop. Think of it like an emergency exit: as soon as `break` is encountered, the loop stops, no matter how many iterations are left or if the `while` condition is still true.

**Example: Searching for an item**

Imagine you have a list of numbers and you want to find the first number greater than 10. Once you find it, there's no need to check the rest of the list, so you can `break` out.

```python
numbers = [1, 5, 8, 12, 3, 15, 7]
found_number = None

for num in numbers:
    if num > 10:
        found_number = num
        print(f"Found the first number greater than 10: {found_number}")
        break # Exit the loop immediately because we found what we needed
    else:
        print(f"{num} is not greater than 10.")

print("Search complete.")
```

**Output:**
```
1 is not greater than 10.
5 is not greater than 10.
8 is not greater than 10.
Found the first number greater than 10: 12
Search complete.
```
Notice how the numbers `3, 15, 7` were not processed after `12` was found. The `break` statement efficiently stopped the loop.

#### `continue` Statement: Skipping the Current Iteration

The `continue` statement skips the rest of the code inside the *current* loop iteration and immediately moves to the next iteration. The loop *doesn't* terminate; it just skips a part of its current cycle and proceeds with the next item or condition check.

**Example: Printing only even numbers**

Let's say you want to process a list of numbers, but you're only interested in the even ones. You can use `continue` to skip any odd numbers.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for num in numbers:
    if num % 2 != 0: # If the number is odd (remainder when divided by 2 is not 0)
        print(f"Skipping odd number: {num}")
        continue # Skip the rest of this iteration and go to the next number
    
    # This line will only execute if the number was even
    print(f"Found an even number: {num}")
```

**Output:**
```
Skipping odd number: 1
Found an even number: 2
Skipping odd number: 3
Found an even number: 4
Skipping odd number: 5
Found an even number: 6
Skipping odd number: 7
Found an even number: 8
Skipping odd number: 9
Found an even number: 10
```
Here, when an odd number is encountered, `continue` makes the loop immediately jump to the next `num` in the `numbers` list, without executing the `print("Found an even number...")` line for that odd number.

## Wrap-Up

Loops are incredibly powerful tools that allow your programs to perform repetitive tasks efficiently and dynamically. You've learned about:
*   The fundamental concept of a **loop** as a way to automate repetition.
*   **`for` loops** for iterating over sequences (like lists and strings) and performing actions for each item.
*   The **`range()` function** for generating numerical sequences, often used with `for` loops to repeat actions a specific number of times.
*   **`while` loops** for repeating actions as long as a certain condition remains true, emphasizing the critical need to manage the condition to avoid infinite loops.
*   **`break`** to exit a loop entirely when a specific condition is met.
*   **`continue`** to skip the current iteration of a loop and move to the next one.

With loops, your programs can now handle dynamic data, automate complex processes, and become much more versatile. This ability to repeat actions is a cornerstone of almost any useful program. In the next lesson, we'll explore how to organize our code into reusable blocks using [functions](../python/functions.md), which often work hand-in-hand with loops to build robust applications!