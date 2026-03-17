# Data Structure: Lists

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain what a list is and identify scenarios where it's a useful data structure.
- Create lists to store collections of various [data types](/note/python/python-basics-and-variables.md).
- Access individual elements and sub-sections of a list using indexing and slicing.
- Modify, add, and remove elements from a list, understanding the concept of mutability.
- Utilize common list methods to perform operations like sorting, counting, and finding elements.

## Introduction
Imagine you're organizing a party. You need to keep track of guests, a shopping list for ingredients, and a playlist of songs. If you had to store each guest's name, each item on your shopping list, or each song title in a separate, individual variable, things would get messy very quickly! Managing hundreds of individual variables would be a nightmare.

This is where **lists** come in handy. In Python, a list is like a versatile container that can hold an ordered collection of items. Think of it as a single, organized place to store multiple pieces of related information under one name. Lists are incredibly versatile and are one of the most fundamental [data structures](/note/python/dictionaries.md) you'll use in Python programming. They allow you to manage collections of data efficiently, making your code cleaner, more powerful, and much easier to work with.

## Concept Progression

### What are Lists and Why Do We Need Them?
As we saw in the introduction, trying to manage many individual pieces of related data with separate variables quickly becomes impractical. This is precisely the problem lists solve.

At its core, a list is an **ordered sequence of items**. The "ordered" part is important because it means the items maintain a specific position, and you can refer to them by that position. The "sequence of items" part means you can store multiple things together, regardless of their data type.

Let's revisit our friends example. If you wanted to store the names of your three best friends using individual variables:

```python
friend1 = "Alice"
friend2 = "Bob"
friend3 = "Charlie"
```

This works for a small number of friends. But what if you have 10 friends? Or 100? Creating 100 separate variables would be tedious and unmanageable. What if you wanted to print all their names? You'd have to print each variable individually.

With a list, you can store all your friends' names in one place:

```python
friends = ["Alice", "Bob", "Charlie"]
```

Now, `friends` is a single variable that holds all three names. This makes it much easier to manage, iterate through (which you learned about with [loops](../python/loops.md)), and perform operations on the entire collection. Lists are the go-to data structure when you need to store multiple items in a specific order.

### Creating Your First List
Now that we understand *why* lists are useful, let's see *how* to create them. Creating a list in Python is straightforward. You simply enclose a comma-separated sequence of items within square brackets `[]`.

A powerful feature of lists is that they can hold items of different [data types](/note/python/python-basics-and-variables.md). You can have numbers, strings, booleans, and even other lists all within the same list!

Let's look at some examples:

```python
# A list of numbers (integers)
ages = [25, 30, 22, 28]
print(f"Ages: {ages}")

# A list of strings
fruits = ["apple", "banana", "cherry", "date"]
print(f"Fruits: {fruits}")

# A list with mixed data types
mixed_list = ["hello", 123, True, 3.14]
print(f"Mixed list: {mixed_list}")

# An empty list (useful as a starting point)
empty_list = []
print(f"Empty list: {empty_list}")
```

Notice how each item is separated by a comma, and the entire collection is wrapped in `[]`. This is the fundamental syntax for creating lists.

### Accessing Elements: Indexing
Once you've stored data in a list, the next crucial step is to retrieve specific pieces of information. This is done using **indexing**. Each item in a list has a unique position, or "index," which is an integer number.

A crucial concept to remember in Python (and many other programming languages) is that lists are **zero-indexed**. This means the first item is at index `0`, the second at index `1`, the third at index `2`, and so on.

To access an element, you use square brackets after the list's name, followed by the index number: `list_name[index]`.

```python
fruits = ["apple", "banana", "cherry", "date"]

# Accessing the first element (at index 0)
first_fruit = fruits[0]
print(f"The first fruit is: {first_fruit}") # Output: The first fruit is: apple

# Accessing the third element (at index 2)
third_fruit = fruits[2]
print(f"The third fruit is: {third_fruit}") # Output: The third fruit is: cherry
```

Python also allows **negative indexing**, which counts from the end of the list. This is very convenient when you want to access items from the end without knowing the list's exact length. The last item is at index `-1`, the second to last at `-2`, and so on.

```python
fruits = ["apple", "banana", "cherry", "date"]

# Accessing the last element (at index -1)
last_fruit = fruits[-1]
print(f"The last fruit is: {last_fruit}") # Output: The last fruit is: date

# Accessing the second to last element (at index -2)
second_to_last_fruit = fruits[-2]
print(f"The second to last fruit is: {second_to_last_fruit}") # Output: The second to last fruit is: cherry
```

[IMAGE_PLACEHOLDER: A diagram illustrating list indexing. Show a list of 5 elements, e.g., `['A', 'B', 'C', 'D', 'E']`. Above the elements, show positive indices `0, 1, 2, 3, 4`. Below the elements, show negative indices `-5, -4, -3, -2, -1`. Arrows should point from the indices to their corresponding elements.]

Be careful when using indexing! If you try to access an index that doesn't exist (e.g., `fruits[10]` for a list of only 4 items), Python will raise an `IndexError`.

### Accessing Multiple Elements: Slicing
Sometimes you don't just want one item; you want a portion, or a "slice," of the list. **Slicing** allows you to extract a sub-list (a new list containing a sequence of elements) from an existing list.

The syntax for slicing is `list_name[start:end:step]`:
-   `start`: The index where the slice begins (inclusive). If omitted, it defaults to `0` (the beginning of the list).
-   `end`: The index where the slice ends (exclusive). The element at this index is *not* included. If omitted, it defaults to the end of the list.
-   `step`: How many items to skip between elements (optional). If omitted, it defaults to `1` (taking every element).

Let's see slicing in action:

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Get elements from index 2 up to (but not including) index 5
slice1 = numbers[2:5]
print(f"numbers[2:5]: {slice1}") # Output: [2, 3, 4]

# Get elements from the beginning up to (but not including) index 4
slice2 = numbers[:4]
print(f"numbers[:4]: {slice2}") # Output: [0, 1, 2, 3]

# Get elements from index 6 to the end of the list
slice3 = numbers[6:]
print(f"numbers[6:]: {slice3}") # Output: [6, 7, 8, 9]

# Get a copy of the entire list (omitting both start and end)
slice4 = numbers[:]
print(f"numbers[:]: {slice4}") # Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Get every second element from index 1 up to (but not including) index 8
slice5 = numbers[1:8:2]
print(f"numbers[1:8:2]: {slice5}") # Output: [1, 3, 5, 7]

# A common trick: Reverse the list using a step of -1
reversed_list = numbers[::-1]
print(f"numbers[::-1]: {reversed_list}") # Output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

[IMAGE_PLACEHOLDER: A diagram illustrating list slicing. Show a list of 10 elements with indices 0-9. Demonstrate `list[2:7]` by highlighting elements at indices 2, 3, 4, 5, 6. Show `list[:5]` highlighting 0-4. Show `list[5:]` highlighting 5-9. Clearly label the start and end points and indicate that the end index is exclusive.]

It's important to remember that slicing always returns a *new* list, which is a copy of the selected elements. The original list remains unchanged by a slicing operation.

### Modifying Lists: Mutability in Action
One of the most powerful and distinguishing features of Python lists is that they are **mutable**. This means you can change their contents *after* they have been created, without having to create an entirely new list. You can modify individual elements, add new elements, or remove existing ones directly within the list. This is a key difference from other [data types](/note/python/python-basics-and-variables.md) like strings, which are immutable (you can't change a string once it's created; any "modification" actually creates a new string).

Let's explore how to leverage this mutability.

#### Changing Individual Elements
To change an element, you simply access it by its index and assign a new value. The list is updated in-place.

```python
tasks = ["buy groceries", "clean room", "pay bills"]
print(f"Original tasks: {tasks}")

# Change the second task (at index 1)
tasks[1] = "walk dog"
print(f"Modified tasks: {tasks}") # Output: ['buy groceries', 'walk dog', 'pay bills']
```

#### Adding Elements
There are a few ways to add elements to a list, each suited for different scenarios:

1.  **`append()`**: Adds a single item to the *end* of the list. This is the most common way to add items.

    ```python
    shopping_list = ["milk", "bread"]
    print(f"Initial shopping list: {shopping_list}")
    shopping_list.append("eggs")
    print(f"After append 'eggs': {shopping_list}") # Output: ['milk', 'bread', 'eggs']
    ```

2.  **`insert()`**: Adds an item at a specific index. It takes two arguments: the index where the item should be placed, and the item itself. Existing elements shift to the right.

    ```python
    shopping_list = ["milk", "eggs"]
    print(f"Initial shopping list: {shopping_list}")
    shopping_list.insert(1, "butter") # Insert 'butter' at index 1
    print(f"After insert 'butter' at index 1: {shopping_list}") # Output: ['milk', 'butter', 'eggs']
    ```

3.  **`extend()`**: Adds all items from another iterable (like another list) to the end of the current list. This effectively merges two lists into one, modifying the original list.

    ```python
    list1 = [1, 2]
    list2 = [3, 4]
    print(f"list1 before extend: {list1}")
    list1.extend(list2)
    print(f"list1 after extend list2: {list1}") # Output: [1, 2, 3, 4]
    ```
    **Important Note:** You can also use the `+` operator to combine lists, but this creates a *new* list rather than modifying the original in-place.

    ```python
    list_a = [1, 2]
    list_b = [3, 4]
    list_c = list_a + list_b # Creates a new list_c
    print(f"Concatenated list (list_c): {list_c}") # Output: [1, 2, 3, 4]
    print(f"Original list_a (unchanged): {list_a}") # Output: [1, 2]
    ```

#### Removing Elements
Just as you can add elements, you can also remove them from a list:

1.  **`remove()`**: Removes the *first occurrence* of a specified value. If the value isn't found in the list, it raises a `ValueError`.

    ```python
    colors = ["red", "blue", "green", "blue"]
    print(f"Initial colors: {colors}")
    colors.remove("blue") # Removes the first 'blue'
    print(f"After removing 'blue': {colors}") # Output: ['red', 'green', 'blue']
    ```

2.  **`pop()`**: Removes and returns the item at a specified index. If no index is given, it removes and returns the *last* item. This is useful when you need to remove an item and also use its value.

    ```python
    numbers = [10, 20, 30, 40]
    print(f"Initial numbers: {numbers}")
    removed_item = numbers.pop(1) # Remove item at index 1 (20)
    print(f"Removed item: {removed_item}") # Output: 20
    print(f"List after pop by index: {numbers}") # Output: [10, 30, 40]

    last_item = numbers.pop() # Remove the last item (40)
    print(f"Removed last item: {last_item}") # Output: 40
    print(f"List after pop last: {numbers}") # Output: [10, 30]
    ```

3.  **`del` statement**: This is a Python statement (not a method) that deletes an item at a specific index or a slice of items. It doesn't return the deleted item(s).

    ```python
    my_list = ["a", "b", "c", "d", "e"]
    print(f"Initial my_list: {my_list}")
    del my_list[2] # Delete item at index 2 ('c')
    print(f"After del single element: {my_list}") # Output: ['a', 'b', 'd', 'e']

    del my_list[1:3] # Delete items from index 1 up to (but not including) 3 ('b', 'd')
    print(f"After del slice: {my_list}") # Output: ['a', 'e']
    ```

4.  **`clear()`**: Removes all items from the list, making it empty.

    ```python
    data = [1, 2, 3]
    print(f"Initial data: {data}")
    data.clear()
    print(f"After clear: {data}") # Output: []
    ```

### Common List Methods
Beyond adding and removing, Python lists come with several built-in methods that make common operations easy and efficient.

1.  **`len()` (a built-in function, not a method, but commonly used with lists)**: Returns the number of items in a list.

    ```python
    my_list = ["apple", "banana", "cherry"]
    length = len(my_list)
    print(f"Length of the list: {length}") # Output: 3
    ```

2.  **`sort()`**: Sorts the items of the list in ascending order *in-place* (modifies the original list directly).

    ```python
    numbers = [3, 1, 4, 1, 5, 9, 2]
    print(f"Original numbers: {numbers}")
    numbers.sort()
    print(f"Sorted numbers (ascending): {numbers}") # Output: [1, 1, 2, 3, 4, 5, 9]

    # To sort in descending order, use the 'reverse=True' argument
    numbers.sort(reverse=True)
    print(f"Sorted numbers (descending): {numbers}") # Output: [9, 5, 4, 3, 2, 1, 1]
    ```
    **Note:** If you want a sorted version of the list without changing the original, use the `sorted()` *function*: `new_list = sorted(original_list)`. This function returns a new sorted list, leaving the original untouched.

3.  **`reverse()`**: Reverses the order of elements in the list *in-place*.

    ```python
    letters = ['a', 'b', 'c', 'd']
    print(f"Original letters: {letters}")
    letters.reverse()
    print(f"Reversed letters: {letters}") # Output: ['d', 'c', 'b', 'a']
    ```

4.  **`count()`**: Returns the number of times a specified value appears in the list.

    ```python
    grades = [85, 90, 78, 90, 95, 85, 90]
    count_90 = grades.count(90)
    print(f"Number of 90s in grades: {count_90}") # Output: 3
    ```

5.  **`index()`**: Returns the index of the *first occurrence* of a specified value. If the value is not found, it raises a `ValueError`.

    ```python
    items = ["pen", "pencil", "eraser", "pencil"]
    pencil_index = items.index("pencil")
    print(f"Index of the first 'pencil': {pencil_index}") # Output: 1
    ```

## Wrap-Up
Congratulations! You've taken a significant step in your Python journey by mastering lists. You've learned how to create these versatile containers, store various [data types](/note/python/python-basics-and-variables.md) within them, and access their elements using both positive and negative indexing. You can now extract portions of a list using slicing, and crucially, you understand that lists are mutable, meaning you can dynamically change their contents by adding, removing, or modifying elements. Finally, you explored several useful list methods that simplify common operations like sorting, counting, and finding items.

Lists are a cornerstone of data handling in Python. In the next lessons, we'll explore other [data structures](/note/python/dictionaries.md) that offer different ways to store and manage collections of data, each with its own strengths and use cases.