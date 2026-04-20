<a id="concept-lists-and-tuples"></a>
# Python Data Structures: Lists and Tuples

## Learning Objectives
- Define data structures and understand their role in organizing data in Python.
- Understand Python lists as ordered, mutable sequences and perform common operations like creation, indexing, slicing, and modification.
- Understand Python tuples as ordered, immutable sequences and perform common operations like creation, indexing, and slicing.
- Differentiate between lists and tuples based on their mutability and identify appropriate use cases for each.

## Introduction
Imagine you're trying to keep track of your favorite books, the daily temperatures for a week, or the ingredients for a recipe. If you had to store each piece of information in a separate variable, your code would quickly become messy and hard to manage. This is where **[data structures](../python/python-data-structures-mappings-and-sets.md#concept-data-structures)** come in!

In programming, a data structure is essentially a way to organize and store data so that it can be accessed and modified efficiently. Think of it like different types of containers in your kitchen: you might use a jar for spices, a box for cereal, or a basket for fruit. Each container is designed to hold certain types of items and allows you to interact with them in specific ways.

In Python, two fundamental data structures for organizing collections of items are **lists** and **tuples**. They both allow you to store multiple items in a single variable, but they have a key difference that makes them suitable for different situations. Let's dive in and explore how to use these powerful tools!

## Concept Progression

<a id="concept-data-structures"></a>
### What are Data Structures?
At its core, a **data structure** is a specialized format for organizing and storing data. It's not just about holding information, but about holding it in a way that makes sense for the operations you want to perform.

Why do we need them?
-   **Organization:** They help keep related data together, making your code cleaner and easier to understand.
-   **Efficiency:** Different data structures are optimized for different tasks. For example, some are great for quickly finding an item, while others are better for adding or removing items frequently.
-   **Problem Solving:** Many real-world problems involve collections of data, and choosing the right data structure can make solving these problems much simpler.

Consider a simple example: storing the names of students in a class.
Without a data structure, you might do this:

```python
student1 = "Alice"
student2 = "Bob"
student3 = "Charlie"
# ... and so on for 30 students!
```

This quickly becomes unmanageable. A data structure allows you to group these names together:

```python
students = ["Alice", "Bob", "Charlie"]
```

Now, `students` is a single variable holding all the names, making it much easier to work with. Lists and tuples are two types of "sequence" [data structures](../python/python-data-structures-mappings-and-sets.md#concept-data-structures), meaning they store items in a specific order. Now that we understand the general idea of data structures, let's explore two of Python's most common and useful sequence data structures: lists and tuples.

### Python Lists: Your Flexible Containers

A **Python [list](../python/python-data-structures-sequences.md#concept-list)** is an ordered collection of items that is **mutable**.
-   **Ordered:** The items in a list have a defined order, and this order will not change unless you explicitly modify it. This means you can access items by their position.
-   **Mutable:** You can change, add, or remove items from a list after it has been created. This flexibility makes lists incredibly versatile for many programming tasks.

Think of a list like a shopping list you write on a piece of paper. You can add new items, cross out items you've bought, or even change your mind about an item's quantity.

#### Creating Lists
You can create a list by placing all the items (elements) inside square brackets `[]`, separated by commas. Lists can hold items of different [data types](../data-science/python-fundamentals.md#concept-data-types).

```python
# A list of strings
fruits = ["apple", "banana", "cherry", "date"]

# A list of numbers
lottery_numbers = [12, 45, 33, 7, 89]

# A list with mixed data types
mixed_list = ["hello", 10, True, 3.14]

# An empty list
empty_list = []

print(fruits)
print(lottery_numbers)
print(mixed_list)
print(empty_list)
```

<a id="concept-sequence-indexing"></a>
#### Accessing Elements: Indexing
Since lists are ordered, each item has a specific position, or **index**. In Python, [indexing](../python/python-data-structures-sequences.md#concept-array-index) starts from `0` for the first item. You can access individual items using their index inside square brackets.

```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])  # Output: apple (the first item)
print(fruits[2])  # Output: cherry (the third item)
```

Python also supports **negative indexing**, where `-1` refers to the last item, `-2` to the second to last, and so on.

```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[-1]) # Output: date (the last item)
print(fruits[-3]) # Output: banana (the second item from the end)
```

[IMAGE_PLACEHOLDER: A diagram showing a Python list `["apple", "banana", "cherry", "date"]`. Above each element, its positive index (0, 1, 2, 3) is clearly labeled. Below each element, its negative index (-4, -3, -2, -1) is clearly labeled. Arrows point from the indices to their corresponding elements.]

<a id="concept-sequence-slicing"></a>
#### Accessing Elements: Slicing
**Slicing** allows you to extract a portion (a "slice") of a list. You specify a `start` index and an `end` index, separated by a colon `[:]`. The slice will include items from the `start` index up to, but *not including*, the `end` index.

The general syntax is `list[start:end:step]`.

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Get items from index 2 up to (but not including) index 5
print(numbers[2:5]) # Output: [2, 3, 4]

# Get items from the beginning up to (but not including) index 3
print(numbers[:3])  # Output: [0, 1, 2]

# Get items from index 7 to the end
print(numbers[7:])  # Output: [7, 8, 9]

# Get a copy of the entire list
print(numbers[:])   # Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Use a step value: get every second item from index 1 to 7
print(numbers[1:8:2]) # Output: [1, 3, 5, 7]

# Reverse the list using a negative step
print(numbers[::-1]) # Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

[IMAGE_PLACEHOLDER: A diagram illustrating list slicing. Show a list `my_list = [10, 20, 30, 40, 50, 60]`. Demonstrate `my_list[1:4]` with arrows pointing to elements 20, 30, 40, and a clear indication that index 4 (element 50) is excluded. Label indices 0-5 above the elements.]

#### Modifying Lists (Mutability in Action)
Since lists are mutable, you can change their contents after creation.

**1. Changing an item:** Assign a new value to an item at a specific index.

```python
my_list = ["apple", "banana", "cherry"]
my_list[1] = "blueberry"
print(my_list) # Output: ['apple', 'blueberry', 'cherry']
```

**2. Adding items:**
   - `append(item)`: Adds an item to the end of the list.
   - `insert(index, item)`: Inserts an item at a specified index.
   - `extend(another_list)`: Appends all items from another iterable (like another list) to the current list.

```python
my_list = ["apple", "banana", "cherry"]

my_list.append("date")
print(my_list) # Output: ['apple', 'banana', 'cherry', 'date']

my_list.insert(1, "grape")
print(my_list) # Output: ['apple', 'grape', 'banana', 'cherry', 'date']

new_fruits = ["kiwi", "lemon"]
my_list.extend(new_fruits)
print(my_list) # Output: ['apple', 'grape', 'banana', 'cherry', 'date', 'kiwi', 'lemon']
```

**3. Removing items:**
   - `remove(item)`: Removes the first occurrence of a specified item.
   - `pop(index)`: Removes and returns the item at a specified index. If no index is given, it removes and returns the last item.
   - `del list[index]` or `del list[start:end]`: Deletes item(s) at a specific index or slice.
   - `clear()`: Removes all items from the list.

```python
my_list = ['apple', 'grape', 'banana', 'cherry', 'date', 'kiwi', 'lemon']

my_list.remove("banana")
print(my_list) # Output: ['apple', 'grape', 'cherry', 'date', 'kiwi', 'lemon']

popped_fruit = my_list.pop(0) # Remove 'apple'
print(popped_fruit) # Output: apple
print(my_list)      # Output: ['grape', 'cherry', 'date', 'kiwi', 'lemon']

del my_list[1:3] # Delete 'cherry' and 'date'
print(my_list)   # Output: ['grape', 'kiwi', 'lemon']

my_list.clear()
print(my_list)   # Output: []
```

#### Iterating through Lists
You can easily loop through the items in a list using a `for` loop. This is very common when you need to process each item in a collection.

```python
fruits = ["apple", "banana", "cherry"]

print("My favorite fruits are:")
for fruit in fruits:
    print(fruit)
```

Output:
```
My favorite fruits are:
apple
banana
cherry
```

### Python Tuples: Your Unchangeable Records

While lists offer incredible flexibility because they are mutable, there are many situations where you want to ensure that a collection of data remains constant once it's created. This is where **Python tuples** come in.

A Python tuple is an ordered collection of items that is **immutable**.
-   **Ordered:** Just like lists, items in a tuple have a defined order and can be accessed by index.
-   **Immutable:** This is the key difference! Once a tuple is created, you cannot change, add, or remove any of its items. Its contents are fixed.

Think of a tuple like a birth certificate or a fixed address. The information on it (name, date of birth, location) is set once and cannot be altered. If you need to "change" it, you'd have to create an entirely new record.

#### Creating Tuples
You create a tuple by placing items inside parentheses `()`, separated by commas.

```python
# A tuple of strings
rgb_color = ("red", "green", "blue")

# A tuple of numbers (e.g., geographical coordinates)
coordinates = (40.7128, -74.0060)

# A tuple with mixed data types
person_info = ("Alice", 30, "New York")

# An empty tuple
empty_tuple = ()

print(rgb_color)
print(coordinates)
print(person_info)
print(empty_tuple)
```

**Important Note for Single-Item Tuples:**
If you want to create a tuple with only one item, you must include a comma after the item, otherwise Python will treat it as a regular value in parentheses.

```python
not_a_tuple = ("hello") # This is just a string
print(type(not_a_tuple)) # Output: <class 'str'>

is_a_tuple = ("hello",) # This is a tuple
print(type(is_a_tuple))  # Output: <class 'tuple'>
```

#### Accessing Elements (Indexing and Slicing)
Just like lists, tuples are ordered sequences, so you can access their elements using **indexing** and **slicing** in the exact same way.

```python
my_tuple = ("alpha", "beta", "gamma", "delta", "epsilon")

# Indexing
print(my_tuple[0])  # Output: alpha
print(my_tuple[-2]) # Output: delta

# Slicing
print(my_tuple[1:4]) # Output: ('beta', 'gamma', 'delta')
print(my_tuple[:3])  # Output: ('alpha', 'beta', 'gamma')
```

#### Immutability in Action
Because tuples are immutable, any attempt to change their contents will result in a `TypeError`.

```python
my_tuple = ("apple", "banana", "cherry")

# Attempting to change an item will cause an error
# my_tuple[1] = "blueberry" # This line would raise a TypeError!
# print(my_tuple)

# Attempting to add an item will cause an error
# my_tuple.append("date") # This line would raise an AttributeError!

# Attempting to remove an item will cause an error
# my_tuple.remove("banana") # This line would raise an AttributeError!
```
If you need to "modify" a tuple, you typically create a new tuple based on the original, with the desired changes.

```python
original_tuple = (1, 2, 3)
# To "change" 2 to 5, we create a new tuple
new_tuple = (original_tuple[0], 5, original_tuple[2])
print(new_tuple) # Output: (1, 5, 3)
```

#### Why Use Tuples?
You might wonder why we'd use tuples if they're so restrictive. Their immutability offers several advantages:
-   **Data Integrity:** They are ideal for data that should not change, ensuring its integrity.
-   **Performance:** Tuples are generally faster than lists for [iteration](../python/loops.md#concept-iteration) and access, especially for large collections, because their size is fixed.
-   **Dictionary Keys:** Because they are immutable, tuples can be used as keys in dictionaries, which lists cannot.
-   **[Function](../python/functions-in-python.md#concept-function) Arguments:** Tuples are often used to return multiple values from a function.

### Lists vs. Tuples: Choosing the Right Tool

The main difference between lists and tuples boils down to **mutability**. Here's a quick summary to help you decide which one to use:

| Feature      | Lists (`[]`)                               | Tuples (`()`)                                  |
| :----------- | :----------------------------------------- | :--------------------------------------------- |
| **Mutability** | **Mutable** (can be changed)               | **Immutable** (cannot be changed)              |
| **Syntax**   | Square brackets `[]`                       | Parentheses `()`                               |
| **Use Cases**| Collections that might change: shopping cart, list of tasks, game scores, dynamic data. | Fixed collections: geographical coordinates, RGB color codes, database records, configuration settings, returning multiple values from a function. |
| **Performance**| Slightly slower for some operations due to overhead for mutability. | Generally faster for access and iteration due to fixed size. |
| **Memory**   | May consume slightly more memory.          | May consume slightly less memory.              |

**When to use a List:**
-   You have a collection of items that needs to be modified (added, removed, or changed) frequently.
-   You need to store a sequence of items where the order matters, and the items themselves might change.
-   Example: A list of users currently logged into a system, which will change as users log in and out.

**When to use a Tuple:**
-   You have a collection of items that should remain constant throughout the program's execution.
-   You need to represent a fixed record or a set of related values that logically belong together and shouldn't be altered.
-   Example: The dimensions of an image `(width, height)` or a date `(year, month, day)`.

```python
# Example of when to use a list
shopping_list = ["milk", "eggs", "bread"]
shopping_list.append("cheese") # We can add items
print(shopping_list) # Output: ['milk', 'eggs', 'bread', 'cheese']

# Example of when to use a tuple
user_id = (101, "john_doe", "active") # User ID, username, status - fixed record
# user_id[0] = 102 # This would cause a TypeError!
print(user_id) # Output: (101, 'john_doe', 'active')
```

## Wrap-Up
In this lesson, you've learned about two fundamental Python data structures: lists and tuples. You now understand that both are ordered sequences, but lists are **mutable** (changeable) while tuples are **immutable** (unchangeable). You've also practiced creating them, accessing their elements using indexing and slicing, and performing various operations.

Choosing between a list and a tuple depends on whether the collection of data needs to be modified after its creation. Lists offer flexibility, while tuples provide data integrity and sometimes better performance for fixed data. As you continue your Python journey, you'll find yourself using these data structures constantly to organize and manipulate information effectively. Next, we'll explore other ways to store and manage data in Python!