# Operators and Expressions

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what operators and expressions are and why they are fundamental in programming.
- Identify and use common arithmetic, assignment, comparison, and logical operators.
- Construct simple expressions that perform calculations and comparisons.
- Understand and apply the concept of operator precedence to predict expression outcomes.
- Differentiate between unary and binary operators.

## Introduction
Imagine you're building something with LEGOs. You have various bricks (your data, like numbers or text) and you want to connect them, stack them, or compare their sizes. In programming, **operators** and **expressions** are your tools for doing just that! They are the fundamental building blocks that allow your programs to perform actions, make decisions, and manipulate data.

Think of operators as the "action words" or "verbs" of programming, telling your computer what to *do* with your data. An **expression** is like a complete thought or a mini-instruction that, when Python looks at it, gives you a single, definite result. Mastering operators and expressions is crucial because they form the backbone of almost every calculation and decision your code will ever make.

Let's dive in and see how these powerful tools work!

## Concept Progression

### What are Operators and Expressions?

To understand operators and expressions, let's start with a simple math problem: `5 + 3`.
Here, `5` and `3` are the numbers we're working with. The `+` symbol tells us to add them.
In programming, it's very similar:
*   The numbers `5` and `3` are called **operands**. These are the values or variables that an operator acts upon.
*   The `+` symbol is an **operator**. It's a special symbol or keyword that performs an operation on one or more operands.

When you combine operands and operators, you create an **expression**. An expression is a piece of code that, when Python processes it, *evaluates* to a single value.
For example, `5 + 3` is an expression that evaluates to `8`.
Similarly, if you have a variable `x` with a value, `x * 2` is an expression that evaluates to the value of `x` multiplied by `2`.

Operators can also be categorized by how many operands they require:
*   **Unary Operators:** These operators work on a single operand. A common example is the negation operator, like `-5`, where the `-` acts only on the `5`.
*   **Binary Operators:** These operators work on two operands. Most operators you'll encounter, like `+`, `-`, `*`, `/`, are binary because they need two values to perform their action (e.g., `5 + 3`).

Let's see these concepts in action:

```python
# 5 and 3 are operands, + is a binary operator
result = 5 + 3 
print(result) # Output: 8

# - is a unary operator acting on the operand 10
negative_number = -10 
print(negative_number) # Output: -10

# 'hello' and ' world' are operands, + is a binary operator (for string concatenation)
greeting = "hello" + " world"
print(greeting) # Output: hello world
```
As you can see, operators aren't just for numbers; they can work with different types of data, like strings, too!

### Arithmetic Operators

Now that we understand the basics, let's explore the most common type of operators: **arithmetic operators**. These are used to perform standard mathematical calculations, just like you learned in school!

| Operator | Description        | Example      | Result |
| :------- | :----------------- | :----------- | :----- |
| `+`      | Addition           | `10 + 5`     | `15`   |
| `-`      | Subtraction        | `10 - 5`     | `5`    |
| `*`      | Multiplication     | `10 * 5`     | `50`   |
| `/`      | Division           | `10 / 5`     | `2.0`  |
| `//`     | Floor Division     | `10 // 3`    | `3`    |
| `%`      | Modulo (Remainder) | `10 % 3`     | `1`    |
| `**`     | Exponentiation     | `2 ** 3`     | `8`    |

Let's take a closer look at some of the less common, but very useful, arithmetic operators:

*   **Division (`/`)**: In Python, regular division always returns a floating-point number (a number with a decimal point), even if the result is a whole number. For example, `10 / 5` gives `2.0`, not `2`.
*   **Floor Division (`//`)**: This operator divides two numbers and returns only the integer part of the result, discarding any fractional part. It effectively "floors" the result down to the nearest whole number (towards negative infinity for negative results). So, `10 // 3` is `3`, and `10 // 4` is `2`.
*   **Modulo (`%`)**: This operator returns the *remainder* of a division. It's incredibly useful for tasks like checking if a number is even or odd (e.g., `number % 2 == 0`), or for cycling through a sequence. For instance, `10 % 3` is `1` because 10 divided by 3 is 3 with a remainder of 1.
*   **Exponentiation (`**`)**: This raises the first operand to the power of the second operand. So, `2 ** 3` means 2 to the power of 3 (2 * 2 * 2), which is 8.

Here's a practical example demonstrating these operators:

```python
# Example of arithmetic operators
num1 = 15
num2 = 4

print(f"Addition: {num1 + num2}")       # Output: Addition: 19
print(f"Subtraction: {num1 - num2}")    # Output: Subtraction: 11
print(f"Multiplication: {num1 * num2}") # Output: Multiplication: 60
print(f"Division: {num1 / num2}")       # Output: Division: 3.75
print(f"Floor Division: {num1 // num2}")# Output: Floor Division: 3
print(f"Modulo: {num1 % num2}")         # Output: Modulo: 3 (15 divided by 4 is 3 with a remainder of 3)
print(f"Exponentiation: {2 ** 4}")      # Output: Exponentiation: 16 (2 to the power of 4)
```

### Assignment Operators

After performing calculations, you often want to store the result in a variable. This is where **assignment operators** come in. The most basic assignment operator is the single equals sign (`=`).

```python
my_age = 30 # The value 30 is assigned to the variable my_age
```

Python also provides **shorthand assignment operators** that combine an arithmetic operation with assignment. These are very common and make your code more concise and often easier to read when you're updating a variable's value.

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

These shorthand operators are particularly useful when you want to modify a variable's value based on its current state.

```python
score = 100
print(f"Initial score: {score}") # Output: Initial score: 100

# Add 50 to score
score += 50 # This is equivalent to: score = score + 50
print(f"Score after adding 50: {score}") # Output: Score after adding 50: 150

# Multiply score by 2
score *= 2  # This is equivalent to: score = score * 2
print(f"Score after doubling: {score}") # Output: Score after doubling: 300

# Decrease score by 100
score -= 100 # This is equivalent to: score = score - 100
print(f"Score after reducing by 100: {score}") # Output: Score after reducing by 100: 200
```

### Comparison Operators

Beyond calculations, programs often need to make decisions. This involves asking questions about values: "Is this number greater than that one?", "Are these two strings the same?". **Comparison operators** (also known as relational operators) allow you to compare two values.

The result of any comparison operation is always a **Boolean value**: either `True` or `False`. These Boolean results are absolutely crucial for controlling the flow of your programs, which we'll explore in future lessons.

| Operator | Description                  | Example        | Result |
| :------- | :--------------------------- | :------------- | :----- |
| `==`     | Equal to                     | `5 == 5`       | `True` |
| `!=`     | Not equal to                 | `5 != 10`      | `True` |
| `>`      | Greater than                 | `10 > 5`       | `True` |
| `<`      | Less than                    | `5 < 10`       | `True` |
| `>=`     | Greater than or equal to     | `10 >= 10`     | `True` |
| `<=`     | Less than or equal to        | `5 <= 10`      | `True` |

Let's see some comparisons in action:

```python
age = 25
min_age_for_license = 18

print(f"Is age equal to 25? {age == 25}") # Output: Is age equal to 25? True
print(f"Is age not equal to 30? {age != 30}") # Output: Is age not equal to 30? True
print(f"Is age greater than 20? {age > 20}") # Output: Is age greater than 20? True
print(f"Is age less than 18? {age < min_age_for_license}") # Output: Is age less than 18? False
print(f"Is age greater than or equal to 18? {age >= min_age_for_license}") # Output: Is age greater than or equal to 18? True

name1 = "Alice"
name2 = "alice"
print(f"Are names equal (case-sensitive)? {name1 == name2}") # Output: Are names equal (case-sensitive)? False
```
**Important Note:** Notice that `==` (double equals) is used for *comparison* (asking "is this equal to that?"), while `=` (single equals) is used for *assignment* (saying "store this value in that variable"). This is a very common point of confusion for beginners, so pay close attention to the difference!

### Logical Operators

What if you need to combine multiple conditions, or reverse a condition? This is where **logical operators** come in handy. They work with Boolean values (`True` or `False`) and always return a Boolean result. They are essential for building complex decision-making logic in your programs.

| Operator | Description                                   | Example                               | Result |
| :------- | :-------------------------------------------- | :------------------------------------ | :----- |
| `and`    | Returns `True` if *both* operands are `True`. | `(5 > 3) and (10 < 20)`               | `True` |
| `or`     | Returns `True` if *at least one* operand is `True`. | `(5 > 10) or (10 < 20)`               | `True` |
| `not`    | Reverses the Boolean state of the operand.    | `not (5 == 5)`                        | `False` |

Let's see them in action with some variables:

```python
has_license = True
is_over_18 = True
has_car = False

# Using 'and': Both conditions must be True for the result to be True
can_drive = has_license and is_over_18
print(f"Can drive? {can_drive}") # Output: Can drive? True (because both are True)

# Using 'or': At least one condition must be True for the result to be True
can_rent_car = has_license or has_car
print(f"Can rent a car? {can_rent_car}") # Output: Can rent a car? True (because has_license is True)

# Using 'not': Reverses the Boolean value
is_under_18 = not is_over_18
print(f"Is under 18? {is_under_18}") # Output: Is under 18? False (because is_over_18 is True)
```

You can combine comparison and logical operators to create powerful and complex conditions:

```python
temperature = 28
is_raining = False

# Is it hot AND not raining?
is_good_weather_for_beach = (temperature > 25) and (not is_raining)
print(f"Good weather for beach? {is_good_weather_for_beach}") # Output: Good weather for beach? True
```
This example shows how `(temperature > 25)` evaluates to `True`, `(not is_raining)` evaluates to `True`, and `True and True` results in `True`.

### Operator Precedence

What happens if you have an expression with multiple different operators, like `5 + 3 * 2`? Does Python calculate `5 + 3` first (giving `8 * 2 = 16`), or `3 * 2` first (giving `5 + 6 = 11`)?

Just like in mathematics (where you might remember rules like PEMDAS or BODMAS), operators in Python have an order of operations, called **operator precedence**. Operators with higher precedence are evaluated before operators with lower precedence. If operators have the same precedence, they are usually evaluated from left to right.

Here's a simplified order from highest to lowest precedence for the operators we've covered. This isn't an exhaustive list, but it covers the most common scenarios:

1.  **Parentheses `()`**: Always evaluated first. Use them to explicitly control the order of operations and make your code clearer.
2.  **Exponentiation `**`**
3.  **Unary operators** (`-` for negation, `not` for logical negation)
4.  **Multiplication `*`, Division `/`, Floor Division `//`, Modulo `%`** (evaluated from left to right)
5.  **Addition `+`, Subtraction `-`** (evaluated from left to right)
6.  **Comparison operators `==`, `!=`, `>`, `<`, `>=`, `<=`** (evaluated from left to right)
7.  **Logical operator `and`**
8.  **Logical operator `or`**

Let's revisit our initial example: `5 + 3 * 2`
According to the precedence rules, multiplication (`*`) has higher precedence than addition (`+`).
So, `3 * 2` is calculated first, which is `6`.
Then, `5 + 6` is calculated, resulting in `11`.

If you want to force a different order, or simply make your intentions crystal clear, use parentheses:

```python
# Without parentheses: Multiplication first (due to higher precedence)
result1 = 5 + 3 * 2
print(f"Result 1: {result1}") # Output: Result 1: 11

# With parentheses: Addition first (parentheses override precedence)
result2 = (5 + 3) * 2
print(f"Result 2: {result2}") # Output: Result 2: 16

# Another example with multiple operators
calculation = 10 - 2 ** 3 + 4 / 2

# Let's break down the evaluation step-by-step:
# Original: 10 - 2 ** 3 + 4 / 2

# Step 1: Exponentiation (**) has the highest precedence here
# 2 ** 3 evaluates to 8
# Expression becomes: 10 - 8 + 4 / 2

# Step 2: Division (/) has the next highest precedence
# 4 / 2 evaluates to 2.0 (remember, regular division gives a float)
# Expression becomes: 10 - 8 + 2.0

# Step 3: Subtraction (-) and Addition (+) have the same precedence,
# so they are evaluated from left to right.
# First, 10 - 8 evaluates to 2
# Expression becomes: 2 + 2.0

# Step 4: Finally, Addition (+)
# 2 + 2.0 evaluates to 4.0
print(f"Complex calculation: {calculation}") # Output: Complex calculation: 4.0
```

[IMAGE_PLACEHOLDER: A flowchart or step-by-step diagram illustrating the evaluation of the expression `10 - 2 ** 3 + 4 / 2`. Each step should show the current expression, highlight the operator being evaluated next based on precedence, and then show the result of that evaluation, leading to the final value. Use arrows to indicate the flow of evaluation.]

Understanding operator precedence is vital to avoid unexpected results in your programs. When in doubt, always use parentheses to make your intentions explicit and improve the readability of your code!

## Wrap-Up
You've just taken a significant step in understanding how Python performs actions and makes decisions! We've explored the fundamental concepts of operators and expressions, learning how to use:
*   **Arithmetic operators** for calculations (`+`, `-`, `*`, `/`, `//`, `%`, `**`).
*   **Assignment operators** to store and update values in variables (`=`, `+=`, `-=`, etc.).
*   **Comparison operators** to ask questions about values, resulting in `True` or `False` (`==`, `!=`, `>`, `<`, `>=`, `<=`).
*   **Logical operators** to combine or reverse Boolean conditions (`and`, `or`, `not`).

Crucially, we also tackled **operator precedence**, which dictates the order in which operations are performed, and how parentheses can override this order for clarity and control.

These building blocks are absolutely essential for writing any meaningful program. In the next lesson, we'll see how these expressions, especially those involving comparison and logical operators, become the basis for controlling the flow of your program, allowing it to make choices and repeat actions based on conditions you define. Get ready to make your programs truly dynamic!