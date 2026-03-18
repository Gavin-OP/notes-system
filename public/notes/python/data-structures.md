# Python Data Structures

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand why data structures are essential for organizing information in Python.
- Create and manipulate lists to store ordered, changeable collections of items.
- Use tuples for storing ordered, unchangeable collections of items, understanding their key differences from lists.
- Work with dictionaries to store data as key-value pairs, allowing for efficient data retrieval.
- Utilize sets to store unique, unordered collections of items, particularly for membership testing and removing duplicates.

## Introduction
When you're building a program, you often need to store more than just a single piece of information. Imagine trying to keep track of all your favorite movies, a list of tasks for the day, or the scores in a game using only individual variables. It would quickly become messy and unmanageable!

This is precisely where **data structures** become indispensable. Data structures are specialized containers that help us organize, store, and manage collections of data in a structured and efficient way. Python, known for its readability and versatility, provides several powerful built-in data structures that simplify complex data handling.

In this lesson, we'll dive into four fundamental Python data structures: **lists**, **tuples**, **dictionaries**, and **sets**. Mastering these will significantly expand your ability to write more robust and effective Python programs, allowing you to tackle more realistic and challenging problems.

## Concept Progression

### Lists: Your Flexible Shopping Cart

Think about a shopping list. You write down items, maybe add new ones as you remember them, cross out items you've bought, and sometimes even change your mind about an item. Python's `list` is remarkably similar: it's an ordered collection of items that you can change, add to, or remove from after it's created.

**Why are lists so useful?**
Lists are your go-to choice when you need to store multiple items that maintain a specific order, and you expect this collection to change over time. Examples include a list of students in a class, a sequence of daily temperatures, or the steps in a recipe.

**How do we create and use lists?**
You create a list by placing all the items (elements) inside square brackets `[]`, separated by commas.

```python
# A list of fruits
fruits = ["apple", "banana", "cherry"]
print(fruits)
# Output: ['apple', 'banana', 'cherry']

# A list of numbers
temperatures = [25, 28, 22, 30]
print(temperatures)
# Output: [25, 28, 22, 30]

# A list can even contain different types of data
mixed_list = ["hello", 123, True, 3.14]
print(mixed_list)
# Output: ['hello', 123, True, 3.14]
```

**Accessing List Items:**
Every item in a list has an **index**, which indicates its position. Python lists are **zero-indexed**, meaning the first item is at index `0`, the second at `1`, and so on.

```python
fruits = ["apple", "banana", "cherry", "date"]

# Access the first item (at index 0)
print(fruits[0])
# Output: apple

# Access the third item (at index 2)
print(fruits[2])
# Output: cherry

# You can also use negative indices to count from the end of the list
print(fruits[-1]) # The last item
# Output: date
print(fruits[-2]) # The second to last item
# Output: cherry
```

**Modifying Lists:**
Lists are **mutable**, which means they are changeable. You can easily update an item by referring to its index, add new items, or remove existing ones.

```python
fruits = ["apple", "banana", "cherry"]
print("Original list:", fruits)

# Change an item at a specific index
fruits[1] = "orange"
print("After changing 'banana' to 'orange':", fruits)
# Output: ['apple', 'orange', 'cherry']

# Add an item to the end of the list using .append()
fruits.append("grape")
print("After appending 'grape':", fruits)
# Output: ['apple', 'orange', 'cherry', 'grape']

# Insert an item at a specific position using .insert()
fruits.insert(1, "kiwi") # Insert "kiwi" at index 1
print("After inserting 'kiwi' at index 1:", fruits)
# Output: ['apple', 'kiwi', 'orange', 'cherry', 'grape']

# Remove an item by its value using .remove()
fruits.remove("cherry")
print("After removing 'cherry':", fruits)
# Output: ['apple', 'kiwi', 'orange', 'grape']

# Remove an item by its index using .pop()
# .pop() also returns the removed item, which can be useful
popped_fruit = fruits.pop(0) # Removes and returns the item at index 0
print("After popping the first item:", fruits)
# Output: ['kiwi', 'orange', 'grape']
print("The popped fruit was:", popped_fruit)
# Output: apple
```

[IMAGE_PLACEHOLDER: A diagram illustrating a Python list. Show a horizontal row of boxes, each containing an item and labeled with its zero-based index (0, 1, 2, 3...). An arrow points from the list variable name to the first box. Show an example of changing an item at an index, and adding an item to the end.]

### Tuples: Your Unchangeable Records

While lists offer great flexibility, sometimes you need a collection of items that should *not* change once they are created. Consider a point on a map (latitude and longitude), a specific date (year, month, day), or the colors of a rainbow. For these fixed collections, Python provides **tuples**.

**Why do we need tuples?**
Tuples are ideal when you want to ensure that a collection of data remains constant throughout your program. This characteristic, called **immutability**, can make your code safer and sometimes more efficient, especially when dealing with data that should never be accidentally altered. For instance, if you're storing coordinates, you wouldn't want them to be inadvertently changed.

**How do we create and use tuples?**
You create a tuple by placing all the items inside parentheses `()`, separated by commas.

```python
# A tuple representing a point (x, y coordinates)
point = (10, 20)
print(point)
# Output: (10, 20)

# A tuple representing a date
date = (2023, 10, 26)
print(date)
# Output: (2023, 10, 26)

# IMPORTANT: A tuple with a single item needs a comma after the item!
# This tells Python it's a tuple, not just a parenthesized expression.
single_item_tuple = ("hello",)
print(single_item_tuple)
# Output: ('hello',)
print(type(single_item_tuple))
# Output: <class 'tuple'>

# Without the comma, it's just a string in parentheses
not_a_tuple = ("hello")
print(type(not_a_tuple))
# Output: <class 'str'>
```

**Accessing Tuple Items:**
Just like lists, tuple items are accessed using their zero-based index.

```python
colors = ("red", "green", "blue")

print(colors[0])
# Output: red
print(colors[2])
# Output: blue
```

**The Immutability of Tuples:**
The defining characteristic of tuples, and their key difference from lists, is that they are **immutable**. Once a tuple is created, you cannot change its individual items, add new items, or remove existing ones.

```python
point = (10, 20)
print("Original point tuple:", point)

# This line will cause an error because tuples are immutable!
# point[0] = 15 # Uncommenting this line would raise a TypeError: 'tuple' object does not support item assignment

print("Attempting to modify an item directly will fail.")

# You can, however, reassign the variable to a *new* tuple
point = (15, 25)
print("We can reassign the variable to a new tuple:", point)
# Output: (15, 25)
```
While you cannot change individual items *within* a tuple, it's important to note a subtle point: if a tuple contains mutable objects (like lists), those mutable objects *can* still be changed. The tuple itself still holds the *reference* to that mutable object, and that reference doesn't change.

```python
# A tuple containing a list (which is a mutable object)
my_tuple_with_list = (1, [2, 3], 4)
print("Original tuple with a list:", my_tuple_with_list)

# We can change the list *inside* the tuple
my_tuple_with_list[1][0] = 99
print("After modifying the list inside the tuple:", my_tuple_with_list)
# Output: (1, [99, 3], 4)

# But we still can't reassign the list itself within the tuple
# my_tuple_with_list[1] = [5, 6] # This would still be a TypeError
```

[IMAGE_PLACEHOLDER: A diagram comparing a list and a tuple. Show a list as a row of boxes with arrows indicating mutability (e.g., an item being replaced). Show a tuple as a row of boxes with a "lock" icon or a clear indication that items cannot be changed once set. Emphasize indexing for both.]

### Dictionaries: Your Smart Address Book

Imagine you have an address book. You don't look up an address by its position (like "the 5th address in the book"). Instead, you look it up by a name, like "John Doe." Python's `dictionary` works in a very similar way: it stores data in **key-value pairs**. Each `key` is unique and acts like the name in an address book, and it points to a `value`, which is the actual data you want to retrieve.

**Why do we need dictionaries?**
Dictionaries are perfect when you need to associate one piece of information (the key) with another (the value). This allows for very fast and intuitive retrieval of data. Think of a student's ID (key) linked to their name and grades (value), or a product code (key) linked to its price and description (value).

**How do we create and use dictionaries?**
You create a dictionary by placing items inside curly braces `{}`. Each item is a key-value pair, separated by a colon `:`, and the pairs themselves are separated by commas.

```python
# A dictionary storing a person's information
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(person)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York'}

# A dictionary storing product prices
product_prices = {
    "apple": 1.50,
    "banana": 0.75,
    "orange": 1.20
}
print(product_prices)
# Output: {'apple': 1.5, 'banana': 0.75, 'orange': 1.2}
```
**Important Note on Keys:** Dictionary keys must be **immutable** types (like strings, numbers, or tuples). This is because keys need to be "hashable" – their value must not change so Python can reliably find them. Mutable types (like lists or other dictionaries) cannot be used as keys. Values, however, can be of any type.

**Accessing Dictionary Items:**
You access the value associated with a key by using the key inside square brackets `[]`.

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

print("Person's name:", person["name"])
# Output: Alice
print("Person's age:", person["age"])
# Output: 30

# If you try to access a key that doesn't exist, it will cause a KeyError.
# print(person["country"]) # Uncommenting this would raise: KeyError: 'country'

# A safer way to get a value is using the .get() method.
# It returns None if the key isn't found, instead of an error.
print("Person's city (using .get()):", person.get("city"))
# Output: New York
print("Person's country (using .get()):", person.get("country"))
# Output: None

# You can also provide a default value to .get() if the key is not found
print("Person's country (with default):", person.get("country", "Unknown"))
# Output: Unknown
```

**Modifying Dictionaries:**
Dictionaries are **mutable**, meaning you can add new key-value pairs, change the value associated with an existing key, or remove pairs.

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print("Original dictionary:", person)

# Change the value of an existing key
person["age"] = 31
print("After changing age:", person)
# Output: {'name': 'Alice', 'age': 31, 'city': 'New York'}

# Add a new key-value pair
person["occupation"] = "Engineer"
print("After adding occupation:", person)
# Output: {'name': 'Alice', 'age': 31, 'city': 'New York', 'occupation': 'Engineer'}

# Remove a key-value pair using the 'del' keyword
del person["city"]
print("After deleting city:", person)
# Output: {'name': 'Alice', 'age': 31, 'occupation': 'Engineer'}

# Remove a key-value pair using .pop() (also returns the value of the removed key)
age = person.pop("age")
print("After popping age:", person)
# Output: {'name': 'Alice', 'occupation': 'Engineer'}
print("The popped age was:", age)
# Output: 31
```

[IMAGE_PLACEHOLDER: A diagram illustrating a Python dictionary. Show a collection of key-value pairs, perhaps like a set of index cards. Each card has a unique "key" on one side and its corresponding "value" on the other. Arrows show how a key maps directly to its value. Emphasize that keys are unique.]

### Sets: Your Collection of Unique Items

Imagine you have a bag full of marbles, but you only care about the *types* of marbles you have, not how many of each, or their specific order. If you have three red marbles, two blue, and one green, you just want to know you possess red, blue, and green marbles. Python's `set` is designed for exactly this purpose: it's an unordered collection of **unique** items.

**Why do we need sets?**
Sets are incredibly useful when you need to store a collection of items where duplicates are not allowed, and the order of items doesn't matter. They are excellent for quickly checking if an item is present in a collection (membership testing), or for efficiently finding and removing unique items from a larger list.

**How do we create and use sets?**
You create a set by placing all the items inside curly braces `{}`, separated by commas. However, if you want to create an *empty* set, you must use `set()`, not `{}` (because `{}` creates an empty dictionary).

```python
# A set of unique numbers (duplicates are automatically removed)
unique_numbers = {1, 2, 3, 2, 1}
print(unique_numbers)
# Output: {1, 2, 3} (the order might vary because sets are unordered)

# A set of unique fruits
fruits = {"apple", "banana", "cherry"}
print(fruits)
# Output: {'apple', 'banana', 'cherry'} (order may vary)

# Creating an empty set
empty_set = set()
print(empty_set)
# Output: set()
print(type(empty_set))
# Output: <class 'set'>
```

**Key Characteristics of Sets:**
1.  **Unordered**: Items in a set do not have a defined order. You cannot access items by index.
2.  **Unique**: Sets automatically remove duplicate items.
3.  **Mutable**: You can add or remove items from a set after it's created.
4.  **Elements must be hashable**: Like dictionary keys, items in a set must be immutable (hashable). You cannot put mutable objects like lists or dictionaries directly into a set.

**Adding and Removing Items:**
You can add items to a set using the `.add()` method and remove them using `.remove()` or `.discard()`.

```python
my_set = {"apple", "banana"}
print("Original set:", my_set)

# Add a new item
my_set.add("cherry")
print("After adding 'cherry':", my_set)
# Output: {'apple', 'banana', 'cherry'} (order may vary)

# Try to add a duplicate (it won't be added, as sets only store unique items)
my_set.add("apple")
print("After trying to add 'apple' again:", my_set)
# Output: {'apple', 'banana', 'cherry'}

# Remove an item
my_set.remove("banana")
print("After removing 'banana':", my_set)
# Output: {'apple', 'cherry'}

# .discard() is a safer way to remove an item than .remove()
# because it doesn't raise an error if the item isn't found.
my_set.discard("grape") # No error, "grape" just isn't in the set
print("After discarding 'grape' (which wasn't there):", my_set)
# Output: {'apple', 'cherry'}
# my_set.remove("grape") # Uncommenting this would raise a KeyError
```

**Useful Set Operations:**
Sets are powerful for performing mathematical set operations like union, intersection, and difference, which are common in data analysis.

```python
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}
print("Set A:", set_a)
print("Set B:", set_b)

# Union: all unique items from both sets
print("Union (A or B):", set_a.union(set_b))
# Output: {1, 2, 3, 4, 5, 6}
print("Shorthand for union (A | B):", set_a | set_b)
# Output: {1, 2, 3, 4, 5, 6}

# Intersection: items common to both sets
print("Intersection (A and B):", set_a.intersection(set_b))
# Output: {3, 4}
print("Shorthand for intersection (A & B):", set_a & set_b)
# Output: {3, 4}

# Difference: items in set_a but not in set_b
print("Difference (A - B):", set_a.difference(set_b))
# Output: {1, 2}
print("Shorthand for difference (A - B):", set_a - set_b)
# Output: {1, 2}
```

[IMAGE_PLACEHOLDER: A Venn diagram illustrating set operations. Show two overlapping circles, labeled "Set A" and "Set B". Clearly label the union (all areas), intersection (overlapping area), and differences (non-overlapping parts of each circle) with example numbers.]

## Wrap-Up
Congratulations! You've just taken a significant step in understanding how to organize and manage data in Python. We've explored four fundamental data structures, each with its unique characteristics and ideal use cases:

*   **Lists**: Your flexible, ordered, and **mutable** collections, perfect for sequences that need to change over time.
*   **Tuples**: Your reliable, ordered, and **immutable** collections, ideal for fixed records where data integrity is paramount.
*   **Dictionaries**: Your smart, unordered collections of unique **key-value pairs**, excellent for associating and quickly retrieving data by a specific label. Keys must be immutable.
*   **Sets**: Your efficient, unordered collections of **unique, hashable items**, best for membership testing and eliminating duplicates.

Choosing the right data structure for your task is a crucial skill in programming. As you continue your Python journey, you'll find yourself using these powerful building blocks constantly to create more complex, organized, and efficient programs. Keep practicing, and you'll soon be a master of Python's data structures!