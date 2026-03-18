# Operators and Expressions

## Learning Objectives
By the end of this lesson, you will be able to:
- Define what an operator is and identify its role in programming.
- Understand what an expression is and how it evaluates to a value.
- Differentiate between various types of operators, including arithmetic, comparison, logical, and assignment operators.
- Apply different operators correctly in Python code.
- Explain and apply the concept of operator precedence to predict the outcome of complex expressions.

## Introduction
Imagine you're cooking a meal. You have your ingredients (which, in programming, are like your [variables-data-types](../python/variables-data-types.md) and data). But ingredients alone don't make a meal; you need to *do* something with them – chop, mix, bake, season.

In programming, we do something very similar. We use special symbols and keywords to perform actions on our data. These "action words" are called **operators**, and when we combine them with data, we form **expressions**.

Understanding operators and expressions is fundamental to writing any meaningful program. They are the tools that allow us to perform calculations, make decisions, and manipulate information. Without them, our programs would just be static collections of data. Let's dive in and see how these powerful tools work together!

## Concept Progression

### What are Operators?
At its core, an **operator** is a symbol or keyword that tells the computer to perform a specific mathematical, relational, or logical operation on one or more values. Think of operators as verbs in a sentence – they describe an action.

The values that an operator acts upon are called **operands**. For example, in the mathematical expression `5 + 3`, the `+` symbol is the operator, and `5` and `3` are the operands. The `+` operator tells the computer to add the two numbers together.

Let's look at a simple example in Python:

```python
# Here, '+' is an operator, and 10 and 5 are operands.
result = 10 + 5
print(result) # Output: 15
```

Operators aren't just for numbers! They can work with different types of data. For instance, you can "add" strings together (which is called concatenation), or compare two text values to see if they are the same.

### What are Expressions?
While an operator performs an action, an **expression** is a combination of operators and operands that the Python interpreter can evaluate to produce a single value. Essentially, an expression is any piece of code that *computes* something and gives you a result.

Consider the example `10 + 5`. This entire phrase is an expression. When Python sees it, it performs the addition and produces the value `15`. So, the expression `10 + 5` *evaluates* to `15`.

Expressions can be very simple, like a single variable (`x`) or a literal value (`5`, `"hello"`), or they can be complex, involving multiple operators and operands.

```python
# Simple expressions:
x = 10
y = 20

# A more complex expression:
# (x + y) is an expression that evaluates to 30
# (x * 2) is an expression that evaluates to 20
# The entire line combines these to form a larger expression that evaluates to 50
total = (x + y) + (x * 2)
print(total) # Output: 50
```

Every time you write code that calculates something or produces a value, you are creating and using an expression.

[IMAGE_PLACEHOLDER: A diagram illustrating the relationship between operators, operands, and expressions. It shows two operands (e.g., '5' and '3') connected by an operator (e.g., '+') inside a larger box labeled 'Expression'. An arrow points from the expression box to a result (e.g., '8'), indicating evaluation.]

### Types of Operators
Python provides several categories of operators, each designed for specific tasks. Let's explore the most common ones, starting with the familiar mathematical operations.

#### Arithmetic Operators
These are the operators you're probably most familiar with from basic mathematics. They perform calculations like addition, subtraction, multiplication, and division.

| Operator | Description        | Example        | Result |
| :------- | :----------------- | :------------- | :----- |
| `+`      | Addition           | `5 + 2`        | `7`    |
| `-`      | Subtraction        | `5 - 2`        | `3`    |
| `*`      | Multiplication     | `5 * 2`        | `10`   |
| `/`      | Division           | `5 / 2`        | `2.5`  |
| `//`     | Floor Division     | `5 // 2`       | `2`    |
| `%`      | Modulus (Remainder)| `5 % 2`        | `1`    |
| `**`     | Exponentiation     | `5 ** 2`       | `25`   |

Let's see them in action with some Python code:

```python
num1 = 10
num2 = 3

print(f"Addition: {num1 + num2}")       # Output: Addition: 13
print(f"Subtraction: {num1 - num2}")    # Output: Subtraction: 7
print(f"Multiplication: {num1 * num2}") # Output: Multiplication: 30
print(f"Division: {num1 / num2}")       # Output: Division: 3.3333333333333335 (always a float)
print(f"Floor Division: {num1 // num2}")# Output: Floor Division: 3 (divides and rounds down to the nearest whole number)
print(f"Modulus: {num1 % num2}")        # Output: Modulus: 1 (the remainder when 10 is divided by 3)
print(f"Exponentiation: {num1 ** num2}")# Output: Exponentiation: 1000 (10 to the power of 3)
```
Notice the difference between `/` (regular division, which always returns a floating-point number) and `//` (floor division, which returns an integer if both operands are integers, effectively "rounding down"). The modulus operator (`%`) is particularly useful for tasks like checking if a number is even or odd, or for creating repeating patterns.

#### Comparison (Relational) Operators
Once you can perform calculations, you'll often need to compare values. Comparison operators do just that: they compare two values and always return a Boolean value – either `True` or `False`. These operators are fundamental for making decisions in your code.

| Operator | Description                | Example        | Result |
| :------- | :------------------------- | :------------- | :----- |
| `==`     | Equal to                   | `5 == 2`       | `False`|
| `!=`     | Not equal to               | `5 != 2`       | `True` |
| `>`      | Greater than               | `5 > 2`        | `True` |
| `<`      | Less than                  | `5 < 2`        | `False`|
| `>=`     | Greater than or equal to   | `5 >= 2`       | `True` |
| `<=`     | Less than or equal to      | `5 <= 2`       | `False`|

Here's how they work in Python:

```python
a = 7
b = 7
c = 10

print(f"Is a equal to b? (a == b): {a == b}") # Output: Is a equal to b? (a == b): True
print(f"Is a not equal to c? (a != c): {a != c}") # Output: Is a not equal to c? (a != c): True
print(f"Is a greater than c? (a > c): {a > c}")   # Output: Is a greater than c? (a > c): False
print(f"Is a less than or equal to b? (a <= b): {a <= b}") # Output: Is a less than or equal to b? (a <= b): True
```
These operators are the essential building blocks for conditional statements, which allow your program to take different paths based on whether a condition is `True` or `False`. We'll explore conditional statements in a later lesson.

#### Logical Operators
Sometimes, a single comparison isn't enough. You might need to combine multiple conditions to make a decision. That's where logical operators come in. They are used to combine conditional statements (expressions that evaluate to `True` or `False`) and allow you to build more complex logical conditions. Python has three logical operators: `and`, `or`, and `not`.

| Operator | Description                               | Example               | Result |
| :------- | :---------------------------------------- | :-------------------- | :----- |
| `and`    | Returns `True` if *both* operands are `True` | `True and False`      | `False`|
| `or`     | Returns `True` if *at least one* operand is `True` | `True or False`       | `True` |
| `not`    | Reverses the logical state of the operand | `not True`            | `False`|

Let's see some practical examples:

```python
is_sunny = True
is_warm = False
has_hat = True

# Using 'and': Both conditions must be true for the result to be True
print(f"Go outside (is_sunny AND is_warm): {is_sunny and is_warm}") # Output: Go outside (is_sunny AND is_warm): False

# Using 'or': At least one condition must be true for the result to be True
print(f"Wear sunscreen (is_sunny OR is_warm): {is_sunny or is_warm}") # Output: Wear sunscreen (is_sunny OR is_warm): True

# Using 'not': Reverses the truth value of the operand
print(f"Don't wear hat (NOT has_hat): {not has_hat}") # Output: Don't wear hat (NOT has_hat): False

# Combining them for a more complex decision
age = 25
has_license = True
can_drive = (age >= 18) and has_license # You must be 18 OR older AND have a license
print(f"Can drive: {can_drive}") # Output: Can drive: True
```
Logical operators are incredibly powerful for controlling the flow of your program based on multiple conditions, making your programs smarter and more responsive.

#### Assignment Operators
You've already used the most basic assignment operator, `=`, to give values to your variables. However, Python also provides convenient shorthand assignment operators that combine an arithmetic operation with an assignment. These are often used to update the value of a variable.

| Operator | Example      | Equivalent to |
| :------- | :----------- | :------------ |
| `=`      | `x = 5`      | `x = 5`       |
| `+=`     | `x += 3`     | `x = x + 3`   |
| `-=`     | `x -= 3`     | `x = x - 3`   |
| `*=`     | `x *= 3`     | `x = x * 3`   |
| `/=`     | `x /= 3`     | `x = x / 3`   |
| `//=`    | `x //= 3`    | `x = x // 3`  |
| `%=`     | `x %= 3`     | `x = x % 3`   |
| `**=`    | `x **= 3`    | `x = x ** 3`  |

These shorthand operators are not only convenient but also often make your code more concise and easier to read, especially when you're repeatedly modifying a variable.

```python
score = 100
print(f"Initial score: {score}") # Output: Initial score: 100

score += 50 # Add 50 to score (score becomes 100 + 50 = 150)
print(f"Score after += 50: {score}") # Output: Score after += 50: 150

score -= 20 # Subtract 20 from score (score becomes 150 - 20 = 130)
print(f"Score after -= 20: {score}") # Output: Score after -= 20: 130

score *= 2  # Multiply score by 2 (score becomes 130 * 2 = 260)
print(f"Score after *= 2: {score}") # Output: Score after *= 2: 260

score /= 10 # Divide score by 10 (score becomes 260 / 10 = 26.0)
print(f"Score after /= 10: {score}") # Output: Score after /= 10: 26.0
```

### Operator Precedence
When you have an expression with multiple operators, how does Python know which operation to perform first? This is where **operator precedence** comes in. Just like in mathematics, where multiplication and division are performed before addition and subtraction, Python has a defined order for its operators.

Think of it like a hierarchy: some operators have higher "priority" or "precedence" than others. Python evaluates operators with higher precedence first. If operators have the same precedence, they are usually evaluated from left to right (this is called associativity).

The general rule of thumb, often remembered by acronyms like PEMDAS (Parentheses, Exponents, Multiplication and Division, Addition and Subtraction) from math class, applies similarly in Python.

Here's a simplified order from highest to lowest precedence (this list is not exhaustive, but covers the operators we've learned):

1.  **Parentheses `()`**: Used to explicitly group expressions and override default precedence.
2.  **Exponentiation `**`**
3.  **Multiplication `*`, Division `/`, Floor Division `//`, Modulus `%`** (These have equal precedence and are evaluated from left to right)
4.  **Addition `+`, Subtraction `-`** (These have equal precedence and are evaluated from left to right)
5.  **Comparison Operators `==`, `!=`, `>`, `<`, `>=`, `<=`**
6.  **Logical `not`**
7.  **Logical `and`**
8.  **Logical `or`**
9.  **Assignment Operators `=`, `+=`, etc.**

Let's look at a classic example:

```python
# What do you think this expression evaluates to?
result = 5 + 2 * 3
print(result)
```
If you thought `21` (because `5+2` is `7`, then `7*3` is `21`), you've fallen into a common trap! Due to operator precedence, multiplication (`*`) happens before addition (`+`).
So, Python first calculates `2 * 3`, which is `6`. Then, it performs the addition `5 + 6`, resulting in `11`.

```python
# Correct evaluation step-by-step:
# 1. Multiplication: 2 * 3 = 6
# 2. Addition: 5 + 6 = 11
result = 5 + 2 * 3
print(result) # Output: 11
```

What if you *want* the addition to happen first? You use parentheses to explicitly group operations and force a different order of evaluation:

```python
# Using parentheses to change precedence
result_with_parentheses = (5 + 2) * 3
print(result_with_parentheses) # Output: 21
```
Parentheses are your best friend for ensuring expressions are evaluated exactly as you intend. They also make your code much clearer for others (and your future self!) to read. When in doubt about precedence, use parentheses!

[IMAGE_PLACEHOLDER: A visual hierarchy or pyramid showing common Python operators stacked by their precedence level. Parentheses are at the top, followed by exponentiation, then multiplication/division/modulus, then addition/subtraction, then comparison operators, then logical operators, and finally assignment operators at the bottom. Arrows indicate evaluation order.]

## Wrap-Up
You've just taken a significant step in understanding how to make your programs perform actions! We've learned that **operators** are the symbols that tell Python what to do, and **expressions** are combinations of operators and operands that evaluate to a single value.

We explored various types of operators:
*   **Arithmetic operators** for calculations.
*   **Comparison operators** for making true/false statements.
*   **Logical operators** for combining those statements.
*   **Assignment operators** for updating variables.

Finally, we tackled **operator precedence**, which dictates the order in which operations are performed, and how parentheses can be used to control that order, ensuring your expressions evaluate exactly as you intend.

With this knowledge, you can now write code that performs calculations and makes basic decisions. In the next lesson, we'll build on this by using these expressions to control the flow of your programs with conditional statements, allowing your code to react dynamically to different situations.