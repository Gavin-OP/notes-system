<a id="concept-python-data-structures"></a>
# Python Data Structures

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the fundamental concept of data structures and their importance in organizing information.
- Learn to use Python's built-in `list` data structure for ordered, changeable collections.
- Differentiate between mutable and immutable data types, a crucial concept for understanding how Python handles data.
- Explore `tuple` data structures for storing ordered, unchangeable sequences of items.
- Master the use of `dictionary` data structures for storing data as key-value pairs, allowing for efficient lookups.
- Discover `set` data structures for managing unique, unordered collections of items.
- Utilize `list comprehensions` as an efficient and concise way to create lists.

## Introduction
Imagine you're planning a party. You'd likely have a guest list, a menu, a list of tasks, and perhaps even a seating chart. Each of these requires a different way to store and manage information. Some lists might change frequently (like adding a last-minute guest), while others are more fixed (like the ingredients for a specific dish).

Just like in real life, when we write computer programs, we often need to store and organize collections of related [data](../data-science/data-fundamentals-and-types.md#concept-data). This is where **data structures** become essential. Python, a highly versatile language, provides several powerful built-in data structures that allow us to organize and manage our data efficiently. Choosing the right [data structure](../python/python-data-structures.md#concept-data-structures) for a given task can make your code cleaner, faster, and much easier to understand.

In this lesson, we'll dive into Python's most common and useful built-in data structures: [lists](../data-science/programming-for-data-science-python.md#concept-data-structures-python), tuples, dictionaries, and sets. We'll explore what makes each one unique, when to use them, and how to perform basic operations. We'll also cover the important concept of mutability and a powerful technique called [list comprehensions](../python/python-data-structures.md#concept-list-comprehension).

## Concept Progression

<a id="concept-data-structures"></a>
### What are Data Structures? Organizing Your Information
At its heart, a **data structure** is simply a specialized way to organize and store data in a computer so that it can be accessed and modified efficiently. Think of them as different types of containers, each designed for a specific purpose. Just as you wouldn't store loose change in a filing cabinet or important documents in a piggy bank, you choose a data structure based on the kind of data you have and what you want to do with it.

Why do we need different ways to store data? Consider these common programming scenarios:
*   You need to keep track of a sequence of items, where the order matters, and you might want to add or remove items later (e.g., a to-do list).
*   You have a collection of items that should never change once created (e.g., the days of the week).
*   You want to store information where each piece of data has a unique label, like an address book where each name has a corresponding phone number (e.g., user profiles).
*   You need a collection of items where duplicates are not allowed, and the order doesn't matter (e.g., a list of unique tags).

Each of these scenarios calls for a different [data](../data-science/data-fundamentals-and-types.md#concept-data) structure. Python provides elegant, built-in solutions for all of them, making your programming life much easier.

[IMAGE_PLACEHOLDER: A simple diagram showing a central "Data Structures" box with arrows pointing to four distinct boxes: "Lists (Ordered, Changeable)", "Tuples (Ordered, Unchangeable)", "Dictionaries (Key-Value)", and "Sets (Unique, Unordered)". Each box could have a small icon representing its nature, e.g., a scroll for lists, a locked scroll for tuples, a phone book for dictionaries, and a collection of distinct marbles for sets. The overall style should be clean and introductory.]

<a id="concept-list-data-structure"></a>
### Lists: Ordered, Changeable Collections
Let's start with the most common and flexible [data structure](../python/python-data-structures.md#concept-data-structures) in Python: the **list**. A list is an ordered collection of items, meaning the items have a defined sequence, and you can access them by their position (index). What makes lists incredibly useful is that they are **changeable** (or *mutable*), allowing you to add, remove, or modify items *after* the list has been created.

You create a list by placing all the items (elements) inside square brackets `[]`, separated by commas.

**Intuition:** Imagine a shopping list. The order of items might matter (e.g., getting frozen items last), and you can easily add new items, cross off ones you've already bought, or even change your mind about a quantity.

```python
# Creating a list of fruits
fruits = ["apple", "banana", "cherry", "date"]
print(fruits)
# Output: ['apple', 'banana', 'cherry', 'date']

# Lists can hold different data types
mixed_list = ["hello", 123, True, 3.14]
print(mixed_list)
# Output: ['hello', 123, True, 3.14]
```

You can access individual items in a list using their **index**. Python uses zero-based indexing, meaning the first item is at index `0`, the second at `1`, and so on.

```python
# Accessing elements by positive index
print(fruits[0])  # Output: apple
print(fruits[2])  # Output: cherry

# You can also use negative indices to count from the end
print(fruits[-1]) # Output: date (the last item)
print(fruits[-2]) # Output: cherry (the second to last item)
```

Since lists are changeable, you can modify them in many ways:

```python
# Modifying an item at a specific index
fruits[1] = "blueberry"
print(fruits) # Output: ['apple', 'blueberry', 'cherry', 'date']

# Adding an item to the end of the list
fruits.append("elderberry")
print(fruits) # Output: ['apple', 'blueberry', 'cherry', 'date', 'elderberry']

# Inserting an item at a specific position (index)
fruits.insert(1, "grape") # Inserts "grape" at index 1, shifting others
print(fruits) # Output: ['apple', 'grape', 'blueberry', 'cherry', 'date', 'elderberry']

# Removing an item by its value
fruits.remove("cherry")
print(fruits) # Output: ['apple', 'grape', 'blueberry', 'date', 'elderberry']

# Removing the last item and returning it (useful for stacks)
popped_fruit = fruits.pop()
print(f"Popped fruit: {popped_fruit}") # Output: Popped fruit: elderberry
print(fruits) # Output: ['apple', 'grape', 'blueberry', 'date']
```

### Mutability vs. Immutability: The Difference Between Changeable and Unchangeable
Before we explore other data structures, it's crucial to understand the concept of **mutability** and **immutability**. This is a fundamental property that distinguishes many data types in Python and affects how you interact with them.

*   **Mutable objects** are those whose state or content *can be changed* after they are created. You can modify them "in place" without creating a new object. **Lists** are a prime example of mutable objects.
*   **Immutable objects** are those whose state or content *cannot be changed* after they are created. If you try to "modify" an immutable object, Python actually creates a *new* object with the changes. Numbers, [strings](../python/python-data-types-operators.md#concept-string-data-type), and as we'll see next, tuples, are examples of immutable objects.

Why does this distinction matter?
1.  **Predictability:** Immutable objects are safer in complex programs or when passed between different parts of your code, as you know they won't be unexpectedly altered.
2.  **Performance:** Sometimes, immutable objects can be more efficient because Python can make certain optimizations, knowing their content won't change.
3.  **Hashing:** Only immutable objects can be used as keys in dictionaries (which we'll cover soon) because their hash value (a unique identifier) must remain constant.

Let's see an example with a string (immutable) versus a list (mutable):

```python
# String (immutable)
my_string = "hello"
# If you try to change a character directly, it will cause an error:
# my_string[0] = "J" # This would cause a TypeError!

# To "change" a string, you must create a new one:
my_string = "J" + my_string[1:] # Concatenates 'J' with the rest of the string
print(my_string) # Output: Jello

# List (mutable)
my_list = [1, 2, 3]
my_list[0] = 99 # This works directly; the list itself is modified
print(my_list) # Output: [99, 2, 3]
```

<a id="concept-mutability-vs-immutability"></a>
### Tuples: Ordered, Unchangeable Collections
Now that we understand mutability, let's look at **tuples**. A tuple is an ordered collection of items, just like a list. The key difference, stemming from our previous discussion, is that tuples are **unchangeable** (or *immutable*). Once you create a tuple, you cannot add, remove, or modify its elements.

You create a tuple by placing all the items inside parentheses `()`, separated by commas.

**Intuition:** Think of a tuple as a fixed record, like the coordinates of a point on a map (latitude, longitude) or the days of the week. You wouldn't typically change these values once they're defined; if you need different coordinates, you'd define a *new* point.

```python
# Creating a tuple of coordinates
coordinates = (10.0, 20.5)
print(coordinates)
# Output: (10.0, 20.5)

# A tuple of days of the week
days_of_week = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
print(days_of_week)
# Output: ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
```

Like lists, you can access items in a tuple using indexing:

```python
# Accessing elements
print(coordinates[0]) # Output: 10.0
print(days_of_week[1]) # Output: Tue
```

However, attempting to modify a tuple will result in an error, reinforcing its immutable nature:

```python
# This will cause an error because tuples are immutable
# days_of_week[0] = "Sunday"
# print(days_of_week)
# Output: TypeError: 'tuple' object does not support item assignment
```

Tuples are often used for:
*   Representing fixed collections of related data (e.g., a record of a person's birth date).
*   Returning multiple values from a [function](../python/functions-in-python.md#concept-function) (functions often return a tuple of values).
*   Using as keys in dictionaries (because they are immutable, unlike lists).

### Dictionaries: Key-Value Pairs
Sometimes, you don't want to access items by a numerical index (like in lists or tuples), but by a descriptive name or "key." This is where **dictionaries** shine. A dictionary is an unordered collection of *key-value pairs*. Each key must be unique and immutable (like a string, number, or tuple), and it maps to a specific value.

You create a dictionary by placing items inside curly braces `{}`, with each item being a `key: value` pair, separated by commas.

**Intuition:** Imagine a physical dictionary or a phone book. You look up a word (the key) to find its definition (the value), or a person's name (the key) to find their phone number (the value). The order of entries in a phone book doesn't typically matter for finding a specific person.

```python
# Creating a dictionary for a person's information
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(person)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York'}

# Creating a dictionary for product prices
product_prices = {
    "apple": 1.50,
    "banana": 0.75,
    "cherry": 2.25
}
print(product_prices)
# Output: {'apple': 1.5, 'banana': 0.75, 'cherry': 2.25}
```

You access values in a dictionary using their corresponding keys:

```python
# Accessing values using keys
print(person["name"]) # Output: Alice
print(product_prices["banana"]) # Output: 0.75

# You can also use the .get() method, which returns None if the key doesn't exist
# (instead of raising an error)
print(person.get("occupation")) # Output: None
print(person.get("age", "Not specified")) # Output: 30 (returns default if key not found)
```

Dictionaries are mutable, so you can add, modify, or remove key-value pairs:

```python
# Adding a new key-value pair
person["occupation"] = "Engineer"
print(person)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York', 'occupation': 'Engineer'}

# Modifying an existing value
person["age"] = 31
print(person)
# Output: {'name': 'Alice', 'age': 31, 'city': 'New York', 'occupation': 'Engineer'}

# Removing a key-value pair using 'del'
del person["city"]
print(person)
# Output: {'name': 'Alice', 'age': 31, 'occupation': 'Engineer'}

# Removing a key-value pair using .pop() (returns the value)
removed_occupation = person.pop("occupation")
print(f"Removed occupation: {removed_occupation}") # Output: Removed occupation: Engineer
print(person) # Output: {'name': 'Alice', 'age': 31}
```

[IMAGE_PLACEHOLDER: A diagram illustrating a Python dictionary. Show a large curly brace `{}` containing several key-value pairs. Each pair should clearly show a "Key" (e.g., "name", "age") and an arrow pointing to its "Value" (e.g., "Alice", 30). Keys should be distinct and values can be of various types. The diagram should emphasize the mapping from key to value.]

### Sets: Unique, Unordered Collections
Finally, let's explore **sets**. A set is an unordered collection of unique items. This means two important things:
1.  **Unordered:** Items in a set do not have a defined order, so you cannot access them using indexes.
2.  **Unique:** A set cannot contain duplicate elements. If you try to add a duplicate, it will simply be ignored.

You create a set by placing items inside curly braces `{}`, separated by commas. An important note: if you want to create an *empty* set, you must use `set()` because `{}` creates an empty dictionary.

**Intuition:** Think of a guest list for an exclusive event where each person can only be on the list once. The order you write names down doesn't matter, only who is present. If someone tries to sign up twice, they're still only counted once.

```python
# Creating a set of unique numbers
unique_numbers = {1, 2, 3, 4, 5}
print(unique_numbers)
# Output: {1, 2, 3, 4, 5}

# Creating a set with some duplicate elements (duplicates are automatically removed)
colors = {"red", "blue", "green", "red", "yellow"}
print(colors) # Output: {'red', 'blue', 'green', 'yellow'} (the order might vary each time you run it)

# Creating an empty set
empty_set = set()
print(empty_set) # Output: set()
```

Since sets are unordered, you cannot access elements by index. However, you can add and remove elements, and perform powerful mathematical set operations:

```python
# Adding an element
colors.add("purple")
print(colors) # Output: {'red', 'blue', 'green', 'yellow', 'purple'} (order still varies)

# Adding an existing element has no effect (due to uniqueness)
colors.add("red")
print(colors) # Output: {'red', 'blue', 'green', 'yellow', 'purple'} (no change)

# Removing an element
colors.remove("blue")
print(colors) # Output: {'red', 'green', 'yellow', 'purple'}

# You can also perform set operations like union, intersection, difference
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

print(f"Union: {set_a.union(set_b)}")        # All unique elements from both: {1, 2, 3, 4, 5, 6}
print(f"Intersection: {set_a.intersection(set_b)}") # Common elements: {3, 4}
print(f"Difference (A - B): {set_a.difference(set_b)}")   # Elements in A but not in B: {1, 2}
print(f"Symmetric Difference: {set_a.symmetric_difference(set_b)}") # Elements in either set, but not in both: {1, 2, 5, 6}
```

Sets are particularly useful for:
*   Quickly removing duplicate items from any collection (e.g., a list).
*   Performing mathematical set operations efficiently.
*   Checking for membership efficiently (e.g., `if item in my_set:`).

<a id="concept-list-comprehension"></a>
### List Comprehensions: A Powerful Shortcut
Now that you're familiar with lists and how to manipulate them, let's look at a very Pythonic and efficient way to create them: **list comprehensions**. A list comprehension offers a concise way to create lists based on existing iterables (like other lists, tuples, or ranges). It's essentially a single line of code that can do the work of a `for` loop and `append()` method, often making your code more readable and sometimes more performant.

**Why use them?** They allow you to express complex list creation logic in a compact and elegant way, which is a hallmark of Pythonic code.

**Intuition:** Imagine you have a list of numbers, and you want to quickly create a new list where each number is doubled. Instead of writing a multi-line loop, a list comprehension lets you express this idea in one compact line, almost like a mathematical set builder notation.

The basic syntax for a list comprehension is:
`new_list = [expression for item in iterable if condition]`

Let's see it in action, comparing it to the traditional loop approach:

```python
# Traditional way to create a list of squares
squares_traditional = []
for i in range(5):
    squares_traditional.append(i * i)
print(f"Traditional squares: {squares_traditional}") # Output: Traditional squares: [0, 1, 4, 9, 16]

# Using a list comprehension for the same task
squares_comprehension = [i * i for i in range(5)]
print(f"Comprehension squares: {squares_comprehension}") # Output: Comprehension squares: [0, 1, 4, 9, 16]
```

You can also include a conditional statement (`if`) to filter elements, making them even more powerful:

```python
# Get only even numbers from a list
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [num for num in numbers if num % 2 == 0]
print(f"Even numbers: {even_numbers}") # Output: Even numbers: [2, 4, 6, 8, 10]

# Convert a list of strings to uppercase, but only for words longer than 5 characters
words = ["apple", "banana", "cherry", "date", "elderberry"]
long_uppercase_words = [word.upper() for word in words if len(word) > 5]
print(f"Long uppercase words: {long_uppercase_words}") # Output: Long uppercase words: ['BANANA', 'CHERRY', 'ELDERBERRY']
```

List comprehensions are a powerful and widely used feature in Python for writing cleaner, more efficient, and more expressive code, especially when dealing with list manipulation and generation.

## Wrap-Up
Congratulations! You've now explored Python's core built-in data structures: lists, tuples, dictionaries, and sets. Each serves a unique purpose, offering different ways to organize and interact with your data.

Here's a quick recap of their key characteristics:
*   **Lists:** Ordered, changeable, allows duplicates. Great for general-purpose collections.
*   **Tuples:** Ordered, *unchangeable*, allows duplicates. Ideal for fixed collections or records.
*   **Dictionaries:** Unordered (conceptually), changeable, stores key-value pairs, keys must be unique and immutable. Perfect for mapping unique identifiers to values.
*   **Sets:** Unordered, changeable, stores *unique* items. Excellent for membership testing and mathematical set operations.

Understanding their characteristics – especially the distinction between mutable and immutable types – is key to writing effective and robust Python programs. You also learned about list comprehensions, a powerful and concise way to build lists.

As you continue your Python journey, you'll find yourself reaching for these data structures constantly. The next crucial step is to practice using them in various scenarios to solidify your understanding and build your programming intuition. Experiment with creating, modifying, and querying these structures to truly master them!