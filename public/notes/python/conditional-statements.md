<a id="concept-conditional-statements"></a>
# Control Flow: Conditional Statements

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose of conditional statements in programming.
- Understand how boolean expressions determine the flow of a program.
- Write basic `if` statements to execute code based on a condition.
- Use `else` statements to provide an alternative code path when a condition is false.
- Implement `elif` statements to handle multiple, sequential conditions.
- Recognize and apply Python's significant indentation for structuring conditional code blocks.

## Introduction
Imagine you're getting ready for your day. You don't just pick clothes randomly, do you? You probably think: "Is it cold outside? **If yes**, I'll wear a jacket. **Else (otherwise)**, I'll wear a t-shirt." This simple thought process is a decision, and it's based on a condition (the weather).

Just like in real life, programs often need to make decisions. They need to check if certain conditions are true or false and then execute different parts of the code accordingly. This ability to make decisions is called **[control flow](../python/control-flow-conditionals.md#concept-control-flow-conditionals)**, and **conditional statements** are the fundamental tools that allow your programs to do it. Without them, your programs would simply run the same steps every single time, making them rigid and unable to adapt to different situations.

In this lesson, we'll explore how to teach your Python programs to make these intelligent decisions using `if`, `elif`, and `else` statements. We'll also uncover why Python's unique way of structuring these decisions, through something called "[significant indentation](../python/introduction-to-python-programming.md#concept-significant-indentation)," is so important.

## Making Decisions with Conditional Statements
At its core, a **conditional statement** allows your program to choose between different actions based on whether a certain condition is met. Think of it like a fork in the road: depending on a sign (the condition), you decide which path to take.

The "sign" your program reads is a **boolean expression**. You might recall from the "[Operators and Expressions](../python/operators-and-expressions.md#concept-operators-and-expressions)" lesson that a boolean expression is anything that evaluates to either `True` or `False`. These `True`/`False` values are the fundamental building blocks for decision-making in programming.

Let's look at a simple example to illustrate this idea:

```python
is_raining = True

# If it's raining, we'll print a message
if is_raining:
    print("Remember your umbrella!")
```

In this snippet:
- `is_raining = True` sets up a variable with a [boolean value](../python/python-data-types-and-variables.md#concept-boolean-value).
- `if is_raining:` is our conditional statement. Python evaluates the expression `is_raining`. Since its value is `True`, the code indented below it runs.

If `is_raining` were `False`, the `print` statement would be skipped entirely. This is the essence of conditional logic: execute code *only if* a condition is true.

[IMAGE_PLACEHOLDER: A simple flowchart illustrating a conditional statement. It starts with an oval labeled "Start", leads to a diamond labeled "Condition (Boolean Expression) True or False?". An arrow labeled "True" points to a rectangular process box labeled "Execute Code Block". An arrow labeled "False" bypasses the code block. Both paths converge to an oval labeled "End".]

<a id="concept-if-statement"></a>
## The `if` Statement: Your First Decision
The `if` statement is the most basic form of a conditional statement. It allows you to specify a block of code that should only be executed if a given condition evaluates to `True`.

The syntax for an `if` statement in Python is straightforward:

```python
if condition:
    # Code to execute if the condition is True
    # This code block MUST be indented
```

Notice two critical elements:
1.  A **colon (`:`)** at the end of the `if` line. This signals the start of a new code block.
2.  **Indentation** of the code that follows. This indentation is crucial in Python, as it defines the "block" of code associated with the `if` statement. We'll delve deeper into this "[significant indentation](../python/introduction-to-python-programming.md#concept-significant-indentation)" soon!

Let's try an example where we check a user's age to see if they are eligible to vote:

```python
age = 20

if age >= 18:
    print("You are old enough to vote.")
    print("Please register to vote.")

print("Program continues here, regardless of age.")
```

**Explanation:**
1.  We set `age` to `20`.
2.  The condition `age >= 18` evaluates to `True` (since `20` is greater than or equal to `18`).
3.  Because the condition is `True`, both `print` statements indented under the `if` are executed.
4.  Finally, the last `print` statement runs, as it's outside the `if` block and will always execute.

What if `age` was `16`?
```python
age = 16

if age >= 18:
    print("You are old enough to vote.")
    print("Please register to vote.")

print("Program continues here, regardless of age.")
```
In this case, `age >= 18` would be `False`. Therefore, the two indented `print` statements within the `if` block would be skipped entirely. Only "Program continues here, regardless of age." would be printed.

<a id="concept-else-statement"></a>
## The `else` Statement: Providing an Alternative
While an `if` statement handles what to do when a condition is true, what if you want your program to do something specific when the condition is *false*? This is where the `else` statement comes in handy. It provides an alternative block of code to execute when the `if` condition is not met.

The `else` statement always follows an `if` statement (or an `elif` statement, which we'll cover next) within the same conditional structure. It acts as a catch-all for any situation where the preceding `if` (and `elif`s) conditions are `False`.

The syntax looks like this:

```python
if condition:
    # Code to execute if condition is True
else:
    # Code to execute if condition is False
    # This code block MUST also be indented
```

Let's refine our age example to provide a message for those not yet old enough to vote:

```python
age = 15

if age >= 18:
    print("You are old enough to vote.")
else:
    print("You are not yet old enough to vote.")
    print("Please wait a few more years.")
```

**Explanation:**
1.  `age` is `15`.
2.  The condition `age >= 18` evaluates to `False`.
3.  Since the `if` condition is `False`, Python skips the `if` block and executes the code block under `else`.
4.  The messages "You are not yet old enough to vote." and "Please wait a few more years." are printed.

Using `if` and `else` together ensures that one of two distinct code blocks will always run, providing a clear and complete path for your program's logic.

[IMAGE_PLACEHOLDER: A flowchart illustrating an 'if-else' statement. It starts with an oval labeled "Start", leads to a diamond labeled "Condition True or False?". An arrow labeled "True" points to a rectangular process box labeled "Execute If Block". An arrow labeled "False" points to a rectangular process box labeled "Execute Else Block". Both "Execute If Block" and "Execute Else Block" paths converge to an oval labeled "End".]

<a id="concept-elif-statement"></a>
## The `elif` Statement: Handling Multiple Choices
Sometimes, a simple "if this, otherwise that" isn't enough. What if you have several possible conditions, and you want to check them one by one? For example, you might want to check if a number is positive, negative, or zero. This is where the `elif` (short for "else if") statement becomes incredibly useful.

The `elif` statement allows you to check multiple conditions in sequence. If the initial `if` condition is `False`, Python moves on to check the first `elif` condition. If that's also `False`, it checks the next `elif`, and so on. You can have as many `elif` statements as you need between an `if` and an optional `else`.

The general structure is:

```python
if condition1:
    # Code if condition1 is True
elif condition2:
    # Code if condition1 is False AND condition2 is True
elif condition3:
    # Code if condition1 is False AND condition2 is False AND condition3 is True
else:
    # Code if all preceding conditions (condition1, condition2, condition3) are False
```

Let's use the positive, negative, or zero example:

```python
number = 0

if number > 0:
    print("The number is positive.")
elif number < 0:
    print("The number is negative.")
else:
    print("The number is zero.")
```

**Explanation:**
1.  `number` is `0`.
2.  `if number > 0:` (`0 > 0`) evaluates to `False`.
3.  Python moves to the first `elif`. `elif number < 0:` (`0 < 0`) evaluates to `False`.
4.  Since all preceding conditions were `False`, the `else` block is executed, and "The number is zero." is printed.

Let's try with `number = 5`:
- `if number > 0:` (`5 > 0`) evaluates to `True`. "The number is positive." is printed. Python then *skips* the rest of the `elif` and `else` blocks in this chain.

And with `number = -3`:
- `if number > 0:` (`-3 > 0`) evaluates to `False`.
- `elif number < 0:` (`-3 < 0`) evaluates to `True`. "The number is negative." is printed. Python then *skips* the `else` block.

**Important Note:** The order of `elif` statements matters! Python checks conditions from top to bottom and executes the code block for the *first* `True` condition it encounters, then skips the rest of the chain. This means if multiple conditions could be true, only the first one listed will have its block executed.

[IMAGE_PLACEHOLDER: A flowchart illustrating an 'if-elif-else' statement. It starts with an oval labeled "Start", leads to a diamond labeled "Condition 1 True or False?". An arrow labeled "True" points to "Execute If Block". An arrow labeled "False" points to another diamond labeled "Condition 2 True or False?". An arrow from "Condition 2" labeled "True" points to "Execute Elif Block". An arrow from "Condition 2" labeled "False" points to "Execute Else Block". All three execution blocks ("Execute If Block", "Execute Elif Block", "Execute Else Block") converge to an oval labeled "End".]

<a id="concept-significant-indentation"></a>
## Python's Significant Indentation: The Structure of Decisions
As you've seen in all these examples, a consistent visual structure is key to defining code blocks in Python. This brings us to a fundamental and unique aspect of Python's syntax: **significant indentation**.

Unlike many other programming languages that use curly braces `{}` or keywords like `end` to mark the beginning and end of code blocks, Python relies entirely on whitespace (spaces or tabs). This means that the indentation level of your code is not just for readability; it's a core part of the language's syntax. Incorrect indentation will lead to `IndentationError` messages and prevent your program from running.

Here's how it works:
- When you start a new code block (like those under `if`, `elif`, `else`, or later, [functions](../data-science/python-fundamentals.md#concept-functions) and loops), you **increase** the indentation level.
- All statements within that block must have the **same** increased indentation level.
- The block ends when the indentation returns to the **previous** level.

Let's revisit an example to highlight indentation and its meaning:

```python
temperature = 25

if temperature > 30:
    print("It's very hot!") # This is part of the 'if' block
    print("Stay hydrated.") # This is also part of the 'if' block
elif temperature > 20:
    print("It's warm.")     # This is part of the 'elif' block
else:
    print("It's cool.")     # This is part of the 'else' block

print("Weather check complete.") # This is outside all conditional blocks
```

In this example:
- The two `print` statements under `if temperature > 30:` are indented by 4 spaces (a common and highly recommended convention in Python). They form a single block that executes if `temperature > 30` is `True`.
- The `print` statement under `elif temperature > 20:` is also indented by 4 spaces, forming its own block.
- The `print` statement under `else:` is similarly indented.
- The final `print("Weather check complete.")` is at the same indentation level as `if`, `elif`, and `else`. This tells Python that it is *outside* those conditional blocks and will always execute after the decision-making process is complete, regardless of which conditional path was taken.

**Why is this important?**
Python's significant indentation enforces a consistent and readable code style. It makes it easier for programmers to understand the structure and flow of a program at a glance, as the visual layout directly reflects the logical structure. While it might feel a bit strict at first, it quickly becomes second nature and contributes significantly to Python's reputation for clear and maintainable code.

**Best Practice:** Always use 4 spaces for indentation. Avoid mixing spaces and tabs, as this can lead to subtle and hard-to-find errors. Most modern code editors will automatically handle this for you, often converting a tab press into 4 spaces.

## Wrap-Up
Conditional statements (`if`, `elif`, `else`) are fundamental to creating dynamic and responsive programs. They empower your code to adapt to different situations by executing specific blocks of instructions only when certain conditions are met. You've learned how boolean expressions act as the decision-makers, and how Python's significant indentation is not just a style choice but a core part of its syntax for defining these decision blocks.

With these powerful tools, you can now build programs that don't just follow a single, predetermined script, but can intelligently respond to various inputs and scenarios. This is a huge step forward in your programming journey! Next, we'll explore another powerful control flow concept: **loops**, which allow your programs to repeat actions efficiently.