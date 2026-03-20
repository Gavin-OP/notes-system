<a id="concept-python-data-structures-sequences"></a>
# Python Data Structures: Sequences (Lists, Tuples, Strings)

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand the fundamental concept of a "sequence" in Python.
- Differentiate between Python lists, tuples, and strings based on their mutability.
- Access individual elements within sequences using zero-based indexing.
- Extract portions of sequences using slicing with `start`, `end`, and `step` parameters.
- Create new lists efficiently using list comprehensions.

## Introduction
Imagine you have a collection of items you want to keep together and in a specific order. Perhaps it's a shopping list, a series of steps in a recipe, or the letters that form a word. In programming, we frequently need to store and manage such ordered collections of data. This is where **data structures** become incredibly useful!

In Python, some of the most fundamental and frequently used data structures for ordered collections are called **sequences**. They allow you to store multiple pieces of data in a single variable, and crucially, each piece has its own specific position. This lesson will introduce you to three core sequence types: **lists**, **tuples**, and **strings**, and teach you how to work with them effectively. Understanding sequences is a crucial step in becoming a proficient Python programmer, as they are the building blocks for many more complex operations and data manipulations.

## Concept Progression

### Understanding Sequences: Ordered Collections
At its heart, a **sequence** in Python is simply an ordered collection of items. Think of it like a line of people waiting for a bus, or a row of books on a shelf. Each person or book has a specific spot, and their order matters. This "order" is the defining characteristic of a sequence.

The items within a sequence don't have to be of the same type. You could have a sequence containing numbers, text, or even other sequences!

Because sequences are ordered, each element has a specific position. We can refer to this position using an **index**.

<a id="concept-array-index"></a>
#### Indexing: Finding Items by Position
Since sequences are ordered, we need a way to pinpoint each item. That's where **indexing** comes in. An index is like an address for an item within the sequence. In Python, like many other programming languages, indexing starts from zero. This is called **zero-based numbering**. So, the first item is at index `0`, the second at `1`, and so on.

Let's look at an example with a list of fruits:

```python
fruits = ["apple", "banana", "cherry", "date"]

# Accessing elements using positive indices
print(fruits[0]) # Output: apple (the first item)
print(fruits[2]) # Output: cherry (the third item)
```

Python also allows you to use negative indices to count from the end of the sequence. The last item is at index `-1`, the second to last at `-2`, and so forth. This is very handy for quickly accessing items from the end without knowing the sequence's length.

```python
print(fruits[-1]) # Output: date (the last item)
print(fruits[-3]) # Output: banana (the third item from the end)
```

[IMAGE_PLACEHOLDER: Diagram showing a list of four fruits: "apple", "banana", "cherry", "date". Each fruit is in a box. Above the boxes, positive indices 0, 1, 2, 3 are shown. Below the boxes, negative indices -4, -3, -2, -1 are shown. Arrows point from indices to their corresponding fruit.]

It's important to remember that if you try to access an index that doesn't exist (e.g., `fruits[4]` for a list of four items, or `fruits[-5]`), Python will raise an `IndexError`.

### Python Lists: Your Flexible Shopping Cart
**Lists** are arguably the most common and versatile sequence type in Python. They are like a shopping cart where you can add, remove, or change items at any time. This characteristic is known as **mutability**. A **mutable object** is one whose state (its contents) can be modified after it is created.

#### Creating Lists
You can create a list by enclosing a comma-separated sequence of items within square brackets `[]`:

```python
my_list = [1, 2, 3, "hello", True] # Lists can hold items of different types
empty_list = []                    # An empty list
```

#### Modifying Lists (Because They Are Mutable!)
Since lists are mutable, you have a lot of control over their contents:

1.  **Changing an element:** You can assign a new value to an existing index.
    ```python
    my_list = ["apple", "banana", "cherry"]
    my_list[1] = "orange" # Change "banana" to "orange"
    print(my_list)        # Output: ['apple', 'orange', 'cherry']
    ```

2.  **Adding elements:**
    -   `append(item)`: Adds an item to the very end of the list.
        ```python
        my_list.append("grape")
        print(my_list) # Output: ['apple', 'orange', 'cherry', 'grape']
        ```
    -   `insert(index, item)`: Adds an item at a specific position, shifting subsequent elements to the right.
        ```python
        my_list.insert(1, "kiwi") # Insert "kiwi" at index 1
        print(my_list)            # Output: ['apple', 'kiwi', 'orange', 'cherry', 'grape']
        ```

3.  **Removing elements:**
    -   `remove(item)`: Removes the *first* occurrence of a specific value from the list. If the item isn't found, it raises a `ValueError`.
        ```python
        my_list.remove("orange")
        print(my_list) # Output: ['apple', 'kiwi', 'cherry', 'grape']
        ```
    -   `pop(index)`: Removes and returns the item at a specific index. If no index is given, it removes and returns the last item.
        ```python
        popped_item = my_list.pop(0) # Remove and get item at index 0
        print(popped_item)           # Output: apple
        print(my_list)               # Output: ['kiwi', 'cherry', 'grape']
        ```

<a id="concept-list"></a>
<a id="concept-list-comprehension"></a>
#### List Comprehensions: Quick and Elegant List Building
**List comprehensions** provide a concise and powerful way to create new lists based on existing iterables (like other lists, ranges, or strings). They are often much more readable and efficient than traditional `for loops` for simple list creation or transformation.

The basic syntax is `[expression for item in iterable if condition]`. The `if condition` part is optional.

Let's say you want a list of squares of numbers from 0 to 4:

```python
squares = [x**2 for x in range(5)]
print(squares) # Output: [0, 1, 4, 9, 16]
```
This single line replaces a multi-line `for` loop, making your code cleaner.

You can also add a condition to filter items:

```python
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares) # Output: [0, 4, 16, 36, 64]
```
List comprehensions are a hallmark of Pythonic code and a feature you'll use constantly!

### Python Tuples: Your Immutable Records
While lists are designed for flexibility, sometimes you need a collection that *cannot* be changed after it's created. This is where **tuples** shine. Tuples are another type of sequence in Python, but they have a crucial difference from lists: they are **immutable**. This means once a tuple is created, you cannot change its contents (add, remove, or modify elements).

#### Creating Tuples
You create a tuple by enclosing a comma-separated sequence of items within parentheses `()`:

```python
my_tuple = (10, 20, "python", False)
empty_tuple = ()
single_item_tuple = (5,) # IMPORTANT: Note the comma! Without it, Python treats (5) as just the integer 5.
```

Interestingly, if you omit the parentheses, Python often infers it's a tuple, especially for multiple items:

```python
another_tuple = 1, 2, 3
print(another_tuple) # Output: (1, 2, 3)
```

#### Why Use Tuples?
Since you can't change tuples, why use them? They offer several advantages:
1.  **Data Integrity:** If you have a collection of related data that should not change, a tuple ensures its integrity. For example, geographical coordinates `(latitude, longitude)` or a date `(year, month, day)` are often best represented as tuples.
2.  **Performance:** Tuples are generally faster to iterate over and access than lists because their size is fixed, allowing Python to optimize their storage.
3.  **Dictionary Keys:** Only immutable objects can be used as keys in dictionaries. If you need a sequence as a dictionary key, it must be a tuple (or a string, or a number). Lists cannot be dictionary keys.

#### Immutability in Action
Let's try to modify a tuple to see its immutable nature:

```python
coordinates = (10, 20)
# The following line would cause an error:
# coordinates[0] = 15 # This will raise a TypeError!
# print(coordinates)
```
If you uncomment and run the line `coordinates[0] = 15`, you'll get an error like `TypeError: 'tuple' object does not support item assignment`. This is Python's way of telling you that you cannot change an [immutable object](../python/python-data-types-and-variables.md#concept-immutable-object).

If you need a "modified" version of a tuple, you must create a *new* tuple based on the existing one:

```python
old_tuple = (1, 2, 3)
new_tuple = old_tuple + (4,) # Creates a new tuple (1, 2, 3, 4)
print(new_tuple)             # Output: (1, 2, 3, 4)
print(old_tuple)             # Output: (1, 2, 3) (The original tuple is unchanged)
```

### Python Strings: Sequences of Characters
You've been using strings since the very beginning of your Python journey! Now, let's look at them through the lens of sequences. A string is simply a **sequence of characters**. Just like tuples, strings are **immutable**. Once a string is created, you cannot change individual characters within it.

#### Creating Strings
You can create strings using single quotes `''`, double quotes `""`, or triple quotes `''' '''` or `""" """` for multi-line strings:

```python
name = "Alice"
message = 'Hello, world!'
long_text = """This is a
multi-line string.
It preserves line breaks."""
```

#### String Operations (Many are shared with other sequences!)
Strings support many operations common to all sequences, plus some string-specific methods:

1.  **Indexing:** Access individual characters.
    ```python
    word = "Python"
    print(word[0])  # Output: P
    print(word[-1]) # Output: n
    ```

2.  **Concatenation:** Combine strings using the `+` operator.
    ```python
    greeting = "Hello"
    name = "World"
    full_greeting = greeting + ", " + name + "!"
    print(full_greeting) # Output: Hello, World!
    ```

3.  **Repetition:** Repeat a string using the `*` operator.
    ```python
    print("abc" * 3) # Output: abcabcabc
    ```

#### Immutability of Strings
Just like tuples, you cannot change a string after it's created. Attempting to modify a character by index will result in a `TypeError`:

```python
my_string = "hello"
# The following line would cause an error:
# my_string[0] = "J" # This will raise a TypeError!
# print(my_string)
```
If you want to "change" a string, you must create a *new* string based on the old one. For example, to change "hello" to "jello", you'd do:

```python
my_string = "hello"
new_string = "j" + my_string[1:] # We'll learn about `my_string[1:]` in the next section!
print(new_string)                # Output: jello
```
Here, we're taking the first character "j" and concatenating it with a *slice* of `my_string` (all characters from index 1 to the end), which effectively creates a new string "ello". The result is a brand new string "jello".

<a id="concept-array-slicing"></a>
### Slicing Sequences: Taking a Piece
Beyond accessing single elements with indexing, Python offers a powerful way to extract *portions* of sequences: **slicing**. Slicing allows you to create new sequences (lists, tuples, or strings) from existing ones without affecting the original.

The general syntax for slicing is `[start:end:step]`.

-   `start`: The index where the slice begins (inclusive). If omitted, it defaults to `0` (the beginning of the sequence).
-   `end`: The index where the slice ends (**exclusive**). This is a very important concept, often referred to as a **half-open interval**. It means the element at the `end` index is *not* included in the slice. If omitted, it defaults to the end of the sequence.
-   `step`: How many items to skip between elements (defaults to `1`). A `step` of `2` means take every second element.

The `end` index being **exclusive** means that the slice will contain elements from `start` up to, but *not including*, the element at `end`. This makes it easy to calculate the length of a slice (`end - start`).

Let's see some examples across different sequence types:

```python
my_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
my_tuple = ("a", "b", "c", "d", "e")
my_string = "Programming"

# Basic slicing: [start:end]
print(my_list[2:6])    # Output: [2, 3, 4, 5] (elements from index 2 up to, but not including, 6)
print(my_tuple[1:4])   # Output: ('b', 'c', 'd')
print(my_string[0:7])  # Output: Program

# Omitting start or end
print(my_list[:5])     # Output: [0, 1, 2, 3, 4] (from beginning up to, but not including, 5)
print(my_tuple[2:])    # Output: ('c', 'd', 'e') (from index 2 to the end)
print(my_string[:])    # Output: Programming (a copy of the entire string)

# Using step: [start:end:step]
print(my_list[1:8:2])  # Output: [1, 3, 5, 7] (from index 1 to 8, taking every 2nd element)
print(my_string[::3])  # Output: Prm (from beginning to end, taking every 3rd element)

# Negative step (a common trick for reversing a sequence!)
print(my_list[::-1])   # Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] (reverses the list)
print(my_string[::-1]) # Output: gnimmargorP (reverses the string)
```

[IMAGE_PLACEHOLDER: Diagram illustrating Python slicing on a list of numbers `[0, 1, 2, 3, 4, 5]`. Show indices 0 to 5 above the elements. Demonstrate a slice `[1:4]` with a bracket under elements 1, 2, 3, and an arrow pointing to the result `[1, 2, 3]`. Clearly label 'start' (inclusive) and 'end' (exclusive) points.]

Remember, slicing always creates a *new* sequence. For mutable types like lists, this means the original list remains unchanged. For immutable types like tuples and strings, this is the only way to "modify" them – by creating a new one with the desired changes.

## Wrap-Up
Congratulations! You've taken a deep dive into Python's fundamental sequence data structures: lists, tuples, and strings. You now understand that sequences are ordered collections of items, and you can access their elements using zero-based indexing and extract sub-sequences using powerful slicing techniques.

The key takeaway from this lesson is the concept of **mutability**:
-   **Lists** are **mutable**, meaning you can change their elements, add new ones, or remove existing ones after creation. They are your flexible, dynamic collections.
-   **Tuples** and **strings** are **immutable**, meaning their contents cannot be altered once they are created. Any "modification" actually results in a new tuple or string being generated. They are best for fixed, unchanging data.

These sequence types are incredibly important in Python programming. You'll use them constantly to organize data, process text, and build more complex applications. In upcoming lessons, we'll explore other data structures like dictionaries and sets, and see how they complement sequences in Python's rich toolkit. Keep practicing with indexing and slicing – they are essential skills!