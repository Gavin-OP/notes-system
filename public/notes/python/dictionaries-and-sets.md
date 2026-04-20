<a id="concept-dictionaries-and-sets"></a>
# Python Data Structures: Dictionaries and Sets

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the core concept of a Python dictionary as a collection of key-value pairs.
- Create and manipulate dictionaries by adding, accessing, modifying, and deleting elements.
- Understand the core concept of a Python set as an unordered collection of unique elements.
- Create and modify sets, including adding and removing elements.
- Perform common set operations like union, intersection, and difference.

## Introduction
In our previous lesson, we mastered [lists and tuples](../python/lists-and-tuples.md#concept-lists-and-tuples), which are fantastic for storing ordered sequences of items. You learned how to access elements using numerical indices, like finding the first item or the tenth item.

But what if you need to store information where each piece of data has a specific *label* or *identifier*, rather than just a position? Imagine you want to look up a person's age using the label "age," not by knowing it's the second item in a list. Or, what if you need a collection of items where every single item *must be unique*, and the order in which they are stored simply doesn't matter?

This is where Python's **dictionaries** and **sets** become incredibly powerful! These two fundamental [data structures](../python/python-data-structures-mappings-and-sets.md#concept-data-structures) offer distinct ways to organize and work with your data, each designed to solve different kinds of problems. We'll explore the unique strengths of each, starting with dictionaries, and then move on to sets.

## Concept Progression

### Dictionaries: Organizing Data with Key-Value Pairs

Think about a physical dictionary you might use to look up words. You don't flip to page 50 and count to the 10th word; instead, you look up a word directly, like "pedagogy." The word itself is your search term, and its definition is the information you retrieve.

Python dictionaries work in a very similar way. They allow you to store data in **key-value pairs**. Each `key` acts like a unique label or identifier, and it points to its corresponding `value`. This makes dictionaries perfect for representing real-world objects or records where you need to quickly retrieve information based on a specific name or attribute.

For example, if you're storing information about a student, you might want to access their name using the key `"name"`, their age using `"age"`, or their major using `"major"`.

[IMAGE_PLACEHOLDER: A diagram illustrating a Python dictionary. It shows a box representing the dictionary, containing multiple smaller boxes. Each smaller box is divided into two sections: 'Key' on the left and 'Value' on the right. Examples of key-value pairs could be 'Name': 'Alice', 'Age': 30, 'City': 'New York'. Arrows point from the key to its associated value.]

It's crucial to understand that dictionary keys must be **immutable** (meaning they cannot be changed after creation, like strings, numbers, or tuples) and **hashable** (a technical term meaning they can be converted into a fixed-size [integer](../python/python-data-types-and-variables.md#concept-integer) value, which allows for very fast lookups). Values, on the other hand, can be of any [data type](../python/python-data-types-and-variables.md#concept-data-type) – even other dictionaries or lists!

Let's see how we can create a simple dictionary:

```python
# Creating a dictionary to store a student's information
student_info = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science",
    "gpa": 3.8
}

print(student_info)
# Expected Output: {'name': 'Alice', 'age': 20, 'major': 'Computer Science', 'gpa': 3.8}
```

In this example:
- `"name"`, `"age"`, `"major"`, and `"gpa"` are the **keys**.
- `"Alice"`, `20`, `"Computer Science"`, and `3.8` are their corresponding **values**.

Notice that dictionaries are defined using **curly braces `{}`**. Each key-value pair is separated by a **colon (`:`)**, and individual pairs are separated by **commas (`,`)**.

<a id="concept-python-dictionary"></a>
### Accessing and Modifying Dictionary Elements

Once you've created a dictionary, accessing its values is straightforward and intuitive, much like looking up a word in a physical dictionary.

To retrieve a value, you use its corresponding key inside square brackets `[]`:

```python
student_info = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science",
    "gpa": 3.8
}

# Accessing values using their keys
print(f"Student's name: {student_info['name']}")
print(f"Student's age: {student_info['age']}")

# Expected Output:
# Student's name: Alice
# Student's age: 20
```

One of the great advantages of dictionaries is that they are **mutable**. This means you can change them after they're created – you can update existing values, add new key-value pairs, or even remove pairs entirely.

```python
student_info = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science",
    "gpa": 3.8
}

print(f"Original info: {student_info}")

# Modifying an existing value
student_info["age"] = 21
print(f"Updated age: {student_info['age']}") # Output: Updated age: 21

# Adding a new key-value pair
student_info["email"] = "alice@example.com"
print(f"Student info with email: {student_info}")
# Output: Student info with email: {'name': 'Alice', 'age': 21, 'major': 'Computer Science', 'gpa': 3.8, 'email': 'alice@example.com'}

# Deleting a key-value pair using the 'del' keyword
del student_info["gpa"]
print(f"Student info after deleting GPA: {student_info}")
# Output: Student info after deleting GPA: {'name': 'Alice', 'age': 21, 'major': 'Computer Science', 'email': 'alice@example.com'}
```

It's also common to check if a key already exists in a dictionary before trying to access or modify it. You can do this using the `in` keyword:

```python
student_info = {"name": "Alice", "age": 21}

if "name" in student_info:
    print("The student's name is present.")

if "phone" not in student_info:
    print("Phone number is not available for this student.")

# Expected Output:
# The student's name is present.
# Phone number is not available for this student.
```

### Useful Dictionary Methods

Python provides several built-in methods that make working with dictionaries even more efficient and convenient.

-   `.keys()`: Returns a "view" object that displays all the keys currently in the dictionary.
-   `.values()`: Returns a "view" object that displays all the values currently in the dictionary.
-   `.items()`: Returns a "view" object that displays all the dictionary's key-value pairs as tuples.
-   `.get(key, default_value)`: This is a safer way to retrieve a value for a given key. If the key doesn't exist, it won't raise a `KeyError` (which would crash your program). Instead, it returns `None` by default, or a `default_value` that you specify.

Let's see these methods in action:

```python
car = {
    "brand": "Ford",
    "model": "Mustang",
    "year": 1964
}

# Get all keys
print(f"Keys: {car.keys()}")
# Output: Keys: dict_keys(['brand', 'model', 'year'])

# Get all values
print(f"Values: {car.values()}")
# Output: Values: dict_values(['Ford', 'Mustang', 1964])

# Get all items (key-value pairs)
print(f"Items: {car.items()}")
# Output: Items: dict_items([('brand', 'Ford'), ('model', 'Mustang'), ('year', 1964)])

# Using .get() to safely access a value
owner = car.get("owner", "Unknown") # 'owner' key doesn't exist, so it returns "Unknown"
print(f"Car owner: {owner}") # Output: Car owner: Unknown

model = car.get("model") # 'model' key exists
print(f"Car model: {model}") # Output: Car model: Mustang
```
The `.get()` method is particularly useful when you're not sure if a key exists, preventing potential errors in your code.

### Sets: Collections of Unique Items

While dictionaries are great for mapping keys to values, sometimes you just need a collection of items where every item *must be unique*, and the order doesn't matter at all. This is where **sets** shine!

Imagine you're organizing a guest list for an event. You might receive sign-ups from various sources, and some names might appear multiple times. You don't care about how many times someone signed up; you just want a definitive list of *unique* attendees. A Python `set` is perfect for this scenario.

A Python `set` is an **unordered collection of unique elements**. Just like dictionary keys, elements within a set must be **immutable** and **hashable**. This means you cannot directly put mutable objects like lists or other dictionaries into a set.

Key characteristics of sets:
1.  **Uniqueness**: Every element in a set must be distinct. If you try to add a duplicate element, the set simply ignores it.
2.  **Unordered**: Items in a set do not have a defined order. You cannot access elements by an index (like `my_set[0]`) as you would with lists or tuples.

Sets are incredibly useful when you need to quickly remove duplicates from a collection, or when you want to perform mathematical set operations (like finding common elements between two groups).

[IMAGE_PLACEHOLDER: A Venn diagram showing two overlapping circles, representing two sets. Elements are placed within each circle, with common elements in the overlapping region. This visually demonstrates union, intersection, and difference operations.]

Here's how to create a set:

```python
# Creating a set of unique numbers directly
unique_numbers = {1, 2, 3, 2, 4, 1}
print(f"Set of unique numbers: {unique_numbers}")
# Expected Output: {1, 2, 3, 4} (Note: order might vary as sets are unordered)

# Creating a set from a list that contains duplicates
my_list = [5, 6, 7, 6, 8, 5]
unique_items = set(my_list)
print(f"Set from list: {unique_items}")
# Expected Output: {5, 6, 7, 8} (Again, order might vary)

# Important: To create an empty set, you must use set()
# Using {} creates an empty dictionary, not an empty set.
empty_set = set()
print(f"Empty set: {empty_set}")
# Expected Output: set()
```

Notice how the duplicate numbers (`1` and `2` in `unique_numbers`, and `5` and `6` in `my_list`) were automatically removed when the sets were created.

### Modifying Sets

Like dictionaries, sets are **mutable**, meaning you can add or remove elements after a set has been created.

-   `.add(element)`: Adds a single element to the set. If the element already exists, the set remains unchanged.
-   `.remove(element)`: Removes a specified element from the set. If the element is not found, this method will raise a `KeyError`.
-   `.discard(element)`: Also removes a specified element from the set. The key difference from `.remove()` is that if the element is not found, `.discard()` does nothing and does *not* raise an error, making it a "safer" option when you're unsure if an element is present.

```python
fruits = {"apple", "banana", "cherry"}
print(f"Initial fruits: {fruits}")

# Adding a new element
fruits.add("orange")
print(f"After adding orange: {fruits}")
# Output: After adding orange: {'cherry', 'apple', 'orange', 'banana'} (order may vary)

# Adding an existing element does nothing
fruits.add("apple")
print(f"After adding apple again: {fruits}") # No change in the set

# Removing an element using .remove()
fruits.remove("banana")
print(f"After removing banana: {fruits}")
# Output: After removing banana: {'cherry', 'apple', 'orange'} (order may vary)

# Using .discard() (safer removal)
fruits.discard("grape") # 'grape' is not in the set, but no error is raised
print(f"After discarding grape: {fruits}") # Set remains unchanged
```

<a id="concept-python-set"></a>
### Common Set Operations

One of the most powerful features of sets is their ability to perform mathematical set operations, which are incredibly useful for comparing and combining collections of data. These operations are often visualized using Venn diagrams.

-   **Union (`|` or `.union()`):** Creates a new set containing all unique elements from *both* sets.
-   **Intersection (`&` or `.intersection()`):** Creates a new set containing only the elements that are *common to both* sets.
-   **Difference (`-` or `.difference()`):** Creates a new set containing elements that are present in the *first set but not in the second*.
-   **Symmetric Difference (`^` or `.symmetric_difference()`):** Creates a new set containing elements that are in *either set, but not in both* (the elements unique to each set).

Let's illustrate these operations with an example:

```python
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

print(f"Set A: {set_a}")
print(f"Set B: {set_b}")

# Union: Elements in A OR B (or both)
union_set = set_a | set_b
print(f"Union of A and B: {union_set}")
# Expected Output: Union of A and B: {1, 2, 3, 4, 5, 6}

# Intersection: Elements common to both A AND B
intersection_set = set_a & set_b
print(f"Intersection of A and B: {intersection_set}")
# Expected Output: Intersection of A and B: {3, 4}

# Difference: Elements in A but NOT in B
difference_set_ab = set_a - set_b
print(f"Elements in A but not in B: {difference_set_ab}")
# Expected Output: Elements in A but not in B: {1, 2}

# Symmetric Difference: Elements in A OR B, but NOT both
symmetric_difference_set = set_a ^ set_b
print(f"Elements in A or B, but not both: {symmetric_difference_set}")
# Expected Output: Elements in A or B, but not both: {1, 2, 5, 6}
```

These set operations are highly optimized in Python and can simplify complex data filtering, comparison, and merging tasks, making your code more concise and efficient.

## Wrap-Up
Congratulations! You've now expanded your Python toolkit with two more incredibly useful data structures: dictionaries and sets.

You learned that **dictionaries** are perfect for storing data that needs to be looked up by a unique label (a key), offering fast access and flexible organization for structured information. You can create, access, modify, and delete key-value pairs with ease.

You also discovered **sets**, which are ideal for managing collections of unique items where order doesn't matter. Sets provide powerful, efficient ways to eliminate duplicates and perform mathematical operations like unions, intersections, and differences.

Understanding when to choose between lists, tuples, dictionaries, or sets is a crucial step in becoming a proficient Python programmer. Each data structure has its own strengths and use cases, and selecting the right one can significantly improve the efficiency and readability of your code.

In the next lesson, we'll continue to build on your understanding of program logic by exploring how to control the flow of your programs using conditional statements, allowing your code to make decisions!