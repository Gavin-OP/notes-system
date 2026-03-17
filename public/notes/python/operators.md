# Operators in Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Identify and use various types of operators in Python, including arithmetic, assignment, comparison, and logical operators.
- Understand the difference between value equality (`==`) and object identity (`is`).
- Check for the presence of an element within a sequence using membership operators (`in`, `not in`).
- Write simple Python expressions that combine different operators to perform calculations and make decisions.

## Introduction
Imagine your programming journey as building something complex, like a house. You have raw materials (data and variables), but you also need tools to shape, connect, and manipulate them. In Python, **operators** are precisely these tools. They are special symbols or keywords that perform specific operations on values and variables.

Why are operators so crucial? Because programming isn't just about storing information; it's about *acting* on that information. Whether you need to add numbers, compare two pieces of data, update a variable's value, or check if certain conditions are met, operators are the fundamental building blocks that make these actions possible. They empower your programs to calculate, make decisions, and interact with data, truly bringing your code to life.

Let's dive in and explore the essential operators that will empower you to write more dynamic and interactive Python programs!

## Concept Progression

### Arithmetic Operators: Your Basic Math Tools
Just like you learned addition, subtraction, multiplication, and division in school, Python provides operators for these fundamental mathematical operations. These are known as **arithmetic operators**. They take numerical values (or variables holding numbers) and return a new numerical value as a result.

Let's look at the most common ones:

| Operator | Description        | Example      | Result |
| :------- | :----------------- | :----------- | :----- |
| `+`      | Addition           | `5 + 3`      | `8`    |
| `-`      | Subtraction        | `10 - 4`     | `6`    |
| `*`      | Multiplication     | `6 * 2`      | `12`   |
| `/`      | Division           | `10 / 2`     | `5.0`  |
| `//`     | Floor Division     | `10 // 3`    | `3`    |
| `%`      | Modulo (Remainder) | `10 % 3`     | `1`    |
| `**`     | Exponentiation     | `2 ** 3`     | `8`    |

Let's see these operators in action with some Python code:

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

# Division (Note: always returns a float, even if the result is a whole number)
result_div = 10 / 2
print(f"10 / 2 = {result_div}") # Output: 10 / 2 = 5.0

# Floor Division (discards the fractional part, effectively rounding down for positive numbers)
result_floor_div = 10 // 3
print(f"10 // 3 = {result_floor_div}") # Output: 10 // 3 = 3

# Modulo (gives the remainder of a division)
result_modulo = 10 % 3
print(f"10 % 3 = {result_modulo}") # Output: 10 % 3 = 1

# Exponentiation (raises a number to a power)
result_exp = 2 ** 4 # 2 to the power of 4 (2*2*2*2)
print(f"2 ** 4 = {result_exp}") # Output: 2 ** 4 = 16
```

**Why `//` (Floor Division) and `%` (Modulo) are particularly useful:**
-   `//` (Floor Division) is handy when you only care about how many whole times one number fits into another. For example, calculating how many full packs of 12 eggs you can make from 38 eggs would be `38 // 12`, which gives `3` packs.
-   `%` (Modulo) is perfect for finding out what's left over after a division. Using the egg example, `38 % 12` would tell you there are `2` eggs left over. It's also frequently used to check if a number is even or odd (a number `% 2` will be `0` if even, `1` if odd).

### Assignment Operators: Giving Values to Variables
Now that you can perform calculations, how do you store and efficiently update those results? You've already encountered the most basic assignment operator: the equals sign (`=`). This operator assigns the value on its right to the variable on its left.

```python
my_number = 10 # Assigns the value 10 to the variable my_number
```

But what if you want to update a variable's value based on its *current* value? For instance, if you want to add 5 to `my_number`, you could write:

```python
my_number = my_number + 5
print(my_number) # Output: 15
```

Python offers a more concise shorthand for this common operation, known as **compound assignment operators**. These operators combine an arithmetic operation with an assignment.

| Operator | Example      | Equivalent to      |
| :------- | :----------- | :----------------- |
| `+=`     | `x += 5`     | `x = x + 5`        |
| `-=`     | `x -= 3`     | `x = x - 3`        |
| `*=`     | `x *= 2`     | `x = x * 2`        |
| `/=`     | `x /= 4`     | `x = x / 4`        |
| `//=`    | `x //= 2`    | `x = x // 2`       |
| `%=`     | `x %= 3`     | `x = x % 3`        |
| `**=`    | `x **= 2`    | `x = x ** 2`       |

Let's see these in action, updating a `score` variable:

```python
score = 100
print(f"Initial score: {score}") # Output: Initial score: 100

# Add 20 to score
score += 20 # This is equivalent to: score = score + 20
print(f"Score after bonus: {score}") # Output: Score after bonus: 120

# Halve the score
score /= 2 # This is equivalent to: score = score / 2
print(f"Score after penalty: {score}") # Output: Score after penalty: 60.0

# Double the score
score *= 2 # This is equivalent to: score = score * 2
print(f"Score after doubling: {score}") # Output: Score after doubling: 120.0
```
These compound assignment operators make your code more compact and often clearer when you're modifying a variable's value in place.

### Comparison Operators: Asking Questions About Values
Once you have values stored in variables, you'll often need to ask questions about them. For example, "Is this value greater than that one?" or "Are these two values the same?" This is where **comparison operators** come in. They compare two values and always return a `boolean` value: either `True` or `False`. These operators are absolutely crucial for making decisions in your programs, a concept we'll explore further in a later lesson on [control-flow](../python/conditional-statements.md).

| Operator | Description                     | Example        | Result |
| :------- | :------------------------------ | :------------- | :----- |
| `==`     | Equal to                        | `5 == 5`       | `True` |
| `!=`     | Not equal to                    | `5 != 3`       | `True` |
| `>`      | Greater than                    | `10 > 7`       | `True` |
| `<`      | Less than                       | `4 < 9`        | `True` |
| `>=`     | Greater than or equal to        | `8 >= 8`       | `True` |
| `<=`     | Less than or equal to           | `6 <= 10`      | `True` |

Let's try some comparisons:

```python
age = 25
min_age_for_license = 18

# Is age equal to 25?
is_twenty_five = (age == 25)
print(f"Is age 25? {is_twenty_five}") # Output: Is age 25? True

# Is age less than min_age_for_license?
is_too_young = (age < min_age_for_license)
print(f"Is age less than {min_age_for_license}? {is_too_young}") # Output: Is age less than 18? False

# Is age greater than or equal to min_age_for_license?
can_get_license = (age >= min_age_for_license)
print(f"Can get license? {can_get_license}") # Output: Can get license? True

# Comparison also works for strings (case-sensitive!)
name1 = "Alice"
name2 = "alice"
are_names_equal = (name1 == name2)
print(f"Are '{name1}' and '{name2}' equal? {are_names_equal}") # Output: Are 'Alice' and 'alice' equal? False
```
It's important to note that `==` checks for *value equality*. It asks, "Do these two things hold the same value?" Keep this in mind as we move to the next type of comparison.

### Logical Operators: Combining Conditions
Sometimes, a single comparison isn't enough. What if you need to check multiple conditions at once? For example, "Is the user logged in *AND* is their subscription active?" Or "Is it raining *OR* is it snowing?" This is where **logical operators** come in. They combine boolean values (`True` or `False`) and return a new boolean value, allowing you to build complex decision-making logic.

Python has three logical operators: `and`, `or`, and `not`.

1.  **`and` operator:** Returns `True` if *both* conditions it connects are `True`. If even one condition is `False`, the entire expression becomes `False`.
    ```python
    is_logged_in = True
    has_active_subscription = False

    can_access_premium = is_logged_in and has_active_subscription
    print(f"Can access premium? {can_access_premium}") # Output: Can access premium? False
    ```
    (Here, `is_logged_in` is `True`, but `has_active_subscription` is `False`, so `True and False` results in `False`).

2.  **`or` operator:** Returns `True` if *at least one* of the conditions it connects is `True`. It only returns `False` if *both* conditions are `False`.
    ```python
    has_coupon = True
    is_first_time_customer = False

    gets_discount = has_coupon or is_first_time_customer
    print(f"Gets discount? {gets_discount}") # Output: Gets discount? True
    ```
    (Here, `has_coupon` is `True`, so `True or False` results in `True`).

3.  **`not` operator:** Reverses the boolean value of a single condition. If a condition is `True`, `not` makes it `False`, and vice-versa.
    ```python
    is_raining = True
    should_take_umbrella = not is_raining # Reverses the value of is_raining
    print(f"Should take umbrella? {should_take_umbrella}") # Output: Should take umbrella? False
    ```
    (Since `is_raining` is `True`, `not True` becomes `False`).

You can combine these operators to create very sophisticated conditions:

```python
temperature = 28
is_sunny = True
is_weekend = False

# Is it hot AND sunny AND not the weekend?
go_to_beach = (temperature > 25 and is_sunny) and (not is_weekend)
print(f"Go to beach? {go_to_beach}") # Output: Go to beach? True
```

### Identity Operators: Are They the *Same* Object?
While comparison operators like `==` are excellent for checking if two variables hold the same *value*, Python offers a more specific way to compare if two variables are literally the *same object* in the computer's memory. This is the job of **identity operators** (`is` and `is not`).

Think of it like this: two identical twins might have the same name and look exactly alike (same value), but they are still two distinct people (different objects). Similarly, two variables can hold identical values but refer to entirely separate objects in memory.

-   `is`: Returns `True` if both variables point to the exact same object in memory.
-   `is not`: Returns `True` if both variables do *not* point to the same object in memory.

This distinction is particularly important when dealing with mutable objects like [lists](/note/python/lists.md), which can be changed after they are created.

```python
a = [1, 2, 3] # Creates a list object
b = [1, 2, 3] # Creates a *new* list object, even if content is identical
c = a         # 'c' now refers to the *exact same* list object that 'a' refers to

print(f"a == b: {a == b}")     # Output: a == b: True (Values are equal)
print(f"a is b: {a is b}")     # Output: a is b: False (They are different list objects in memory)

print(f"a == c: {a == c}")     # Output: a == c: True (Values are equal)
print(f"a is c: {a is c}")     # Output: a is c: True (They are the *same* list object in memory)

# Let's visualize this:
[IMAGE_PLACEHOLDER: A diagram showing three boxes representing memory locations. Box 1 contains list [1, 2, 3] and has an arrow from variable 'a' pointing to it. Box 2 contains list [1, 2, 3] and has an arrow from variable 'b' pointing to it. A second arrow from variable 'c' also points to Box 1, illustrating that 'a' and 'c' reference the same object, while 'b' references a different object with the same content. Labels for 'a', 'b', 'c' and their respective memory addresses/objects.]
```

For simple immutable types like numbers and strings, Python often optimizes by making variables with the same value point to the same object (especially for small integers or short, interned strings). However, relying on `is` for value comparison is generally discouraged; always use `==` for that. Use `is` when you specifically need to check if two variables are the *exact same instance* of an object.

### Membership Operators: Checking for Presence
Beyond comparing values or objects, you'll often need to check if a particular item exists *within* a collection of items. Have you ever needed to see if a specific name is in a list of users, or if a character is part of a string? **Membership operators** (`in` and `not in`) allow you to do just that. They are used to test if a sequence (like a string, list, or tuple) contains a certain value.

-   `in`: Returns `True` if the value is found anywhere within the sequence.
-   `not in`: Returns `True` if the value is *not* found within the sequence.

```python
fruits = ["apple", "banana", "cherry"]
my_fruit = "banana"
other_fruit = "grape"

# Is 'banana' in the fruits list?
is_banana_present = my_fruit in fruits
print(f"Is '{my_fruit}' in fruits? {is_banana_present}") # Output: Is 'banana' in fruits? True

# Is 'grape' not in the fruits list?
is_grape_absent = other_fruit not in fruits
print(f"Is '{other_fruit}' not in fruits? {is_grape_absent}") # Output: Is 'grape' not in fruits? True

# Membership also works for checking substrings within strings
message = "Hello, Python!"
is_hello_in_message = "Hello" in message
print(f"Is 'Hello' in message? {is_hello_in_message}") # Output: Is 'Hello' in message? True

is_world_in_message = "World" in message
print(f"Is 'World' in message? {is_world_in_message}") # Output: Is 'World' in message? False
```
Membership operators are incredibly useful for searching, validating data, and controlling program flow based on the contents of collections.

## Wrap-Up
Congratulations! You've now explored the essential "tools" in Python's operator toolbox. We've covered:
-   **Arithmetic operators** for performing calculations.
-   **Assignment operators** for efficiently updating variables.
-   **Comparison operators** for asking questions about values, returning `True` or `False`.
-   **Logical operators** for combining multiple conditions.
-   **Identity operators** for checking if variables refer to the *exact same object* in memory.
-   **Membership operators** for checking if an item exists within a sequence.

Understanding operators is fundamental because they are the verbs of your Python programs, allowing you to perform actions and make decisions. As you move forward, you'll find yourself using these operators constantly to build more complex and intelligent applications. In the next lesson, we'll see how these comparison and logical operators become the backbone for [control-flow](../python/conditional-statements.md), enabling your programs to make choices and execute different code paths based on conditions.