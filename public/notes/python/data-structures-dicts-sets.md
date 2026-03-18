# Data Structures - Dictionaries and Sets

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the concept of key-value pairs and how they form the basis of dictionaries.
- Create, access, modify, and iterate through Python dictionaries.
- Explain the core characteristics of sets, including uniqueness and unordered elements.
- Perform common operations on sets, such as adding/removing elements and mathematical set operations.
- Appreciate the underlying mechanism of hashing that makes dictionaries and sets efficient.

## Introduction
In our previous lesson, we explored lists and tuples, which are excellent for storing ordered collections of items. They allow us to access data by its position (index). But what if you need to store information in a way that lets you quickly look things up by a *name* or a *label*, rather than just by their numerical position? Imagine a phone book where you look up a person's number by their name, not by knowing they are the 5th entry. Or perhaps you need a collection of unique items where the order doesn't matter, but you absolutely must ensure there are no duplicates.

This is where Python's **dictionaries** and **sets** come in! They are powerful and distinct [data structures](../python/data-structures-lists-tuples.md) that solve these exact problems, offering efficient ways to organize and retrieve data in scenarios where lists and tuples might fall short. Understanding them will significantly expand your ability to write more effective and organized Python programs.

## Concept Progression

### What are Dictionaries? The Power of Key-Value Pairs

Let's start with dictionaries. Think about a real-world dictionary: you look up a specific *word* (the key) to find its *definition* (the value). Python dictionaries work in a very similar way. Instead of just a sequence of items (like a list), a dictionary stores data as a collection of **key-value pairs**. Each key is unique and acts like a distinct label, pointing to its associated value.

Why is this structure so useful? Because it allows for incredibly fast lookups. If you know the key, you can instantly retrieve its value, without having to search through the entire collection item by item. This makes dictionaries ideal for representing real-world objects or records where each piece of information has a distinct identifier.

Let's look at an example. Imagine you want to store information about a student: their name, age, and grade.

```python
# Creating a dictionary
student_profile = {
    "name": "Alice",
    "age": 16,
    "grade": "10th"
}

print(student_profile)
# Output: {'name': 'Alice', 'age': 16, 'grade': '10th'}
```

In this example:
- `"name"`, `"age"`, and `"grade"` are the **keys**. They are unique identifiers.
- `"Alice"`, `16`, and `"10th"` are the corresponding **values**.
- Each `key: value` combination (e.g., `"name": "Alice"`) is a **key-value pair**, also known as an item or entry.

You can think of a dictionary as a mapping from unique keys to their corresponding values.

[IMAGE_PLACEHOLDER: A simple diagram illustrating a dictionary. On the left, a box labeled "Dictionary". Inside, three distinct pairs: "Key: 'name'" pointing to "Value: 'Alice'", "Key: 'age'" pointing to "Value: 16", and "Key: 'grade'" pointing to "Value: '10th'". Arrows clearly show the mapping from key to value. The overall style should be clean and easy to understand for beginners.]

### Working with Dictionaries: Accessing, Modifying, and Adding Data

Once you have a dictionary, you'll want to interact with the data inside it. Dictionaries are highly flexible and allow for various operations.

#### Accessing Values
You can access a value by referring to its key, much like you access elements in a list using an index, but here you use the key instead of a number.

```python
student_profile = {
    "name": "Alice",
    "age": 16,
    "grade": "10th"
}

# Accessing values using their keys
print(f"Student's name: {student_profile['name']}")
print(f"Student's age: {student_profile['age']}")

# Output:
# Student's name: Alice
# Student's age: 16
```
**Important Note:** If you try to access a key that doesn't exist using `[]` (square brackets), Python will raise a `KeyError`. To handle this gracefully, you can use the `.get()` method. This method returns `None` (or a default value you specify) if the key isn't found, instead of an error.

```python
print(f"Student's city (using .get()): {student_profile.get('city', 'Not specified')}")
# Output: Student's city (using .get()): Not specified
```

#### Modifying and Adding Key-Value Pairs
Dictionaries are **mutable**, meaning you can change their contents after they're created.
- To **modify** a value, you simply assign a new value to an existing key.
- To **add** a new key-value pair, you assign a value to a new key that doesn't already exist in the dictionary.

```python
student_profile = {
    "name": "Alice",
    "age": 16,
    "grade": "10th"
}

# Modifying an existing value
student_profile["age"] = 17
print(f"Updated age: {student_profile['age']}") # Output: Updated age: 17

# Adding a new key-value pair
student_profile["city"] = "New York"
print(student_profile)
# Output: {'name': 'Alice', 'age': 17, 'grade': '10th', 'city': 'New York'}
```

#### Removing Key-Value Pairs
You can remove pairs using the `del` keyword or the `.pop()` method. The `.pop()` method also returns the value of the removed item, which can be useful.

```python
student_profile = {
    "name": "Alice",
    "age": 17,
    "grade": "10th",
    "city": "New York"
}

# Removing a key-value pair using del
del student_profile["city"]
print(student_profile)
# Output: {'name': 'Alice', 'age': 17, 'grade': '10th'}

# Removing a key-value pair using .pop() (and getting the value back)
grade = student_profile.pop("grade")
print(f"Removed grade: {grade}") # Output: Removed grade: 10th
print(student_profile)
# Output: {'name': 'Alice', 'age': 17}
```

#### Iterating Through Dictionaries
You can loop through dictionaries in several convenient ways, depending on whether you need the keys, values, or both.

```python
student_profile = {
    "name": "Bob",
    "age": 18,
    "major": "Computer Science"
}

print("--- Iterating through Keys (default) ---")
for key in student_profile: # This is the default behavior, same as student_profile.keys()
    print(key)

print("\n--- Iterating through Values ---")
for value in student_profile.values():
    print(value)

print("\n--- Iterating through Key-Value Pairs (Items) ---")
for key, value in student_profile.items():
    print(f"{key}: {value}")

# Output:
# --- Iterating through Keys (default) ---
# name
# age
# major
#
# --- Iterating through Values ---
# Bob
# 18
# Computer Science
#
# --- Iterating through Key-Value Pairs (Items) ---
# name: Bob
# age: 18
# major: Computer Science
```
Dictionaries are incredibly versatile for storing and managing structured data where each piece of information has a unique identifier. But what if uniqueness is your main concern, and order or key-value mapping isn't important? That's where sets shine.

### Introducing Sets: Collections of Unique Items

While dictionaries are fantastic for mapping unique keys to values, what if you simply need a collection of items where every single item must be unique, and the order in which they are stored doesn't matter at all?

Imagine you have a bag of marbles, but you only care about *what colors* of marbles you have, not how many of each color, or in what order you picked them up. If you pick up a red marble, then another red marble, you still only have "red" as one of your distinct colors. This is the core idea behind a Python **set**: it's an unordered collection of unique elements.

The two most important characteristics of sets are:
1.  **Uniqueness**: Every element in a set must be distinct. If you try to add a duplicate, it will simply be ignored.
2.  **Unordered**: Items in a set do not have a defined order. You cannot access elements by an index (like `my_set[0]`) because there is no "first" or "last" element.

Why are sets useful? They are fantastic for:
-   Quickly checking if an item is present in a collection (membership testing).
-   Efficiently removing duplicate items from a list or other collection.
-   Performing mathematical set operations like union, intersection, and difference, which are common in [data analysis](../data-science/exploratory-data-analysis.md) and logic.

#### Creating Sets
You can create a set using curly braces `{}` (but be careful, an empty `{}` creates a dictionary!) or by using the `set()` constructor.

```python
# Creating a set directly
my_colors = {"red", "green", "blue"}
print(my_colors)
# Output: {'blue', 'red', 'green'} (order might vary because sets are unordered)

# Creating a set from a list (duplicates are automatically removed)
my_numbers = [1, 2, 2, 3, 4, 4, 5]
unique_numbers = set(my_numbers)
print(unique_numbers)
# Output: {1, 2, 3, 4, 5}

# An empty set (important: use set() for an empty set, not {})
empty_set = set()
print(empty_set)
# Output: set()
```

Notice how the output for `my_colors` might not be in the exact order you typed it. This reinforces the "unordered" nature of sets – Python stores them efficiently, but without preserving insertion order.

### Set Operations: Adding, Removing, and Comparing Collections

Sets provide efficient ways to manage their elements and perform operations that are very similar to mathematical set theory.

#### Adding and Removing Elements
-   Use `.add()` to add a single element. If the element already exists, nothing happens (due to uniqueness).
-   Use `.remove()` to remove an element. If the element is not present, it raises a `KeyError`.
-   Use `.discard()` to remove an element. If the element is not present, it does nothing (this is generally safer than `.remove()` if you're unsure if an element exists).

```python
fruits = {"apple", "banana", "cherry"}

fruits.add("orange")
print(fruits) # Output: {'cherry', 'banana', 'apple', 'orange'} (order varies)

fruits.add("apple") # Adding an existing element does nothing
print(fruits) # Output: {'cherry', 'banana', 'apple', 'orange'}

fruits.remove("banana")
print(fruits) # Output: {'cherry', 'apple', 'orange'}

fruits.discard("grape") # 'grape' is not in the set, but no error occurs
print(fruits) # Output: {'cherry', 'apple', 'orange'}
```

#### Membership Testing
Checking if an element is in a set is extremely fast, making sets ideal for quickly determining presence.

```python
my_courses = {"Math", "Physics", "Chemistry"}

print("Math" in my_courses)    # Output: True
print("Biology" in my_courses) # Output: False
```

#### Mathematical Set Operations
These operations are incredibly powerful for comparing and combining collections based on their unique elements.

-   **Union (`|` or `.union()`):** Creates a new set containing all unique elements from both sets.
-   **Intersection (`&` or `.intersection()`):** Creates a new set containing only the elements common to both sets.
-   **Difference (`-` or `.difference()`):** Creates a new set containing elements in the first set that are *not* in the second set.
-   **Symmetric Difference (`^` or `.symmetric_difference()`):** Creates a new set containing elements that are in either set, but *not* in both (i.e., elements unique to each set).

```python
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

print(f"Union (A | B): {set_a | set_b}")             # Output: {1, 2, 3, 4, 5, 6}
print(f"Intersection (A & B): {set_a & set_b}")      # Output: {3, 4}
print(f"Difference (A - B): {set_a - set_b}") # Output: {1, 2}
print(f"Difference (B - A): {set_b - set_a}") # Output: {5, 6}
print(f"Symmetric Difference (A ^ B): {set_a ^ set_b}") # Output: {1, 2, 5, 6}
```

[IMAGE_PLACEHOLDER: A Venn diagram illustrating two overlapping circles, labeled "Set A" and "Set B". The union, intersection, difference (A-B), and symmetric difference regions should be clearly highlighted with different colors or patterns, and labeled with their respective set operation symbols (e.g., A ∪ B, A ∩ B, A \ B, A Δ B). The pedagogical intent is to visually explain the mathematical set operations.]

### A Peek Behind the Curtain: Hashing

You might be wondering *why* dictionaries and sets are so incredibly fast for lookups, additions, and membership testing, especially compared to searching through a list. The secret lies in a fundamental computer science concept called **hashing**.

Imagine you have a giant library, and you want to find a specific book very quickly. Instead of searching shelf by shelf, what if each book had a special code (a "hash") that told you exactly which shelf and even which section of that shelf it belonged to? You'd go directly to that spot!

That's essentially what hashing does for dictionaries and sets. When you add a key to a dictionary or an element to a set, Python calculates a special number called a **hash value** for that item. This hash value then tells Python precisely where to store the item in memory. When you later try to retrieve that item (e.g., `my_dict['key']` or `'element' in my_set`), Python calculates its hash value again, and immediately knows where to look, rather than having to scan through everything. This direct access is what makes these operations so efficient.

[IMAGE_PLACEHOLDER: A simplified diagram showing the concept of hashing. An input "Key/Element" (e.g., "apple") goes into a box labeled "Hash Function". An arrow points from the Hash Function to an output "Hash Value" (e.g., "12345"). This hash value then points to a specific "Memory Location" or "Bucket" where the actual value (for a dict) or the element itself (for a set) is stored. The diagram should convey the idea of a direct mapping for quick access.]

For this efficient system to work, the **keys** in a dictionary and the **elements** in a set must be **hashable**. This generally means they must be **immutable** (their value cannot change after creation). Why? Because if an item's value changed, its hash value would also change, and Python wouldn't be able to find it in the original location where it was stored.

-   **Hashable types:** Numbers (integers, floats), strings, and tuples are hashable because they are immutable.
-   **Non-hashable types:** Lists, other dictionaries, and sets themselves are *not* hashable because they are mutable. You cannot use a list as a dictionary key or as an element in a set.

This underlying mechanism is what gives dictionaries and sets their incredible efficiency for operations like `in` checks and direct lookups by key, making them indispensable tools in a programmer's toolkit.

## Wrap-Up
Congratulations! You've now explored two incredibly powerful and versatile Python [data structures](../python/data-structures-lists-tuples.md): dictionaries and sets. You learned that dictionaries store data as unique key-value pairs, allowing for fast lookups by key, while sets store unique, unordered collections of elements, perfect for membership testing and mathematical set operations. We also briefly touched upon hashing, the clever technique that makes these data structures so efficient by providing direct access to elements.

Understanding when to use dictionaries versus lists or sets will significantly improve your ability to write clean, efficient, and effective Python code. In the next lesson, we'll continue our journey into more advanced [data structures](../python/data-structures-lists-tuples.md) and how to choose the right one for your specific programming needs.