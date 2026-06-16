<a id="concept-control-flow-python"></a>
# Control Flow in Python

## Learning Objectives
- Understand why control flow is essential for dynamic Python programs.
- Use `if`, `elif`, and `else` statements to execute code conditionally.
- Implement `for` loops to iterate over sequences of items.
- Implement `while` loops to repeat actions as long as a condition remains true.
- Master `break` and `continue` statements to fine-tune loop behavior.
- Grasp Python's unique use of code indentation to define code blocks.

## Introduction
Imagine you're giving instructions to a robot. Sometimes, you want the robot to make a decision: "If it's raining, take an umbrella. Otherwise, wear sunglasses." Other times, you want it to repeat an action: "Keep stirring the soup until it's hot."

In programming, your code needs to do the same! Up until now, your Python programs have likely executed line by line, from top to bottom. But real-world programs are rarely that simple. They need to make decisions, repeat tasks, and respond dynamically to different situations. This is where **[control flow](../python/control-flow-python.md#concept-code-indentation)** comes in.

Control flow statements allow you to dictate the order in which your program's instructions are executed. They are the backbone of any intelligent program, enabling it to be flexible, efficient, and interactive. In this lesson, we'll explore the fundamental control flow tools in Python: conditional statements (like `if`) and loops (like `for` and `while`). Let's dive into how your programs can start making smart choices and performing repetitive tasks with ease.

## Concept Progression

### 1. Conditional Statements: Making Decisions

At its core, a computer program is a series of instructions. But what if you want certain instructions to run *only* under specific circumstances? This is where **conditional statements** shine. They allow your program to evaluate a condition (which results in either `True` or `False`) and execute different blocks of code based on that outcome.

Think of it like a fork in the road. Your program arrives at a decision point, checks a condition, and then takes one path if the condition is met, or another path if it isn't.

The most basic conditional statement in Python is the `if` statement.

```python
# Example: Checking if a number is positive
number = 10

if number > 0:
    print("The number is positive.")

print("This line always runs.")
```

In this example:
- `number > 0` is the **condition**. This expression evaluates to `True` if `number` is greater than `0`, and `False` otherwise.
- If the condition is `True` (which `10 > 0` is), the indented line `print("The number is positive.")` will execute.
- The line `print("This line always runs.")` is outside the `if` block, so it executes regardless of the condition.

What if the number was `-5`? The condition `number > 0` would be `False`, and the `print` statement inside the `if` block would be skipped entirely.

### 2. The `if`, `elif`, and `else` Statements

While a simple `if` is great for a single condition, often you need to handle multiple, mutually exclusive possibilities. Python provides `elif` (short for "else if") and `else` to create more comprehensive decision-making structures. These statements work together to ensure that only one block of code is executed among several options.

-   **`if`**: This is always the first condition checked. If it's `True`, its code block runs, and the rest of the `elif`/`else` chain is skipped.
-   **`elif`**: Stands for "else if." If the preceding `if` (and any `elif`s before it) were `False`, then this condition is checked. If `True`, its code block runs, and the rest of the chain is skipped. You can have multiple `elif` blocks to check many different conditions.
-   **`else`**: This is the "catch-all" [option](../finance/derivatives.md#concept-option). If all preceding `if` and `elif` conditions in the chain are `False`, the code block under `else` is executed.

Let's refine our number checking example to handle all possibilities:

```python
# Example: Checking if a number is positive, negative, or zero
number = -5

if number > 0:
    print("The number is positive.")
elif number < 0:
    print("The number is negative.")
else:
    print("The number is zero.")
```

Try changing the value of `number` to `0`, `5`, or `-10` and run the code to observe how the output changes based on which condition evaluates to `True`.

<a id="concept-code-indentation"></a>
#### Code Indentation: Python's Way of Grouping Code

One crucial and unique aspect of Python's control flow is **code indentation**. Unlike many other programming languages that use curly braces `{}` or keywords like `BEGIN`/`END` to define blocks of code, Python uses **whitespace** (spaces or tabs) to indicate which lines of code belong together.

Every line of code that is part of an `if`, `elif`, `else`, `for` loop, or `while` loop *must* be indented by the same amount. The standard and highly recommended practice is to use **4 spaces** for each level of indentation.

```python
# Correct indentation
age = 18
if age >= 18:
    print("You are an adult.") # This line is part of the if block
    print("You can vote.")    # This line is also part of the if block
print("Program finished.")    # This line is outside the if block

# Incorrect indentation (will cause an IndentationError)
# if age >= 18:
#     print("You are an adult.")
#    print("You can vote.") # Mismatched indentation - this would cause an error!
```

[IMAGE_PLACEHOLDER: A flowchart illustrating the `if-elif-else` control flow. Start node "Start". Decision node "Condition 1?". If Yes, execute "Block 1", then go to "End". If No, go to Decision node "Condition 2?". If Yes, execute "Block 2", then go to "End". If No, execute "Block 3", then go to "End". All paths converge to "End".]

This strict indentation rule is one of Python's defining features, promoting highly readable and consistent code across all Python projects.

### 3. `for` Loops: Repeating for Each Item

Once your program can make decisions, the next step is to make it repeat actions. What if you have a collection of items and want to perform the same action on each one? This is a perfect job for a **`for` loop**. A `for` loop is used to iterate over a sequence (like a list, tuple, string, or the output of `range()`) or other iterable objects, executing a block of code for each item.

Think of it like a conveyor belt: each item comes along, you do something with it, and then the next item appears until all items have been processed.

```python
# Example: Iterating through a list of fruits
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I love {fruit}s!")

# Example: Iterating through characters in a string
word = "Python"
print("\nCharacters in 'Python':")
for char in word:
    print(char)

# Example: Using range() to loop a specific number of times
print("\nCounting from 0 to 4:")
for i in range(5): # range(5) generates numbers 0, 1, 2, 3, 4
    print(i)
```

In the `for fruit in fruits:` example:
- `fruits` is the sequence we are iterating over.
- `fruit` is a temporary variable that takes on the value of each item in `fruits` during each iteration. The loop continues until all items in `fruits` have been assigned to `fruit` and processed.

The `range()` [function](../python/functions-in-python.md#concept-function) is particularly useful for generating a sequence of numbers, often used when you need to repeat an action a specific number of times. `range(5)` gives you numbers from 0 up to (but not including) 5.

### 4. `while` Loops: Repeating While a Condition is True

Sometimes, you don't know exactly how many times you need to repeat an action. Instead, you want to keep repeating it *as long as a certain condition remains true*. This is where **`while` loops** come in handy.

Imagine you're baking and the recipe says, "Knead the dough until it's smooth." You don't know how many kneads that will take, but you know when to stop: when the dough is smooth. A `while` loop works similarly: it repeatedly executes a block of code as long as its condition evaluates to `True`.

```python
# Example: A simple countdown
countdown = 5

while countdown > 0:
    print(countdown)
    countdown -= 1 # Decrement countdown by 1

print("Blast off!")

# Example: Asking for user input until a valid response is given
password = ""
while password != "secret":
    password = input("Enter the password: ")
    if password != "secret":
        print("Incorrect password. Try again.")
print("Access granted!")
```

**Important Note**: With `while` loops, it's crucial to ensure that the condition will eventually become `False`. If the condition never changes to `False`, your program will enter an **infinite loop** and run forever (or until you force it to stop). In the countdown example, `countdown -= 1` ensures `countdown` eventually reaches `0`, making `countdown > 0` false and allowing the loop to terminate. Always double-check your `while` loop conditions!

[IMAGE_PLACEHOLDER: A flowchart illustrating the `while` loop control flow. Start node "Start". Decision node "Condition?". If Yes, execute "Loop Body", then loop back to "Condition?". If No, go to "End".]

### 5. Controlling Loops with `break` and `continue`

While `for` and `while` loops provide powerful ways to repeat code, sometimes you need even finer control over how your loops behave. Python provides two special statements, `break` and `continue`, to modify the normal flow of a loop's execution.

<a id="concept-break-statement"></a>
#### `break` Statement: Exiting the Loop Early

The `break` statement immediately terminates the current loop (whether it's a `for` or `while` loop) and transfers control to the statement immediately following the loop.

Think of it as an emergency exit. You're in the middle of a process, but something happens that requires you to stop everything and leave the loop entirely, even if the loop's original condition hasn't been met or all items haven't been processed.

```python
# Example: Searching for a specific number in a list
numbers = [1, 5, 8, 12, 3, 9]
target = 12

for num in numbers:
    if num == target:
        print(f"Found {target}!")
        break # Exit the loop once the target is found
    print(f"Checking {num}...")

print("Search complete.") # This runs after the loop terminates

# Example with a while loop
count = 0
while True: # This loop would be infinite without 'break'
    print(f"Count is {count}")
    count += 1
    if count >= 3:
        break # Exit when count reaches 3
print("While loop stopped.")
```

<a id="concept-continue-statement"></a>
#### `continue` Statement: Skipping the Current Iteration

The `continue` statement skips the rest of the code inside the current loop iteration and immediately moves to the next iteration of the loop.

Think of it as skipping a step. You're processing items, and for a particular item, you decide you don't need to do the remaining steps for *this specific item*, but you want to continue with the *next* item in the sequence or the next check of the `while` condition.

```python
# Example: Printing only even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

print("Even numbers:")
for num in numbers:
    if num % 2 != 0: # If the number is odd
        continue     # Skip the rest of this iteration and go to the next number
    print(f"{num} is an even number.")

print("Finished checking numbers.")
```

In this example, when `num` is odd, the condition `num % 2 != 0` is `True`, so `continue` is executed. This means the `print` statement for that odd number is skipped, and the loop immediately proceeds to the next number in the `numbers` list.

## Wrap-Up

Congratulations! You've just unlocked the power of control flow in Python. Conditional statements (`if`, `elif`, `else`) allow your programs to make intelligent decisions, while loops (`for`, `while`) enable them to perform repetitive tasks efficiently. With `break` and `continue`, you gain even finer control over how your loops execute, allowing for more sophisticated program logic.

These concepts are fundamental building blocks for creating dynamic, interactive, and powerful Python applications. As you continue your programming journey, you'll find yourself using control flow in almost every program you write. In the next lesson, we'll explore how to organize your code into reusable blocks using functions, which often rely heavily on these control flow structures to perform their tasks.