# Python for Loops and range()

- slug: python-for-loops
- prerequisites: python-variables, python-conditionals
- difficulty: 2/5
- estimated_time_minutes: 30
- tags: python, loops

## Learning Objectives
- Iterate over lists and strings with for loops
- Use range() for counted loops
- Combine loops and conditionals for filtering tasks

## Core Explanation
Python's 'for' loop is a fundamental tool for iterating over sequences, such as lists and strings, executing a block of code for each item. It's also versatile and works with other iterable objects like tuples, dictionaries, and sets. The 'range()' function is frequently used with 'for' loops to generate a sequence of numbers, useful for repeating actions a specific number of times or accessing elements by index. 'range(stop)' generates numbers from 0 up to (but not including) 'stop'. 'range(start, stop)' generates numbers from 'start' up to (but not including) 'stop'. Combining 'for' loops with 'if' statements enables powerful data processing, such as filtering items based on conditions.

## Worked Examples
- numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num * 2)

This loop prints each number in the 'numbers' list, multiplied by 2. Output: 2, 4, 6, 8, 10.
- word = "hello"
for char in word:
    print(char.upper())

This loop goes through each character in 'hello' and prints its uppercase version. Output: H, E, L, L, O.
- for i in range(3):
    print("Python is fun!")

This loop runs 3 times (for i=0, 1, 2), printing the message each time. Output: Python is fun! (x3).
- data = [10, 7, 22, 5, 18]
even_numbers = []
for x in data:
    if x % 2 == 0:
        even_numbers.append(x)
print(even_numbers)

This code iterates through 'data' and adds only the even numbers to 'even_numbers'. Output: [10, 22, 18].

## Common Pitfalls
- Forgetting to indent the code block inside the loop. Python uses indentation to define code blocks.
- Modifying the list you are iterating over directly. This can lead to unexpected behavior or skipped items.
- Off-by-one errors with 'range()', especially when using 'range(stop)' which excludes the 'stop' value.
- Confusing 'for' loops with 'while' loops; 'for' is for iterating over sequences, 'while' for conditional repetition.

## Quick Check Quiz
1. What will this code print?
for i in range(2):
    print("Loop")
  - 0. Loop
  - 1. Loop
Loop
  - 2. Error
  - 3. Nothing
  - Answer: 1
  - Why: `range(2)` generates 0, 1. The loop runs twice, printing "Loop" each time.

2. How do you iterate through a list called `items`?
  - 0. `for item in items:`
  - 1. `while item in items:`
  - 2. `loop items:`
  - 3. `iterate items:`
  - Answer: 0
  - Why: The `for item in iterable:` syntax is the correct way to iterate over lists.

3. What is the last number printed by `for x in range(1, 5): print(x)`?
  - 0. 1
  - 1. 4
  - 2. 5
  - 3. 0
  - Answer: 1
  - Why: `range(1, 5)` generates 1, 2, 3, 4. The `stop` value (5) is excluded.

4. Which code snippet correctly prints only numbers greater than 10 from `nums = [5, 12, 8, 15]`?
  - 0. `for n in nums:
    if n > 10:
        print(n)`
  - 1. `if n > 10:
    for n in nums:
        print(n)`
  - 2. `for n in nums and n > 10:
    print(n)`
  - 3. `for n in nums:
    print(n > 10)`
  - Answer: 0
  - Why: The `if` statement correctly filters elements inside the loop.

## Practice Tasks
- Create a list of names and print each name with a greeting, e.g., 'Hello, Alice!'.
- Write a loop that prints all odd numbers from 1 to 10 using `range()` and an `if` condition.
- Calculate the sum of all numbers in a given list using a `for` loop.
- Count how many times the letter 'a' appears in a string.
