# Project: Command-Line To-Do List Application

## Learning Objectives
By the end of this lesson, you will be able to:
- Design a simple data structure to represent tasks in a to-do list application.
- Implement core functionalities like adding, viewing, and marking tasks as complete.
- Utilize file I/O to save and load application data, ensuring persistence.
- Structure a command-line application using a main loop and [functions](/note/python/functions.md) for different operations.
- Integrate previously learned Python concepts such as [lists](../python/lists.md), [dictionaries](/note/python/dictionaries.md), loops, conditionals, [functions](../python/functions.md), and [error handling](/note/python/error-handling.md) into a cohesive project.

## Introduction
You've come a long way! So far, you've mastered many individual Python concepts: how to get input from a user, make decisions with [conditional statements](/note/python/conditional-statements.md), repeat actions using loops, store collections of data in [lists](../python/lists.md) and [dictionaries](/note/python/dictionaries.md), organize your code with [functions](../python/functions.md), and even read from and write to files. That's a powerful toolkit!

But how do all these individual pieces fit together to build something truly useful? This lesson is your chance to connect the dots and bring everything you've learned into a practical application. We're going to build a functional, command-line to-do list application. This isn't just about writing code; it's about thinking like a developer – breaking down a larger problem into smaller, manageable parts, and seeing how all those concepts become powerful tools in your hands. By the end, you'll have a working application that can help you keep track of your tasks, and you'll have a much clearer understanding of how real-world programs are constructed from the ground up.

## Concept Progression

### Representing a Task: The Building Block
Every to-do list needs to store individual tasks. Before we write any code, let's think about what essential information each task needs. At a minimum, we need to know *what* the task is (its description) and whether it's *done* or not.

How can we represent this information in Python? A simple string is great for the description, but to also store its completion status, a [dictionaries](../python/dictionaries.md) is perfect! Each task can be a dictionary with clear keys like `"description"` and `"completed"`.

Let's imagine how a single task would look:
```python
task_example = {
    "description": "Buy groceries",
    "completed": False
}
```
Here, `"Buy groceries"` is the task description, and `False` indicates it's not yet completed. When the task is finished, we can simply change the value associated with the `"completed"` key to `True`.

Now, how do we store *multiple* tasks? If each task is a dictionary, then a [lists](../python/lists.md) is the natural choice to hold a collection of these task [dictionaries](/note/python/dictionaries.md). This `tasks` list will be the central data structure for our entire application.

```python
# Our main list to hold all tasks
tasks = []

# Let's add a couple of tasks to see how this structure works
tasks.append({"description": "Learn Python", "completed": False})
tasks.append({"description": "Walk the dog", "completed": True})
tasks.append({"description": "Finish project", "completed": False})

print(tasks)
# Expected output:
# [{'description': 'Learn Python', 'completed': False},
#  {'description': 'Walk the dog', 'completed': True},
#  {'description': 'Finish project', 'completed': False}]
```
This `tasks` list will be the heart of our application, holding all the data.

[IMAGE_PLACEHOLDER: A simple diagram showing a Python list. Each element of the list is a dictionary. Each dictionary represents a task with two key-value pairs: "description": "string" and "completed": boolean. Arrows point from the list indices to the respective dictionaries. The pedagogical intent is to visually represent the data structure for tasks.]

### Adding New Tasks
The first essential functionality for any to-do list is the ability to add new tasks. We need to ask the user for the task description and then create a new task dictionary, adding it to our `tasks` list.

We'll use the `input()` function to get the description from the user. By default, any new task is always incomplete, so its `"completed"` status will be `False`. To keep our code organized and reusable, we'll encapsulate this logic within a [functions](../python/functions.md).

```python
def add_task(task_list):
    """Prompts the user for a task description and adds a new task to the list."""
    description = input("Enter the task description: ")
    new_task = {"description": description, "completed": False}
    task_list.append(new_task)
    print(f"Task '{description}' added.")

# Example usage (you would call this from your main program):
# tasks = [] # Assuming 'tasks' list is already defined and possibly loaded
# add_task(tasks)
# print(tasks) # After adding, you'd see the new task in the list
```
Notice how we pass `task_list` as an argument to the function. This makes our function clear about what data it operates on and keeps it flexible.

### Viewing All Tasks
Once tasks are added, the next logical step is to see them! This involves iterating through our `tasks` list and printing each one in a user-friendly format. We'll use a [loops](../python/loops.md) for this, as it's perfect for processing each item in a list.

It's also helpful to clearly show whether a task is completed or not. We can use a checkmark `[x]` for completed tasks and an empty box `[ ]` for incomplete ones. Additionally, numbering the tasks makes it easy for users to refer to them later (e.g., "mark task 3 as complete").

```python
def view_tasks(task_list):
    """Prints all tasks in the list in a formatted way."""
    if not task_list: # Check if the list is empty before trying to display
        print("No tasks in the list.")
        return # Exit the function if there are no tasks

    print("\n--- Your To-Do List ---")
    for i, task in enumerate(task_list): # enumerate gives us both the index (i) and the item (task)
        # This is a conditional expression: if task["completed"] is True, status is "[x]", otherwise "[ ]"
        status = "[x]" if task["completed"] else "[ ]"
        print(f"{i + 1}. {status} {task['description']}") # We add 1 to 'i' for user-friendly 1-based numbering
    print("-----------------------\n")

# Example usage:
# tasks = [{"description": "Learn Python", "completed": False},
#          {"description": "Walk the dog", "completed": True}]
# view_tasks(tasks)
# Expected output:
# --- Your To-Do List ---
# 1. [ ] Learn Python
# 2. [x] Walk the dog
# -----------------------
```
Here, `enumerate` is incredibly useful for getting both the index and the task itself during iteration. We add `1` to `i` because users typically prefer 1-based indexing for [lists](/note/python/lists.md). The `status = "[x]" if task["completed"] else "[ ]"` is a concise [conditional-statements](../python/conditional-statements.md) that picks the correct symbol based on the task's completion status.

### Marking Tasks as Complete
A core feature of any to-do list is the ability to mark tasks as done. This requires the user to tell us *which* task they want to mark. Since we numbered our tasks when viewing them, we can ask the user for the task number.

Once we have the number, we need to convert it to a list index (remembering that user input is usually 1-based, but Python list indices are 0-based). Then, we access the specific task dictionary in our list and change its `"completed"` value to `True`.

What if the user enters something that isn't a number, or a number that doesn't correspond to an existing task? This is where [error-handling](../python/error-handling.md) becomes crucial. We should use a `try-except` block to catch a `ValueError` if they don't enter a valid integer, and we must validate the index to prevent an `IndexError` (trying to access a list element that doesn't exist).

```python
def complete_task(task_list):
    """Marks a specified task as complete, handling user input and errors."""
    view_tasks(task_list) # Show tasks first so the user knows which to pick
    if not task_list: # If there are no tasks, nothing to complete
        return

    try:
        task_num = int(input("Enter the number of the task to mark as complete: "))
        # Adjust for 0-based indexing: user input 1 corresponds to index 0
        task_index = task_num - 1

        # Validate the index to ensure it's within the bounds of our list
        if 0 <= task_index < len(task_list):
            task_list[task_index]["completed"] = True
            print(f"Task '{task_list[task_index]['description']}' marked as complete.")
        else:
            print("Invalid task number. Please enter a number from the list.")
    except ValueError:
        print("Invalid input. Please enter a whole number.")
    # The 'if 0 <= task_index < len(task_list)' condition explicitly handles out-of-range indices,
    # preventing an IndexError from being raised in this specific logic.
    # If that check were absent, an IndexError would be caught here.

# Example usage:
# tasks = [{"description": "Learn Python", "completed": False}]
# complete_task(tasks) # User enters 1
# print(tasks) # Output: [{'description': 'Learn Python', 'completed': True}]
```
This function demonstrates robust handling of user input, a crucial aspect of building user-friendly and reliable applications.

### Saving and Loading Tasks: Making it Persistent
Imagine adding all your important tasks, closing the program, and then reopening it only to find everything gone! That's not very useful. We need a way to save our `tasks` list to a file and load it back when the program starts. This is where [file-io](../python/file-io.md) comes in.

Since our tasks are stored as a list of [dictionaries](/note/python/dictionaries.md), the `json` module is perfect for this. JSON (JavaScript Object Notation) is a lightweight data-interchange format that Python's [dictionaries](../python/dictionaries.md) and [lists](/note/python/lists.md) map to very well, and it's also human-readable.

**Saving Tasks:**
We'll open a file in write mode (`'w'`) and use `json.dump()` to write our `tasks` list to it.

```python
import json # Don't forget to import the json module at the top of your file!

def save_tasks(task_list, filename="tasks.json"):
    """Saves the current list of tasks to a JSON file."""
    try:
        with open(filename, 'w') as f: # Open the file in write mode
            json.dump(task_list, f, indent=4) # 'indent=4' makes the JSON file nicely formatted and human-readable
        print(f"Tasks saved to {filename}")
    except IOError: # Catches general I/O errors, including permission issues or disk full
        print(f"Error: Could not save tasks to {filename}. Check file permissions or disk space.")

# Example usage:
# tasks = [{"description": "Learn Python", "completed": False}]
# save_tasks(tasks) # This will create or overwrite 'tasks.json'
```
The `with open(...) as f:` syntax is important because it ensures the file is automatically closed, even if errors occur during the write operation.

**Loading Tasks:**
When the program starts, we want to load any previously saved tasks. We'll open the file in read mode (`'r'`) and use `json.load()` to read the data back into our `tasks` list.

What if the file doesn't exist yet (e.g., the very first time the program runs)? We need to handle a `FileNotFoundError`. In this case, we'll just start with an empty list of tasks. We also need to consider if the file exists but contains malformed JSON, which would raise a `json.JSONDecodeError`.

```python
import json

def load_tasks(filename="tasks.json"):
    """Loads tasks from a JSON file. Returns an empty list if the file doesn't exist or is corrupted."""
    try:
        with open(filename, 'r') as f: # Open the file in read mode
            task_list = json.load(f) # Load the data from the file
        print(f"Tasks loaded from {filename}")
        return task_list
    except FileNotFoundError:
        print(f"No task file '{filename}' found. Starting with an empty list.")
        return [] # Return an empty list if the file doesn't exist
    except json.JSONDecodeError:
        print(f"Error: Could not decode tasks from '{filename}'. The file might be corrupted. Starting with an empty list.")
        return []
    except IOError: # Catches other potential I/O errors during read (e.g., permission issues)
        print(f"Error: Could not read tasks from '{filename}'. Starting with an empty list.")
        return []

# Example usage:
# tasks = load_tasks() # This will be called at the very start of our program
# print(tasks) # Will show loaded tasks or an empty list
```
This `load_tasks` function is crucial for making our application's data persistent across different sessions, ensuring your to-do list isn't lost when you close the program.

### Building the Main Application Loop and User Interface
Now that we have individual [functions](/note/python/functions.md) for adding, viewing, marking, saving, and loading tasks, we need to tie them all together into a user-friendly command-line interface. This is typically done with a `while` loop that continuously displays a menu of options and responds to user input.

This `while` loop will be our main program loop. Inside it, we'll use [conditional-statements](../python/conditional-statements.md) to call the appropriate function based on the user's choice.

```python
def main():
    """The main function that runs the To-Do List application."""
    tasks = load_tasks() # Load tasks when the program starts, before entering the main loop

    while True: # This loop will run indefinitely until the user chooses to exit
        print("\n--- To-Do List Menu ---")
        print("1. Add a new task")
        print("2. View all tasks")
        print("3. Mark a task as complete")
        print("4. Save tasks and Exit")
        print("-----------------------")

        choice = input("Enter your choice (1-4): ")

        if choice == '1':
            add_task(tasks)
        elif choice == '2':
            view_tasks(tasks)
        elif choice == '3':
            complete_task(tasks)
        elif choice == '4':
            save_tasks(tasks) # Always save tasks before exiting
            print("Exiting To-Do List application. Goodbye!")
            break # Exit the while loop, ending the program
        else:
            print("Invalid choice. Please enter a number between 1 and 4.")

# This ensures main() runs only when the script is executed directly,
# not when it's imported as a module into another script.
if __name__ == "__main__":
    main()
```
This `main()` function orchestrates the entire application, providing the user with a continuous interaction loop. The `if __name__ == "__main__":` block is a standard Python idiom that ensures `main()` is called only when the script is run directly, not when it's imported as a module into another script.

[IMAGE_PLACEHOLDER: A flowchart illustrating the main application loop. Start node -> "Load Tasks" -> "Display Menu" -> "Get User Choice". From "Get User Choice", branches lead to "Add Task", "View Tasks", "Mark Task Complete", "Save & Exit", and "Invalid Choice". "Add Task", "View Tasks", and "Mark Task Complete" all loop back to "Display Menu". "Save & Exit" leads to an End node. "Invalid Choice" also loops back to "Display Menu". The pedagogical intent is to show the flow of control in the application.]

## Wrap-Up
Congratulations! You've just built a complete, functional command-line to-do list application from scratch. This project was a fantastic opportunity to bring together and reinforce many fundamental Python concepts:
-   **[Data Structures](/note/python/dictionaries.md):** Effectively using [lists](/note/python/lists.md) and [dictionaries](../python/dictionaries.md) to organize complex, related data.
-   **[Functions](/note/python/functions.md):** Breaking down your program into reusable, manageable pieces, making your code cleaner and easier to understand.
-   **Input/Output:** Interacting with the user to get commands and data, and reading/writing files to ensure data persistence.
-   **[Control Flow](/note/python/conditional-statements.md):** Using [loops](/note/python/loops.md) and conditionals to manage the program's logic and respond to user choices.
-   **[Error Handling](/note/python/error-handling.md):** Making your program robust and user-friendly by anticipating and gracefully handling unexpected user input or file issues.

This project is a fantastic foundation. You could extend it further by adding features like deleting tasks, editing task descriptions, filtering tasks (e.g., show only incomplete tasks), or even prioritizing tasks. The skills you've practiced here are essential for building any larger application, and you're now well-equipped to tackle more complex programming challenges!