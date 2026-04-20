<a id="concept-operators-and-expressions"></a>
# Operators and Expressions

## Learning Objectives
By the end of this lesson, you will be able to:
- Identify and use Python's arithmetic operators to perform basic mathematical calculations.
- Understand and apply assignment operators to efficiently update variable values.
- Utilize comparison operators to compare values and produce Boolean (`True`/`False`) results.
- Combine Boolean results using logical operators (`and`, `or`, `not`).
- Construct meaningful expressions by combining variables, values, and operators.
- Explain and apply operator precedence (order of operations) to predict how Python evaluates complex expressions.

## Introduction
In our previous lesson, we learned how to store different kinds of information using [variables](../data-science/python-fundamentals.md#concept-variables) and various [data types](../data-science/python-fundamentals.md#concept-data-types) like numbers and text. But simply storing data isn't enough; we need to be able to *do things* with it! This is where **operators** come into play.

Think of operators as the "action words" or "verbs" of programming. They tell Python what kind of operation to perform on your data. When you combine data (like numbers or variables) with operators, you create an **expression**. Python then evaluates this expression to produce a new, single value.

Understanding operators and expressions is absolutely fundamental. They are the tools that allow you to perform calculations, make decisions, and manipulate data—skills that are at the core of almost every program you'll ever write. Let's dive in and discover how we can make our data work for us!

## Concept Progression

### Arithmetic Operators: Your Python Calculator
Just like in everyday math, Python provides operators for all your basic mathematical needs: addition, subtraction, multiplication, and division. These are known as **arithmetic operators**, and they work exactly as you'd expect with numbers.

Let's start with the most common ones:

| Operator | Description      | Example       | Result |
| :------- | :--------------- | :------------ | :----- |
| `+`      | Addition         | `5 + 2`       | `7`    |
| `-`      | Subtraction      | `5 - 2`       | `3`    |
| `*`      | Multiplication   | `5 * 2`       | `10`   |
| `/`      | Division         | `5 / 2`       | `2.5`  |

It's important to note that standard division (`/`) in Python always returns a floating-point number (a number with a decimal), even if the result is a whole number. For example, `10 / 2` would give `5.0`.

Beyond these basics, Python offers a few more specialized arithmetic operators that are incredibly useful in various programming scenarios:

-   **Floor Division (`//`):** This operator divides two numbers and rounds the result *down* to the nearest whole number. It effectively discards any fractional part for positive results.
-   **Modulo (`%`):** This operator returns the *remainder* of a division. It's super handy for tasks like checking if a number is even or odd, or for operations that involve cycles (e.g., what day of the week will it be in 100 days?).
-   **Exponentiation (`**`):** This operator raises a number to the power of another.

Let's see these powerful operators in action:

```python
# Basic arithmetic examples
apples = 10
oranges = 5
total_fruit = apples + oranges
print(f"Total fruit: {total_fruit}") # Output: Total fruit: 15

price_per_item = 2.5
quantity = 4
total_price = price_per_item * quantity
print(f"Total price: {total_price}") # Output: Total price: 10.0

# Specialized arithmetic examples
num1 = 17
num2 = 5

# Floor division: How many times does num2 fit entirely into num1?
floor_result = num1 // num2
print(f"17 // 5 = {floor_result}") # Output: 17 // 5 = 3 (17 divided by 5 is 3 with a remainder)

# Modulo (remainder): What's left over after num2 divides num1?
remainder_result = num1 % num2
print(f"17 % 5 = {remainder_result}") # Output: 17 % 5 = 2 (The remainder when 17 is divided by 5 is 2)

# Exponentiation (power): 2 raised to the power of 3 (2 * 2 * 2)
power_result = 2 ** 3
print(f"2 ** 3 = {power_result}") # Output: 2 ** 3 = 8
```

[IMAGE_PLACEHOLDER: A table illustrating Python's arithmetic operators. Each row shows the operator symbol, its name (e.g., "Addition"), a simple mathematical example (e.g., "5 + 2"), and the Python code equivalent with its output. Include `+`, `-`, `*`, `/`, `//`, `%`, `**`.]

With these arithmetic tools, you can perform a wide range of calculations in your Python programs. Next, let's explore how to update variable values more efficiently.

### Assignment Operators: Updating Variables with Ease
You're already familiar with the most fundamental assignment operator: the equals sign (`=`). It takes the value on its right and stores it in the variable on its left.

```python
score = 100 # Assigns the value 100 to the variable 'score'
print(f"Initial score: {score}") # Output: Initial score: 100
```

Often, you'll want to update a variable's value based on its *current* value. For example, if a player scores 10 points, you might write `score = score + 10`. Python offers convenient shorthand **assignment operators** that combine an arithmetic operation with an assignment. This makes your code more concise, often easier to read, and sometimes even slightly more efficient.

Here are some common assignment operators:

| Operator | Example      | Equivalent to |
| :------- | :----------- | :------------ |
| `+=`     | `x += 5`     | `x = x + 5`   |
| `-=`     | `x -= 3`     | `x = x - 3`   |
| `*=`     | `x *= 2`     | `x = x * 2`   |
| `/=`     | `x /= 4`     | `x = x / 4`   |
| `//=`    | `x //= 2`    | `x = x // 2`  |
| `%=`     | `x %= 3`     | `x = x % 3`   |
| `**=`    | `x **= 2`    | `x = x ** 2`  |

Let's see these in action, making our code cleaner:

```python
player_health = 100
print(f"Player health: {player_health}") # Output: Player health: 100

# Player takes damage: subtract 20 from current health
player_health -= 20 # Equivalent to player_health = player_health - 20
print(f"Health after damage: {player_health}") # Output: Health after damage: 80

# Player picks up a health pack: add 15 to current health
player_health += 15 # Equivalent to player_health = player_health + 15
print(f"Health after health pack: {player_health}") # Output: Health after health pack: 95

# Double the score: multiply current score by 2
current_score = 50
current_score *= 2 # Equivalent to current_score = current_score * 2
print(f"Doubled score: {current_score}") # Output: Doubled score: 100
```

These operators aren't just for numbers! They can also work with other [data types](../data-science/python-fundamentals.md#concept-data-types) where the underlying operation makes sense. For example, `+=` can be used to concatenate (join) strings:

```python
greeting = "Hello"
name = "Alice"
greeting += ", " + name + "!" # Equivalent to greeting = greeting + ", " + name + "!"
print(greeting) # Output: Hello, Alice!
```

Now that we know how to perform calculations and update variables, let's learn how to compare values and ask questions in our code.

### Comparison Operators: Asking Questions About Values
Sometimes, instead of calculating a new value, you need to compare existing values. Are two numbers the same? Is one larger than the other? **Comparison operators** (also known as relational operators) allow you to do exactly that. The result of any comparison operation is always a **Boolean** value: either `True` or `False`.

This ability to compare values and get a `True`/`False` answer is incredibly important. It forms the basis for making decisions in your programs, which you'll explore in depth when we cover conditional statements.

Here are the main comparison operators:

| Operator | Description                      | Example       | Result |
| :------- | :------------------------------- | :------------ | :----- |
| `==`     | Equal to                         | `5 == 5`      | `True` |
| `!=`     | Not equal to                     | `5 != 10`     | `True` |
| `>`      | Greater than                     | `10 > 5`      | `True` |
| `<`      | Less than                        | `5 < 10`      | `True` |
| `>=`     | Greater than or equal to         | `10 >= 10`    | `True` |
| `<=`     | Less than or equal to            | `5 <= 10`     | `True` |

**A crucial point to remember:** Do not confuse the **assignment operator (`=`)** with the **equality comparison operator (`==`)**.
-   `=` is used to *assign* a value to a variable (e.g., `x = 10`).
-   `==` is used to *check if two values are equal* (e.g., `x == 10`).

Let's see some examples of comparisons:

```python
age = 25
minimum_age = 18

# Is age equal to minimum_age?
is_equal = (age == minimum_age)
print(f"Is age equal to minimum age? {is_equal}") # Output: Is age equal to minimum age? False

# Is age greater than or equal to minimum_age?
can_enter = (age >= minimum_age)
print(f"Can enter? {can_enter}") # Output: Can enter? True

# Are two strings the same? (Python comparisons are case-sensitive!)
name1 = "Bob"
name2 = "bob"
are_names_same = (name1 == name2)
print(f"Are names the same? {are_names_same}") # Output: Are names the same? False

# Is a number not equal to another?
temperature = 20
target_temperature = 25
is_not_target = (temperature != target_temperature)
print(f"Is temperature not target? {is_not_target}") # Output: Is temperature not target? True
```

[IMAGE_PLACEHOLDER: A table illustrating Python's comparison operators. Each row shows the operator symbol, its description (e.g., "Equal to"), a simple comparison example (e.g., "x == y"), and the Python code equivalent with its Boolean output. Emphasize the difference between `=` and `==` visually.]

Now that you can get `True` or `False` answers, let's learn how to combine these answers to create more sophisticated conditions.

### Logical Operators: Combining Truths
Once you can generate `True` or `False` results using comparison operators, you'll often need to combine these results to form more complex conditions. This is where **logical operators** come in. Python has three logical operators: `and`, `or`, and `not`. They work with Boolean values (`True` or `False`).

-   **`and`:** Returns `True` if *both* conditions it connects are `True`. If even one condition is `False`, the entire `and` expression is `False`.
-   **`or`:** Returns `True` if *at least one* of the conditions it connects is `True`. It only returns `False` if *both* conditions are `False`.
-   **`not`:** Reverses the [Boolean value](../python/python-data-types-and-variables.md#concept-boolean-value) of a single condition. If a condition is `True`, `not` makes it `False`, and vice-versa.

Let's look at some practical examples:

```python
has_license = True
is_over_18 = True
has_car = False

# Using 'and': Both conditions must be True for the result to be True
can_drive = has_license and is_over_18
print(f"Can drive? {can_drive}") # Output: Can drive? True (both has_license and is_over_18 are True)

# Using 'or': At least one condition must be True for the result to be True
can_travel = has_license or has_car
print(f"Can travel? {can_travel}") # Output: Can travel? True (has_license is True, so it doesn't matter that has_car is False)

# Using 'not': Reverses the truth value
is_not_licensed = not has_license
print(f"Is not licensed? {is_not_licensed}") # Output: Is not licensed? False (because has_license is True, so not True is False)

# Combining multiple conditions with 'or' and 'and' for a discount eligibility check
# Discount rule: (age > 60) OR (student_status AND purchase_amount > 50)

# Case 1: Age is over 60
age = 65
student_status = False
purchase_amount = 75
is_eligible_for_discount_1 = (age > 60) or (student_status and purchase_amount > 50)
print(f"Is eligible for discount (Case 1: Age > 60)? {is_eligible_for_discount_1}") # Output: True (because age > 60 is True)

# Case 2: Is a student AND has a large purchase
age = 25
student_status = True
purchase_amount = 100
is_eligible_for_discount_2 = (age > 60) or (student_status and purchase_amount > 50)
print(f"Is eligible for discount (Case 2: Student & large purchase)? {is_eligible_for_discount_2}") # Output: True (because student_status and purchase_amount > 50 is True)

# Case 3: Neither condition for discount is met
age = 25
student_status = True
purchase_amount = 30 # Not > 50
is_eligible_for_discount_3 = (age > 60) or (student_status and purchase_amount > 50)
print(f"Is eligible for discount (Case 3: Neither)? {is_eligible_for_discount_3}") # Output: False (both parts of 'or' are False)
```

[IMAGE_PLACEHOLDER: A simple truth table diagram for `and`, `or`, and `not` operators. Show inputs (Condition A, Condition B) and outputs (A and B, A or B, not A) clearly with True/False values.]

Logical operators are essential for building sophisticated decision-making logic in your programs. Next, let's formally define what an "expression" is, as you've been using them all along!

### Expressions: Building Blocks of Computation
Throughout this lesson, you've been creating and evaluating many examples of **expressions** without us explicitly defining them. An expression is simply a combination of values, variables, and operators that Python evaluates to produce a single result. Every piece of code that produces a value is an expression.

Think of an expression as a phrase in English that describes something. In programming, an expression describes a computation that yields a value.

Here are some examples of expressions, ranging from simple to more complex:

```python
# Simple expressions
result1 = 10 + 5            # Arithmetic expression, evaluates to the integer 15
result2 = "Hello" + " World" # String concatenation expression, evaluates to the string "Hello World"
result3 = 7 > 3             # Comparison expression, evaluates to the boolean True

# More complex expressions combining different operators
x = 10
y = 5
z = 2

# This expression combines arithmetic operators
complex_calculation = (x * y) - (z ** 2) + (x / y)
print(f"Complex calculation: {complex_calculation}") # Output: Complex calculation: 48.0

# This expression combines comparison and logical operators
is_valid_user = (x > 0) and (y != 0) and (z < 10)
print(f"Is valid user? {is_valid_user}") # Output: Is valid user? True
```
In each case, Python takes the expression, performs the indicated operations, and gives you back a single, definite value. This resulting value can then be assigned to a variable, printed to the console, or used as part of an even larger expression.

<a id="concept-order-of-operations"></a>
### Operator Precedence: The Order of Operations
When you construct an expression with multiple different operators, how does Python know which operation to perform first? This is determined by **operator precedence**, which is just like the "order of operations" you learned in mathematics (remember PEMDAS/BODMAS?). Python follows a specific set of rules to evaluate expressions consistently.

Here's the general order of precedence in Python, from highest (evaluated first) to lowest (evaluated last):

1.  **Parentheses `()`:** Operations inside parentheses are always evaluated first. Use them to explicitly control the order of operations and make your code clearer.
2.  **Exponentiation `**`:** Powers are calculated next.
3.  **Multiplication `*`, Division `/`, Floor Division `//`, Modulo `%`:** These arithmetic operations are evaluated after exponentiation. If there are multiple of these in an expression, they are evaluated from **left to right**.
4.  **Addition `+`, Subtraction `-`:** These arithmetic operations are evaluated after multiplication/division. If there are multiple, they are evaluated from **left to right**.
5.  **Comparison Operators `==`, `!=`, `>`, `<`, `>=`, `<=`:** These are evaluated after all arithmetic operations.
6.  **Logical Operators `not`, `and`, `or`:** Among logical operators, `not` has the highest precedence, followed by `and`, and then `or` (lowest precedence).

Let's see how this works with some examples, breaking down the evaluation step-by-step:

```python
# Example 1: Arithmetic precedence
# Without parentheses
result_no_paren = 10 + 5 * 2
# Breakdown:
# 1. Multiplication: 5 * 2 = 10
# 2. Addition: 10 + 10 = 20
print(f"10 + 5 * 2 = {result_no_paren}") # Output: 10 + 5 * 2 = 20

# With parentheses, changing the order
result_with_paren = (10 + 5) * 2
# Breakdown:
# 1. Parentheses: (10 + 5) = 15
# 2. Multiplication: 15 * 2 = 30
print(f"(10 + 5) * 2 = {result_with_paren}") # Output: (10 + 5) * 2 = 30

# Example 2: Multiple arithmetic operators
expression_arith_comp = 5 + 2 * 3 ** 2 - 10 / 2
# Breakdown by precedence:
# 1. Exponentiation: 3 ** 2 = 9
# 2. Multiplication: 2 * 9 = 18
# 3. Division: 10 / 2 = 5.0
# 4. Addition: 5 + 18 = 23
# 5. Subtraction: 23 - 5.0 = 18.0
print(f"5 + 2 * 3 ** 2 - 10 / 2 = {expression_arith_comp}") # Output: 18.0

# Example 3: Combining comparison and logical operators
is_adult = True
has_ticket = False
age = 20
is_vip = False

can_enter_event = (age >= 18 and is_adult) or has_ticket or is_vip
# Breakdown by precedence:
# 1. Parentheses (innermost first): age >= 18 -> 20 >= 18 = True
# 2. Logical 'and': True and is_adult -> True and True = True
# 3. Logical 'or' (left to right): True or has_ticket -> True or False = True
# 4. Logical 'or' (left to right): True or is_vip -> True or False = True
print(f"Can enter event? {can_enter_event}") # Output: Can enter event? True

# Example 4: Logical 'not' precedence
is_raining = True
is_cold = False
should_bring_umbrella = is_raining and not is_cold
# Breakdown by precedence:
# 1. Logical 'not': not is_cold -> not False = True
# 2. Logical 'and': is_raining and True -> True and True = True
print(f"Should bring umbrella? {should_bring_umbrella}") # Output: Should bring umbrella? True
```

While Python's precedence rules are consistent, it's always a good practice to use parentheses, even if the default rules would lead to the same result. This makes your code much clearer for anyone reading it (including your future self!) and helps prevent potential errors.

[IMAGE_PLACEHOLDER: A pyramid diagram illustrating Python operator precedence. The top of the pyramid shows operators with the highest precedence (Parentheses), followed by Exponentiation, then Multiplication/Division/Modulo, then Addition/Subtraction, then Comparison operators, and finally Logical operators at the bottom (lowest precedence). Arrows or labels should indicate left-to-right evaluation for operators at the same level.]

## Wrap-Up
Congratulations! You've now gained a solid understanding of the fundamental building blocks of computation in Python: operators and expressions. We explored how **arithmetic operators** perform calculations, how **assignment operators** efficiently update variable values, how **comparison operators** allow your program to ask questions and get `True`/`False` answers, and how **logical operators** combine these answers into more complex conditions. Finally, we demystified **operator precedence**, learning how Python evaluates expressions with multiple operations.

These concepts are absolutely crucial for writing any meaningful program, as they empower your code to perform actions, manipulate data, and make intelligent decisions. In the next lesson, we'll build directly on this knowledge by diving into **conditional statements**, where you'll use these comparison and logical operators to control the flow of your programs, making them respond dynamically to different conditions. Get ready to make your programs truly interactive!