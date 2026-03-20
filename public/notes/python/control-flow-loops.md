<a id="concept-control-flow-loops"></a>
# Control Flow: Loops

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the fundamental concept of a loop and why it's essential in programming.
- Write and understand `for` loops to iterate over sequences like lists, strings, and ranges.
- Implement `while` loops to repeat code blocks based on a condition.
- Use `break` and `continue` statements to control the flow within loops.
- Understand the concepts of iterables and iterators that power Python's iteration.
- Create simple generator functions using the `yield` keyword for efficient, on-demand value generation.

## Introduction
Imagine you have a task that needs to be performed many times. For example, printing a list of names, calculating the sum of numbers in a large dataset, or checking every item in a shopping cart. Doing these tasks manually, by writing the same line of code over and over, would be incredibly tedious, time-consuming, and prone to errors. This is precisely where **loops** come in!

Loops are a fundamental concept in programming that allow you to execute a block of code repeatedly. They are a cornerstone of efficient and concise code, enabling your program to automate repetitive actions with ease. Just like how you might loop through your favorite songs on a playlist, Python loops through instructions or items in a collection. In this lesson, we'll explore different types of loops and how to control their behavior, moving from simple repetition to more advanced, memory-efficient techniques.

## Concept Progression

### The Power of Repetition: Understanding Loops
At its core, a loop is a way to tell your computer: "Do this specific thing multiple times." Instead of writing the same instruction many times, you write it once and place it inside a loop. The loop then takes care of the repetition for you.

Why is this capability so powerful and essential in programming?
1.  **Efficiency**: You write significantly less code, making your programs shorter and easier to read.
2.  **Maintainability**: If you need to change the repeated action, you only have to modify it in one place within the loop, rather than in many scattered lines of code.
3.  **Automation**: Computers excel at repetitive tasks; loops leverage this strength, allowing programs to handle vast amounts of data or complex sequences of operations effortlessly.

Think of a loop like a recipe step that says, "Stir the batter until smooth." You don't know exactly how many times you'll stir, but you keep repeating the action (stirring) until a certain condition is met (the batter is smooth). Or, if you're baking cookies, "Repeat for each cookie on the tray." Here, you know exactly how many times to repeat based on the number of cookies you have.

[IMAGE_PLACEHOLDER: A simple flowchart illustrating a loop. It starts with an "Initialize" box, leads to a "Condition Check" diamond. If true, it goes to a "Execute Loop Body" rectangle, then back to the "Condition Check". If false, it exits the loop to an "End" box. Arrows clearly show the flow.]

In Python, we primarily use two main types of loops: `for` loops and `while` loops. While they both achieve repetition, they are designed for slightly different scenarios, as we'll explore next.

### `for` Loops: Iterating Over Collections
The `for` loop is Python's go-to tool for iterating over a sequence (like a list, tuple, [string](../python/python-data-types-and-variables.md#concept-character-string), or range) or any other **iterable** object. It executes a block of code once for each item in the sequence, making it perfect when you know you want to process every item in a collection.

Let's say you have a list of fruits and you want to print each one individually:

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

**Explanation:**
-   `fruits` is our list, which is an example of a sequence.
-   `for fruit in fruits:`: This line tells Python to take each item from the `fruits` list, one by one, and temporarily assign it to the variable `fruit`.
-   `print(fruit)`: This is the code block inside the loop. It gets executed for each `fruit` as it's assigned.

The output would be:
```
apple
banana
cherry
```

`for` loops are also commonly used with the `range()` function, especially when you need to repeat an action a specific number of times or iterate through a sequence of numbers. `range(n)` generates a sequence of numbers starting from 0 up to (but not including) `n`.

```python
# Print numbers from 0 to 4
for i in range(5):
    print(i)
```

Output:
```
0
1
2
3
4
```

The `range()` function is quite versatile and can also take `start` and `step` arguments: `range(start, stop, step)`.

```python
# Print even numbers from 2 to 10 (inclusive)
for num in range(2, 11, 2): # Start at 2, stop before 11, increment by 2
    print(num)
```

Output:
```
2
4
6
8
10
```

[IMAGE_PLACEHOLDER: A diagram showing a `for` loop iterating over a list. The list `["A", "B", "C"]` is shown. An arrow points from the list to a variable `item`. In the first iteration, `item` is "A", then "B", then "C". Each iteration shows the `print(item)` action being performed.]

### `while` Loops: Repeating Based on a Condition
In contrast to `for` loops, which iterate over a known sequence, `while` loops execute a block of code as long as a specified condition remains `True`. This makes `while` loops ideal when you don't know in advance how many times the loop needs to run, but rather when a certain condition is met or no longer met.

Consider a scenario where you want to count up to a certain number:

```python
count = 0
while count < 5: # The loop continues as long as 'count' is less than 5
    print(count)
    count = count + 1 # Increment count by 1
```

**Explanation:**
-   `count = 0`: We start by initializing a `count` variable to 0.
-   `while count < 5:`: This is the loop's condition. As long as `count` is less than 5, the code block inside the loop will execute.
-   `print(count)`: Prints the current value of `count`.
-   `count = count + 1`: This line is crucial! It changes the `count` variable in each iteration. If we didn't update `count`, it would always remain 0, the condition `count < 5` would always be `True`, and we'd end up with an **infinite loop**!

The output would be:
```
0
1
2
3
4
```

**Important Note on Infinite Loops:**
Always ensure that the condition in a `while` loop will eventually become `False`. If it never does, your program will run forever (or until you manually stop it), consuming resources and potentially crashing. An infinite loop is a common pitfall for beginners.

```python
# DANGER! This is an infinite loop!
# while True:
#     print("Help, I'm stuck!")
```

[IMAGE_PLACEHOLDER: A flowchart illustrating a `while` loop. It starts with an "Initialize Condition Variable" box, leads to a "Condition Check" diamond. If true, it goes to a "Execute Loop Body" rectangle, then to an "Update Condition Variable" rectangle, and finally back to the "Condition Check". If false, it exits the loop to an "End" box.]

<a id="concept-loop"></a>
### Controlling Loop Flow: `break` and `continue`
While `for` and `while` loops provide powerful ways to repeat code, sometimes you need even more fine-grained control over their execution. Python provides `break` and `continue` statements for this purpose, allowing you to alter the normal flow of a loop.

<a id="concept-break-statement"></a>
#### `break` Statement
The `break` statement immediately terminates the current loop and transfers control to the statement immediately following the loop. It's like an emergency exit that lets you jump out of the loop entirely, even if its normal termination condition hasn't been met.

**Example: Searching for an item**
Let's say you're looking for a specific name in a list. Once you find it, there's no need to continue checking the rest of the list.

```python
names = ["Alice", "Bob", "Charlie", "David"]
target_name = "Charlie"

for name in names:
    if name == target_name:
        print(f"Found {target_name}!")
        break # Exit the loop immediately because we found what we needed
    print(f"Checking {name}...")

print("Loop finished.")
```

Output:
```
Checking Alice...
Checking Bob...
Found Charlie!
Loop finished.
```
Notice that "Checking David..." was not printed. The `break` statement stopped the loop as soon as "Charlie" was found.

#### `continue` Statement
The `continue` statement skips the rest of the current iteration of the loop and moves directly to the next iteration. It's like saying, "I'm not interested in processing this particular item; just skip to the next one."

**Example: Skipping certain items**
Imagine you want to process a list of numbers but want to ignore any negative numbers.

```python
numbers = [1, -2, 3, -4, 5]

for num in numbers:
    if num < 0:
        print(f"Skipping negative number: {num}")
        continue # Skip the rest of this iteration and go to the next number
    print(f"Processing positive number: {num}")
```

Output:
```
Processing positive number: 1
Skipping negative number: -2
Processing positive number: 3
Skipping negative number: -4
Processing positive number: 5
```
Here, when `num` is negative, the `print` statement for "Processing positive number" is skipped, and the loop immediately proceeds to the next number.

[IMAGE_PLACEHOLDER: A flowchart showing a loop with `break` and `continue`. The loop has a "Condition Check" diamond. If true, it enters the loop body. Inside, there's a "Check for Continue" diamond. If true, it jumps back to the main "Condition Check". If false, it proceeds to "Check for Break" diamond. If true, it exits the loop entirely. If false, it executes the rest of the loop body and then goes back to the main "Condition Check".]

<a id="concept-iterator"></a>
### Iterators and Iterables: The Engine of `for` Loops
To truly understand how `for` loops work under the hood, it's helpful to grasp the concepts of **iterables** and **iterators**. These are fundamental to Python's iteration model.

An **iterable** is any Python object that you can "iterate over," meaning it can return its members one at a time. Lists, tuples, [strings](../python/python-data-types-and-variables.md#concept-character-string), and dictionaries are all common examples of iterables. Think of an iterable as a container of items that can be gone through.

An **iterator** is an object that represents a stream of data. It has a special method, `__next__()` (or `next()` in older Python versions), that returns the next item in the sequence. When there are no more items to return, it signals this by raising a `StopIteration` exception. An iterator is what actually keeps track of where you are in the sequence.

Think of it this way:
-   A **playlist** of songs is an **iterable** (a collection of items you can go through).
-   The **play button** on your music player, which advances to the next song, is an **iterator**. It remembers which song is currently playing and knows how to get to the next one.

When you use a `for` loop, Python implicitly performs these steps:
1.  It calls `iter()` on the iterable (e.g., your list) to get an iterator object.
2.  It then repeatedly calls `next()` on this iterator to get the next item.
3.  It continues this process until the iterator raises a `StopIteration` exception, at which point the loop gracefully ends.

Let's see this implicit process in action explicitly:

```python
my_list = [10, 20, 30]

# Step 1: Get an iterator from the iterable
my_iterator = iter(my_list)

# Step 2: Use the iterator to get elements one by one
print(next(my_iterator)) # Output: 10
print(next(my_iterator)) # Output: 20
print(next(my_iterator)) # Output: 30

# Step 3: Trying to get another element will raise StopIteration
# print(next(my_iterator)) # Uncommenting this line would cause an error
```

[IMAGE_PLACEHOLDER: A diagram illustrating the relationship between an iterable and an iterator. On the left, a "List (Iterable)" box containing [1, 2, 3]. An arrow labeled `iter()` points from this box to a "List Iterator (Iterator)" box on the right. Inside the iterator box, there's a pointer indicating the current position (e.g., pointing to 1). Arrows labeled `next()` emanate from the iterator, showing it yielding 1, then 2, then 3, and finally raising `StopIteration` when exhausted.]

<a id="concept-generator"></a>
### Generators: Efficient, On-Demand Iteration
Generators are a special and powerful type of iterator that you can define using a function. What makes them unique is that instead of using the `return` keyword to send back a value and end the function, generators use the `yield` keyword. When `yield` is encountered, the function pauses its execution, returns the yielded value, and crucially, saves its entire state (local variables, instruction pointer, etc.). When `next()` is called on the generator again, it resumes execution right from where it left off.

The main advantage of generators is their support for lazy evaluation (also known as lazy loading). They produce items one by one, only when requested, rather than creating and storing all items in memory at once. This is incredibly memory-efficient, especially when dealing with very large or potentially infinite sequences of data.

**Example: A simple generator function**

```python
def count_up_to(max_num):
    count = 1
    while count <= max_num:
        yield count # Pause here, return 'count', and remember state
        count += 1 # Resume from here next time 'next()' is called

# Using the generator
my_counter = count_up_to(3) # This creates a generator object, but doesn't run the code yet

print(next(my_counter)) # Output: 1 (Function runs up to first yield)
print(next(my_counter)) # Output: 2 (Function resumes, runs to second yield)
print(next(my_counter)) # Output: 3 (Function resumes, runs to third yield)

# Trying to get another element will raise StopIteration, as 'count' is now 4 and 'count <= max_num' is False
# print(next(my_counter))
```

You can also use generators directly in `for` loops, just like any other iterable. This is a very common and convenient way to consume generated values:

```python
print("\nUsing the generator in a for loop:")
for number in count_up_to(5):
    print(f"Generated: {number}")
```

Output:
```
Using the generator in a for loop:
Generated: 1
Generated: 2
Generated: 3
Generated: 4
Generated: 5
```

Generators are powerful tools for creating efficient data pipelines, processing large files, or handling any scenario where you need to produce a sequence of values without consuming excessive memory.

[IMAGE_PLACEHOLDER: A diagram illustrating a generator function. Show a "Generator Function" box with `def my_generator(): yield 1; yield 2`. An arrow points to a "Generator Object" box. Arrows labeled `next()` emanate from the generator object, showing it yielding 1, then pausing, then yielding 2, then pausing, and finally raising `StopIteration` when done. Emphasize that values are produced one at a time.]

## Wrap-Up
Loops are an indispensable part of programming, allowing you to automate repetitive tasks and write more efficient, concise code in Python. You've learned about `for` loops for iterating over collections and `while` loops for conditional repetition, where the number of iterations isn't known beforehand. We also covered `break` and `continue` statements, which provide powerful ways to fine-tune loop execution by exiting early or skipping specific iterations.

Furthermore, we delved into the underlying mechanics of iteration with iterables and iterators, understanding how `for` loops work behind the scenes. Finally, we discovered how generators provide a memory-efficient way to create custom iterators using the `yield` keyword, enabling on-demand value generation. Mastering these control flow tools will significantly enhance your ability to write powerful and efficient Python programs. In the next lesson, we'll explore how to organize your code into reusable blocks using functions, building upon the control flow concepts you've learned here.