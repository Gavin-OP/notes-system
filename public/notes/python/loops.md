<a id="concept-loops"></a>
# Control Flow: Loops

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the concept of iteration and why loops are essential in programming.
- Write and understand `for` loops to iterate over sequences like lists and strings.
- Utilize the `range()` function to generate sequences of numbers for looping.
- Write and understand `while` loops for repetitive execution based on a condition.
- Control loop execution using `break` to exit a loop and `continue` to skip the current iteration.

## Introduction
Imagine you have a list of your favorite songs, and you want to play each one. Or perhaps you're building a game where a character needs to move a certain number of steps. In programming, we often encounter situations where we need to repeat a block of code multiple times. Writing the same lines of code over and over again would be tedious, error-prone, and inefficient.

This is where **loops** come in! Loops are fundamental [control flow](../python/conditional-statements.md#concept-conditional-statements) structures that allow your program to execute a block of code repeatedly. They are like a powerful "repeat" button for your code, saving you time and making your programs much more dynamic and efficient. In this lesson, we'll explore the two main types of loops in Python: `for` loops and `while` loops, and learn how to control their behavior.

## Concept Progression

<a id="concept-iteration"></a>
### The Power of Repetition: Understanding Iteration
At its core, a loop is about **iteration**. Iteration simply means performing a task repeatedly. Think about a chef preparing a meal: they might chop each vegetable one by one, or stir a pot every few minutes until it's ready. Each chop or stir is an iteration of a task.

In programming, iteration allows us to process collections of data, perform calculations until a certain condition is met, or simply repeat an action a fixed number of times. Loops are the primary mechanism Python provides to achieve this powerful repetition. Without them, many common programming tasks would be incredibly difficult or impossible to implement efficiently.

Let's say you have a list of names and you want to greet each person. Instead of writing `print("Hello, Alice!")`, `print("Hello, Bob!")`, `print("Hello, Charlie!")` separately, a loop can do this for you automatically and elegantly.

[IMAGE_PLACEHOLDER: A flowchart illustrating the concept of a loop. It starts with "Start", goes to "Condition Check", then branches. If "True", it goes to "Execute Code Block", then back to "Condition Check". If "False", it goes to "End Loop", then "Stop". The arrows clearly show the repetitive flow.]

### `for` Loops: Iterating Over Sequences
The `for` loop in Python is your go-to tool for iterating over items that belong to a **sequence**. A sequence is an ordered collection of items, such as a list of names, a string of characters, or a range of numbers. When you use a `for` loop, Python goes through each item in the sequence, one by one, and executes the code block associated with the loop for that item.

The basic syntax of a `for` loop looks like this:

```python
for item in sequence:
    # Code to execute for each item
    # This code block is indented
```

Let's see this in action with a list of fruits:

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I love {fruit}!")

print("Finished listing fruits.")
```

**Output:**
```
I love apple!
I love banana!
I love cherry!
Finished listing fruits.
```

In this example:
- `fruits` is our sequence (a list).
- `fruit` is a temporary variable that takes on the value of each item in `fruits` during each iteration.
- The `print(f"I love {fruit}!")` line is the code block that gets executed for each `fruit`. Notice the essential indentation!

#### Using `range()` with `for` Loops
Sometimes, you don't need to iterate over an existing list or string, but rather want to repeat an action a specific, fixed number of times. This is where the built-in `range()` [function](../python/functions-in-python.md#concept-function) comes in handy. The `range()` function generates a sequence of numbers, which `for` loops can then iterate over.

`range()` can be used in a few ways:
- `range(stop)`: Generates numbers starting from 0 up to (but not including) `stop`.
- `range(start, stop)`: Generates numbers starting from `start` up to (but not including) `stop`.
- `range(start, stop, step)`: Generates numbers starting from `start` up to (but not including) `stop`, incrementing by `step` each time.

Let's count from 0 to 4 using `range(stop)`:

```python
for i in range(5): # Generates 0, 1, 2, 3, 4
    print(f"Counting: {i}")
```

**Output:**
```
Counting: 0
Counting: 1
Counting: 2
Counting: 3
Counting: 4
```

And counting from 1 to 5 using `range(start, stop)`:

```python
for num in range(1, 6): # Generates 1, 2, 3, 4, 5
    print(f"Number is: {num}")
```

**Output:**
```
Number is: 1
Number is: 2
Number is: 3
Number is: 4
Number is: 5
```

### `while` Loops: Repeating as Long as a Condition is True
While `for` loops are excellent for iterating over known sequences (like all items in a list), `while` loops are perfect when you need to repeat a block of code **as long as a certain condition remains true**. The `while` [loop](../python/control-flow-loops.md#concept-loop) continues to execute its code block repeatedly until its controlling condition becomes `False`. This makes `while` loops ideal when you don't know in advance how many times you'll need to loop.

The basic syntax of a `while` loop is:

```python
while condition:
    # Code to execute repeatedly
    # This code block is indented
```

It's absolutely crucial that the `condition` eventually becomes `False` *inside* the loop's code block. If the condition never changes to `False`, you'll create an **infinite loop**! An infinite loop will run forever, consuming your computer's resources, and you'll usually have to force-quit your program.

Let's see an example where we count up to a certain number:

```python
count = 0
while count < 3:
    print(f"Count is: {count}")
    count = count + 1 # Important: This line updates the condition!

print("While loop finished.")
```

**Output:**
```
Count is: 0
Count is: 1
Count is: 2
While loop finished.
```

Here's how this `while` loop works step-by-step:
1.  `count` is initialized to 0.
2.  The `while` loop checks if `count < 3` (which is `0 < 3`, so `True`).
3.  It prints "Count is: 0".
4.  `count` is incremented to 1.
5.  The loop checks `count < 3` again (now `1 < 3`, still `True`).
6.  It prints "Count is: 1".
7.  `count` is incremented to 2.
8.  The loop checks `count < 3` again (now `2 < 3`, still `True`).
9.  It prints "Count is: 2".
10. `count` is incremented to 3.
11. The loop checks `count < 3` again (now `3 < 3`, which is `False`).
12. Since the condition is `False`, the loop terminates, and "While loop finished." is printed.

[IMAGE_PLACEHOLDER: A flowchart comparing 'for' and 'while' loops. The 'for' loop branch shows "Start", "Get next item in sequence?", "Yes" -> "Process item" -> back to "Get next item". "No" -> "End". The 'while' loop branch shows "Start", "Condition True?", "Yes" -> "Execute code block" -> back to "Condition True?". "No" -> "End". Arrows clearly indicate flow.]

### Controlling Loop Flow: `break` and `continue`
Sometimes, the default behavior of a loop (either iterating through all items or continuing until the condition is false) isn't exactly what you need. Python provides two special statements, `break` and `continue`, to give you more fine-grained control over how your loops execute.

<a id="concept-break-statement"></a>
#### The `break` Statement
The `break` statement allows you to **immediately exit** the current [loop](../python/control-flow-loops.md#concept-loop), regardless of whether the loop's condition is still true or if there are more items in the sequence. It's like an emergency exit that stops the loop entirely and moves execution to the code immediately following the loop.

Consider searching for a specific item in a list. Once you find it, there's no need to keep looking:

```python
items = ["apple", "banana", "grape", "orange"]
search_item = "grape"

for item in items:
    if item == search_item:
        print(f"Found {search_item}!")
        break # Exit the loop immediately
    print(f"Checking {item}...")

print("Search complete.")
```

**Output:**
```
Checking apple...
Checking banana...
Found grape!
Search complete.
```

Without `break`, the loop would continue checking "orange" even after finding "grape", which would be less efficient. `break` ensures that once our goal is met, the loop stops.

<a id="concept-continue-statement"></a>
#### The `continue` Statement
The `continue` statement allows you to **skip the rest of the current iteration** of the loop and move directly to the next iteration. It's useful when you want to bypass certain parts of the loop's code block for specific conditions, but still want the loop to keep running for subsequent items or conditions.

Let's say we want to print only even numbers from a range, skipping any odd numbers:

```python
for number in range(1, 6): # Numbers 1, 2, 3, 4, 5
    if number % 2 != 0: # If the number is odd (remainder when divided by 2 is not 0)
        continue # Skip the print statement below and move to the next 'number'
    print(f"Even number: {number}")

print("Done with even numbers.")
```

**Output:**
```
Even number: 2
Even number: 4
Done with even numbers.
```

Here's what happens in this example:
1.  When `number` is 1, `1 % 2 != 0` is `True`, so `continue` is executed. The `print()` statement is skipped, and the loop moves to the next `number`.
2.  When `number` is 2, `2 % 2 != 0` is `False`, so `continue` is skipped. `print(f"Even number: 2")` is executed.
3.  This process repeats. For 3, `continue` is hit. For 4, it prints. For 5, `continue` is hit.

`break` and `continue` give you powerful tools to manage the flow of your loops, making your code more flexible and responsive to different conditions.

## Wrap-Up
Loops are indispensable tools in programming, allowing us to automate repetitive tasks and process data efficiently. We've explored the `for` loop for iterating over sequences (like lists, strings, or numbers generated by `range()`) and the `while` loop for repeating code based on a condition that eventually becomes false. We also learned how `break` can exit a loop entirely and `continue` can skip a single iteration, giving us precise control over our program's flow.

Understanding these control flow mechanisms is a crucial step in writing more complex and dynamic programs. In the next lesson, we'll build on this knowledge by looking at how to organize our code into reusable blocks using functions.