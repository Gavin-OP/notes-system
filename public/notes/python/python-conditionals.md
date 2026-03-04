# Python Conditionals with if/elif/else

- slug: python-conditionals
- prerequisites: python-variables
- difficulty: 1/5
- estimated_time_minutes: 60
- tags: python, control-flow

## Learning Objectives
- Write boolean conditions with comparison operators
- Combine conditions using logical operators (`and`, `or`, `not`)
- Use if/elif/else for branching logic
- Avoid common indentation and condition-order mistakes

## Core Explanation
Python's `if`, `elif` (short for 'else if'), and `else` statements are fundamental for creating programs that can make decisions. They allow your code to execute different blocks of instructions based on whether certain conditions are met.

Conditions in Python are typically *boolean expressions* that evaluate to either `True` or `False`. You form these conditions using **comparison operators**:
*   `==` (equal to)
*   `!=` (not equal to)
*   `<` (less than)
*   `>` (greater than)
*   `<=` (less than or equal to)
*   `>=` (greater than or equal to)

You can also combine multiple conditions using **logical operators**:
*   `and`: True if *both* conditions are True.
*   `or`: True if *at least one* condition is True.
*   `not`: Reverses the boolean value of a condition.

The execution flow works as follows:
1.  An `if` statement checks its condition first. If it's `True`, its indented block of code runs, and the rest of the `elif`/`else` chain is skipped.
2.  If the `if` condition is `False`, Python moves to the first `elif` condition (if present). If that `elif` condition is `True`, its block runs, and the rest of the chain is skipped.
3.  This process continues for any subsequent `elif` statements.
4.  If all `if` and `elif` conditions are `False`, the `else` block (if present) executes.

**Indentation is crucial in Python** to define which lines of code belong to which `if`, `elif`, or `else` block. Consistent indentation (typically 4 spaces) is mandatory.

## Worked Examples
- Simple 'if': Check if a number is positive.
num = 10
if num > 0:
    print("Positive number")
- 'if/else': Check if a user is logged in.
is_logged_in = False
if is_logged_in:
    print("Welcome back!")
else:
    print("Please log in.")
- 'if/elif/else': Assign a grade based on a score.
score = 85
if score >= 90:
    print("Grade A")
elif score >= 80:
    print("Grade B")
else:
    print("Grade C")
- Multiple conditions: Check if a person is eligible to vote.
age = 19
has_id = True
if age >= 18 and has_id:
    print("Eligible to vote.")
else:
    print("Not eligible.")

## Common Pitfalls
- Incorrect Indentation: Python uses indentation to define code blocks. Missing or inconsistent indentation will cause errors.
- Wrong Comparison Operator: Using '=' (assignment) instead of '==' (equality check) in a condition.
- Order of 'elif' conditions: Specific conditions should often come before more general ones to ensure correct logic.
- Forgetting 'else': Sometimes an 'else' block is needed to handle all other cases.

## Quick Check Quiz
1. What will be printed?
x = 5
if x > 10:
    print("A")
elif x > 0:
    print("B")
else:
    print("C")
  - 0. A
  - 1. B
  - 2. C
  - 3. Nothing
  - Answer: 1
  - Why: The first condition (x > 10) is False. The second condition (x > 0) is True, so 'B' is printed.

2. Which operator checks if two values are equal?
  - 0. =
  - 1. ==
  - 2. !=
  - 3. >=
  - Answer: 1
  - Why: '==' is the equality comparison operator. '=' is for assignment.

3. What will be printed?
age = 25
is_student = True
if age > 18 and not is_student:
    print("Adult non-student")
elif age > 18 or is_student:
    print("Adult or student")
else:
    print("Young")
  - 0. Adult non-student
  - 1. Adult or student
  - 2. Young
  - 3. Nothing
  - Answer: 1
  - Why: The first condition `age > 18 and not is_student` (True and False) is False. The second condition `age > 18 or is_student` (True or True) is True, so 'Adult or student' is printed.

4. What happens if an 'if' condition is 'True' and an 'elif' condition is also 'True'?
  - 0. Both blocks run
  - 1. Only the 'if' block runs
  - 2. Only the 'elif' block runs
  - 3. An error occurs
  - Answer: 1
  - Why: Once an 'if' or 'elif' condition is met, its block runs, and the rest of the chain is skipped.

5. Consider the following code to assign a grade:
score = 75
if score >= 60:
    print("Pass")
elif score >= 70:
    print("Good")
elif score >= 80:
    print("Excellent")
else:
    print("Fail")
What will be printed?
  - 0. Pass
  - 1. Good
  - 2. Excellent
  - 3. Fail
  - Answer: 0
  - Why: The conditions are in the wrong order. `score >= 60` is evaluated first. Since 75 >= 60 is True, 'Pass' is printed, and the subsequent `elif` conditions are skipped, even though `score >= 70` and `score >= 80` might also be true for other scores.

6. What is the purpose of the 'else' statement?
  - 0. To define a new condition
  - 1. To run code if all preceding 'if'/'elif' conditions are False
  - 2. To repeat a block of code
  - 3. To handle errors
  - Answer: 1
  - Why: The 'else' block executes when no 'if' or 'elif' condition is met in the chain.

## Practice Tasks
- Write a program that checks if a number is even or odd using 'if/else'.
- Create a simple login system: ask for a username and password, then use 'if/elif/else' to check credentials.
- Write code to determine if a year is a leap year (divisible by 4, but not by 100 unless also by 400).
- Ask a user for their age and print if they are a child (<13), teenager (13-19), or adult (>=20).
