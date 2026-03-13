# Loops (for and while)

## Learning Objectives
- Understand why loops are essential for automating repetitive tasks in programming.
- Learn to use `for` loops to iterate over sequences of items or a specific range of numbers.
- Learn to use `while` loops to repeat actions as long as a certain condition remains true.
- Discover how to control loop execution using `break` to exit a loop early and `continue` to skip the current iteration.

## Introduction
Imagine you have a list of 100 names, and you need to print a personalized greeting for each one. Or perhaps you're building a game where you want to keep asking the player for input until they enter a valid move. Doing these tasks manually, by writing the same code 100 times or repeatedly asking for input with separate lines of code, would be incredibly tedious, time-consuming, and prone to errors.

This is where **loops** come in! Loops are one of the most powerful concepts in programming because they allow your code to perform repetitive tasks automatically. Instead of writing the same instructions over and over, you can tell your program, "Do this set of instructions multiple times," or "Keep doing this until a certain condition is met."

In this lesson, we'll explore two main types of loops in Python: `for` loops and `while` loops. You'll learn when to use each, how they work, and how to control their behavior to make your programs efficient and smart.

## Concept Progression

### The Problem with Repetition (and the Need for Loops)
Let's start with a simple scenario. Suppose you have a list of your favorite fruits and you want to print each one.

```python
print("Apple")
print("Banana")
print("Cherry")
print("Date")
```

This works fine for a short, fixed list. But what if you had 100 fruits? Or what if the list of fruits could change frequently? You'd have to manually add or remove `print()` statements every time, which is not only tedious but also makes your code hard to maintain. This kind of repetitive task is a perfect candidate for a loop. Loops help us write concise, flexible, and powerful code by automating these repetitions.

### `for` Loops - Iterating Over Sequences
A `for` loop is used when you want to **iterate** (which means to go through each item, one by one) over a sequence of items and do something with each item. Think of it as saying, "For *each* item in this collection, do X."

The "sequence" can be a list of items, the characters in a string, or even a range of numbers.

Let's revisit our fruit example, now made much more efficient using a `for` loop:

```python
fruits = ["Apple", "Banana", "Cherry", "Date"]

for fruit in fruits:
    print(fruit)
```

**How it works:**
1.  `fruits` is our list (the sequence we want to iterate over).
2.  The line `for fruit in fruits:` tells Python:
    *   Take the first item from `fruits` ("Apple"), assign it to the temporary variable `fruit`.
    *   Then, execute the indented code block (`print(fruit)`).
    *   After that, take the second item ("Banana"), assign it to `fruit`, and run the code block again.
    *   This process continues for every item in the `fruits` list until there are no more items left.
3.  The variable `fruit` is just a placeholder name; you could call it `item`, `f`, or anything else that makes sense for the context.

#### Using `range()` with `for` Loops
Often, you don't have a list of items but just want to repeat an action a specific number of times. This is where the built-in `range()` function is incredibly useful with `for` loops.

The `range()` function generates a sequence of numbers, which `for` loops can then iterate over.
-   `range(5)` generates numbers starting from 0 up to (but *not including*) 5: `0, 1, 2, 3, 4`.
-   `range(2, 7)` generates numbers starting from 2 up to (but *not including*) 7: `2, 3, 4, 5, 6`.
-   `range(1, 10, 2)` generates numbers starting from 1 up to (not including) 10, stepping by 2: `1, 3, 5, 7, 9`.

Let's use `range()` to print "Hello!" five times:

```python
for i in range(5):
    print("Hello!")
```

Here, `i` will take on the values 0, 1, 2, 3, 4. The `print("Hello!")` statement runs once for each of these values, resulting in "Hello!" being printed five times.

**Example: Counting down**

```python
for count in range(5, 0, -1): # Start at 5, go down to 1 (not including 0), step by -1
    print(count)
print("Blast off!")
```

This will print:
```
5
4
3
2
1
Blast off!
```

[IMAGE_PLACEHOLDER: A flowchart illustrating the execution of a `for` loop. Start node -> "Is there an item left in the sequence?" (Decision). If Yes -> "Assign item to variable" -> "Execute loop body" -> Arrow back to "Is there an item left?". If No -> "Exit loop" (End node). Arrows clearly show the flow.]

### `while` Loops - Repeating Until a Condition is Met
While `for` loops are great when you know how many times you want to repeat something (or you're going through a known collection), a `while` loop is used when you want to repeat a block of code *as long as* a certain condition remains true. The number of times the loop runs isn't necessarily known beforehand; it depends entirely on when the condition becomes false. Think of it as saying, "While this condition is true, keep doing X."

The basic structure of a `while` loop is:

```python
while condition:
    # Code to execute repeatedly
    # IMPORTANT: Make sure something inside the loop changes the condition
    # to eventually become false, or you'll have an infinite loop!
```

Let's create a simple counter using a `while` loop:

```python
count = 0
while count < 5:
    print(f"Count is: {count}")
    count = count + 1 # Increment count, so it eventually reaches 5
print("Loop finished!")
```

**How it works:**
1.  We initialize `count` to `0`.
2.  The `while count < 5:` condition is checked. Since `0 < 5` is true, the loop body executes.
3.  `print(f"Count is: {count}")` prints "Count is: 0".
4.  `count = count + 1` changes `count` to `1`.
5.  The condition `count < 5` is checked *again*. `1 < 5` is true, so the loop continues.
6.  This cycle repeats until `count` becomes `5`. At that point, when `count` is `5`, the condition `5 < 5` is false, and the loop terminates. The program then moves to the line immediately after the loop.

#### Avoiding Infinite Loops
A crucial aspect of `while` loops is ensuring that the condition eventually becomes false. If it never does, your program will run forever in an **infinite loop**, consuming resources and never finishing.

```python
# DANGER: This is an infinite loop!
# Don't run this unless you know how to stop your program (Ctrl+C in most terminals)
#
# while True: # 'True' is always true, so this condition never becomes false
#     print("Help, I'm stuck in a loop!")
#
```

Always make sure there's a line of code inside your `while` loop that modifies the variables involved in the condition, pushing it towards becoming false.

**Example: User input validation**
A common and practical use for `while` loops is to keep asking for input until valid input is provided.

```python
password = "" # Initialize password to an empty string so the loop condition can be checked
while password != "secret": # Loop as long as the password is not "secret"
    password = input("Enter the password: ")
    if password != "secret":
        print("Incorrect password. Try again.")
print("Access granted!")
```

[IMAGE_PLACEHOLDER: A flowchart illustrating the execution of a `while` loop. Start node -> "Check condition" (Decision). If True -> "Execute loop body" -> Arrow back to "Check condition". If False -> "Exit loop" (End node). Arrows clearly show the flow, emphasizing the loop back to the condition check.]

### Controlling Loops with `break` and `continue`
Sometimes, you need more fine-grained control over how your loops execute. Python provides two special statements for this: `break` and `continue`. These allow you to alter the normal flow of a loop based on specific conditions.

#### `break`: Exiting the Loop Early
The `break` statement immediately terminates the current loop (whether it's a `for` or `while` loop) and moves execution to the statement immediately following the loop. It's like an emergency exit that lets you jump out of the loop prematurely.

**Why use `break`?**
Imagine you're searching for a specific item in a large list. Once you find it, there's no need to keep checking the rest of the list. `break` lets you stop the search early, saving computational effort.

```python
items = ["apple", "banana", "grape", "orange", "kiwi"]
search_item = "grape"

for item in items:
    if item == search_item:
        print(f"Found {search_item}!")
        break # Exit the loop immediately because we found what we needed
    print(f"Checking {item}...")
print("Search complete.")
```

Output:
```
Checking apple...
Checking banana...
Found grape!
Search complete.
```
Notice how "Checking orange..." and "Checking kiwi..." are not printed. The `break` statement stopped the loop as soon as "grape" was found, preventing further iterations.

#### `continue`: Skipping the Current Iteration
The `continue` statement skips the rest of the code inside the current loop iteration and immediately jumps to the next iteration. The loop itself doesn't stop; it just skips a particular cycle and moves on to the next one.

**Why use `continue`?**
Suppose you're processing a list of numbers, but you want to skip any negative numbers and only work with positive ones. `continue` allows you to bypass the processing logic for specific items that don't meet certain criteria.

```python
numbers = [1, -2, 3, 0, -5, 6]

for num in numbers:
    if num <= 0:
        print(f"Skipping non-positive number: {num}")
        continue # Skip the rest of this iteration, go directly to the next number
    
    # This code only runs for positive numbers
    print(f"Processing positive number: {num}")
    print(f"Square of {num} is {num * num}")
```

Output:
```
Processing positive number: 1
Square of 1 is 1
Skipping non-positive number: -2
Processing positive number: 3
Square of 3 is 9
Skipping non-positive number: 0
Skipping non-positive number: -5
Processing positive number: 6
Square of 6 is 36
```
Notice how for -2, 0, and -5, the `print(f"Processing positive number: {num}")` and squaring operations are skipped. The `continue` statement caused the loop to immediately move to the next number in the `numbers` list.

## Wrap-Up
Congratulations! You've learned about loops, a fundamental concept that will dramatically increase your programming power. You now understand:
-   The difference between `for` loops (for iterating over sequences or a known range of repetitions) and `while` loops (for repeating actions based on a condition that might change).
-   How to use the versatile `range()` function to generate sequences of numbers for `for` loops.
-   The critical importance of designing `while` loops to avoid infinite loops.
-   How `break` can exit a loop entirely, and `continue` can skip to the next iteration, giving you precise control over loop execution.

Loops are everywhere in programming, from processing data to building interactive applications. As you continue your journey, you'll find yourself using them constantly to make your code more efficient, dynamic, and less repetitive. Next, we'll explore how to organize your code into reusable blocks using functions, which will further enhance your ability to write clean and powerful programs!