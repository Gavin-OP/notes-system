# Data Structure: Dictionaries

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what a dictionary is and why it's a powerful data structure.
- Create dictionaries to store information using key-value pairs.
- Access, add, modify, and remove data from dictionaries using their unique keys.
- Utilize common dictionary methods to work with keys, values, and items.

## Introduction
Imagine you have a list of your friends' names, and you also want to store their phone numbers. If you put names in one list and numbers in another, how do you know which number belongs to which friend? You'd have to remember that the friend at `index 0` in the name list corresponds to the number at `index 0` in the phone number list. While this works, it's not very intuitive or robust, especially as your lists grow or change.

What if you could simply say, "Give me John's phone number," and get it directly, without worrying about his position in a list? This is exactly what dictionaries allow us to do! Dictionaries are like real-world dictionaries or phone books: you look up a specific *word* (or name) to find its *definition* (or number). In programming, we call these "keys" and "values."

Dictionaries are incredibly useful when you need to store data that has a natural label or identifier, rather than just an ordered position. They provide a flexible and efficient way to organize information. Let's dive in and see how they work!

## Concept Progression

### The Idea Behind Dictionaries: Key-Value Pairs
Think about a physical dictionary. You don't look up a word by its page number (like an index in a list). Instead, you look up the word itself, and it points you directly to its definition.

In Python, a dictionary works similarly. It stores information in **key-value pairs**.
-   The **key** is like the word you look up – it's a unique identifier for a piece of information.
-   The **value** is like the definition – it's the actual data associated with that key.

Why is this structure so useful? Because it allows you to retrieve information directly by its name or label, rather than its numerical position. This makes your code much more readable, intuitive, and less prone to errors when the order of items might change.

Let's revisit our phone book analogy:
-   **Key**: A friend's name (e.g., "Alice", "Bob", "Charlie")
-   **Value**: Their phone number (e.g., "555-1234", "555-5678", "555-9012")

[IMAGE_PLACEHOLDER: A simple diagram illustrating a phone book. On the left, a column labeled "Name (Key)" with entries like "Alice", "Bob", "Charlie". On the right, a column labeled "Phone Number (Value)" with corresponding numbers. An arrow points from "Alice" to "555-1234", showing the key-value relationship. The overall style should be clean and easy to understand for beginners.]

### Creating Your First Dictionary
Creating a dictionary in Python is straightforward. You use curly braces `{}` to define a dictionary, and inside, you list your key-value pairs. Each key is separated from its value by a colon (`:`), and each key-value pair is separated by a comma.

Here's how you'd create our phone book:

```python
# Creating a dictionary for a simple phone book
phone_book = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Charlie": "555-9012"
}

print(phone_book)
```

**What you'll see:**
```
{'Alice': '555-1234', 'Bob': '555-5678', 'Charlie': '555-9012'}
```

**Important Rules for Keys:**
1.  **Unique**: Every key within a single dictionary must be unique. You can't have two "Alice" entries with different phone numbers in the same dictionary. If you try to add a key that already exists, it will simply update the value for that existing key.
2.  **Immutable**: Keys must be of an "immutable" type. This means their value cannot be changed after they are created. Common immutable types that work well as keys include strings (like "Alice"), numbers (integers, floats), and tuples. Lists, for example, cannot be used as keys because they are mutable (you can change their contents). For now, just remember that strings and numbers are perfectly fine for keys.

Now that we know how to create a dictionary, let's learn how to retrieve information from it.

### Accessing Values in a Dictionary
Once you have a dictionary, the most common thing you'll want to do is retrieve a value using its key. You do this using square brackets `[]`, similar to how you access elements in a list, but instead of an index, you provide the key.

```python
# Accessing values from our phone book
phone_book = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Charlie": "555-9012"
}

# Get Alice's phone number
alice_number = phone_book["Alice"]
print(f"Alice's number: {alice_number}")

# Get Bob's phone number
bob_number = phone_book["Bob"]
print(f"Bob's number: {bob_number}")
```

**What you'll see:**
```
Alice's number: 555-1234
Bob's number: 555-5678
```

**What happens if the key doesn't exist?**
If you try to access a key that isn't in the dictionary using the square bracket notation, Python will raise a `KeyError`. This is Python's way of telling you, "Hey, I can't find what you're looking for!"

```python
# Trying to access a non-existent key will cause an error!
# print(phone_book["David"]) # Uncommenting this line would cause a KeyError!
```

To avoid a `KeyError`, especially when you're not sure if a key exists, you can use the `.get()` method. The `.get()` method allows you to specify a default value to return if the key is not found, instead of raising an error. If no default is specified and the key isn't found, it returns `None`.

```python
# Using .get() to safely access values
david_number = phone_book.get("David", "Number not found")
print(f"David's number: {david_number}")

# You can also use .get() for existing keys
charlie_number = phone_book.get("Charlie") # Default is None if not specified, but Charlie exists
print(f"Charlie's number: {charlie_number}")
```

**What you'll see:**
```
David's number: Number not found
Charlie's number: 555-9012
```

Dictionaries aren't just for looking up existing data; they're also dynamic. You can easily add new entries or update old ones.

### Adding and Modifying Entries
Dictionaries are mutable, meaning you can change them after they're created. You can add new key-value pairs or change the value associated with an existing key.

**Adding a new entry:**
To add a new key-value pair, you simply use the square bracket notation with a new key and assign it a value.

```python
phone_book = {
    "Alice": "555-1234",
    "Bob": "555-5678"
}

# Add a new friend, David
phone_book["David"] = "555-4321"
print(f"Phone book after adding David: {phone_book}")
```

**What you'll see:**
```
Phone book after adding David: {'Alice': '555-1234', 'Bob': '555-5678', 'David': '555-4321'}
```

**Modifying an existing entry:**
If you use an existing key with the assignment operator `=`, you will update the value associated with that key. Remember, keys must be unique, so assigning a new value to an existing key simply overwrites the old one.

```python
# Bob got a new number!
phone_book["Bob"] = "555-9999"
print(f"Phone book after Bob's number change: {phone_book}")
```

**What you'll see:**
```
Phone book after Bob's number change: {'Alice': '555-1234', 'Bob': '555-9999', 'David': '555-4321'}
```

Just as you can add and modify, you can also remove entries when they are no longer needed.

### Removing Entries from a Dictionary
There are a few ways to remove key-value pairs from a dictionary, each with slightly different behavior:

1.  **`del` keyword**: This is a simple way to remove an item by its key. If the key doesn't exist, it will raise a `KeyError`.

    ```python
    my_dict = {"apple": 1, "banana": 2, "cherry": 3}
    del my_dict["banana"]
    print(f"After deleting 'banana': {my_dict}")
    ```

    **What you'll see:**
    ```
    After deleting 'banana': {'apple': 1, 'cherry': 3}
    ```

2.  **`.pop(key)` method**: This method removes the item with the specified key and *returns its value*. This can be useful if you need to use the value that was removed. It also allows you to provide a default value to return if the key is not found, preventing a `KeyError`.

    ```python
    my_dict = {"apple": 1, "banana": 2, "cherry": 3}
    removed_value = my_dict.pop("cherry")
    print(f"Removed value: {removed_value}")
    print(f"After popping 'cherry': {my_dict}")

    # Trying to pop a non-existent key with a default value
    no_such_key = my_dict.pop("grape", "Not found")
    print(f"Attempted to pop 'grape': {no_such_key}")
    print(f"Dictionary after trying to pop 'grape': {my_dict}")
    ```

    **What you'll see:**
    ```
    Removed value: 3
    After popping 'cherry': {'apple': 1, 'banana': 2}
    Attempted to pop 'grape': Not found
    Dictionary after trying to pop 'grape': {'apple': 1, 'banana': 2}
    ```

3.  **`.clear()` method**: This method removes all items from the dictionary, leaving it empty.

    ```python
    my_dict = {"apple": 1, "banana": 2, "cherry": 3}
    my_dict.clear()
    print(f"After clearing: {my_dict}")
    ```

    **What you'll see:**
    ```
    After clearing: {}
    ```

Beyond adding, modifying, and removing, dictionaries offer several handy methods to inspect their contents.

### Useful Dictionary Methods
Dictionaries come with several built-in methods that help you work with their contents, especially when you want to see all the keys, all the values, or all the pairs.

1.  **`.keys()`**: Returns a view object that displays a list of all the keys in the dictionary.
2.  **`.values()`**: Returns a view object that displays a list of all the values in the dictionary.
3.  **`.items()`**: Returns a view object that displays a list of a dictionary's key-value tuple pairs.

These "view objects" are dynamic, meaning they reflect any changes made to the dictionary. You can easily convert them to actual lists if needed, which is often useful for printing or further processing.

```python
student_grades = {
    "Alice": 95,
    "Bob": 88,
    "Charlie": 92
}

# Get all keys (names)
names = student_grades.keys()
print(f"Student names: {list(names)}") # Convert to list for easy viewing

# Get all values (grades)
grades = student_grades.values()
print(f"Student grades: {list(grades)}")

# Get all key-value pairs
all_items = student_grades.items()
print(f"All student data: {list(all_items)}")

# You can iterate directly over these views, which is very common
print("\nIterating through names:")
for name in student_grades.keys():
    print(name)

print("\nIterating through grades:")
for grade in student_grades.values():
    print(grade)

print("\nIterating through items (key, value pairs):")
for name, grade in student_grades.items():
    print(f"{name} got a grade of {grade}")
```

**What you'll see:**
```
Student names: ['Alice', 'Bob', 'Charlie']
Student grades: [95, 88, 92]
All student data: [('Alice', 95), ('Bob', 88), ('Charlie', 92)]

Iterating through names:
Alice
Bob
Charlie

Iterating through grades:
95
88
92

Iterating through items (key, value pairs):
Alice got a grade of 95
Bob got a grade of 88
Charlie got a grade of 92
```

[IMAGE_PLACEHOLDER: A diagram showing a dictionary with three key-value pairs. Arrows or lines should emanate from the dictionary to three separate boxes: one labeled "keys()" pointing to a list of keys, one labeled "values()" pointing to a list of values, and one labeled "items()" pointing to a list of (key, value) tuples. This visually explains what each method returns.]

## Wrap-Up
Congratulations! You've just unlocked the power of dictionaries. You learned that dictionaries store data in unique key-value pairs, allowing you to access information by its label rather than its position. You can create, access, modify, and delete entries, and use handy methods like `.keys()`, `.values()`, and `.items()` to efficiently work with your data.

Dictionaries are a fundamental and incredibly versatile data structure in Python, used everywhere from storing configuration settings to representing complex data structures. Their ability to map unique keys to specific values makes them indispensable for many programming tasks. In the next lesson, we'll explore how to combine dictionaries with other data structures, like lists, to build even more powerful and flexible programs.