# Data Structure: Dictionaries

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the concept of key-value pairs and why they are useful.
- Create dictionaries in Python, both empty and pre-filled.
- Access, add, and modify values in a dictionary using their keys.
- Understand and use common dictionary methods like `keys()`, `values()`, and `items()`.
- Identify valid types for dictionary keys.

## Introduction: Beyond Indexed Lists
Imagine you're trying to organize information where one piece of data is directly linked to another. For example, you might have a list of your friends' names and a separate list of their phone numbers. If you wanted to find "Alice's" phone number, you'd first have to find "Alice" in the name list, remember her position (say, the 3rd item), and then look up the 3rd item in the phone number list. This works, but it's a bit indirect and prone to errors if the [lists](/note/python/lists.md) get out of sync.

What if you could simply ask, "What's Alice's phone number?" and get the answer directly? This is where **dictionaries** come in!

Dictionaries are a fundamental data structure in Python designed for storing information in a way that makes intuitive sense: by associating a "key" with a "value." Think of it like a real-world dictionary where you look up a "word" (the key) to find its "definition" (the value), or a phone book where you look up a "name" (the key) to find their "phone number" (the value). This direct lookup by a meaningful identifier is what makes dictionaries incredibly powerful and efficient.

## The Core Idea: Key-Value Pairs
At the heart of every dictionary is the concept of a **key-value pair**. Instead of relying on numerical positions (like indices in a list), dictionaries allow you to store and retrieve data using unique, descriptive keys.

Let's break down a key-value pair:
1.  **The Key**: This is the unique identifier you use to look something up. It's like the word in a dictionary, the name in a phone book, or a product ID in an inventory system. Keys must be unique within a single dictionary.
2.  **The Value**: This is the actual data associated with the key. It's the definition of a word, the phone number for a name, or the price for a product ID. Values can be any type of data, and they don't have to be unique.

Together, a key and its value form a single entry in the dictionary. This pairing creates a direct, meaningful link between two pieces of information.

**Why is this better than [lists](/note/python/lists.md) for certain situations?**
Consider our phone book example again. With [lists](/note/python/lists.md), you might have:
```python
names = ["Alice", "Bob", "Charlie"]
numbers = ["555-1234", "555-5678", "555-9012"]

# To get Bob's number:
bob_index = names.index("Bob") # Find Bob's position
bob_number = numbers[bob_index] # Use that position to get his number
print(f"Bob's number (using lists): {bob_number}")
# Output: Bob's number (using lists): 555-5678
```
This works, but it's a two-step process and relies on the two [lists](/note/python/lists.md) always staying perfectly aligned. With a dictionary, it's much more direct:
```python
phone_book = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Charlie": "555-9012"
}

# To get Bob's number directly:
bob_number_dict = phone_book["Bob"]
print(f"Bob's number (using dictionary): {bob_number_dict}")
# Output: Bob's number (using dictionary): 555-5678
```
Notice how much cleaner and more intuitive the dictionary approach is!

### Creating Your First Dictionary
Creating a dictionary in Python is straightforward. You use curly braces `{}` to define a dictionary.

To create an **empty dictionary**:
```python
empty_dictionary = {}
print(empty_dictionary)
# Output: {}
```
This is useful when you want to build a dictionary by adding key-value pairs later.

To create a dictionary with **initial key-value pairs**:
You list the key-value pairs inside the curly braces. Each key is separated from its value by a colon (`:`), and each key-value pair is separated by a comma (`,`).

```python
# A dictionary mapping student names (keys) to their ages (values)
student_ages = {
    "Alice": 20,
    "Bob": 22,
    "Charlie": 21
}
print(student_ages)
# Output: {'Alice': 20, 'Bob': 22, 'Charlie': 21}

# Another example: mapping product codes to prices
product_prices = {
    "P101": 15.99,
    "P102": 25.50,
    "P103": 5.00
}
print(product_prices)
# Output: {'P101': 15.99, 'P102': 25.5, 'P103': 5.0}
```
As you can see, keys are often strings, but values can be any data type—integers, floats, strings, or even other complex structures like [lists](/note/python/lists.md) or other dictionaries!

[IMAGE_PLACEHOLDER: A simple diagram illustrating a dictionary. It shows a box labeled "student_ages" containing three distinct key-value pairs. Each pair is represented by a smaller box or bubble. The first pair shows "Key: 'Alice'" pointing to "Value: 20". The second shows "Key: 'Bob'" pointing to "Value: 22". The third shows "Key: 'Charlie'" pointing to "Value: 21". Arrows clearly indicate the mapping from key to value. The overall style is clean and easy to understand for beginners.]

### Accessing Values: Retrieving Data with Keys
Once you have a dictionary, the most common operation is to retrieve a value using its associated key. You do this by placing the key inside square brackets `[]` after the dictionary's name, much like you would use an index for a list.

```python
student_ages = {
    "Alice": 20,
    "Bob": 22,
    "Charlie": 21
}

# Get Alice's age
alice_age = student_ages["Alice"]
print(f"Alice's age is: {alice_age}")
# Output: Alice's age is: 20

# Get Bob's age
bob_age = student_ages["Bob"]
print(f"Bob's age is: {bob_age}")
# Output: Bob's age is: 22
```

**What if the key doesn't exist?**
If you try to access a key that isn't present in the dictionary using the square bracket notation, Python will raise a `KeyError`. This error indicates that the key you're looking for simply isn't there.

```python
# This will cause an error!
# print(student_ages["David"])
# Output: KeyError: 'David'
```

To avoid `KeyError` and handle situations where a key might not exist more gracefully, you can use the `get()` method. The `get()` method allows you to specify a default value to return if the key is not found, instead of stopping your program with an error.

```python
# Using get() to safely access a value
david_age = student_ages.get("David", "Not found") # "Not found" is the default value
print(f"David's age is: {david_age}")
# Output: David's age is: Not found

# If the key *does* exist, get() works just like direct access
charlie_age = student_ages.get("Charlie", "Not found")
print(f"Charlie's age is: {charlie_age}")
# Output: Charlie's age is: 21
```
If you don't provide a default value to `get()` and the key isn't found, it will return `None`.

### Adding and Modifying Entries: Changing Your Dictionary
Dictionaries are **mutable**, which means you can change their contents after they've been created. You can easily add new key-value pairs or update the value associated with an existing key.

**Adding a new key-value pair:**
To add a new entry, simply assign a value to a new key using the square bracket notation.

```python
student_ages = {
    "Alice": 20,
    "Bob": 22,
    "Charlie": 21
}

# Add a new student, David, and his age
student_ages["David"] = 23
print(student_ages)
# Output: {'Alice': 20, 'Bob': 22, 'Charlie': 21, 'David': 23}
```

**Modifying an existing value:**
If you assign a value to a key that *already exists* in the dictionary, the old value associated with that key will be overwritten with the new one. Remember, keys must be unique!

```python
# Alice decided to take a gap year and is now a year older!
student_ages["Alice"] = 21
print(student_ages)
# Output: {'Alice': 21, 'Bob': 22, 'Charlie': 21, 'David': 23}
```

### Common Dictionary Methods: Exploring Contents
Python dictionaries come with several built-in methods that help you inspect and work with their contents. The most frequently used are `keys()`, `values()`, and `items()`.

1.  **`keys()`**: This method returns a "view object" that displays a list of all the keys currently in the dictionary. A view object is dynamic, meaning it reflects any changes made to the dictionary after it's created.

    ```python
    student_ages = {
        "Alice": 21,
        "Bob": 22,
        "Charlie": 21,
        "David": 23
    }

    all_keys = student_ages.keys()
    print(all_keys)
    # Output: dict_keys(['Alice', 'Bob', 'Charlie', 'David'])

    # You can easily convert this view object into a standard list if needed:
    list_of_keys = list(all_keys)
    print(list_of_keys)
    # Output: ['Alice', 'Bob', 'Charlie', 'David']
    ```

2.  **`values()`**: Similar to `keys()`, this method returns a view object that displays a list of all the values in the dictionary.

    ```python
    all_values = student_ages.values()
    print(all_values)
    # Output: dict_values([21, 22, 21, 23])

    # Convert to a list:
    list_of_values = list(all_values)
    print(list_of_values)
    # Output: [21, 22, 21, 23]
    ```

3.  **`items()`**: This powerful method returns a view object that displays a list of all the key-value pairs as [tuples](/note/python/tuples.md). Each tuple contains `(key, value)`.

    ```python
    all_items = student_ages.items()
    print(all_items)
    # Output: dict_items([('Alice', 21), ('Bob', 22), ('Charlie', 21), ('David', 23)])

    # Convert to a list of tuples:
    list_of_items = list(all_items)
    print(list_of_items)
    # Output: [('Alice', 21), ('Bob', 22), ('Charlie', 21), ('David', 23)]
    ```
    The `items()` method is especially useful when you want to loop through both keys and values in a dictionary, which we'll explore in a future lesson.

### Important Characteristics of Dictionary Keys
While dictionary values can be almost anything, keys have a couple of crucial rules that ensure dictionaries can function efficiently:

1.  **Keys must be unique**: Every key within a single dictionary must be distinct. If you try to add a key-value pair where the key already exists, Python won't create a new entry. Instead, it will simply update (overwrite) the value associated with that existing key. This is why assigning a value to an existing key modifies it, rather than adding a duplicate.

    ```python
    my_settings = {"theme": "dark", "font_size": 12}
    print(f"Initial settings: {my_settings}")

    my_settings["theme"] = "light" # 'theme' already exists, so its value is updated
    print(f"Settings after updating theme: {my_settings}")
    # Output: Initial settings: {'theme': 'dark', 'font_size': 12}
    # Output: Settings after updating theme: {'theme': 'light', 'font_size': 12}
    ```

2.  **Keys must be immutable**: This means that dictionary keys must be of a type that cannot be changed after they are created. Python needs keys to be stable so it can reliably find them. Common immutable types that work perfectly as keys include:
    *   Numbers (integers, floats)
    *   Strings
    *   [Tuples](/note/python/tuples.md) (as long as all elements *within* the tuple are also immutable)

    Mutable types like [lists](/note/python/lists.md) or other dictionaries **cannot** be used as keys. If you try, Python will raise a `TypeError`.

    ```python
    # Valid keys (immutable types)
    valid_dict = {
        1: "one",                 # Integer key
        "two": 2,                 # String key
        (3, 4): "three-four"      # Tuple key (containing immutable integers)
    }
    print(valid_dict)
    # Output: {1: 'one', 'two': 2, (3, 4): 'three-four'}

    # Invalid key (this would cause an error if uncommented)
    # invalid_dict = {
    #     [1, 2]: "a list key" # TypeError: unhashable type: 'list'
    # }
    ```
    Don't worry too much about the technical details of "immutability" and "hashable" for now. The key takeaway is that strings, numbers, and [tuples](/note/python/tuples.md) are generally safe to use as keys, while [lists](/note/python/lists.md) and other dictionaries are not.

## Wrap-Up: The Power of Dictionaries
Congratulations! You've just unlocked the power of dictionaries, a fundamental and incredibly useful data structure in Python. We started by understanding the intuitive idea of key-value pairs, much like a phone book, and learned how to:
*   Create dictionaries, both empty and pre-filled.
*   Access values directly using their keys.
*   Safely retrieve values using `get()` to avoid errors.
*   Add new key-value pairs and modify existing ones.
*   Use essential methods like `keys()`, `values()`, and `items()` to explore your dictionary's contents.
*   Understand the crucial rules that govern dictionary keys: they must be unique and immutable.

Dictionaries are incredibly versatile and you'll find yourself using them constantly to organize and retrieve data efficiently in your Python programs. In the next lesson, we'll explore how to iterate through dictionaries and perform more advanced operations, further enhancing your ability to work with this powerful data structure.