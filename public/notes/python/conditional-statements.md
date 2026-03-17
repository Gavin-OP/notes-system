# Conditional Statements (if, elif, else)

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the fundamental role of conditional statements in making programs dynamic.
- Write basic `if` statements to execute specific code blocks only when a condition is met.
- Utilize `else` statements to define an alternative action when an `if` condition is false.
- Implement `elif` statements to handle multiple, distinct conditions in a sequential manner.
- Combine conditional statements with logical [operators](/note/python/operators.md) (`and`, `or`, `not`) to create more sophisticated decision-making logic.

## Introduction: Making Decisions in Your Code

Think about how you make decisions every day:
*   "**If** it's raining, I'll take an umbrella. **Otherwise**, I'll leave it at home."
*   "**If** I'm hungry, I'll eat a snack. **Else if** I'm thirsty, I'll drink water. **Otherwise**, I'll just relax."

These are examples of **conditional logic** – actions that depend on whether certain conditions are true or false. Just like us, computer programs often need to make decisions and choose different paths based on various inputs or states.

Imagine a simple program that always does the exact same thing, step by step, every single time. It would be very limited! To create programs that are dynamic, responsive, and truly useful, we need them to "think" and adapt. This is precisely what **conditional statements** allow us to do. They are the core mechanism that enables your code to move beyond a fixed sequence of instructions and respond intelligently to different situations.

Let's explore how Python empowers your programs to make these crucial choices.

## Concept Progression

### The `if` Statement: Your First Decision Point

**Why do we need it?**
Sometimes, a particular block of code should only execute if a specific condition is met. For instance, you might want to:
*   Display a "Welcome back!" message *only if* a user is logged in.
*   Apply a discount *only if* a customer's total purchase exceeds a certain amount.

The `if` statement is your fundamental tool for implementing this "do this, *if* that" logic.

**How it works:**
The `if` statement evaluates a condition. If this condition is `True`, the code indented directly below the `if` statement (known as the `if` block) is executed. If the condition is `False`, that entire indented block of code is skipped, and the program continues from the first line after the `if` block.

You can visualize this like a gatekeeper: if you know the secret password (the condition is `True`), the gate opens, and you can proceed. If not (the condition is `False`), the gate remains closed, and you go around it.

Let's see this in action:

```python
temperature = 25

# Check if the temperature is greater than 20
if temperature > 20:
    print("It's a warm day!")
    print("Consider wearing light clothes.") # This line is part of the 'if' block

print("Enjoy your day!") # This line runs regardless of the 'if' condition
```

In this example:
1.  We set `temperature` to `25`.
2.  The condition `temperature > 20` (which is `25 > 20`) evaluates to `True`.
3.  Because the condition is `True`, the indented lines within the `if` block are executed:
    *   `print("It's a warm day!")`
    *   `print("Consider wearing light clothes.")`
4.  Finally, the line `print("Enjoy your day!")` is executed, as it's outside the `if` block.

**What happens if the condition is `False`?**

```python
temperature = 15

# Check if the temperature is greater than 20
if temperature > 20:
    print("It's a warm day!") # This line will be skipped
    print("Consider wearing light clothes.") # This line will be skipped

print("Enjoy your day!")
```
Here, `15 > 20` is `False`. Therefore, the entire indented `if` block is skipped, and only `print("Enjoy your day!")` is executed.

**Key takeaway:** Indentation is absolutely critical in Python! It's how Python knows which lines of code belong to the `if` statement's block. Incorrect indentation will lead to errors or unexpected program behavior.

*(Imagine a simple flowchart here: Start -> Is Condition True? -> If Yes, Execute Block -> Continue. If No, Skip Block -> Continue.)*

### The `else` Statement: Providing an Alternative Path

**Why do we need it?**
Often, we don't just want to do something *if* a condition is true; we also want to do something *different* if it's false. This is the "otherwise" part of our daily decisions. For example, "If it's raining, take an umbrella. *Otherwise* (if it's not raining), leave it at home." The `else` statement provides this essential alternative path.

**How it works:**
The `else` statement always pairs with an `if` statement. If the `if` condition evaluates to `True`, its block runs, and the `else` block is completely ignored. If the `if` condition evaluates to `False`, its block is skipped, and the `else` block (the alternative) is executed instead. An `if-else` structure guarantees that exactly one of the two code blocks will always run.

Let's enhance our temperature example:

```python
temperature = 18

# Check if it's a warm day
if temperature > 20:
    print("It's a warm day!")
    print("Consider wearing light clothes.")
else: # This block runs if the 'if' condition (temperature > 20) is False
    print("It's a bit chilly.")
    print("You might need a jacket.")

print("Have a great day!")
```

In this scenario:
1.  `temperature > 20` (18 > 20) is `False`.
2.  The `if` block is skipped.
3.  The `else` block is executed, printing:
    *   "It's a bit chilly."
    *   "You might need a jacket."
4.  Finally, "Have a great day!" is printed.

**What if the `if` condition was `True`?**

```python
temperature = 22

if temperature > 20:
    print("It's a warm day!") # This block runs
else:
    print("It's a bit chilly.") # This block is skipped

print("Have a great day!")
```
Here, `22 > 20` is `True`, so the `if` block runs, and the `else` block is skipped.

**Key takeaway:** An `if-else` structure ensures that your program always takes one of two distinct paths, covering both possibilities for a single condition.

*(Imagine a flowchart here: Start -> Is Condition True? -> If Yes, Execute If-Block -> Continue. If No, Execute Else-Block -> Continue.)*

### The `elif` Statement: Handling Multiple Possibilities

**Why do we need it?**
What if you have more than just two outcomes? For example, you might want to give different advice based on whether it's hot, warm, cool, or cold. This is where `if` and `else` alone aren't enough. The `elif` (short for "else if") statement allows you to check multiple conditions in a sequence.

**How it works:**
An `elif` statement is placed between an `if` and an optional `else`. Python checks the `if` condition first. If it's `False`, it then moves to the first `elif` condition. If that's also `False`, it moves to the next `elif`, and so on.

The crucial point is that Python stops at the *first* condition that evaluates to `True`. Once a condition is met and its corresponding block of code is executed, all subsequent `elif` and `else` blocks in that chain are skipped. If all `if` and `elif` conditions are `False`, the final `else` block (if present) is executed as a catch-all.

You can include as many `elif` statements as your logic requires.

Let's refine our weather advice with multiple conditions:

```python
temperature = 10

# Check temperature ranges
if temperature >= 25:
    print("It's scorching hot! Time for the beach.")
elif temperature >= 15: # Checked only if the first 'if' was False
    print("It's warm and pleasant.")
elif temperature >= 5:  # Checked only if the previous 'if' and 'elif' were False
    print("It's a bit cool. Grab a light jacket.")
else: # This block runs only if ALL preceding conditions were False
    print("Brrr! It's cold. Bundle up!")

print("Weather report complete.")
```

Let's trace the execution with `temperature = 10`:
1.  The `if` condition `temperature >= 25` (10 >= 25) is `False`.
2.  Python moves to the first `elif`. The condition `temperature >= 15` (10 >= 15) is `False`.
3.  Python moves to the second `elif`. The condition `temperature >= 5` (10 >= 5) is `True`.
4.  The code inside this `elif` block is executed: `print("It's a bit cool. Grab a light jacket.")`.
5.  Since a `True` condition was found and its block executed, all subsequent `elif` and the `else` blocks are skipped.
6.  Finally, `print("Weather report complete.")` is executed.

**Key takeaway:** An `if-elif-else` chain allows you to handle multiple distinct scenarios, ensuring that at most one block of code will execute. The order of your `elif` statements is important because Python stops at the first `True` condition it encounters.

*(Imagine a flowchart here: Start -> Is Condition 1 True? -> If Yes, Execute Block 1 -> Continue. If No, Is Condition 2 True? -> If Yes, Execute Block 2 -> Continue. If No, Is Condition 3 True? -> If Yes, Execute Block 3 -> Continue. If No, Execute Else-Block -> Continue.)*

### Combining Conditions with Logical Operators (`and`, `or`, `not`)

**Why do we need it?**
Often, a decision isn't based on just one simple condition, but on a combination of factors. For example:
*   "If it's raining *and* it's cold, then stay inside."
*   "If you have a coupon *or* it's a sale day, you get a discount."

Python's [operators#logical-operators](../python/operators-logical-operators.md) (`and`, `or`, `not`) allow you to combine multiple conditions into a single, more powerful expression.

**How they work:**
*   **`and`**: The combined condition is `True` only if *both* individual conditions are `True`. If even one is `False`, the entire `and` condition is `False`.
*   **`or`**: The combined condition is `True` if *at least one* of the individual conditions is `True`. It's only `False` if *both* conditions are `False`.
*   **`not`**: This operator reverses the truth value of a condition. If a condition is `True`, `not` makes it `False`, and vice-versa.

Let's see these in action:

```python
is_sunny = True
temperature = 28
has_umbrella = False
is_weekend = True

if is_sunny and temperature > 25 and is_weekend:
    print("Perfect weekend weather for outdoor activities!")
elif not is_sunny and has_umbrella:
    print("It's not sunny, but at least you have an umbrella!")
elif not is_sunny and temperature < 10:
    print("It's cold and gloomy. Stay indoors!")
else:
    print("Just a regular day, or maybe not ideal for specific plans.")
```

In this example:
1.  The first `if` condition `is_sunny and temperature > 25 and is_weekend` evaluates to `True and True and True`, which results in `True`.
2.  Therefore, "Perfect weekend weather for outdoor activities!" is printed.
3.  The rest of the `elif` and `else` blocks are skipped.

Consider another scenario using `or`:

```python
age = 17
has_parental_consent = True

if age >= 18 or has_parental_consent:
    print("You are allowed to enter the event.")
else:
    print("Sorry, you cannot enter the event.")
```
Here, `age >= 18` is `False` (since 17 is not >= 18). However, `has_parental_consent` is `True`. Because it's an `or` condition, `False or True` evaluates to `True`, and the message "You are allowed to enter the event." is printed.

Logical [operators](/note/python/operators.md) are incredibly powerful for building precise and flexible conditions.

### Nested Conditionals: Decisions within Decisions

**Why do we need it?**
Sometimes, after making one decision, you need to make *another* decision that depends on the outcome of the first. For example: "If you're going to the park, *then* if it's sunny, bring a frisbee; *else if* it's cloudy, bring a book." This layering of decisions is called **nesting** conditional statements.

**How it works:**
You simply place an entire `if-elif-else` structure inside another `if`, `elif`, or `else` block. The key to understanding and writing nested conditionals is to pay very close attention to **indentation**. Indentation clearly defines which inner block belongs to which outer condition.

```python
weather = "rainy"
mood = "happy"
has_umbrella = True

if weather == "rainy":
    print("It's raining!")
    # This is a nested 'if' statement, only checked if weather is rainy
    if has_umbrella:
        print("Great, you have an umbrella!")
        # This is a further nested 'if', only checked if weather is rainy AND you have an umbrella
        if mood == "happy":
            print("You can still enjoy your walk!")
        else:
            print("Maybe a hot drink will cheer you up indoors.")
    else: # This 'else' belongs to 'if has_umbrella'
        print("Oh no, you forgot your umbrella! Stay inside.")
elif weather == "sunny": # This 'elif' is at the same level as the first 'if'
    print("It's sunny! Enjoy the outdoors.")
else: # This 'else' is at the same level as the first 'if'
    print("The weather is unpredictable today.")
```

Let's trace the execution with the given values:
1.  The outer `if weather == "rainy"` is `True`.
2.  "It's raining!" is printed.
3.  Now, the *nested* `if has_umbrella:` is checked. `has_umbrella` is `True`.
4.  "Great, you have an umbrella!" is printed.
5.  The *next* nested `if mood == "happy":` is checked. `mood == "happy"` is `True`.
6.  "You can still enjoy your walk!" is printed.
7.  Since the initial `if weather == "rainy"` was true, the outer `elif` and `else` blocks are completely skipped.

Nested conditionals allow for very complex and detailed [decision trees](/note/data_science/supervised-learning-classification.md) in your programs. Just remember to keep your indentation clean and consistent to avoid confusion and errors!

## Wrap-Up

Congratulations! You've now mastered conditional statements (`if`, `elif`, `else`), which are fundamental for creating programs that can make decisions and respond dynamically to different situations. You've learned how to:
*   Use `if` for basic "do this, if that" choices.
*   Employ `else` to provide an alternative path when the `if` condition is false.
*   Implement `elif` to handle multiple distinct possibilities in a clear, sequential manner.
*   Combine conditions using logical [operators](/note/python/operators.md) (`and`, `or`, `not`) for more sophisticated logic.
*   Structure decisions within decisions using nested conditionals.

By applying these concepts, you can build truly intelligent and interactive Python applications. In the next lesson, we'll explore how to repeat actions efficiently using [loops](/note/python/loops.md), which often work hand-in-hand with conditional statements to create even more powerful and automated programs.