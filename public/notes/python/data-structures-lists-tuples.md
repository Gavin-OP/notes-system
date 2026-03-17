# Data Structures: Lists and Tuples

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand what lists and tuples are and why they are useful for organizing data.
- Differentiate between lists (mutable) and tuples (immutable) in Python.
- Access individual elements and subsets of elements using indexing and slicing.
- Perform common operations on lists, such as adding, removing, and modifying elements.
- Choose the appropriate data structure (list or tuple) based on your program's needs.

## Introduction
Imagine you're building a program to manage your favorite books. You could store each book's title in a separate variable: `book1 = "The Hitchhiker's Guide to the Galaxy"`, `book2 = "Pride and Prejudice"`, and so on. But what if you have hundreds of books? Or what if you want to add a new book, or remove one you've finished? This approach quickly becomes messy and unmanageable.

This is where **[data structures](../python/data-structures-dictionaries-sets.md)** come in! Data structures are like specialized containers that help us organize and store related pieces of information efficiently. In Python, two of the most fundamental and widely used data structures are **lists** and **tuples**. They allow you to store multiple items in a single variable, making your code cleaner, more powerful, and easier to manage.

In this lesson, we'll explore lists and tuples, understand their unique characteristics, and learn how to use them effectively to manage collections of data.

## Concept Progression

### Organizing Your Data: The Need for Sequences

Before diving into lists and tuples, let's think about the problem they solve. When you have a collection of items – like a shopping list, a list of student names, or the colors of a rainbow – you often need to keep them together in a specific order. You might want to refer to the first item, the last item, or a range of items.

This idea of an ordered collection of items is called a **sequence**. Both lists and tuples are types of sequences in Python. They allow you to store multiple values in a specific order, and each item in the sequence has a position.

### Lists: Your Flexible Shopping Cart

Let's start with **lists**. Lists are one of Python's most versatile built-in [data structures](../python/data-structures-dictionaries-sets.md). Think of a list like a shopping cart: you can put items in it, take items out, change your mind about an item, and the order of items matters.

**Why use a list?**
You use a list when you need to store a collection of items that might change over time. For example, a list of tasks for a project, a list of scores in a game, or a list of users currently logged in.

**How to create a list:**
In Python, you create a list by placing all the items (elements) inside square brackets `[]`, separated by commas.

```python
# A list of fruits
fruits = ["apple", "banana", "cherry", "date"]
print(f"Fruits list: {fruits}")

# A list of numbers
numbers = [10, 20, 30, 40, 50]
print(f"Numbers list: {numbers}")

# A list can even contain different types of data
mixed_list = ["hello", 123, True, 3.14]
print(f"Mixed list: {mixed_list}")
```

#### Accessing Elements: Indexing

Once you have a list, you'll often want to get a specific item from it.

**Why access elements?**
Imagine you want to know what the first fruit on your `fruits` list is, or you need to update the score of a specific player. You need a way to point to individual items.

**How to access elements (Indexing):**
Each item in a list has a unique position, called an **index**. In Python (and many other programming languages), indexing starts from `0`. This means the first item is at index `0`, the second at `1`, and so on.

You access an item using its index inside square brackets after the list's name: `list_name[index]`.

```python
fruits = ["apple", "banana", "cherry", "date"]

# Get the first fruit (index 0)
first_fruit = fruits[0]
print(f"The first fruit is: {first_fruit}") # Output: The first fruit is: apple

# Get the third fruit (index 2)
third_fruit = fruits[2]
print(f"The third fruit is: {third_fruit}") # Output: The third fruit is: cherry
```

Python also supports **negative indexing**, which allows you to access elements from the end of the list. The last item is at index `-1`, the second to last at `-2`, and so on.

```python
fruits = ["apple", "banana", "cherry", "date"]

# Get the last fruit (index -1)
last_fruit = fruits[-1]
print(f"The last fruit is: {last_fruit}") # Output: The last fruit is: date

# Get the second to last fruit (index -2)
second_to_last_fruit = fruits[-2]
print(f"The second to last fruit is: {second_to_last_fruit}") # Output: The second to last fruit is: cherry
```

[IMAGE_PLACEHOLDER: A diagram illustrating list indexing. Show a list of 4 items (e.g., "apple", "banana", "cherry", "date") in boxes. Above the boxes, show positive indices (0, 1, 2, 3). Below the boxes, show negative indices (-4, -3, -2, -1). Arrows point from indices to their corresponding items.]

#### Accessing Subsets: Slicing

Sometimes you don't just want one item; you want a portion of the list.

**Why use slicing?**
Imagine you have a list of all students in a school, and you only want to see the students in grades 3 through 5. Or you have a list of daily temperatures for a month and want to analyze only the temperatures from the first week. Slicing lets you extract a sub-list.

**How to access subsets (Slicing):**
Slicing allows you to get a range of items from a list. You specify a `start` index and an `end` index, separated by a colon: `list_name[start:end]`.

Important rules for slicing:
- The slice **includes** the item at the `start` index.
- The slice **excludes** the item at the `end` index. (Think of it as "up to, but not including" the end).

```python
numbers = [10, 20, 30, 40, 50, 60, 70]

# Get elements from index 1 up to (but not including) index 4
subset1 = numbers[1:4]
print(f"Subset 1 (numbers[1:4]): {subset1}") # Output: Subset 1 (numbers[1:4]): [20, 30, 40]

# If you omit the start index, it defaults to 0
subset2 = numbers[:3] # From the beginning up to (but not including) index 3
print(f"Subset 2 (numbers[:3]): {subset2}") # Output: Subset 2 (numbers[:3]): [10, 20, 30]

# If you omit the end index, it defaults to the end of the list
subset3 = numbers[4:] # From index 4 to the end
print(f"Subset 3 (numbers[4:]): {subset3}") # Output: Subset 3 (numbers[4:]): [50, 60, 70]

# To copy the entire list
all_numbers = numbers[:]
print(f"All numbers (copy using slicing): {all_numbers}") # Output: All numbers (copy using slicing): [10, 20, 30, 40, 50, 60, 70]
```

[IMAGE_PLACEHOLDER: A diagram illustrating list slicing. Show a list of 7 items (e.g., numbers 10-70) in boxes with their indices (0-6). Show an arrow indicating `numbers[1:4]` highlighting items at index 1, 2, 3. Show another arrow for `numbers[:3]` highlighting 0, 1, 2. Show a third arrow for `numbers[4:]` highlighting 4, 5, 6.]

#### Changing Lists: Mutability

One of the most powerful features of lists is that they are **mutable**. This means you can change them after they've been created. You can add new items, remove existing items, or modify items in place. This is why we compared them to a flexible shopping cart!

**Why is mutability important?**
Real-world data often changes. A list of pending tasks needs new tasks added and completed tasks removed. A list of stock prices needs to be updated. Mutability allows your [data structures](../python/data-structures-dictionaries-sets.md) to reflect these changes dynamically.

**How to modify lists:**

1.  **Changing an item:**
    You can change an item by assigning a new value to a specific index.

    ```python
    fruits = ["apple", "banana", "cherry", "date"]
    print(f"Original fruits: {fruits}")

    # Change "banana" to "grape"
    fruits[1] = "grape"
    print(f"Modified fruits (changed index 1): {fruits}") # Output: Modified fruits (changed index 1): ['apple', 'grape', 'cherry', 'date']
    ```

2.  **Adding items:**
    *   `append()`: Adds an item to the end of the list.

        ```python
        fruits.append("elderberry")
        print(f"After append('elderberry'): {fruits}") # Output: After append('elderberry'): ['apple', 'grape', 'cherry', 'date', 'elderberry']
        ```

    *   `insert()`: Adds an item at a specific index. `list.insert(index, item)`

        ```python
        fruits.insert(1, "blueberry") # Insert "blueberry" at index 1
        print(f"After insert(1, 'blueberry'): {fruits}") # Output: After insert(1, 'blueberry'): ['apple', 'blueberry', 'grape', 'cherry', 'date', 'elderberry']
        ```

3.  **Removing items:**
    *   `remove()`: Removes the *first occurrence* of a specified value.

        ```python
        fruits.remove("grape")
        print(f"After remove('grape'): {fruits}") # Output: After remove('grape'): ['apple', 'blueberry', 'cherry', 'date', 'elderberry']
        ```

    *   `pop()`: Removes and returns the item at a specified index. If no index is given, it removes and returns the last item.

        ```python
        removed_fruit = fruits.pop(0) # Remove the first item
        print(f"Removed fruit with pop(0): {removed_fruit}") # Output: Removed fruit with pop(0): apple
        print(f"After pop(0): {fruits}") # Output: After pop(0): ['blueberry', 'cherry', 'date', 'elderberry']

        last_removed = fruits.pop() # Remove the last item
        print(f"Removed last fruit with pop(): {last_removed}") # Output: Removed last fruit with pop(): elderberry
        print(f"After pop(): {fruits}") # Output: After pop(): ['blueberry', 'cherry', 'date']
        ```

    *   `del` statement: Unlike `remove()` and `pop()` which are list methods, `del` is a Python statement that can remove an item at a specific index or even a slice of items from a list.

        ```python
        my_list = [1, 2, 3, 4, 5]
        print(f"Original my_list: {my_list}")
        del my_list[1] # Delete item at index 1 (which is 2)
        print(f"After del my_list[1]: {my_list}") # Output: After del my_list[1]: [1, 3, 4, 5]

        del my_list[1:3] # Delete items from index 1 up to (not including) 3 (which are 3 and 4)
        print(f"After del my_list[1:3]: {my_list}") # Output: After del my_list[1:3]: [1, 5]
        ```

### Tuples: Your Immutable Recipe Card

Now let's look at **tuples**. If a list is like a flexible shopping cart, a tuple is more like a recipe card. Once the recipe is written, you don't typically change the ingredients or their order on *that specific card*. You might make a new recipe card, but you don't alter the original.

**Why use a tuple?**
You use a tuple when you need to store a collection of items that should *not* change after they are created. For example, the coordinates of a point (latitude, longitude), the days of the week, or the RGB values of a color. These are fixed sets of values.

**How to create a tuple:**
You create a tuple by placing all the items inside parentheses `()`, separated by commas.

```python
# A tuple of coordinates
coordinates = (10.0, 20.5)
print(f"Coordinates tuple: {coordinates}")

# A tuple of colors
colors = ("red", "green", "blue")
print(f"Colors tuple: {colors}")

# A tuple can also contain different types of data
mixed_tuple = ("Python", 3, True)
print(f"Mixed tuple: {mixed_tuple}")

# A tuple with a single item needs a comma!
# Without the comma, Python treats it as a regular expression in parentheses.
single_item_tuple = ("hello",)
print(f"Single item tuple: {single_item_tuple}")
print(f"Type of single_item_tuple: {type(single_item_tuple)}") # Output: <class 'tuple'>

not_a_tuple = ("hello")
print(f"Type of not_a_tuple: {type(not_a_tuple)}") # Output: <class 'str'>
```

#### Accessing Elements: Indexing and Slicing (Just like Lists!)

Good news! Accessing elements in a tuple works exactly the same way as with lists, using indexing and slicing. This is because both are **sequences** and share these fundamental operations.

```python
colors = ("red", "green", "blue", "yellow", "purple")

# Accessing by index
first_color = colors[0]
print(f"First color: {first_color}") # Output: First color: red

last_color = colors[-1]
print(f"Last color: {last_color}") # Output: Last color: purple

# Slicing
subset_colors = colors[1:4] # From index 1 up to (not including) 4
print(f"Subset of colors: {subset_colors}") # Output: Subset of colors: ('green', 'blue', 'yellow')
```

#### Immutability: Tuples Cannot Change

The key difference between lists and tuples is that tuples are **immutable**. Once a tuple is created, you cannot add, remove, or change its elements. Any attempt to do so will result in an error. This is why they are like a "recipe card" – once written, it's fixed.

**Why is immutability important?**
Immutability provides data integrity. If you have data that should never be accidentally modified (like configuration settings, database records, or fixed constants), using a tuple ensures that it remains constant throughout your program's execution. It also makes your code more predictable and can sometimes offer performance benefits.

```python
coordinates = (10.0, 20.5)
print(f"Original coordinates: {coordinates}")

# Attempting to change an element will cause an error!
# coordinates[0] = 15.0 # This line would raise a TypeError: 'tuple' object does not support item assignment
# print(coordinates)

# Attempting to add an element will cause an error!
# coordinates.append(30.0) # This line would raise an AttributeError: 'tuple' object has no attribute 'append'

# Attempting to remove an element will cause an error!
# del coordinates[0] # This line would raise a TypeError: 'tuple' object doesn't support item deletion
```
If you need to "change" a tuple, you actually have to create a *new* tuple with the desired modifications.

```python
old_coordinates = (10, 20)
new_x = 15
# Create a new tuple with the updated x-coordinate
new_coordinates = (new_x, old_coordinates[1])
print(f"Old coordinates: {old_coordinates}") # Output: Old coordinates: (10, 20)
print(f"New coordinates: {new_coordinates}") # Output: New coordinates: (15, 20)
```

### Lists vs. Tuples: Choosing the Right Tool

Now that you understand both, how do you decide when to use a list and when to use a tuple? The choice often comes down to whether the data needs to change or remain constant.

| Feature        | Lists (`[]`)                               | Tuples (`()`)                               |
| :------------- | :----------------------------------------- | :------------------------------------------ |
| **Mutability** | **Mutable** (can be changed after creation)| **Immutable** (cannot be changed after creation) |
| **Syntax**     | Square brackets `[]`                       | Parentheses `()`                            |
| **Use Cases**  | Collections that change (e.g., shopping list, tasks, game scores) | Collections that are fixed (e.g., coordinates, RGB colors, database records) |
| **Performance**| Slightly slower for iteration/creation     | Slightly faster for iteration/creation      |
| **Memory**     | Slightly more memory overhead              | Slightly less memory overhead               |

**When to use a List:**
- When you expect the collection of items to grow, shrink, or change frequently.
- When you need to modify individual elements.
- Examples: A list of user inputs, a queue of pending operations, a dynamic inventory.

**When to use a Tuple:**
- When you have a collection of items that should remain constant throughout the program.
- When you want to ensure data integrity and prevent accidental modifications.
- When you're representing a fixed record (like a point in space, a date, or a person's name and age).
- Examples: RGB color codes `(255, 0, 0)`, database records `("John Doe", 30, "Engineer")`, configuration settings.

## Wrap-Up
Congratulations! You've taken a significant step in organizing your data by learning about lists and tuples. You now understand that both are ordered sequences, but lists are flexible and mutable (like a shopping cart), while tuples are fixed and immutable (like a recipe card). You've also learned how to access elements using indexing and slicing, and how to modify lists.

Choosing between a list and a tuple depends on whether the data you're storing needs to change or remain constant. Mastering these fundamental [data structures](../python/data-structures-dictionaries-sets.md) will make your Python programs more robust, efficient, and easier to manage. In the next lesson, we'll explore other powerful ways to organize data!