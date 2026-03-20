<a id="concept-control-flow-conditionals"></a>
# Control Flow: Conditionals

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose of conditional statements in programming.
- Write basic `if` statements to execute code based on a condition.
- Understand and correctly use Python's indentation to define code blocks.
- Implement `if-else` statements for choosing between two alternative actions.
- Construct `if-elif-else` chains to handle multiple possible conditions.
- Recognize when and how to use the `match-case` statement for more complex decision-making (Python 3.10+).

## Introduction
Imagine you're building a program for a smart thermostat. How would it decide what to do? It needs to react to the current temperature:
*   **If** the temperature is too low, it should turn on the heater.
*   **If** it's too high, it should turn on the air conditioner.
*   **Otherwise** (if it's just right), it should do nothing.

This is a perfect example of how programs need to make decisions based on different situations. In programming, we call this ability to choose different paths **control flow**, and the specific tools we use for decision-making are called **conditional statements**.

Just like in real life, where your actions depend on certain conditions (e.g., "If it rains, I'll take an umbrella"), your programs need to be able to react differently to various inputs or states. This lesson will teach you how to give your Python programs this crucial ability to make choices and adapt.

## Concept Progression

### Making Decisions: The Need for Conditionals
At its core, a computer program is a set of instructions that are usually executed one after another, from top to bottom. But what if you don't want the program to always follow the exact same path? What if you want it to be smart and adapt its behavior? This is where **conditional statements** come in. They allow your program to evaluate a condition and execute different code based on whether that condition is `True` or `False`.

Think of it like a fork in the road. Depending on whether you want to go to the park or the library, you choose a different path. Conditional statements provide these "forks" in your code, letting your program choose which set of instructions to follow.

The "condition" that a program evaluates is always a **[boolean expression](../python/python-data-types-and-variables.md#concept-boolean-value)**. You might remember from our previous lesson on [operators and expressions](../python/operators-and-expressions.md#concept-operators-and-expressions) that a boolean [expression](../python/operators-and-expressions.md#concept-expression) is anything that evaluates to either `True` or `False`. For example, `5 > 3` is `True`, and `10 == 20` is `False`. These `True`/`False` outcomes are the "answers" your program gets when it asks a question, guiding it to decide which path to take.

<a id="concept-if-then-else"></a>
### The 'if' Statement: Your First Decision
The simplest conditional statement in Python is the `if` statement. It allows you to execute a block of code *only if* a certain condition is `True`. If the condition is `False`, the code block is skipped entirely, and the program continues with the instructions immediately following the `if` statement.

The basic structure looks like this:

```python
if condition:
    # Code to execute if the condition is True
    # This code is part of the 'if' block
```

Let's look at an example:

```python
temperature = 28

if temperature > 25:
    print("It's hot outside! Turn on the AC.")

print("Program finished.")
```

In this example, let's trace the execution:
1.  We assign the value `28` to the variable `temperature`.
2.  The `if` statement checks the condition `temperature > 25`. Since `28 > 25` is `True`, the code inside the `if` block is executed.
3.  The message "It's hot outside! Turn on the AC." is printed.
4.  Finally, "Program finished." is printed, as this line is outside the `if` block and always executes.

Now, what if the temperature was `20`?

```python
temperature = 20

if temperature > 25:
    print("It's hot outside! Turn on the AC.") # This line will be skipped!

print("Program finished.")
```

In this case, `temperature > 25` (which is `20 > 25`) evaluates to `False`. Because the condition is `False`, the line `print("It's hot outside! Turn on the AC.")` inside the `if` block is skipped. The program then proceeds directly to the line after the `if` block, printing "Program finished."

[IMAGE_PLACEHOLDER: A flowchart illustrating a simple 'if' statement. It starts with "Start", goes to a diamond shape labeled "Condition (True/False)?", then branches. If True, it goes to a rectangle labeled "Execute 'if' block code", then merges back to "End". If False, it bypasses the 'if' block and goes directly to "End".]

### Code Blocks and Indentation: Python's Structure
You might have noticed the space before the `print` statement in the `if` block. This is called **[indentation](../python/introduction-to-python-programming.md#concept-significant-indentation)**, and it's incredibly important in Python! Unlike many other programming languages that use curly braces `{}` or keywords like `end` to define **code blocks**, Python uses indentation to define them.

A **code block** is simply a group of statements that belong together and should be executed as a single unit. In the context of an `if` statement, the code block is the set of instructions that should run *if* the condition is `True`.

-   **How it works:** All lines of code within the same block must have the same level of indentation.
-   **Standard:** The Python community standard is to use **4 spaces** for each level of indentation. While tabs also work, mixing tabs and spaces can lead to errors, so sticking to 4 spaces is highly recommended.
-   **Colon (`:`):** Notice the colon `:` at the end of the `if` line (and `elif`, `else`, `match`, `case` lines). This colon is a crucial signal to Python that a new indented code block is about to follow.

Let's see an example of incorrect and correct indentation:

**Incorrect Indentation (will cause an `IndentationError`):**

```python
temperature = 28
if temperature > 25:
print("It's hot outside!") # ERROR: This line is not indented!
    print("Turn on the AC.") # This line has too much indentation relative to the first print
```
Python expects the first line after the colon to be indented. If it's not, or if subsequent lines in the *same logical block* have inconsistent indentation, you'll get an `IndentationError`.

**Correct Indentation:**

```python
temperature = 28
if temperature > 25:
    print("It's hot outside!") # Indented by 4 spaces
    print("Turn on the AC.")   # Also indented by 4 spaces, part of the 'if' block
print("Program finished.")     # Not indented, so it's outside the 'if' block
```

In the correct example, both `print` statements inside the `if` block will execute if `temperature > 25` is `True`. The last `print` statement, "Program finished.", is outside the `if` block because it has no indentation. This means it will always execute, regardless of whether the `if` condition was `True` or `False`.

[IMAGE_PLACEHOLDER: A diagram showing Python code with clear indentation. An 'if' statement line ends with a colon. The subsequent lines are indented by 4 spaces, forming a 'code block'. A line after the indented block is unindented, showing it's outside the block. Arrows indicate the flow of control based on indentation.]

### The 'if-else' Statement: Two Paths
What if you want your program to do one thing if a condition is `True` and a *different* thing if it's `False`? This is a very common scenario, and Python's `if-else` statement is perfect for it. It provides two mutually exclusive paths for your program to follow: one path for `True` and one for `False`.

The structure is:

```python
if condition:
    # Code to execute if the condition is True
else:
    # Code to execute if the condition is False
```

Let's refine our thermostat example to use `if-else`:

```python
temperature = 22

if temperature > 25:
    print("It's hot outside! Turn on the AC.")
else:
    print("It's not too hot. No AC needed.")

print("Enjoy your day!")
```

Here's how it works with `temperature = 22`:
1.  The variable `temperature` is `22`.
2.  The `if` condition `temperature > 25` (i.e., `22 > 25`) evaluates to `False`.
3.  Because the `if` condition is `False`, the code inside the `if` block is skipped.
4.  The program then jumps to the `else` block, and the code inside it is executed.
5.  "It's not too hot. No AC needed." is printed.
6.  Finally, "Enjoy your day!" is printed, as it's outside the `if-else` structure.

If `temperature` was `28`, the `if` condition (`28 > 25`) would be `True`, so the `if` block would execute, and the `else` block would be skipped. The key takeaway is that with `if-else`, you always get one path or the other, never both, and never neither.

[IMAGE_PLACEHOLDER: A flowchart illustrating an 'if-else' statement. It starts with "Start", goes to a diamond shape labeled "Condition (True/False)?", then branches. If True, it goes to a rectangle labeled "Execute 'if' block code". If False, it goes to a different rectangle labeled "Execute 'else' block code". Both paths then merge back to "End".]

### The 'if-elif-else' Statement: Multiple Choices
Often, you'll need to handle more than two possible outcomes. For instance, our thermostat might need to turn on the heater if it's too cold, turn on the AC if it's too hot, or do nothing if the temperature is just right. This is where the `if-elif-else` chain comes in handy.

`elif` is short for "else if". It allows you to check multiple conditions in sequence. The program evaluates the `if` condition first. If it's `False`, it moves to the first `elif`. If that's `False`, it moves to the next `elif`, and so on. The first condition that evaluates to `True` will have its corresponding code block executed, and the rest of the `elif` and `else` blocks in that entire chain will be skipped.

The structure is:

```python
if condition1:
    # Code if condition1 is True
elif condition2:
    # Code if condition1 is False AND condition2 is True
elif condition3:
    # Code if condition1 and condition2 are False AND condition3 is True
else:
    # Code if ALL preceding conditions (if and elifs) are False
```

Let's build our smart thermostat with three possible states:

```python
current_temperature = 18

if current_temperature < 20:
    print("It's a bit chilly. Turning on the heater.")
elif current_temperature > 25:
    print("It's getting warm. Turning on the AC.")
else:
    print("Temperature is just right. Enjoy!")

print("Thermostat check complete.")
```

Let's trace `current_temperature = 18`:
1.  The `if` condition `current_temperature < 20` (`18 < 20`) is `True`.
2.  The code inside this `if` block (`print("It's a bit chilly...")`) is executed.
3.  Because a condition was met, the rest of the `elif` and `else` blocks in this chain are skipped.
4.  "Thermostat check complete." is printed.

Now, what if `current_temperature = 23`?
1.  The `if` condition `current_temperature < 20` (`23 < 20`) is `False`.
2.  The program moves to the first `elif`. `elif current_temperature > 25` (`23 > 25`) is `False`.
3.  Since all `if` and `elif` conditions were `False`, the `else` block is executed.
4.  "Temperature is just right. Enjoy!" is printed.
5.  "Thermostat check complete." is printed.

You can have as many `elif` blocks as you need to handle various scenarios. The `else` block at the end is optional, but it's good practice to include it to catch any cases not explicitly covered by your `if` or `elif` conditions, providing a default action.

[IMAGE_PLACEHOLDER: A flowchart illustrating an 'if-elif-else' statement. It starts with "Start", goes to a diamond shape labeled "Condition 1 (True/False)?". If True, it executes "Code Block 1". If False, it goes to another diamond labeled "Condition 2 (True/False)?". If True, it executes "Code Block 2". If False, it goes to a rectangle labeled "Execute 'else' block code". All paths merge back to "End".]

<a id="concept-switch-statement"></a>
### The 'match-case' Statement: A Modern Approach (Python 3.10+)
For situations where you need to compare a single value against several possible patterns, Python 3.10 introduced the `match-case` statement. This is similar to a "switch" statement found in other programming languages and can make your code cleaner and more readable than long `if-elif-else` chains, especially when dealing with specific values or data structures.

The basic structure looks like this:

```python
match value:
    case pattern1:
        # Code if 'value' matches 'pattern1'
    case pattern2:
        # Code if 'value' matches 'pattern2'
    case _: # The underscore acts as a wildcard, like an 'else'
        # Code if 'value' doesn't match any preceding pattern
```

Let's use `match-case` for a simple menu selection in a game:

```python
choice = "start"

match choice:
    case "start":
        print("Game started!")
    case "load":
        print("Loading saved game...")
    case "options":
        print("Opening options menu.")
    case _: # This is the "catch-all" case if no other matches
        print("Invalid choice. Please select 'start', 'load', or 'options'.")
```

In this example:
1.  The variable `choice` is set to `"start"`.
2.  The `match` statement compares `choice` to the `case` patterns.
3.  It finds a match with `case "start":`, so "Game started!" is printed.
4.  Once a match is found and its block executed, the rest of the `case` blocks are skipped.

If `choice` was `"quit"`, it wouldn't match `"start"`, `"load"`, or `"options"`. In this scenario, the `case _:` block would execute, printing "Invalid choice...".

The `match-case` statement is very powerful and can do much more than simple value matching, including matching against sequences, dictionaries, and even objects. However, for beginners, understanding its basic use for discrete choices is a great start for writing more elegant conditional logic.

## Wrap-Up
Congratulations! You've now mastered the fundamental building blocks of decision-making in Python. Conditional statements are absolutely essential for writing dynamic and intelligent programs that can react to different inputs and situations. You've learned how to use `if` for single conditions, `if-else` for two alternative paths, and `if-elif-else` for handling multiple choices in sequence. You also understand how Python's crucial indentation defines these code blocks. Finally, you got a glimpse of the modern `match-case` statement for more structured decision-making, especially when comparing a value against several distinct patterns.

With conditionals under your belt, your programs can now make smart choices! In the next lesson, we'll explore another essential control flow concept: **loops**, which allow your programs to repeat actions efficiently.