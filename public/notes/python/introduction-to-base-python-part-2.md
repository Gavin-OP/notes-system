# Introduction to base python (part-2)

- slug: introduction-to-base-python-part-2
- prerequisites: introduction-to-base-python-part-1
- difficulty: 2/5
- estimated_time_minutes: 150
- tags: python, control-flow, functions, file-io, algorithms

## Learning Objectives
- Translate simple problem ideas into pseudocode and executable Python steps
- Apply conditionals, loops, and functions to structure program flow
- Handle basic file input and output reliably

## Core Explanation
Building on Python fundamentals, this module introduces algorithmic thinking, guiding you to translate problem ideas into logical pseudocode and then into executable Python steps. You'll master controlling program flow using conditional statements (`if/else`) for decision-making and both `for` and `while` loops for efficient repetition. We'll then explore functions to organize code into reusable blocks, understanding how to define them, pass arguments, and return values. Finally, you'll gain practical skills in handling basic file input and output, enabling your programs to interact with external files for reading and writing data. This comprehensive knowledge is crucial for writing structured, efficient, and robust Python applications.

## Worked Examples
- Determine if a number is even or odd using an `if/else` statement. This demonstrates basic decision-making logic.
`num = 10
if num % 2 == 0:
    print('Even')
else:
    print('Odd')`
- Use a `for` loop to iterate and sum numbers from 1 to 5. `for` loops are essential for iterating over sequences.
`total = 0
for i in range(1, 6):
    total += i
print(total)`
- Use a `while` loop to count down from 5 to 1. `while` loops are useful for repetition based on a condition.
`count = 5
while count > 0:
    print(count)
    count -= 1
print('Blast off!')`
- Define a function `greet` that takes a name and returns a greeting. Functions encapsulate reusable code.
`def greet(name):
    return f'Hello, {name}!'
print(greet('Alice'))`
- Write text to 'my_file.txt' and then read its content back. File I/O allows programs to interact with the file system.
`with open('my_file.txt', 'w') as f:
    f.write('Hello, File!')
with open('my_file.txt', 'r') as f:
    content = f.read()
print(content)`

## Common Pitfalls
- Incorrect indentation in Python leads to `IndentationError`.
- Forgetting `return` in functions; functions without `return` implicitly return `None`.
- Not closing files or using `with` statement, risking data loss or resource leaks.
- Infinite loops due to incorrect loop conditions or missing increment/decrement.

## Practice Tasks
- Write a program that checks if a given year is a leap year.
- Create a function that calculates the factorial of a number.
- Use a loop to print the first 10 numbers of the Fibonacci sequence.
- Write a program to count lines in a text file.
