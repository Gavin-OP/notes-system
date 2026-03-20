<a id="concept-python-data-structures-mappings-and-sets"></a>
<a id="concept-data-structures"></a>
# Python Data Structures: Dictionaries and Sets

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the concept of key-value pairs and how they are used in Python dictionaries.
- Create and perform basic operations (add, access, modify, delete) on Python dictionaries.
- Understand the properties of Python sets, including uniqueness and unordered elements.
- Create and perform common set operations (add, remove, union, intersection, difference).
- Choose the appropriate data structure (dictionary or set) for different programming scenarios.

## Introduction
In our previous lesson, we explored Python's [sequence data structures](../python/python-data-structures-sequences.md#concept-python-data-structures-sequences) like lists and tuples. These are fantastic for storing ordered collections of items, where each item has a specific position. But what if you need to store information that isn't just a simple list, but rather a collection where each piece of data has a specific label or identifier? Or what if you need a collection where every item must be unique, and the order doesn't matter at all?

This is where Python's **dictionaries** and **sets** come into play! They offer powerful and flexible ways to organize your data, opening up new possibilities for how you can structure your programs. Think of them as specialized tools in your programming toolbox, each designed to solve particular kinds of data organization challenges efficiently. Let's dive in and discover how these versatile structures can enhance your Python projects.

## Concept Progression

### Dictionaries: Organizing Data with Key-Value Pairs

Imagine you're trying to keep track of your friends' phone numbers. You wouldn't just write down a list of numbers; you'd write down each friend's name *next to* their number. The name acts as a label, helping you quickly find the right number without having to remember its position in a long list.

In Python, a **dictionary** works in a very similar way. It stores data as `key-value pairs`. Each `key` is like a unique label, and its `value` is the data associated with that label. This allows you to retrieve a specific piece of information (the value) by referring to its unique label (the key), rather than by its numerical position (like with lists). This type of data structure is also known as an associative array in other programming contexts.

Let's look at how to create a simple dictionary and access its data:

```python
# Creating a dictionary to store a person's information
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

print(person)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York'}
```
In this example, `"name"`, `"age"`, and `"city"` are the **keys**, and `"Alice"`, `30`, and `"New York"` are their corresponding **values**. Notice that dictionaries are defined using curly braces `{}` and each key-value pair is separated by a colon `:`.

To access a value, you use its key inside square brackets, much like accessing an item in a list by its index:

```python
print(person["name"])  # Output: Alice
print(person["age"])   # Output: 30
```

What happens if you try to access a key that doesn't exist? Python will raise a `KeyError`. To avoid this, you can use the `.get()` method, which allows you to specify a default value to return if the key isn't found, preventing your program from crashing:

```python
print(person.get("city"))      # Output: New York (key exists)
print(person.get("country"))   # Output: None (key not found, no default specified)
print(person.get("country", "USA")) # Output: USA (key not found, returns the default 'USA')
```

[IMAGE_PLACEHOLDER: A diagram illustrating a Python dictionary. It shows a box labeled "Dictionary" containing multiple smaller boxes. Each smaller box is divided into two sections: "Key" and "Value". Examples of key-value pairs are "name: Alice", "age: 30", "city: New York". Arrows point from the keys to their respective values, emphasizing the mapping.]

### Modifying and Managing Dictionaries

One of the great features of dictionaries is that they are **mutable**, meaning you can change their contents after they're created. This allows for dynamic data management.

**Adding New Key-Value Pairs:**
To add a new item to an existing dictionary, simply assign a value to a new key. If the key doesn't exist, it will be added.

```python
person["occupation"] = "Engineer"
print(person)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York', 'occupation': 'Engineer'}
```

**Modifying Existing Values:**
If you assign a value to a key that already exists, the dictionary will update the existing value associated with that key.

```python
person["age"] = 31 # Alice had a birthday!
print(person)
# Output: {'name': 'Alice', 'age': 31, 'city': 'New York', 'occupation': 'Engineer'}
```

**Removing Key-Value Pairs:**
You have a couple of ways to remove items from a dictionary:
-   The `del` keyword: This permanently removes the key-value pair.
-   The `.pop()` method: This also removes the key-value pair, but it returns the value of the removed item, which can be useful if you need to use that value elsewhere.

```python
del person["city"] # Alice moved out of New York
print(person)
# Output: {'name': 'Alice', 'age': 31, 'occupation': 'Engineer'}

occupation = person.pop("occupation") # Let's remove her occupation and store it
print(person)
# Output: {'name': 'Alice', 'age': 31}
print(f"Removed occupation: {occupation}") # Output: Removed occupation: Engineer
```

**Checking for Keys:**
You can quickly check if a key exists in a dictionary using the `in` keyword, which is very efficient:

```python
if "name" in person:
    print("Name is present in the dictionary.")
# Output: Name is present in the dictionary.

if "email" not in person:
    print("Email is not present in the dictionary.")
# Output: Email is not present in the dictionary.
```

**Iterating Through Dictionaries:**
Often, you'll want to process all the items in a dictionary. Python provides several convenient ways to loop through them:

-   **Keys only (default):** When you iterate directly over a dictionary, you get its keys.
    ```python
    for key in person:
        print(key)
    # Output:
    # name
    # age
    ```
-   **Values only:** Use the `.values()` method to iterate through just the values.
    ```python
    for value in person.values():
        print(value)
    # Output:
    # Alice
    # 31
    ```
-   **Both keys and values (most common):** The `.items()` method returns key-value pairs as tuples, allowing you to unpack them directly in your loop.
    ```python
    for key, value in person.items():
        print(f"{key}: {value}")
    # Output:
    # name: Alice
    # age: 31
    ```

<a id="concept-associative-array"></a>
### Dictionary Keys and Values: What Can They Be?

When working with dictionaries, it's important to understand the rules for what can be a key and what can be a value. These rules are crucial for how dictionaries function internally.

**Keys Must Be Immutable (Hashable):**
A fundamental rule for dictionary keys is that they must be [immutable objects](../python/python-data-types-and-variables.md#concept-immutable-object). This means their value cannot change after they are created. Python uses a concept called "hashing" to quickly find keys. Hashing generates a unique numerical code for an object, and this only works reliably if the object (the key) itself cannot change. If a key were mutable, its hash could change, making it impossible for the dictionary to locate the associated value.

Common immutable types that can be used as keys include:
-   Numbers ([integers](../python/python-data-types-and-variables.md#concept-integer), [floating-point numbers](../python/python-data-types-and-variables.md#concept-floating-point-number))
-   [Strings](../python/python-data-types-and-variables.md#concept-character-string)
-   Tuples (as long as *all* elements within the tuple are also immutable)

Mutable types like lists, other dictionaries, or sets **cannot** be used as keys because their contents can change, which would break the dictionary's internal lookup mechanism.

Let's see some examples:

```python
# Valid keys: numbers, strings, and tuples (containing immutable elements)
my_dict = {
    1: "one",
    "two": 2,
    (3, 4): "three-four" # A tuple as a key is valid
}
print(my_dict)
# Output: {1: 'one', 'two': 2, (3, 4): 'three-four'}

# Invalid key example (uncomment to see the error)
# try_this = {
#     [1, 2]: "a list key" # Lists are mutable
# }
# This would raise a TypeError: unhashable type: 'list'
```

**Values Can Be Anything:**
In contrast to keys, dictionary values are much more flexible. They can be of any [data type](../python/python-data-types-and-variables.md#concept-data-type), including other dictionaries, lists, sets, functions, or even custom objects. This incredible flexibility makes dictionaries incredibly powerful for representing complex, nested data structures.

```python
complex_data = {
    "user_id": 123,
    "preferences": ["email", "sms", "push"], # A list as a value
    "address": {                             # Another dictionary as a value
        "street": "123 Main St",
        "zip": "10001"
    },
    "is_active": True # A boolean as a value
}
print(complex_data["preferences"])      # Output: ['email', 'sms', 'push']
print(complex_data["address"]["zip"])   # Output: 10001 (accessing a nested dictionary)
```
This ability to nest dictionaries and lists within each other is a cornerstone of handling structured data in Python, often seen when working with data formats like JSON.

### Sets: Collections of Unique, Unordered Elements

Now, let's shift our focus to **sets**. Imagine you're making a guest list for a party, but you only want to count each person once, no matter how many times their name appears on different invitation lists. Also, the order in which you write down the names doesn't matter; you just care about *who* is coming.

A Python set is exactly this: an **unordered collection of unique elements**. It's based on the mathematical concept of a set. If you try to add a duplicate item to a set, it simply won't be added, and the set will remain unchanged. This makes sets incredibly useful for tasks like removing duplicates from a list or checking for membership efficiently.

You can create a set using curly braces `{}` (but without key-value pairs, unlike dictionaries) or by using the `set()` constructor:

```python
# Creating a set of unique numbers
unique_numbers = {1, 2, 3, 2, 1, 4} # Duplicates 1 and 2 are automatically removed
print(unique_numbers)
# Output: {1, 2, 3, 4} (the order might vary because sets are unordered)

# Creating a set from a list to find unique elements
fruits_list = ["apple", "banana", "apple", "orange"]
unique_fruits = set(fruits_list)
print(unique_fruits)
# Output: {'banana', 'apple', 'orange'} (again, order might vary)

# IMPORTANT: Creating an empty set
# {} creates an empty dictionary, NOT an empty set!
empty_dict = {}
print(type(empty_dict)) # Output: <class 'dict'>

# To create an empty set, you must use the set() constructor:
empty_set = set()
print(type(empty_set))  # Output: <class 'set'>
print(empty_set)        # Output: set()
```

Just like dictionary keys, elements in a set must be [immutable objects](../python/python-data-types-and-variables.md#concept-immutable-object) (hashable). You cannot put mutable objects like lists or dictionaries directly into a set, for the same reasons that dictionary keys must be immutable.

<a id="concept-set"></a>
### Common Set Operations

Sets are particularly useful for performing mathematical set operations like unions, intersections, and differences, which are common in data analysis and logic.

**Adding and Removing Elements:**
Sets are mutable, so you can add and remove elements after creation.
-   Use `.add()` to add a single element. If the element is already present, the set remains unchanged.
-   Use `.remove()` to remove a specific element. This will raise a `KeyError` if the element isn't found.
-   Use `.discard()` to remove an element. This method does nothing if the element isn't found, so it's safer if you're unsure if the element exists.

```python
my_set = {10, 20, 30}
my_set.add(40)
print(my_set) # Output: {10, 20, 30, 40} (order might vary)

my_set.add(20) # Trying to add a duplicate has no effect
print(my_set) # Output: {10, 20, 30, 40}

my_set.remove(10) # Removes 10
print(my_set) # Output: {20, 30, 40}

my_set.discard(50) # No error, 50 is not in the set
print(my_set) # Output: {20, 30, 40}
```

**Set Mathematics (Comparing Collections):**
Sets truly shine when you need to compare collections of items and find relationships between them.

-   **Union (`|` operator or `.union()` method):** Returns a new set containing all unique elements from both sets.
    ```python
    set_a = {1, 2, 3}
    set_b = {3, 4, 5}
    union_set = set_a | set_b # Using the | operator
    print(union_set) # Output: {1, 2, 3, 4, 5} (order might vary)
    ```
-   **Intersection (`&` operator or `.intersection()` method):** Returns a new set containing only the elements that are common to both sets.
    ```python
    intersection_set = set_a & set_b # Using the & operator
    print(intersection_set) # Output: {3}
    ```
-   **Difference (`-` operator or `.difference()` method):** Returns a new set containing elements that are in the first set but *not* in the second set.
    ```python
    difference_set = set_a - set_b # Using the - operator
    print(difference_set) # Output: {1, 2}
    ```
-   **Symmetric Difference (`^` operator or `.symmetric_difference()` method):** Returns a new set containing elements that are in either set, but *not* in both (i.e., elements unique to each set).
    ```python
    symmetric_difference_set = set_a ^ set_b # Using the ^ operator
    print(symmetric_difference_set) # Output: {1, 2, 4, 5} (order might vary)
    ```

[IMAGE_PLACEHOLDER: A Venn diagram illustrating set operations. Two overlapping circles, labeled "Set A" and "Set B", are shown. The intersection area is labeled "Intersection (A & B)". The combined area of both circles is labeled "Union (A | B)". The area of Set A not overlapping with Set B is labeled "Difference (A - B)". The areas of Set A and Set B not overlapping with each other are collectively labeled "Symmetric Difference (A ^ B)".]

### When to Use Dictionaries vs. Sets

Choosing the right data structure is a key skill in programming. While both dictionaries and sets use curly braces and require immutable elements, their purposes are distinct. Here's a quick guide to help you decide:

**Use a Dictionary when:**
-   You need to store data as `key-value pairs`, where each piece of data has a descriptive label.
-   You want to retrieve information quickly using a unique identifier (the key), rather than by its position.
-   The order of items does not matter, but fast lookup by a specific label is crucial.
-   You need to represent structured records, like a user profile, configuration settings, or a database row.

**Example Use Case:** Storing user profiles where each user has a unique ID, and you want to quickly access their name, email, and preferences.
```python
user_profiles = {
    "user_001": {"name": "Alice", "email": "alice@example.com"},
    "user_002": {"name": "Bob", "email": "bob@example.com"}
}
print(user_profiles["user_001"]["name"]) # Output: Alice
```

**Use a Set when:**
-   You need a collection of **unique elements** and want to automatically handle duplicates.
-   The order of elements does not matter.
-   You want to efficiently check for the presence of an item (e.g., "Is this item in my collection?").
-   You need to perform mathematical set operations (union, intersection, difference) to compare collections of items.

**Example Use Case:** Finding all unique words in a document, or identifying common elements between two lists of items.
```python
document_words = ["hello", "world", "hello", "python", "world"]
unique_words = set(document_words)
print(unique_words) # Output: {'world', 'hello', 'python'} (order varies)

permissions_group_a = {"read", "write", "execute"}
permissions_group_b = {"read", "delete"}
common_permissions = permissions_group_a.intersection(permissions_group_b)
print(common_permissions) # Output: {'read'}
```

Both dictionaries and sets offer efficient ways to handle data, especially when dealing with large collections where performance matters. Understanding their core characteristics and operations will help you write more effective and Pythonic code.

## Wrap-Up
In this lesson, we've expanded our understanding of Python data structures beyond sequences. You've learned about **dictionaries**, which allow you to store and retrieve data using descriptive key-value pairs, and **sets**, which are perfect for managing unique, unordered collections of items. We also explored the crucial rule that keys and set elements must be immutable (hashable) objects.

These data structures are fundamental to many programming tasks and will be invaluable as you tackle more complex problems. By choosing the right tool—a dictionary for labeled data, a set for unique items—you can write more efficient and readable code. Keep practicing with these new tools, and you'll soon find them indispensable! In the next lesson, we'll explore how to combine these data structures and use them in more advanced scenarios, building on the foundations you've established here.