# Control Flow

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand why control flow is essential for creating dynamic programs.
- Use `if`, `elif`, and `else` statements to execute code conditionally based on specific criteria.
- Implement `for` loops to iterate over sequences and repeat actions a known number of times.
- Implement `while` loops to repeat actions as long as a certain condition remains true.
- Utilize `break`, `continue`, and `pass` statements to fine-tune the execution flow within loops.

## Introduction
Imagine you're giving instructions to a robot. If you just tell it to do one thing after another, like "walk forward, then turn left, then pick up the box," it's pretty limited. What if the robot needs to decide whether to wear a raincoat based on the weather? Or what if it needs to keep cleaning a room *until* it's spotless? This is where **control flow** comes in.

In programming, control flow refers to the order in which individual statements or instructions are executed. By default, a program runs from top to bottom, one line after another. But real-world problems often require our programs to make decisions, repeat actions, or even skip parts of the code. Control flow statements give us the power to direct our program's path, making it dynamic, responsive, and intelligent.

This lesson will introduce you to the fundamental tools in Python that allow your programs to make choices and perform repetitive tasks, moving beyond simple linear execution.

## Concept Progression

### Making Decisions: Conditional Statements
Think about your daily life. You constantly make decisions: "If it's raining, I'll take an umbrella. Otherwise, I won't." Or, "If I'm hungry, I'll eat. If I'm tired, I'll sleep. Otherwise, I'll work." Programs need this same ability to make choices. This is where **conditional statements** come in. They allow your program to execute different blocks of code based on whether a certain condition is true or false.

#### The `if` Statement
The most basic conditional statement is the `if` statement. It checks a condition, and if that condition evaluates to `True`, it executes a specific block of code. If the condition is `False`, it simply skips that block and moves on.

Let's look at an example:

```python
weather = "sunny"

if weather == "sunny":
    print("It's a beautiful day! Let's go for a walk.")
print("The program continues here.")
```

In this example:
- `weather == "sunny"` is the condition we're checking. Since `weather` is indeed "sunny", this condition evaluates to `True`.
- Because the condition is `True`, the `print` statement indented below `if` is executed.
- The last `print` statement is always executed because it's outside the `if` block, meaning it runs regardless of the `if` condition.

What if `weather` was "rainy"?

```python
weather = "rainy"

if weather == "sunny":
    print("It's a beautiful day! Let's go for a walk.") # This line is skipped
print("The program continues here.")
```

Here, `weather == "sunny"` is `False` because `weather` is "rainy". Therefore, the indented `print` statement is skipped, and the program proceeds directly to the line after the `if` block.

**Important:** Python uses **indentation** (typically four spaces) to define code blocks. All lines belonging to an `if` statement (or any other control flow statement) must be indented at the same level. This is how Python knows which lines are part of the conditional block.

#### The `else` Statement
Often, when an `if` condition is `False`, you don't just want to skip a block of code; you want to do something *else* instead. That's exactly what the `else` statement is for. It provides an alternative block of code to execute when the preceding `if` condition (and any `elif` conditions) is `False`.

```python
temperature = 15 # degrees Celsius

if temperature > 25:
    print("It's hot! Wear light clothes.")
else:
    print("It's not too hot. A light jacket might be good.")
```

In this case, `temperature > 25` (which is `15 > 25`) is `False`. So, the code inside the `else` block is executed, and the message "It's not too hot. A light jacket might be good." is printed.

#### The `elif` Statement (Else If)
What if you have more than two possibilities? For example, "If it's hot, wear shorts. Else if it's warm, wear jeans. Else, wear a coat." This is where `elif` (short for "else if") comes in handy. You can chain multiple `elif` statements together to check several conditions in a specific order. The program will execute the block of code for the *first* condition that evaluates to `True`.

```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80: # This is checked only if the first 'if' was False
    print("Grade: B")
elif score >= 70: # This is checked only if the previous 'if' and 'elif' were False
    print("Grade: C")
else: # This is executed if all above conditions were False
    print("Grade: F")
```

In this example:
1.  `score >= 90` (85 >= 90) is `False`.
2.  The program moves to the first `elif`. `score >= 80` (85 >= 80) is `True`.
3.  "Grade: B" is printed.
4.  Crucially, once a condition is met and its block is executed, the rest of the `elif` and `else` blocks in that chain are skipped. The program continues after the entire `if-elif-else` structure.

This sequential checking ensures that only one block of code within the entire `if-elif-else` structure will ever be executed.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `if-elif-else` structure. Start with a "Start" node. An arrow points to a diamond-shaped "Condition 1?" node. If "True", an arrow points to a "Execute Block 1" rectangle, then to "End". If "False", an arrow points to another diamond-shaped "Condition 2?" node. If "True", an arrow points to "Execute Block 2" rectangle, then to "End". If "False", an arrow points to a "Execute Else Block" rectangle, then to "End".]

### Repeating Actions: Loops
Imagine you need to print the numbers from 1 to 5. You *could* write `print(1)`, `print(2)`, `print(3)`, `print(4)`, `print(5)`. But what if you needed to print numbers from 1 to 1000? Or process every single item in a very long list of customer orders? Writing `print` or similar code 1000 times would be incredibly tedious, inefficient, and prone to errors. This is where **loops** save the day. Loops allow you to repeat a block of code multiple times, making your programs concise and powerful.

#### The `for` Loop
The `for` loop is used for iterating over a sequence (like a list, tuple, string, or the numbers generated by `range()`) or other iterable objects. It's perfect when you want to perform an action for each item in a collection, or when you know in advance how many times you want to repeat an action.

Let's print numbers from 0 to 4 using `range()`:

```python
# range(5) generates a sequence of numbers: 0, 1, 2, 3, 4
for i in range(5):
    print(f"Current number: {i}")

print("Loop finished.")
```

Output:
```
Current number: 0
Current number: 1
Current number: 2
Current number: 3
Current number: 4
Loop finished.
```

Here, the variable `i` takes on each value generated by `range(5)` one by one, and the indented `print` statement is executed for each value. Once all values in the sequence have been processed, the loop terminates.

You can also loop directly over items in a list:

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I love {fruit}s!")
```

Output:
```
I love apples!
I love bananas!
I love cherries!
```
In this case, the `for` loop assigns each element of the `fruits` list to the `fruit` variable in turn, executing the `print` statement for each one.

#### The `while` Loop
The `while` loop is used to repeat a block of code as long as a certain condition remains `True`. It keeps executing the code block until the condition becomes `False`. This is particularly useful when you don't know beforehand how many times the loop needs to run, but you have a condition that will eventually become false.

**Caution:** If the condition in a `while` loop never becomes `False`, you'll create an **infinite loop**, and your program will run forever (or until you force-quit it). Always make sure there's a way for the condition to change and eventually become `False` within the loop's body.

Let's count down from 3:

```python
count = 3

while count > 0:
    print(f"Countdown: {count}")
    count = count - 1 # This line is crucial to change the condition!

print("Blast off!")
```

Output:
```
Countdown: 3
Countdown: 2
Countdown: 1
Blast off!
```

Let's trace the execution:
1.  Initially, `count` is 3. The condition `count > 0` (3 > 0) is `True`.
2.  The loop body executes: "Countdown: 3" is printed, and `count` becomes 2.
3.  The condition `count > 0` (2 > 0) is `True`.
4.  The loop body executes: "Countdown: 2" is printed, and `count` becomes 1.
5.  The condition `count > 0` (1 > 0) is `True`.
6.  The loop body executes: "Countdown: 1" is printed, and `count` becomes 0.
7.  The condition `count > 0` (0 > 0) is `False`. The loop terminates.
8.  The program continues after the loop, and "Blast off!" is printed.

[IMAGE_PLACEHOLDER: A flowchart illustrating a `while` loop. Start with a "Start" node. An arrow points to a diamond-shaped "Condition True?" node. If "True", an arrow points to a "Execute Loop Body" rectangle, then an arrow loops back to the "Condition True?" node. If "False", an arrow points to an "End" node.]

### Fine-Tuning Loops: Control Flow Statements
While `for` and `while` loops provide powerful ways to repeat code, sometimes you need even more precise control over how your loops behave. Python provides special statements that allow you to alter the normal execution flow *within* a loop.

#### The `break` Statement
The `break` statement immediately terminates the current loop (whether it's a `for` or `while` loop) and transfers control to the statement immediately following the loop. It's like an emergency exit that lets you jump out of the loop prematurely.

Imagine searching for a specific item in a list:

```python
items = ["apple", "banana", "grape", "orange", "kiwi"]
search_item = "grape"

for item in items:
    if item == search_item:
        print(f"Found {search_item}!")
        break # Exit the loop immediately once found
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

Without `break`, the loop would continue checking "orange" and "kiwi" even after "grape" was found, which would be inefficient. `break` allows us to stop processing once our goal is achieved.

#### The `continue` Statement
The `continue` statement skips the rest of the current iteration of the loop and moves directly to the next iteration. It's like saying, "I'm done with this particular item; let's move on to the next one without finishing the current cycle."

Let's print only the even numbers from a list, skipping the odd ones:

```python
numbers = [1, 2, 3, 4, 5, 6]

for num in numbers:
    if num % 2 != 0: # If the number is odd (remainder when divided by 2 is not 0)
        continue # Skip the rest of this iteration and go to the next number
    print(f"{num} is an even number.")
```

Output:
```
2 is an even number.
4 is an even number.
6 is an even number.
```

Here, when `num` is 1, 3, or 5, the `if` condition (`num % 2 != 0`) is `True`. The `continue` statement is executed, causing the `print` statement for that number to be skipped, and the loop immediately proceeds to the next number in the `numbers` list.

#### The `pass` Statement
The `pass` statement is a null operation; nothing happens when it executes. It's essentially a placeholder. You use `pass` when a statement is syntactically required by Python (e.g., an empty `if` block, function body, or loop body) but you don't want any code to execute there yet. This is often useful when you're designing a program and want to define a structure but haven't decided on its implementation.

```python
for i in range(5):
    # TODO: Implement some complex logic here later
    pass # This loop does nothing for now, but avoids a syntax error

print("Loop completed (did nothing).")

# Example with an if statement
age = 20
if age > 18:
    pass # We'll add adult-specific logic later, for now, do nothing
else:
    print("You are a minor.")
```

`pass` allows your code to be syntactically correct without actually performing any action, preventing errors that would occur if a required code block were left completely empty.

## Wrap-Up
Congratulations! You've just learned how to make your Python programs much more powerful and flexible. By mastering conditional statements (`if`, `elif`, `else`), you can guide your program to make intelligent decisions based on various conditions. With loops (`for`, `while`), you can automate repetitive tasks efficiently, saving time and reducing errors. And by using `break`, `continue`, and `pass`, you can fine-tune the behavior of your loops to handle specific scenarios with precision.

These control flow tools are fundamental building blocks for almost any non-trivial program you'll ever write. They are essential for creating dynamic, interactive, and efficient applications. In the next lesson, we'll explore how to organize your code into reusable blocks using [functions](../python/functions.md), further enhancing your programming capabilities.