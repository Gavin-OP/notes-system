# Operators in Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand what operators are and why they are fundamental in Python programming.
- Identify and use various arithmetic operators to perform mathematical calculations.
- Apply assignment operators to efficiently store and update variable values.
- Utilize comparison operators to evaluate relationships between values and produce Boolean results.
- Combine conditions using logical operators (`and`, `or`, `not`) to control program flow.
- Differentiate between identity (`is`, `is not`) and membership (`in`, `not in`) operators and know when to use them.

## Introduction
Imagine you're building with LEGOs. You have different types of bricks (your data), but you also need tools to connect them, separate them, or check if they fit together. In Python, variables hold your data, and **operators** are your essential tools! They allow you to perform actions on data, combine values, make decisions, and much more.

Without operators, your Python programs would just be static collections of information. Operators bring your data to life, enabling calculations, comparisons, and complex logic that make programs useful and interactive. In this lesson, we'll explore the most common types of operators, starting with the ones you might already be familiar with from math class, and then moving on to more Python-specific tools.

## Concept Progression

### What are Operators? The "Action" Words of Python

At its core, an operator is a special symbol or keyword that tells Python to perform a specific operation on one or more values. These values are called **operands**.

Consider a simple mathematical expression: `2 + 3`.
Here, `2` and `3` are the **operands** (the values being acted upon), and `+` is the **operator** (the action being performed). The operator `+` tells Python to *add* the two operands together.

Python has many different types of operators, each designed for a specific purpose. We'll break them down into categories, making it easier to understand their roles and when to use them.

### Arithmetic Operators: Your Basic Math Toolkit

Arithmetic operators are used to perform common mathematical calculations. You've likely encountered most of these in everyday math!

| Operator | Description                  | Example        | Result |
| :------- | :--------------------------- | :------------- | :----- |
| `+`      | Addition                     | `5 + 2`        | `7`    |
| `-`      | Subtraction                  | `5 - 2`        | `3`    |
| `*`      | Multiplication               | `5 * 2`        | `10`   |
| `/`      | Division (always float)      | `5 / 2`        | `2.5`  |
| `%`      | Modulus (Remainder of division)| `5 % 2`        | `1`    |
| `**`     | Exponentiation (Power)       | `5 ** 2`       | `25`   |
| `//`     | Floor Division (Integer division)| `5 // 2`       | `2`    |

Let's see these operators in action with some Python code:

```python
# Addition: Combining quantities
total_apples = 10 + 5
print(f"Total apples: {total_apples}") # Output: Total apples: 15

# Subtraction: Finding the difference
remaining_cookies = 20 - 7
print(f"Remaining cookies: {remaining_cookies}") # Output: Remaining cookies: 13

# Multiplication: Repeating a quantity
cost_per_item = 2.5
number_of_items = 4
total_cost = cost_per_item * number_of_items
print(f"Total cost: ${total_cost}") # Output: Total cost: $10.0

# Division: Splitting into equal parts. Note: It always returns a floating-point number.
average_score = 95 / 2
print(f"Average score: {average_score}") # Output: Average score: 47.5

# Modulus (%): Finding the remainder after division.
# This is super useful for tasks like checking if a number is even (number % 2 == 0).
remainder = 10 % 3 # 10 divided by 3 is 3 with a remainder of 1
print(f"Remainder of 10 divided by 3: {remainder}") # Output: Remainder of 1

# Exponentiation (**): Raising a number to a power.
power_result = 2 ** 3 # This means 2 * 2 * 2
print(f"2 to the power of 3: {power_result}") # Output: 8

# Floor Division (//): Divides two numbers and rounds the result *down* to the nearest whole number.
# For positive numbers, it effectively discards the fractional part.
floor_result = 10 // 3 # 10 divided by 3 is 3.33..., floor division rounds down to 3
print(f"Floor division of 10 by 3: {floor_result}") # Output: 3

# A quick note on Floor Division with negative numbers:
# For negative results, floor division rounds towards negative infinity.
# For example, -10 // 3 results in -4 (not -3), because -4 is the next whole number down from -3.33...
# For this lesson, we'll primarily focus on positive examples for clarity.
```

### Assignment Operators: Shortcutting Variable Updates

You've already used the most fundamental assignment operator: `=`. It takes the value on its right and stores it in the variable on its left.

```python
my_age = 30 # The '=' assigns the value 30 to the variable my_age
```

But what if you want to update a variable based on its *current* value? For instance, if you want to increase `my_age` by 5?

You could write it out like this:
```python
my_age = 30
my_age = my_age + 5 # Take the current value of my_age (30), add 5, then assign the new result (35) back to my_age
print(my_age) # Output: 35
```

Python offers **compound assignment operators** as a convenient and more concise shortcut for these common update tasks. They perform an arithmetic operation and then assign the result back to the original variable.

| Operator | Example        | Equivalent To      |
| :------- | :------------- | :----------------- |
| `+=`     | `x += 5`       | `x = x + 5`        |
| `-=`     | `x -= 3`       | `x = x - 3`        |
| `*=`     | `x *= 2`       | `x = x * 2`        |
| `/=`     | `x /= 4`       | `x = x / 4`        |
| `%=`     | `x %= 2`       | `x = x % 2`        |
| `**=`    | `x **= 3`      | `x = x ** 3`       |
| `//=`    | `x //= 2`      | `x = x // 2`       |

Let's see how much cleaner our `my_age` example becomes using a compound assignment operator:

```python
my_age = 30
my_age += 5 # This is a shorthand for my_age = my_age + 5
print(f"My age after update: {my_age}") # Output: My age after update: 35

score = 100
score -= 10 # This is a shorthand for score = score - 10
print(f"Score after penalty: {score}") # Output: Score after penalty: 90

price = 15.0
price *= 1.05 # This is a shorthand for price = price * 1.05 (e.g., adding 5% tax)
print(f"Price with tax: {price}") # Output: Price with tax: 15.75
```
These operators make your code more concise and often easier to read when you're updating a variable based on its own value.

### Comparison Operators: Asking "Is This True or False?"

Comparison operators are used to compare two values. The outcome of any comparison operation is always a **Boolean** value: either `True` or `False`. These operators are fundamental for making decisions and controlling the flow of your programs.

| Operator | Description                     | Example        | Result |
| :------- | :------------------------------ | :------------- | :----- |
| `==`     | Equal to                        | `5 == 5`       | `True` |
| `!=`     | Not equal to                    | `5 != 3`       | `True` |
| `>`      | Greater than                    | `5 > 3`        | `True` |
| `<`      | Less than                       | `5 < 3`        | `False`|
| `>=`     | Greater than or equal to        | `5 >= 5`       | `True` |
| `<=`     | Less than or equal to           | `5 <= 3`       | `False`|

Let's look at some practical examples:

```python
temperature = 25
is_hot = temperature > 30 # Is 25 greater than 30? False.
print(f"Is it hot? {is_hot}") # Output: Is it hot? False

user_name = "Alice"
is_admin = (user_name == "Admin") # Is "Alice" equal to "Admin"? False.
print(f"Is the user an admin? {is_admin}") # Output: Is the user an admin? False

password_correct = (1234 != 5678) # Is 1234 not equal to 5678? True.
print(f"Is the password incorrect? {password_correct}") # Output: Is the password incorrect? True

age = 18
can_vote = (age >= 18) # Is 18 greater than or equal to 18? True.
print(f"Can this person vote? {can_vote}") # Output: Can this person vote? True

# Important distinction: '==' vs '='
# A common mistake for beginners is to use a single '=' (assignment) when they mean '==' (comparison).
# Remember:
#   `=` assigns a value (e.g., `x = 10`)
#   `==` checks if two values are equal (e.g., `x == 10` returns True or False)
# Python will raise an error if you try to use `=` in a comparison context like `if x = 10:`.
```
Comparison operators are the building blocks for conditional statements (like `if` statements), allowing your program to take different actions based on whether a condition is true or false. But what if you need to check *multiple* conditions at once? That's where logical operators come in.

### Logical Operators: Combining Conditions

Sometimes, a single comparison isn't enough. You might need to check if several conditions are true, or if at least one of several conditions is true. This is where **logical operators** become indispensable. They combine Boolean values (`True` or `False`) and return a single Boolean result.

The three primary logical operators in Python are `and`, `or`, and `not`.

1.  **`and` operator**: Returns `True` if *both* conditions it connects are `True`. If even one condition is `False`, the entire expression becomes `False`.
    *   **Analogy**: Think of it like: "Is it sunny *and* is it warm?" Both statements must be true for you to answer "Yes, it's sunny and warm."

    ```python
    is_sunny = True
    is_warm = True
    go_to_beach = is_sunny and is_warm # Both are True, so the result is True
    print(f"Go to beach? {go_to_beach}") # Output: Go to beach? True

    is_raining = True
    stay_inside = is_sunny and is_raining # Sunny is True, but Raining is True. Can't be both!
    print(f"Stay inside? {stay_inside}") # Output: Stay inside? False (because one condition is effectively false in context)
    ```

2.  **`or` operator**: Returns `True` if *at least one* of the conditions it connects is `True`. It only returns `False` if *both* conditions are `False`.
    *   **Analogy**: Think of it like: "Do you want coffee *or* tea?" If you want either one (or both!), the answer is "Yes." You only say "No" if you want neither.

    ```python
    has_ticket = True
    has_id = False
    can_enter = has_ticket or has_id # You only need one to enter (assuming this rule)
    print(f"Can enter? {can_enter}") # Output: Can enter? True (because has_ticket is True)

    is_tired = False
    is_bored = False
    take_a_nap = is_tired or is_bored # Neither is True, so the result is False
    print(f"Take a nap? {take_a_nap}") # Output: Take a nap? False
    ```

3.  **`not` operator**: Reverses the Boolean value of a single condition. If a condition is `True`, `not` makes it `False`, and vice-versa.
    *   **Analogy**: Think of it like: "Is it *not* cold?" If it *is* cold, then "not cold" is false. If it's *not* cold, then "not cold" is true.

    ```python
    is_weekend = False
    is_weekday = not is_weekend # Reverses False to True
    print(f"Is it a weekday? {is_weekday}") # Output: Is it a weekday? True

    is_hungry = True
    not_hungry = not is_hungry # Reverses True to False
    print(f"Not hungry? {not_hungry}") # Output: Not hungry? False
    ```

[IMAGE_PLACEHOLDER: A truth table diagram showing the inputs and outputs for 'and', 'or', and 'not' logical operators. The table should have columns for 'Condition A', 'Condition B', 'A and B', 'A or B', and 'not A'. Rows should cover all combinations of True/False for A and B.]

### Identity Operators: Are They the *Same* Object?

Identity operators (`is` and `is not`) are a bit more nuanced than comparison operators. While `==` checks if two variables have the *same value*, `is` checks if two variables refer to the *exact same object in memory*.

Think of it this way:
*   `==` asks: "Do these two people have the same name?" (Comparing values)
*   `is` asks: "Are these two variables pointing to the *same person*?" (Comparing object identity, i.e., are they literally the same entity in the computer's memory?)

Let's illustrate this crucial difference:

```python
list1 = [1, 2, 3]
list2 = [1, 2, 3] # This creates a *new* list object with the same values
list3 = list1     # This makes list3 point to the *exact same* list object as list1

print(f"list1 == list2: {list1 == list2}") # Output: True (Their values/contents are the same)
print(f"list1 is list2: {list1 is list2}") # Output: False (They are two separate list objects in memory, even if their contents are identical)

print(f"list1 == list3: {list1 == list3}") # Output: True (Their values/contents are the same)
print(f"list1 is list3: {list1 is list3}") # Output: True (They are the exact same object in memory)

# Python's Optimization for Immutable Types:
# For certain immutable types like small integers (typically -5 to 256) and short string literals,
# Python often optimizes by reusing (interning) objects to save memory.
# This means 'is' *might* return True for identical values in these specific cases.
a = 5
b = 5
print(f"a is b: {a is b}") # Output: True (Python often reuses small integer objects)

c = "hello"
d = "hello"
print(f"c is d: {c is d}") # Output: True (Python often reuses identical string literals)

# However, for mutable objects like lists, or for objects created dynamically (even strings that aren't simple literals),
# this optimization generally does not apply, and distinct objects will have distinct identities.
g = [1000]
h = [1000]
print(f"g is h: {g is h}") # Output: False (Lists are mutable, so they are distinct objects unless explicitly assigned to the same reference)
```

[IMAGE_PLACEHOLDER: A diagram illustrating memory addresses. Two variables, 'list1' and 'list2', both point to separate memory locations containing `[1, 2, 3]`. A third variable, 'list3', points to the *same* memory location as 'list1'. This visually explains why `list1 is list2` is False, but `list1 is list3` is True.]

Use `is` when you specifically need to check if two variables refer to the *exact same instance* of an object in memory, not just if they happen to hold the same value. This is particularly important when dealing with mutable objects where changes to one reference would affect the other if they were the same object.

### Membership Operators: Checking for Presence

Membership operators (`in` and `not in`) are used to test if a specific value is present within a sequence (like a string, list, or tuple) or a collection (like a set or dictionary keys). They also return a Boolean (`True` or `False`).

1.  **`in` operator**: Returns `True` if the specified value is found anywhere within the sequence.

    ```python
    my_fruits = ["apple", "banana", "cherry"]
    print(f"'banana' in my_fruits: {'banana' in my_fruits}") # Output: True
    print(f"'grape' in my_fruits: {'grape' in my_fruits}")   # Output: False

    message = "Hello, world!"
    print(f"'world' in message: {'world' in message}")     # Output: True (checks for substring)
    print(f"'python' in message: {'python' in message}")   # Output: False
    ```

2.  **`not in` operator**: Returns `True` if the specified value is *not* found within the sequence. It's simply the inverse of `in`.

    ```python
    my_numbers = (10, 20, 30) # This is a tuple
    print(f"50 not in my_numbers: {50 not in my_numbers}") # Output: True (50 is indeed not in the tuple)
    print(f"20 not in my_numbers: {20 not in my_numbers}") # Output: False (20 *is* in the tuple)

    sentence = "Python is fun"
    print(f"'boring' not in sentence: {'boring' not in sentence}") # Output: True
    ```
Membership operators are incredibly useful for searching, validating data, and controlling program flow based on the contents of collections.

## Wrap-Up

Congratulations! You've now taken a significant step in understanding how to make your Python programs dynamic and interactive. Operators are the verbs of your code, allowing you to perform calculations, compare values, combine conditions, and check for object identity or membership. Mastering them is key to writing effective and intelligent programs.

We covered:
*   **Arithmetic operators** (`+`, `-`, `*`, `/`, `%`, `**`, `//`) for basic mathematical operations.
*   **Assignment operators** (`+=`, `-=`, `*=`, etc.) for efficient variable updates.
*   **Comparison operators** (`==`, `!=`, `>`, `<`, `>=`, `<=`) for making `True`/`False` evaluations between values.
*   **Logical operators** (`and`, `or`, `not`) for combining and negating Boolean conditions.
*   **Identity operators** (`is`, `is not`) for checking if two variables refer to the *exact same object* in memory.
*   **Membership operators** (`in`, `not in`) for checking if a value exists within a sequence or collection.

In upcoming lessons, you'll see how these operators are put to work in control flow statements (like `if/else` conditions and loops) to build programs that can make decisions and repeat actions. Keep practicing with these examples, and soon, using operators will feel like second nature!