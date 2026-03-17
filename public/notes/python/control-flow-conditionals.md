# Control Flow: Conditional Statements

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose of conditional statements in programming.
- Write Python code using `if` statements to execute code based on a condition.
- Use `else` statements to provide alternative actions when an `if` condition is false.
- Implement `elif` statements to handle multiple, mutually exclusive conditions.
- Understand and correctly apply indentation to define code blocks in Python.
- Grasp the concept of "truthiness" and how Python evaluates conditions.

## Introduction
Imagine you're giving instructions to a robot. Sometimes, you want the robot to do something only *if* a certain situation is true. For example, "If the light is red, stop. Otherwise, keep going." Or, "If it's raining, take an umbrella; if it's sunny, wear sunglasses; otherwise, just go outside."

In programming, our programs constantly need to make decisions and perform different actions based on various conditions. This ability to choose different paths of execution is called **[control flow](../python/control-flow-loops.md)**, and it's fundamental to creating dynamic and useful programs. Without it, our programs would just run the same set of instructions every single time, no matter what.

This lesson will introduce you to **conditional statements**, the primary tools Python provides to make these decisions. You'll learn how to tell your program, "If this is true, do that; otherwise, do something else."

## Concept Progression

### The Need for Decisions: Introducing Conditional Statements

Think about your daily life. You make decisions all the time:
*   If it's cold outside, I'll wear a jacket.
*   If I'm hungry, I'll eat.
*   If my alarm rings, I'll wake up.

Programs need to do the same. They need to react to different inputs, data, or states. For instance:
*   If a user enters a valid password, grant access.
*   If an item is out of stock, display "Sold Out."
*   If a number is even, perform one calculation; if it's odd, perform another.

This is where `__MASK_0__`s come in. A conditional statement allows your program to execute a specific block of code *only if* a certain condition is met. It's like a fork in the road for your program, where the path taken depends on whether a condition is true or false. Let's start with the simplest way to make such a decision: the `if` statement.

### The `if` Statement: Making a Simple Choice

The most basic conditional statement is the `__MASK_0__`. It allows you to specify a condition, and if that condition evaluates to `True`, a specific `__MASK_1__` of instructions will be executed. If the condition is `False`, that block of code is simply skipped.

Here's the basic structure:

```python
if condition:
    # This code block runs if the condition is True
    statement_1
    statement_2
    # ...
```

Let's break this down:
1.  `if`: This keyword tells Python you're starting a conditional statement.
2.  `condition`: This is an expression that Python will evaluate. It can be anything that results in a `True` or `False` value (like `x > 10`, `name == "Alice"`, or `is_raining`). We covered these kinds of expressions in the [operators-expressions](../python/operators-expressions.md) lesson.
3.  `:` (colon): This marks the end of the `if` statement's header and signals that an indented `__MASK_0__` follows.
4.  `__MASK_0__`: This is crucial in Python! All lines of code that belong to the `if` block *must* be indented by the same amount (typically four spaces). Python uses indentation to understand which statements are part of the `if` block and which are not. If you don't indent correctly, Python will raise an `IndentationError`.

**Example 1: Checking if a number is positive.**

```python
number = 10

if number > 0:
    print("The number is positive.")

print("This line always runs, regardless of the condition.")
```

In this example, `number > 0` evaluates to `True`, so "The number is positive." is printed. The program then continues to the next line outside the `if` block.

**Example 2: When the condition is false.**

```python
number = -5

if number > 0:
    print("The number is positive.") # This line is skipped because the condition is False

print("This line always runs, regardless of the condition.")
```

Here, `number > 0` evaluates to `False`, so the `print` statement inside the `if` block is skipped entirely. The program then proceeds directly to the line after the `if` block.

Think of an `if` statement like a gate: if the condition is true, the gate opens and you can go through; otherwise, the gate stays closed, and you just walk past it.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `if` statement. Start node "Start". Arrow to "Condition True?". If "Yes", arrow to "Execute Code Block". If "No", arrow directly to "Continue Program". Both "Execute Code Block" and "Continue Program" lead to "End" node. The "Condition True?" node is a diamond, "Execute Code Block" and "Continue Program" are rectangles.]

### The `else` Statement: Providing an Alternative

An `__MASK_0__` lets you do something *if* a condition is true. But what if you want to do something *different* when that condition is false? That's where the `__MASK_1__` comes in.

The `else` statement provides an alternative `__MASK_0__` to be executed *only* when the preceding `if` condition is `False`. An `else` statement *must* always be paired with an `if` statement.

Here's the basic structure:

```python
if condition:
    # This code block runs if the condition is True
    statement_A
else:
    # This code block runs if the condition is False
    statement_B
```

**Example: Checking if a number is even or odd.**

```python
num = 7

if num % 2 == 0: # The modulo operator (%) gives the remainder of a division
    print(f"{num} is an even number.")
else:
    print(f"{num} is an odd number.")

print("Decision made!")
```

In this case, `7 % 2 == 0` evaluates to `False` (because `7 % 2` is `1`, and `1 == 0` is `False`). So, the code inside the `else` block is executed, printing "7 is an odd number."

If `num` was `4`:

```python
num = 4

if num % 2 == 0:
    print(f"{num} is an even number.") # This line runs
else:
    print(f"{num} is an odd number.") # This line is skipped

print("Decision made!")
```

Here, `4 % 2 == 0` evaluates to `True`, so the `if` block runs, printing "4 is an even number."

With `if-else`, your program always takes one of two distinct paths, ensuring that *some* action is always performed based on the condition.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `if-else` statement. Start node "Start". Arrow to "Condition True?". If "Yes", arrow to "Execute IF Code Block". If "No", arrow to "Execute ELSE Code Block". Both "Execute IF Code Block" and "Execute ELSE Code Block" lead to "Continue Program" node, which then leads to "End".]

### The `elif` Statement: Handling Multiple Possibilities

Sometimes, you have more than two possible outcomes. You might have several conditions you want to check, one after another, and execute a specific `__MASK_0__` for the *first* one that's true. This is where the `__MASK_1__` (short for "else if") becomes incredibly useful.

The `elif` statement allows you to check additional conditions if the preceding `if` or `elif` conditions were `False`. You can have as many `elif` statements as you need between an `if` and an optional `else`. Remember, *only one* block of code within an `if-elif-else` chain will ever execute.

Here's the general structure:

```python
if condition_1:
    # Code block for condition_1 (runs if condition_1 is True)
elif condition_2:
    # Code block for condition_2 (runs if condition_1 was False AND condition_2 is True)
elif condition_3:
    # Code block for condition_3 (runs if condition_1 & condition_2 were False AND condition_3 is True)
else:
    # Code block if none of the above conditions are True
```

Python checks the conditions in order:
1.  It checks `condition_1`. If `True`, its block runs, and the entire `if-elif-else` structure is finished.
2.  If `condition_1` is `False`, it then checks `condition_2`. If `True`, its block runs, and the structure is finished.
3.  This continues for all `elif` statements.
4.  If all `if` and `elif` conditions are `False`, and an `else` statement is present, its block runs as the final fallback.

**Example: Determining the sign of a number.**

```python
number = 0

if number > 0:
    print("The number is positive.")
elif number < 0:
    print("The number is negative.")
else:
    print("The number is zero.")
```

Let's trace with `number = 0`:
1.  `number > 0` (0 > 0) is `False`.
2.  Python moves to the first `elif`. `number < 0` (0 < 0) is `False`.
3.  Python moves to the `else`. The `else` block executes, printing "The number is zero."

Now, consider `number = 5`:
1.  `number > 0` (5 > 0) is `True`.
2.  The first `print` statement runs: "The number is positive."
3.  Because a condition was met and its block executed, the rest of the `elif` and `else` blocks are skipped entirely.

This `if-elif-else` structure is perfect for scenarios where you have a series of mutually exclusive choices.

[IMAGE_PLACEHOLDER: A flowchart illustrating the `if-elif-else` statement. Start node "Start". Arrow to "Condition 1 True?". If "Yes", arrow to "Execute IF Code Block". If "No", arrow to "Condition 2 True?". If "Yes", arrow to "Execute ELIF Code Block". If "No", arrow to "Execute ELSE Code Block". All execution blocks lead to "Continue Program" node, which then leads to "End".]

### Understanding Conditions: Truthiness

When Python evaluates the `condition` in an `if` or `elif` statement, it's ultimately looking for a `True` or `False` value. While we often use comparison operators (like `==`, `>`, `<`) or logical operators (`and`, `or`, `not`) that explicitly result in `True` or `False` (as seen in [operators-expressions](../python/operators-expressions.md)), Python has a broader concept called `__MASK_1__`.

Essentially, every value in Python has an inherent "truthy" or "falsy" quality. This allows for more concise and "Pythonic" code.

*   **Falsy values** are those that Python considers `False` in a boolean context. These include:
    *   `None`
    *   `False` (the boolean value itself)
    *   Numeric zero of all types: `0`, `0.0`, `0j`
    *   Empty sequences: `''` (empty string), `[]` (empty list), `()` (empty tuple), `set()` (empty set)
    *   Empty mappings: `{}` (empty dictionary)
*   **Truthy values** are everything else. If a value is not explicitly listed as falsy, it's considered truthy.

This means you can use non-boolean values directly as conditions:

```python
name = "Alice"
# name = "" # Uncomment this line to see the 'else' block run

if name: # Python checks if 'name' is truthy (a non-empty string)
    print(f"Hello, {name}!")
else:
    print("Please enter your name.")

print("-" * 20) # Separator for clarity

count = 5
# count = 0 # Uncomment this line to see the 'else' block run

if count: # Python checks if 'count' is truthy (a non-zero number)
    print(f"You have {count} items.")
else:
    print("Your cart is empty.")
```

In the first example, if `name` is `"Alice"`, it's a non-empty string, which is truthy, so "Hello, Alice!" is printed. If `name` were `""` (an empty string), it would be falsy, and "Please enter your name." would be printed. Similarly, `5` is truthy, while `0` is falsy.

Understanding truthiness allows you to write more elegant and efficient conditional checks, as you don't always need to explicitly compare a value to `True` or `False` or check its length.

## Wrap-Up

Conditional statements are the backbone of decision-making in your programs. You've learned how to use `if` to execute code based on a true condition, `else` to provide an alternative path when the condition is false, and `elif` to handle multiple, sequential conditions. Remember the critical role of `__MASK_0__` in defining `__MASK_1__`s and how Python's concept of `__MASK_2__` allows for flexible condition evaluation.

With these powerful tools, your programs can now react intelligently to different situations, making them much more dynamic and useful. In the next lesson, we'll explore another crucial aspect of [control flow](../python/control-flow-loops.md): making your programs repeat actions using loops.