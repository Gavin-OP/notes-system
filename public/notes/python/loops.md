# Loops (for and while)

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose of loops in programming and identify scenarios where they are useful.
- Write `for` loops to iterate over sequences like [lists](/note/python/lists.md) and use the `range()` function for numerical iteration.
- Construct `while` loops to repeat actions based on a condition, and understand how to prevent infinite loops.
- Utilize `break` to exit a loop prematurely and `continue` to skip the current iteration.

## Introduction
Imagine you're a chef, and you need to chop 100 carrots. Would you write down "chop carrot" 100 times on your to-do list? Probably not! You'd just write "chop carrots until they're all done."

Programming often involves similar repetitive tasks. Perhaps you have a list of 100 names and you need to print each one to the screen. Or maybe you're building a game where you want to keep asking the player for input until they type "quit". Doing these tasks manually, by writing the same line of code 100 times or repeatedly asking for input, would be incredibly tedious, error-prone, and inefficient.

This is where **loops** come in! Loops are a fundamental concept in programming, falling under the umbrella of **[control flow](/note/python/conditional-statements.md)**. They allow you to automate repetitive tasks by executing a block of code multiple times without having to write it out over and over. In Python, the two main types of loops are `for` loops and `while` loops, each suited for different kinds of repetition. Let's dive in and see how they make your code more powerful and concise.

## Concept Progression

### The Need for Repetition
Let's start with a simple problem. Suppose you want to greet three different people: Alice, Bob, and Charlie. Without loops, you might write:

```python
print("Hello, Alice!")
print("Hello, Bob!")
print("Hello, Charlie!")
```

This works fine for three people. But what if you had 100 people? Or a list of names that changes frequently? Writing `print()` 100 times is not practical and certainly not scalable. This is the core problem that loops solve: they let you write the `print()` statement once and tell the computer to repeat it for each name.

### `for` Loops - Iterating Over Sequences
A `for` loop is used when you want to iterate over a **sequence** (like a list, tuple, string, or the output of `range()`) or other **iterable objects**. Think of it as saying, "For *each item* in this collection, do something." `for` loops are ideal when you know beforehand how many times you want to repeat an action, or when you want to process every item in a collection.

Let's revisit our greeting example with a `for` loop:

```python
names = ["Alice", "Bob", "Charlie"]

for name in names:
    print(f"Hello, {name}!")
```

**How it works:**
1.  `names` is a list containing three strings.
2.  The line `for name in names:` tells Python: "Take each item from the `names` list, one by one. For each item, temporarily assign it to the variable `name`."
3.  The indented code block (`print(f"Hello, {name}!")`) is then executed once for each `name` in the list.
4.  The loop automatically continues until all items in the `names` list have been processed.

#### Using `range()` with `for` loops
Often, you don't have a list of items but just want to repeat an action a specific number of times. This is where the `range()` function is incredibly useful. `range()` generates a sequence of numbers, which `for` loops can then iterate over.

Here's how `range()` works:
-   `range(5)` generates numbers from 0 up to (but *not including*) 5: `0, 1, 2, 3, 4`.
-   `range(1, 6)` generates numbers from 1 up to (but *not including*) 6: `1, 2, 3, 4, 5`.
-   `range(0, 10, 2)` generates numbers from 0 up to 10, stepping by 2: `0, 2, 4, 6, 8`.

Let's say you want to print "Python is fun!" five times:

```python
for i in range(5):
    print("Python is fun!")
```

In this case, `i` will take on the values 0, 1, 2, 3, 4. We don't actually use `i` in the `print` statement itself; it just serves as a counter to ensure the loop runs exactly five times.

If you wanted to print numbers from 1 to 3:

```python
for num in range(1, 4): # Remember, range goes up to, but not including, the end number
    print(num)
```

This would output:
```
1
2
3
```

[IMAGE_PLACEHOLDER: A flowchart illustrating a `for` loop. Start node "Begin". Arrow to "Is there another item in the sequence?". If "Yes", arrow to "Assign item to loop variable". Arrow to "Execute loop body". Arrow back to "Is there another item?". If "No", arrow to "End".]

### `while` Loops - Repeating Until a Condition is Met
While `for` loops are great for iterating over known sequences, what if you don't know how many times you need to repeat an action? This is where `while` loops shine. A `while` loop is used when you want to repeat a block of code *as long as* a certain condition remains `True`. Think of it as saying, "Keep doing this *while* this condition is true."

The structure of a `while` loop is:

```python
while condition:
    # Code to execute repeatedly
    # IMPORTANT: Make sure something inside the loop eventually makes the condition false!
```

Let's create a simple counter that counts from 1 to 3 using a `while` loop:

```python
count = 1
while count <= 3:
    print(count)
    count = count + 1 # Or the shorthand: count += 1
print("Loop finished!")
```

**How it works:**
1.  `count` starts at 1.
2.  The `while count <= 3:` condition is checked *before each iteration*.
    *   **Iteration 1:** `count` is 1. `1 <= 3` is `True`. `print(1)` executes. `count` becomes 2.
    *   **Iteration 2:** `count` is 2. `2 <= 3` is `True`. `print(2)` executes. `count` becomes 3.
    *   **Iteration 3:** `count` is 3. `3 <= 3` is `True`. `print(3)` executes. `count` becomes 4.
    *   **Iteration 4:** `count` is 4. `4 <= 3` is `False`. The loop stops.
3.  The line `print("Loop finished!")` executes, as it's outside the loop.

**Important: Avoiding Infinite Loops!**
With `while` loops, it's absolutely crucial that the condition eventually becomes `False`. If it never does, your program will run forever in an **infinite loop**, consuming resources and never finishing. This is a common mistake for beginners.

```python
# DANGER! This is an infinite loop!
# Don't run this unless you know how to stop your program (Ctrl+C in most terminals)
#
# count = 1
# while count <= 3:
#     print(count)
#     # We forgot to update 'count'! So count will always be 1, and 1 <= 3 is always True.
```

Always ensure there's a line of code inside your `while` loop that modifies the variables involved in the condition, leading to the condition eventually becoming `False`.

[IMAGE_PLACEHOLDER: A flowchart illustrating a `while` loop. Start node "Begin". Arrow to "Check condition". If "True", arrow to "Execute loop body". Arrow back to "Check condition". If "False", arrow to "End".]

### Controlling Loops with `break` and `continue`
Sometimes, the standard `for` or `while` loop behavior isn't quite enough. You might need more fine-grained control over how your loops execute, such as stopping early or skipping certain iterations. Python provides two special statements for this: `break` and `continue`.

#### `break` Statement
The `break` statement immediately terminates the current loop (whether it's a `for` or `while` loop) and transfers control to the statement immediately following the loop. It's like an emergency exit from the loop. `break` is useful when you've found what you're looking for or a condition makes further looping unnecessary.

**Example: Searching for an item**
Imagine you have a list of numbers and you want to find the first number greater than 10. Once you find it, there's no need to check the rest of the list, so you can `break` out of the loop to save time.

```python
numbers = [1, 5, 8, 12, 3, 15]
found_number = None

for num in numbers:
    if num > 10:
        found_number = num
        print(f"Found the first number greater than 10: {found_number}")
        break # Exit the loop immediately
    else:
        print(f"{num} is not greater than 10.")

if found_number is None:
    print("No number greater than 10 was found.")
```

Output:
```
1 is not greater than 10.
5 is not greater than 10.
8 is not greater than 10.
Found the first number greater than 10: 12
```
Notice how `3 is not greater than 10.` and `15 is not greater than 10.` were not printed. This is because `break` stopped the loop entirely after `12` was found, preventing further iterations.

#### `continue` Statement
The `continue` statement skips the rest of the current iteration of the loop and moves directly to the next iteration. It's like saying, "I'm done with this particular item; let's move on to the next one without finishing the current task." `continue` is useful when you want to skip processing for certain items that don't meet a specific criterion.

**Example: Processing only even numbers**
Suppose you have a list of numbers and you only want to print the even ones, skipping any odd numbers you encounter.

```python
numbers = [1, 2, 3, 4, 5, 6]

for num in numbers:
    if num % 2 != 0: # If the number is odd (remainder when divided by 2 is not 0)
        print(f"Skipping odd number: {num}")
        continue # Skip the rest of the code in this iteration, go to the next number
    print(f"Processing even number: {num}")
```

Output:
```
Skipping odd number: 1
Processing even number: 2
Skipping odd number: 3
Processing even number: 4
Skipping odd number: 5
Processing even number: 6
```
Here, when `num` is 1, 3, or 5, the `if` condition is true, `continue` is executed, and the `print(f"Processing even number: {num}")` line is skipped for that specific iteration. The loop then immediately proceeds to check the next number in the `numbers` list.

## Wrap-Up
Loops are indispensable tools for any programmer, allowing you to automate repetitive tasks and write more efficient code. You've learned about `for` loops, which are perfect for iterating over collections or a known range of numbers, and `while` loops, which repeat as long as a condition remains true. We also covered `break` for exiting a loop early and `continue` for skipping to the next iteration. Mastering these concepts will allow you to write more dynamic and powerful programs. In the next lesson, we'll explore how to organize your code into reusable blocks using [functions](/note/python/functions.md), building on the [control flow](/note/python/conditional-statements.md) concepts you've learned here.