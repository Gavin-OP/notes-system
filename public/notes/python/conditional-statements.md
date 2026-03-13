# Conditional Statements (if, elif, else)

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the purpose of conditional statements in programming.
- Write basic `if` statements to execute code based on a condition.
- Use `else` to provide an alternative path when an `if` condition is false.
- Implement `elif` to handle multiple, mutually exclusive conditions.
- Combine conditional statements with logical operators (`and`, `or`, `not`) for more complex decisions.
- Understand and apply nested conditional statements for intricate logic.

## Introduction
Imagine you're giving instructions to a smart assistant or a robot. Sometimes, the instructions aren't just a straight list of tasks; they depend on the situation. For example, you might say: "If the light is red, stop. Otherwise, go." Or, "If it's raining, take an umbrella. If it's sunny, wear sunglasses. Otherwise, just go outside."

Just like in real life, programs often need to make decisions. They can't always follow a single, predetermined path. Instead, they need to react to different situations, user inputs, or data values. This is where **conditional statements** come into play! They are the tools that allow your program to choose which code to run based on whether certain conditions are true or false. This fundamental ability to make decisions is crucial for creating dynamic, interactive, and intelligent programs.

Let's dive into how we can teach our programs to think and choose.

## Concept Progression

### The Simplest Choice: "If This, Then That"
Let's begin with the most basic form of decision-making. You want a specific action to happen *only if* a certain condition is met. Think of it like a light switch: if the condition is "on" (true), the light turns on (code runs); if it's "off" (false), nothing happens (code is skipped).

In Python, we use the `if` keyword for this.

**How it works:**
1.  You provide a **condition** after the `if` keyword.
2.  This condition is an expression (like `number > 0` or `name == "Alice"`) that Python evaluates to either `True` or `False`.
3.  If the condition is `True`, the indented block of code immediately following the `if` statement is executed.
4.  If the condition is `False`, that entire indented block of code is completely skipped, and the program continues running from the line after the `if` block.

**Syntax:**
```python
if condition_is_true:
    # This code runs ONLY IF the condition is True
    # (Remember: indentation is crucial in Python!)
    statement_1
    statement_2
```

Let's see an example. Suppose we want to print a message only if a number is positive.

```python
number = 10

if number > 0:
    print("The number is positive.")

print("This message always prints, regardless of the number.")
```

**Let's trace what happens:**
*   Python first checks the condition `number > 0`. Since `number` is `10`, `10 > 0` evaluates to `True`.
*   Because the condition is `True`, the indented line `print("The number is positive.")` is executed.
*   Finally, `print("This message always prints...")` is executed, as it's outside the `if` block.

Now, what if `number` was `-5`?
```python
number = -5

if number > 0:
    print("The number is positive.") # This line will be skipped!

print("This message always prints, regardless of the number.")
```

**Let's trace this scenario:**
*   Python checks the condition `number > 0`. Since `number` is `-5`, `-5 > 0` evaluates to `False`.
*   Because the condition is `False`, the indented line `print("The number is positive.")` is completely skipped.
*   Only `print("This message always prints...")` is executed.

[IMAGE_PLACEHOLDER: A simple flowchart illustrating an `if` statement. Start node "Start". Arrow to "Condition (True/False)?". If True, arrow to "Execute Code Block". If False, arrow directly to "Continue Program". Both "Execute Code Block" and "Continue Program" lead to "End" node.]

**A quick reminder about indentation:** Python uses indentation (typically 4 spaces) to define code blocks. All lines that belong to the `if` statement (or any other block) must be indented at the same level. Incorrect indentation will lead to errors!

### Providing an Alternative: "If This, Otherwise That" with `else`
The `if` statement is perfect for "do this if true." But what if you want to do one thing if the condition is true, and a *different* thing if it's false? This is a very common requirement in programming.

For this, Python provides the `else` keyword. The `else` block runs *only* when the preceding `if` condition (and any `elif` conditions, which we'll see next) is `False`. It's like saying, "If it's raining, take an umbrella; *otherwise* (if it's not raining), wear sunglasses."

**Syntax:**
```python
if condition_is_true:
    # This code runs IF the condition is True
    statement_for_true
else:
    # This code runs IF the condition is False
    statement_for_false
```

Let's refine our positive number check to also handle numbers that are not positive:

```python
number = -3

if number > 0:
    print("The number is positive.")
else:
    print("The number is not positive.") # This will run!

print("Program finished.")
```

**Let's trace with `number = -3`:**
*   Python checks `number > 0`. Since `number` is `-3`, `-3 > 0` evaluates to `False`.
*   Because the `if` condition is `False`, the code inside the `else` block is executed: `print("The number is not positive.")`.
*   Then, `print("Program finished.")` is executed.

Now, if `number` was `7`:
```python
number = 7

if number > 0:
    print("The number is positive.") # This will run!
else:
    print("The number is not positive.")

print("Program finished.")
```

**Let's trace with `number = 7`:**
*   Python checks `number > 0`. Since `number` is `7`, `7 > 0` evaluates to `True`.
*   Because the `if` condition is `True`, the code inside the `if` block is executed: `print("The number is positive.")`.
*   The `else` block is completely skipped.
*   Then, `print("Program finished.")` is executed.

[IMAGE_PLACEHOLDER: A flowchart illustrating an `if-else` statement. Start node "Start". Arrow to "Condition (True/False)?". If True, arrow to "Execute IF Block". If False, arrow to "Execute ELSE Block". Both "Execute IF Block" and "Execute ELSE Block" lead to a merge point, then to "Continue Program" and "End" node.]

An `if` statement can stand alone, but an `else` statement *must always* be paired with a preceding `if` statement (or an `if-elif` chain).

### Handling Multiple Choices: "If This, Else If That, Otherwise Something Else" with `elif`
What if you have more than just two possibilities? For example, a number could be positive, negative, or exactly zero. Or, you might have a grading system with multiple letter grades (A, B, C, D, F). Using just `if` and `else` for these scenarios would quickly become cumbersome, possibly requiring many nested `if` statements, which can be hard to read.

Python offers `elif` (short for "else if") to handle multiple, mutually exclusive conditions in a clear, sequential way. `elif` allows you to check another condition *only if* all previous `if` or `elif` conditions were `False`.

**Syntax:**
```python
if condition_1:
    # Code runs if condition_1 is True
elif condition_2:
    # Code runs if condition_1 was False, AND condition_2 is True
elif condition_3:
    # Code runs if condition_1 and condition_2 were False, AND condition_3 is True
else:
    # Code runs if ALL preceding conditions (if and elifs) were False
```

**Important points about `if-elif-else` chains:**
*   Python checks the conditions from top to bottom, in the order they appear.
*   As soon as one condition is found to be `True`, its corresponding code block is executed, and *all subsequent `elif` and `else` blocks in that chain are skipped*. This means only one block of code in an `if-elif-else` chain will ever execute.
*   You can have any number of `elif` blocks between an `if` and an optional `else`.
*   The `else` block is optional, but it's a good practice to include it to catch all other possibilities if none of the `if` or `elif` conditions are met.

Let's classify a number as positive, negative, or zero:

```python
number = 0

if number > 0:
    print("The number is positive.")
elif number < 0:
    print("The number is negative.")
else:
    print("The number is zero.") # This will run!
```

**Let's trace with `number = 0`:**
1.  Python checks `if number > 0` (is `0 > 0`? `False`).
2.  Since the first `if` was `False`, it moves to `elif number < 0` (is `0 < 0`? `False`).
3.  Since both the `if` and `elif` conditions were `False`, the `else` block runs: `print("The number is zero.")`.

**Let's trace with `number = 5`:**
1.  Python checks `if number > 0` (is `5 > 0`? `True`).
2.  The code `print("The number is positive.")` runs.
3.  Because a condition was found to be `True` and its block executed, the rest of the `elif` and `else` blocks in this chain are skipped.

[IMAGE_PLACEHOLDER: A flowchart illustrating an `if-elif-else` statement. Start node "Start". Arrow to "Condition 1 (True/False)?". If True, arrow to "Execute IF Block". If False, arrow to "Condition 2 (True/False)?". If True, arrow to "Execute ELIF Block". If False, arrow to "Execute ELSE Block". All execution blocks lead to a merge point, then to "Continue Program" and "End" node.]

Here's a practical grading example, demonstrating the importance of order:

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B" # This will be assigned because 85 >= 80 is True!
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your score is {score}, which is a grade {grade}.")
```
Notice the order of the `elif` conditions: it's crucial to check the highest scores first. If we checked `score >= 60` first, a score of 95 would incorrectly get a "D" because `95 >= 60` is `True`, and the rest of the chain would be skipped!

### Combining Conditions with Logical Operators (`and`, `or`, `not`)
Sometimes, a single condition isn't enough to make a decision. You might need to check if *multiple* things are true simultaneously, or if *at least one* of several things is true. This is where **logical operators** (`and`, `or`, `not`) become incredibly useful within your conditional statements. (You might recall these from the "Operators" lesson!)

*   **`and`**: Both conditions must be `True` for the combined condition to be `True`.
    *   `condition_A and condition_B` is `True` only if `condition_A` is `True` AND `condition_B` is `True`.
*   **`or`**: At least one condition must be `True` for the combined condition to be `True`.
    *   `condition_A or condition_B` is `True` if `condition_A` is `True` OR `condition_B` is `True` (or both are `True`).
*   **`not`**: Reverses the truth value of a condition.
    *   `not condition_A` is `True` if `condition_A` is `False`, and `False` if `condition_A` is `True`.

Let's see them in action:

**Example with `and`:** Checking if a number is within a specific range.

```python
age = 25

if age >= 18 and age <= 65:
    print("You are an adult in the working age range.")
else:
    print("You are outside the working age range.")

# Try changing age:
# age = 15  (15 >= 18 is False, 15 <= 65 is True -> False and True -> False)
# age = 70  (70 >= 18 is True, 70 <= 65 is False -> True and False -> False)
# age = 25  (25 >= 18 is True, 25 <= 65 is True -> True and True -> True)
```

**Example with `or`:** Checking if it's a weekend.

```python
day = "Saturday"

if day == "Saturday" or day == "Sunday":
    print("It's the weekend! Time to relax.")
else:
    print("It's a weekday. Back to work!")

# Try changing day:
# day = "Monday"    ("Monday" == "Saturday" is False, "Monday" == "Sunday" is False -> False or False -> False)
# day = "Saturday"  ("Saturday" == "Saturday" is True, "Saturday" == "Sunday" is False -> True or False -> True)
```

**Example with `not`:** Checking if a user is *not* an admin.

```python
user_role = "guest"

if not user_role == "admin": # This is equivalent to user_role != "admin"
    print("Access denied. Admins only.")
else:
    print("Welcome, Admin!")
```
You can combine these operators in more complex ways. When doing so, use parentheses `()` to explicitly define the order of operations and make your conditions easier to read and understand. For example: `if (age > 18 and has_license) or is_supervised:`.

### Decisions Within Decisions: Nested Conditionals
Sometimes, after a program makes one decision, it needs to make *another* decision based on the outcome of the first. This is called **nesting** conditional statements – placing an `if` (or `elif`/`else`) statement inside another `if` (or `elif`/`else`) block.

Think of it like a branching path that then splits again, leading to even more specific outcomes.

**Syntax:**
```python
if outer_condition:
    # Code for outer_condition being True
    if inner_condition:
        # Code for outer_condition AND inner_condition being True
    else:
        # Code for outer_condition being True, BUT inner_condition being False
else:
    # Code for outer_condition being False
```

**Example: Checking login credentials with account status**

```python
# Stored user data (imagine this comes from a database)
correct_username = "admin"
correct_password = "password123"
is_account_active = True

# Get input from the user (from the 'input-and-output' lesson)
input_username = input("Enter username: ")
input_password = input("Enter password: ")

if input_username == correct_username:
    # If username is correct, now check the password
    if input_password == correct_password:
        # If password is also correct, now check account status
        if is_account_active:
            print("Login successful! Welcome, Admin.")
        else:
            print("Login successful, but your account is inactive. Please contact support.")
    else:
        # This 'else' belongs to the 'if input_password == correct_password'
        print("Incorrect password.")
else:
    # This 'else' belongs to the 'if input_username == correct_username'
    print("Incorrect username.")
```

**Let's trace how this works:**
1.  The program first checks the `outer_condition`: `if input_username == correct_username`.
2.  **If the username matches:** It then proceeds to the *inner* `if` statement to check the `input_password`.
    *   **If the password also matches:** It then checks the `innermost` `if` statement for `is_account_active`.
        *   **If `is_account_active` is `True`:** It prints "Login successful!".
        *   **If `is_account_active` is `False`:** It executes the `else` block for the `is_account_active` check, printing "Account inactive."
    *   **If the password doesn't match:** It executes the `else` block that belongs to the password check, printing "Incorrect password."
3.  **If the username doesn't match (from step 1):** The entire inner `if-else` block (for password and account status) is skipped, and the `else` block of the *outermost* `if` statement is executed, printing "Incorrect username."

Nested conditionals are powerful for handling complex, multi-layered logic. However, be careful not to nest too many levels deep, as excessive indentation can make your code harder to read and understand. If you find yourself nesting more than 2-3 levels, it might be a good idea to refactor your code, perhaps by combining conditions with `and` operators or by breaking down the logic into separate functions.

## Wrap-Up
Congratulations! You've taken a significant step in making your programs smarter by teaching them how to make decisions. Conditional statements (`if`, `elif`, `else`) are the backbone of any program that needs to react dynamically to different inputs or situations. You now know how to execute code based on a single condition, provide alternative paths, handle multiple choices in a sequence, combine conditions using logical operators (`and`, `or`, `not`), and even nest decisions for more intricate scenarios.

This ability to control the flow of your program is a huge step forward in your programming journey. In the next lesson, we'll explore another crucial control flow concept: **loops**, which allow your programs to repeat actions efficiently.