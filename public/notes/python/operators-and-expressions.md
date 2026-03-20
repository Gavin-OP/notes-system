<a id="concept-operators-and-expressions"></a>
# Operators and Expressions

## Learning Objectives
By the end of this lesson, you will be able to:
- Define what an expression is in Python and identify its components.
- Use various arithmetic operators to perform calculations, including exponentiation, floor division, and modulo.
- Employ comparison operators to evaluate relationships between values and understand their Boolean results.
- Apply logical operators (`and`, `or`, `not`) to combine and modify conditional statements.
- Utilize assignment operators to efficiently update variable values.
- Understand and apply operator precedence (order of operations) to correctly evaluate complex expressions.

## Introduction
In our previous lesson, we learned how to store different types of data in [variables](../python/python-data-types-and-variables.md#concept-python-data-types-and-variables). But what's the point of having data if you can't *do* anything with it? This is where **operators** and **expressions** come into play!

Think of operators as the action verbs of programming. They tell Python what to do with your data, like adding numbers, comparing values, or assigning results. When you combine variables, values, and operators, you create **expressions** – small pieces of code that Python evaluates to produce a single result. Mastering these building blocks is crucial because they form the foundation for almost everything you'll do in programming, from simple calculations to complex decision-making. Let's dive in and see how we can make our data work for us!

## Concept Progression

<a id="concept-expression"></a>
### What is an Expression?
At its core, an **expression** in Python is any piece of code that produces a value. It's like a mathematical phrase that, when solved, gives you an answer. This answer can then be used elsewhere in your program, perhaps to be displayed, stored in another variable, or used as part of a larger expression.

Let's look at some simple examples:

```python
# A single value is an expression
5             # Evaluates to the integer 5
"Hello"       # Evaluates to the string "Hello"
True          # Evaluates to the boolean True

# A variable is an expression (it evaluates to the value it holds)
x = 10
x             # This evaluates to 10

# Combinations of values and operators are expressions
5 + 3         # Evaluates to 8
"Hello" + " World" # Evaluates to "Hello World"
x * 2         # Evaluates to 20 (since x is 10)
```

As you can see, Python takes the expression, figures out its value, and then that value becomes available for your program to use.

### Arithmetic Operators: Doing Math with Python
Now that we understand what an expression is, let's explore the tools that allow us to create them: operators! We'll start with arithmetic operators, which are probably the most familiar. They allow you to perform common mathematical calculations. Python supports all the basic ones you'd expect, plus a few special ones.

Here are the main arithmetic operators:

| Operator | Description      | Example       | Result |
| :------- | :--------------- | :------------ | :----- |
| `+`      | Addition         | `10 + 5`      | `15`   |
| `-`      | Subtraction      | `10 - 5`      | `5`    |
| `*`      | Multiplication   | `10 * 5`      | `50`   |
| `/`      | Division         | `10 / 5`      | `2.0`  |
| `**`     | Exponentiation   | `2 ** 3`      | `8`    |
| `//`     | Floor Division   | `10 // 3`     | `3`    |
| `%`      | Modulo Operation | `10 % 3`      | `1`    |

Let's see them in action with some examples:

```python
# Addition
result_add = 15 + 7
print(f"15 + 7 = {result_add}") # Output: 15 + 7 = 22

# Subtraction
result_sub = 20 - 8
print(f"20 - 8 = {result_sub}") # Output: 20 - 8 = 12

# Multiplication
result_mul = 4 * 6
print(f"4 * 6 = {result_mul}") # Output: 4 * 6 = 24

# Division (always returns a float, even if the result is a whole number)
result_div = 25 / 5
print(f"25 / 5 = {result_div}") # Output: 25 / 5 = 5.0

# Exponentiation (power operator)
# This calculates 2 raised to the power of 4 (2 * 2 * 2 * 2)
result_exp = 2 ** 4
print(f"2 ** 4 = {result_exp}") # Output: 2 ** 4 = 16

# Floor Division (integer division)
# This divides two numbers and rounds the result DOWN to the nearest whole number.
# The result will be an integer if both operands are integers, otherwise a float.
result_floor = 17 // 3
print(f"17 // 3 = {result_floor}") # Output: 17 // 3 = 5 (17 divided by 3 is 5.66..., rounded down to 5)

result_floor_float = 17.0 // 3
print(f"17.0 // 3 = {result_floor_float}") # Output: 17.0 // 3 = 5.0 (still rounded down, but result is float)

# Modulo Operation (remainder operator)
# This gives you the remainder after division.
result_mod = 17 % 3
print(f"17 % 3 = {result_mod}") # Output: 17 % 3 = 2 (because 17 = 3 * 5 + 2)
```

**Unary Operators:**
Most operators work with two values (like `10 + 5`). However, some operators only need one value to work on. These are called **unary operators**. The most common ones are `+` and `-` when used to indicate the sign of a number.

```python
positive_num = +10 # Explicitly positive
negative_num = -25 # Explicitly negative
print(f"Positive: {positive_num}, Negative: {negative_num}") # Output: Positive: 10, Negative: -25

# You can also use the unary minus to change the sign of a variable's value
temperature = 5
opposite_temperature = -temperature
print(f"Opposite temperature: {opposite_temperature}") # Output: Opposite temperature: -5
```

### Comparison Operators: Asking Questions About Values
Beyond calculations, we often need to compare values. This is where comparison operators come in handy. They allow you to evaluate relationships between two values, such as whether one is greater than another, or if they are equal. The result of a comparison is always a [Boolean value](../python/python-data-types-and-variables.md#concept-boolean-value): either `True` or `False`. These Boolean results are fundamental for making decisions in your code.

| Operator | Description              | Example       | Result |
| :------- | :----------------------- | :------------ | :----- |
| `==`     | Equal to                 | `5 == 5`      | `True` |
| `!=`     | Not equal to             | `5 != 10`     | `True` |
| `>`      | Greater than             | `10 > 5`      | `True` |
| `<`      | Less than                | `5 < 10`      | `True` |
| `>=`     | Greater than or equal to | `10 >= 10`    | `True` |
| `<=`     | Less than or equal to    | `5 <= 10`     | `True` |

Let's see some examples:

```python
age = 25
min_age = 18

print(f"Is age equal to 25? {age == 25}")       # Output: True
print(f"Is age not equal to 30? {age != 30}")     # Output: True
print(f"Is age greater than min_age? {age > min_age}") # Output: True
print(f"Is age less than 10? {age < 10}")       # Output: False
print(f"Is age greater than or equal to 18? {age >= 18}") # Output: True
print(f"Is age less than or equal to 20? {age <= 20}") # Output: False

# You can compare different data types if they are compatible
print(f"Is 'apple' == 'Apple'? {'apple' == 'Apple'}") # Output: False (Python is case-sensitive)
print(f"Is 5 == 5.0? {5 == 5.0}") # Output: True (Python compares the *value*, not just the type)
```

### Logical Operators: Combining Conditions
Often, you'll need to check more than one condition at a time. Logical operators allow you to combine multiple Boolean expressions or reverse the truth value of an expression. They are essential for building complex conditions in your programs, enabling them to make more nuanced decisions.

| Operator | Description                                | Example                               | Result |
| :------- | :----------------------------------------- | :-------------------------------------- | :----- |
| `and`    | Returns `True` if **both** statements are true | `(5 > 3) and (10 < 20)`                 | `True` |
| `or`     | Returns `True` if **at least one** statement is true | `(5 > 10) or (10 < 20)`                 | `True` |
| `not`    | Reverses the result; returns `False` if the result is true, and `True` if the result is false | `not (5 > 3)`                           | `False` |

Here's how they work:

```python
has_license = True
is_over_18 = True
has_car = False
current_age = 25 # Using a variable for age for consistency

# Using 'and': Both conditions must be True for the overall result to be True
can_drive = has_license and is_over_18
print(f"Can drive? {can_drive}") # Output: True (because both has_license and is_over_18 are True)

# Using 'or': At least one condition must be True for the overall result to be True
can_rent_car = has_license or has_car
print(f"Can rent a car? {can_rent_car}") # Output: True (because has_license is True, even though has_car is False)

# Using 'not': Reverses the truth value of an expression
is_under_18 = not is_over_18
print(f"Is under 18? {is_under_18}") # Output: False (because is_over_18 is True, so 'not True' is False)

# Combining multiple logical operators and comparison operators
# Let's check eligibility for a discount: either over 60 OR (under 12 AND doesn't have a car)
eligible_for_discount = (current_age > 60) or (current_age < 12 and not has_car)
print(f"Eligible for discount? {eligible_for_discount}")
# Breakdown:
# (25 > 60) is False
# (25 < 12) is False
# (not has_car) is not False, which is True
# So, (False and True) is False
# Finally, (False or False) is False
# Output: Eligible for discount? False
```

### Assignment Operators: Shorthand for Updating Variables
You've already used the basic assignment operator (`=`) to give a value to a variable. For example, `x = 5`. However, it's very common to update a variable's value based on its current value (e.g., `x = x + 1`). Python provides shorthand assignment operators that combine an arithmetic operation with assignment, making your code more concise and often easier to read.

| Operator | Example    | Equivalent to |
| :------- | :--------- | :------------ |
| `=`      | `x = 5`    | `x = 5`       |
| `+=`     | `x += 3`   | `x = x + 3`   |
| `-=`     | `x -= 3`   | `x = x - 3`   |
| `*=`     | `x *= 3`   | `x = x * 3`   |
| `/=`     | `x /= 3`   | `x = x / 3`   |
| `**=`    | `x **= 2`  | `x = x ** 2`  |
| `//=`    | `x //= 3`  | `x = x // 3`  |
| `%=`     | `x %= 3`   | `x = x % 3`   |

Let's see how they simplify code:

```python
score = 100
print(f"Initial score: {score}") # Output: Initial score: 100

# Add 5 to score
score += 5 # This is a shorthand for: score = score + 5
print(f"Score after += 5: {score}") # Output: Score after += 5: 105

# Subtract 10 from score
score -= 10 # Shorthand for: score = score - 10
print(f"Score after -= 10: {score}") # Output: Score after -= 10: 95

# Multiply score by 2
score *= 2 # Shorthand for: score = score * 2
print(f"Score after *= 2: {score}") # Output: Score after *= 2: 190

# Divide score by 10
score /= 10 # Shorthand for: score = score / 10
print(f"Score after /= 10: {score}") # Output: Score after /= 10: 19.0

# Raise a value to the power of 2
power_val = 3
power_val **= 2 # Shorthand for: power_val = power_val ** 2 (3 * 3)
print(f"Power value after **= 2: {power_val}") # Output: Power value after **= 2: 9
```

<a id="concept-order-of-operations"></a>
### Operator Precedence: The Order of Operations
Just like in mathematics, Python has strict rules about the order in which operations are performed within an expression. This is called **operator precedence** or the **order of operations**. If you don't understand and apply these rules, your calculations might not give you the expected results, leading to subtle bugs in your programs.

The general rule is very similar to the common mathematical acronyms like PEMDAS (Parentheses, Exponents, Multiplication and Division, Addition and Subtraction) or BODMAS (Brackets, Orders, Division and Multiplication, Addition and Subtraction):

1.  **P**arentheses `()` (or **B**rackets) - Operations inside parentheses are always evaluated first.
2.  **E**xponentiation `**` (or **O**rders) - Powers are calculated next.
3.  **M**ultiplication `*`, **D**ivision `/`, **F**loor Division `//`, **M**odulo `%` - These are evaluated from left to right.
4.  **A**ddition `+`, **S**ubtraction `-` - These are evaluated from left to right.
5.  Comparison Operators (`==`, `!=`, `>`, `<`, `>=`, `<=`)
6.  Logical Operators (`not`, `and`, `or`) - `not` has the highest precedence among logical operators, followed by `and`, then `or`.

Operators with higher precedence are evaluated before operators with lower precedence. If operators have the same precedence, Python evaluates them from left to right (this is called associativity).

Let's look at an example:

```python
result = 10 + 5 * 2
print(f"10 + 5 * 2 = {result}") # Output: 10 + 5 * 2 = 20
```
Here, multiplication (`*`) has higher precedence than addition (`+`). So, `5 * 2` is calculated first (which is `10`), and then `10 + 10` is performed, resulting in `20`.

What if we wanted the addition to happen first? That's where parentheses come in:

```python
result_with_parentheses = (10 + 5) * 2
print(f"(10 + 5) * 2 = {result_with_parentheses}") # Output: (10 + 5) * 2 = 30
```
By using parentheses, we force `10 + 5` to be calculated first (which is `15`), and then `15 * 2` is performed, resulting in `30`. Parentheses override the default precedence rules.

[IMAGE_PLACEHOLDER: A flowchart illustrating Python's operator precedence. The flowchart should show levels of precedence from highest to lowest: 1. Parentheses, 2. Exponentiation, 3. Unary Plus/Minus, 4. Multiplication/Division/Floor Division/Modulo (left-to-right), 5. Addition/Subtraction (left-to-right), 6. Comparison Operators, 7. Logical Operators (not, and, or). Arrows should indicate the flow of evaluation.]

It's always a good idea to use parentheses to make your expressions clear, even if you know the precedence rules. This makes your code easier to read, understand, and less prone to errors, especially when dealing with complex calculations.

<a id="concept-concatenated"></a>
### String and List Concatenation and Repetition
So far, we've mostly seen operators working with numbers. But operators don't just work with numerical [data types](../python/python-data-types-and-variables.md#concept-data-type)! The `+` and `*` operators, for instance, have special meanings when used with sequence data types like [strings](../python/python-data-types-and-variables.md#concept-character-string) and lists. This is an example of operator overloading, where an operator behaves differently based on the types of values it's working with.

**Concatenation (`+`):**
When used with two strings or two lists, the `+` operator performs **concatenation**. This means it joins them together to create a new, longer sequence.

```python
# String Concatenation
greeting = "Hello"
name = "Alice"
full_message = greeting + ", " + name + "!"
print(full_message) # Output: Hello, Alice!

# List Concatenation
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = list1 + list2
print(combined_list) # Output: [1, 2, 3, 4, 5, 6]
```

**Repetition (`*`):**
When the `*` operator is used with a sequence (string or list) and an [integer](../python/python-data-types-and-variables.md#concept-integer), it performs **repetition**. This creates a new sequence by repeating the original one multiple times.

```python
# String Repetition
word = "Python"
repeated_word = word * 3
print(repeated_word) # Output: PythonPythonPython

# List Repetition
numbers = [0, 1]
repeated_numbers = numbers * 4
print(repeated_numbers) # Output: [0, 1, 0, 1, 0, 1, 0, 1]
```

It's important to remember that `+` and `*` behave differently depending on the data types they are operating on. You cannot, for example, concatenate a string and an integer directly using `+`; Python would raise an error because it doesn't know how to "add" a string and a number.

## Wrap-Up
Congratulations! You've just unlocked a powerful new way to interact with data in Python. Operators are the tools that allow your programs to perform calculations, make comparisons, and combine information. Understanding expressions and the crucial role of operator precedence ensures that your code does exactly what you intend.

In the next lesson, we'll build on this foundation by exploring how to use these comparison and logical expressions to control the flow of your programs. This will allow your code to make decisions and respond dynamically to different situations, making your programs much smarter and more interactive! Get ready to make your code truly come alive.