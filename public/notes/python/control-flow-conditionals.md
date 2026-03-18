# Control Flow - Conditionals

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the concept of [control flow](../python/control-flow-loops.md) and why conditional statements are essential in programming.
- Use `if` statements to execute specific blocks of code only when a certain condition is met.
- Employ `else` statements to provide an alternative code path when an `if` condition is false.
- Utilize `elif` statements to check multiple conditions in sequence, creating more complex decision-making logic.
- Recognize and correctly apply Python's indentation rules to define code blocks within conditional statements.

## Introduction
Think about how you make decisions every day: "If it's raining, I'll take an umbrella; otherwise, I'll leave it at home." Or, "If I finish my chores, I can play games; if not, I'll have to finish them first." These are choices that lead to different actions.

Just like us, computer programs need to make decisions to be useful and dynamic. Imagine you're building a game: you want a character to jump *only* if the player presses the 'spacebar'. Or perhaps you're creating a website that shows a "Welcome back!" message *only* if a user is logged in.

This ability for a program to choose which code to run based on certain conditions is called **[control flow](../python/control-flow-loops.md)**. It's how your program navigates different paths, making it responsive to various situations. In this lesson, we'll dive into the fundamental tools for decision-making in Python: **conditional statements**.

## Making Decisions with Code: Boolean Expressions and Conditional Statements

Before a program can make a decision, it needs to ask a question. These questions always have a simple "yes" or "no" answer. In programming, "yes" is represented by `True` and "no" by `False`. These `True`/`False` values are called **Booleans**, and the questions that result in them are called `__MASK_0__`s.

You've already encountered Boolean expressions when learning about [operators-expressions](../python/operators-expressions.md). Remember comparison operators like `==` (equal to), `>` (greater than), `<` (less than), and logical operators like `and`, `or`, `not`? They all produce Boolean results.

Let's look at some examples of these "yes/no" questions in action:

```python
# Is 10 greater than 5?
print(10 > 5)
# Output: True

# Is the user logged in AND is their age over 18?
is_logged_in = True
user_age = 25
print(is_logged_in and user_age > 18)
# Output: True

# Is it NOT raining?
is_raining = False
print(not is_raining)
# Output: True
```

These `__MASK_0__`s are the foundation for `__MASK_1__`s. A conditional statement is a programming construct that allows your code to execute different actions based on whether a Boolean expression evaluates to `True` or `False`. It's like setting up a rule: "IF this condition is true, THEN do this specific action."

### The `if` Statement: Your First Decision

The most basic conditional statement in Python is the `if` statement. It allows you to execute a block of code *only* if a specified condition is `True`. Think of it as saying, "IF this is true, DO this."

Here's the basic structure:

```python
if condition:
    # Code to execute if the condition is True
    # This block of code MUST be indented
```

Let's break this down:
1.  `if`: This keyword tells Python you're starting a conditional statement.
2.  `condition`: This is your `__MASK_0__`. Python will evaluate this to either `True` or `False`.
3.  `:` (colon): This marks the end of the `if` statement's header and signals that an indented block of code follows.
4.  **Indented Code Block**: The lines of code that are indented (usually with 4 spaces) directly below the `if` statement are part of its "body." This block will only run if the `condition` is `True`.

Let's see an example:

```python
temperature = 28

if temperature > 25:
    print("It's a hot day!")
    print("Remember to stay hydrated.")

print("Program continues here.")
```

In this example, since `temperature` (28) is indeed greater than 25, the condition `temperature > 25` evaluates to `True`. As a result, both `print` statements inside the `if` block are executed. If `temperature` were, say, 20, the condition would be `False`, and the indented `print` statements would be skipped entirely. The program would jump directly to `print("Program continues here.")`.

The concept of `__MASK_0__` is absolutely crucial in Python. Unlike many other programming languages that use curly braces `{}` to define code blocks, Python uses indentation. This means that the number of spaces (or tabs) at the beginning of a line tells Python which block of code that line belongs to. All lines within the same block must have the same level of indentation. We'll explore indentation in more detail shortly.

[IMAGE_PLACEHOLDER: A simple flowchart illustrating an `if` statement. Start node -> Diamond shape for "Condition True?". If Yes, arrow to "Execute Code Block". If No, arrow directly to "Continue Program". Both paths merge back to "Continue Program" node.]

### The `else` Statement: Handling the Alternative

What if you want your program to do one thing if a condition is `True`, and something *different* if the condition is `False`? That's where the `else` statement comes in. The `else` block provides an alternative path of execution when the `if` condition is not met. Think of it as saying, "IF this is true, DO this; OTHERWISE (else), DO that."

The `else` statement always follows an `if` statement (or an `elif` statement, which we'll cover next).

```python
if condition:
    # Code to execute if the condition is True
else:
    # Code to execute if the condition is False
```

Let's refine our temperature example to include an `else` block:

```python
temperature = 22

if temperature > 25:
    print("It's a hot day!")
    print("Remember to stay hydrated.")
else:
    print("It's not too hot today.")
    print("Enjoy the weather!")

print("Program continues here.")
```

Here, `temperature` (22) is not greater than 25, so the `if` condition `temperature > 25` is `False`. Python then skips the `if` block and executes the code inside the `else` block instead. This ensures that one of the two paths is always taken.

[IMAGE_PLACEHOLDER: A flowchart illustrating an `if-else` statement. Start node -> Diamond shape for "Condition True?". If Yes, arrow to "Execute IF Block". If No, arrow to "Execute ELSE Block". Both paths merge back to "Continue Program" node.]

### The `elif` Statement: Multiple Choices

Sometimes, you have more than two possible outcomes. You might want to check a first condition, and if that's false, check a second condition, and if *that's* false, check a third, and so on. This is where the `elif` (short for "else if") statement becomes incredibly useful. It allows you to chain multiple conditions together.

You can chain multiple `elif` statements after an `if` statement. An optional `else` statement can be placed at the very end to catch any cases that didn't match any of the preceding `if` or `elif` conditions.

```python
if condition1:
    # Code if condition1 is True
elif condition2:
    # Code if condition1 is False, BUT condition2 is True
elif condition3:
    # Code if condition1 and condition2 are False, BUT condition3 is True
else:
    # Code if all preceding conditions (condition1, condition2, condition3) are False
```

**Important:** Python checks these conditions in order, from top to bottom. As soon as it finds a condition that is `True`, it executes the corresponding code block and then *skips all remaining `elif` and `else` blocks* in that chain. This means that **only one block of code will ever be executed** in an `if-elif-else` chain.

Let's create a simple grading system to illustrate this:

```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")

print("Grading complete.")
```

In this example:
-   If `score` was 95, the first condition (`score >= 90`) would be `True`, it would print "Grade: A", and then skip the rest of the `elif` and `else` blocks.
-   Since `score` is 85, the first condition (`score >= 90`) is `False`.
-   Python moves to the first `elif`. The condition `score >= 80` (85 >= 80) is `True`.
-   It prints "Grade: B" and then, crucially, skips all remaining `elif` and `else` blocks.

If `score` was 55, all `if` and `elif` conditions would be `False`, and the final `else` block would execute, printing "Grade: F".

[IMAGE_PLACEHOLDER: A flowchart illustrating an `if-elif-else` chain. Start node -> Diamond for "Condition 1 True?". If Yes, "Execute Block 1" then "Continue Program". If No, arrow to Diamond for "Condition 2 True?". If Yes, "Execute Block 2" then "Continue Program". If No, arrow to Diamond for "Condition 3 True?". If Yes, "Execute Block 3" then "Continue Program". If No, arrow to "Execute ELSE Block" then "Continue Program". All paths merge back to "Continue Program" node.]

### Indentation: Python's Way of Grouping Code

We've mentioned `__MASK_0__` several times, but it's so fundamental to Python's [control flow](../python/control-flow-loops.md) that it deserves its own dedicated focus. In Python, indentation is not just for making your code look neat; it's a critical part of the syntax that defines code blocks.

Every line of code that belongs to an `if`, `elif`, or `else` statement (or loops, [functions](../python/functions.md), etc.) must be indented by the same amount. The standard practice, and highly recommended, is to use **4 spaces** for each level of indentation.

Consider this example to see the difference between correct and incorrect indentation:

```python
# Correct Indentation
age = 20
if age >= 18:
    print("You are an adult.")
    print("You can vote.") # This line is also part of the if block because it's indented
print("This line is outside the if block and always runs.")

# Incorrect Indentation (will cause an IndentationError)
# if age >= 18:
# print("You are an adult.") # ERROR: Expected an indented block after the 'if'
#    print("You can vote.") # This line has inconsistent indentation
```

If you mix spaces and tabs, or use inconsistent indentation within the same block, Python will raise an `IndentationError`. Modern code editors are usually configured to handle indentation correctly, often converting tabs to spaces automatically, which helps prevent these errors.

**Why does Python use indentation?**
The main reason is readability. By forcing consistent indentation, Python makes code visually structured and easier to understand. It eliminates the need for explicit block delimiters like curly braces (common in languages like Java or C++), leading to cleaner and often shorter code. It's a design choice that makes Python unique and often praised for its clear syntax.

## Wrap-Up
Congratulations! You've just learned how to make your programs smart by giving them the ability to make decisions. We covered:
-   The importance of `__MASK_0__`s as the "questions" your program asks.
-   The `__MASK_0__` for executing code only when a condition is `True`.
-   The `__MASK_0__` for providing an alternative path when the `if` condition is `False`.
-   The `__MASK_0__` for handling multiple conditions in a sequential, exclusive manner.
-   The critical role of `__MASK_0__` in Python for defining code blocks within these `__MASK_1__`s.

With conditional statements, your programs are no longer just a linear sequence of instructions. They can now respond dynamically to different situations, user inputs, or data values, making them much more powerful and interactive. This opens up a whole new world of possibilities for creating intelligent applications. Next, we'll explore another powerful [control flow](../python/control-flow-loops.md) concept: **loops**, which allow your programs to repeat actions.