# Project: Command-Line To-Do List Application

## Learning Objectives
By the end of this lesson, you will be able to:
- Design and structure a simple command-line application.
- Integrate multiple Python concepts like functions, lists, dictionaries, and loops into a single project.
- Implement basic file input/output to save and load application data.
- Handle common user input and file operation errors gracefully to improve user experience.
- Build a functional To-Do list application that can add, view, mark as complete, delete, save, and load tasks.

## Introduction
You've come a long way, learning about individual Python concepts: how to store data in lists and dictionaries, make decisions with `if` statements, repeat actions with `loops`, organize code with `functions`, interact with files, and handle errors. That's a fantastic foundation!

But how do all these powerful pieces fit together to create something truly useful? That's exactly what we're going to explore in this project! We'll build a simple yet complete **Command-Line To-Do List Application**. This isn't just about making a to-do list; it's about seeing how all your hard-earned knowledge comes together to create a real, interactive program. It's a chance to solidify your understanding and feel the power of what you can build with Python.

Let's get started and turn those individual concepts into a working application!

## Concept Progression

### 1. Understanding the Core Features and Data Structure

Before we write a single line of code, let's put on our user hats and think about what a To-Do list application *needs* to do. Imagine you're using one – what actions would you expect?

1.  **Add a task:** You need to be able to type in a new task.
2.  **View tasks:** You want to see all your tasks, perhaps with their status (done or not done).
3.  **Mark a task as complete:** Once you finish something, you want to check it off.
4.  **Delete a task:** Sometimes tasks become irrelevant or were added by mistake.
5.  **Save and Load tasks:** Crucially, you don't want to lose your tasks every time you close the application!

Now, let's translate these features into how we'll store the data in our Python program. Each task isn't just a piece of text; it also has a "completed" status. This sounds like a perfect job for a **dictionary**! We can represent each task as a dictionary with keys like `"description"` (for the task text) and `"completed"` (a boolean, `True` or `False`).

Since we'll have *multiple* tasks, we'll store all these individual task dictionaries inside a **list**. This list will be the central data structure for our entire application.

Here's what a list of tasks might look like in our program:

```python
tasks = [
    {"description": "Learn Python basics", "completed": True},
    {"description": "Build a To-Do app", "completed": False},
    {"description": "Buy groceries", "completed": False}
]
```
This structure allows us to easily add new tasks to the list, access specific tasks by their index, and update their `completed` status.

### 2. Setting Up the Main Application Loop

Our To-Do list will be a command-line application, meaning users will interact with it by typing commands into the terminal. This requires a continuous loop that:
1.  Displays a menu of available options (add, view, mark complete, etc.).
2.  Asks the user for their choice.
3.  Performs an action based on that choice.
4.  Repeats these steps until the user explicitly decides to quit.

This continuous cycle is often called the "main loop" of an application. We'll use a `while True` loop, which will keep running indefinitely until we explicitly `break` out of it (when the user chooses the "Exit" option).

Let's define a function to display our menu and another to manage the main application flow:

```python
def main_menu():
    """Displays the main menu options and gets user input."""
    print("\n--- To-Do List Application ---")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Mark Task as Complete")
    print("4. Delete Task")
    print("5. Save Tasks")
    print("6. Load Tasks")
    print("7. Exit")
    return input("Enter your choice: ")

# This will be our main application logic function
def run_app():
    tasks = [] # Initialize an empty list to hold our task dictionaries
    
    while True: # The main application loop
        choice = main_menu() # Get the user's choice
        
        if choice == '1':
            print("You chose to Add Task")
            # We'll call an add_task function here later
        elif choice == '2':
            print("You chose to View Tasks")
            # We'll call a view_tasks function here later
        # ... other choices will go here ...
        elif choice == '7':
            print("Exiting To-Do List. Goodbye!")
            break # This statement breaks out of the while loop, ending the application
        else:
            print("Invalid choice. Please try again.")

# To run the application, we'd call:
# run_app()
```

[IMAGE_PLACEHOLDER: A flowchart illustrating the main application loop. Start node "Start Application". Decision node "Display Menu & Get Choice". Branches for each choice (1-7). Choices 1-6 lead to "Perform Action (e.g., Add Task)". Choice 7 leads to "Exit Application" and "End". An arrow from "Perform Action" loops back to "Display Menu & Get Choice".]

This `run_app` function provides the skeleton for our application. Next, we'll flesh out the actual operations for each menu choice.

### 3. Implementing Core Task Management Functions

Now that we have our data structure and main loop, let's fill in the actions for adding, viewing, marking complete, and deleting tasks. We'll create separate **functions** for each of these operations. This keeps our code organized, readable, and reusable, making it easier to manage and debug.

#### Adding a Task (`add_task`)

The `add_task` function will take our `tasks` list and a `description` string as input. It will create a new task dictionary (setting `completed` to `False` by default) and append it to our `tasks` list.

```python
def add_task(tasks, description):
    """Adds a new task to the tasks list."""
    task = {"description": description, "completed": False}
    tasks.append(task)
    print(f"Task '{description}' added.")

# Example of how it would be used inside run_app (if choice == '1'):
# description = input("Enter task description: ")
# if description: # Basic validation: ensure description is not empty
#     add_task(tasks, description)
# else:
#     print("Task description cannot be empty.")
```

#### Viewing Tasks (`view_tasks`)

The `view_tasks` function will iterate through the `tasks` list and print each task with its status. We'll use `enumerate` to get both the index and the task itself. The index is crucial because users will refer to tasks by their number when marking them complete or deleting them.

```python
def view_tasks(tasks):
    """Displays all tasks with their status."""
    if not tasks: # Check if the list is empty
        print("No tasks in your list.")
        return # Exit the function if there are no tasks

    print("\n--- Your Tasks ---")
    for i, task in enumerate(tasks):
        # Use a checkmark for completed tasks, a space otherwise
        status = "✓" if task["completed"] else " " 
        # Display task number (i+1 because enumerate is 0-indexed)
        print(f"{i + 1}. [{status}] {task['description']}")
    print("------------------")

# Example of how it would be used inside run_app (if choice == '2'):
# view_tasks(tasks)
```

#### Marking a Task as Complete (`mark_task_complete`)

This function needs the `tasks` list and the `index` of the task to mark. Remember that users will input 1-based numbers, but Python lists are 0-based, so we'll need to adjust the index. We also need to validate the input to ensure it's a valid task number.

```python
def mark_task_complete(tasks, task_index):
    """Marks a specific task as complete."""
    # Adjust index for 0-based list (user input 1 becomes list index 0)
    actual_index = task_index - 1 
    
    if 0 <= actual_index < len(tasks): # Check if the index is valid
        tasks[actual_index]["completed"] = True
        print(f"Task '{tasks[actual_index]['description']}' marked as complete.")
    else:
        print("Invalid task number. Please choose a number from the list.")

# Example of how it would be used inside run_app (if choice == '3'):
# view_tasks(tasks) # Show tasks first so user knows which numbers to pick
# try:
#     task_num = int(input("Enter the number of the task to mark complete: "))
#     mark_task_complete(tasks, task_num)
# except ValueError: # Catch error if user types non-numeric input
#     print("Invalid input. Please enter a number.")
```

#### Deleting a Task (`delete_task`)

Similar to marking a task, this function needs the `tasks` list and the `index` of the task to delete. We'll use the `.pop()` method, which removes an item at a given index and returns it, allowing us to print a confirmation message.

```python
def delete_task(tasks, task_index):
    """Deletes a specific task from the tasks list."""
    actual_index = task_index - 1 # Adjust for 0-based indexing
    
    if 0 <= actual_index < len(tasks): # Check if the index is valid
        removed_task = tasks.pop(actual_index) # .pop() removes and returns the item
        print(f"Task '{removed_task['description']}' deleted.")
    else:
        print("Invalid task number. Please choose a number from the list.")

# Example of how it would be used inside run_app (if choice == '4'):
# view_tasks(tasks) # Show tasks first
# try:
#     task_num = int(input("Enter the number of the task to delete: "))
#     delete_task(tasks, task_num)
# except ValueError:
#     print("Invalid input. Please enter a number.")
```

### 4. Making it Persistent: Saving and Loading Tasks (File I/O)

Our application is functional, but it has a major flaw: if you close it, all your tasks disappear! This is where **file I/O** (Input/Output) comes in. We need a way to save our `tasks` list to a file and load it back when the application starts.

For saving complex Python data structures like lists of dictionaries, Python's built-in `json` module is perfect. It converts Python objects into a standardized text format called JSON (JavaScript Object Notation), which can be easily written to and read from files. JSON is also human-readable, making it easy to inspect your saved data.

First, remember to `import json` at the very top of your Python file to use this module.

#### Saving Tasks (`save_tasks`)

The `save_tasks` function will take the `tasks` list and a `filename`. It will open the file in write mode (`'w'`) and use `json.dump` to write the list to the file. We'll also add `indent=4` to make the JSON file nicely formatted and easy to read.

```python
import json # Don't forget to import this at the top of your file!

def save_tasks(tasks, filename="tasks.json"):
    """Saves the current tasks list to a JSON file."""
    try:
        with open(filename, 'w') as f: # Open file in write mode
            json.dump(tasks, f, indent=4) # Write tasks as JSON, with 4-space indentation
        print(f"Tasks saved to {filename}")
    except OSError as e: # Catching OSError for file system errors like permission denied
        print(f"Error: Could not save tasks to {filename}. Reason: {e}")

# Example usage (inside run_app, if choice == '5' or before exiting):
# save_tasks(tasks)
```

#### Loading Tasks (`load_tasks`)

The `load_tasks` function will take a `filename`. It will try to open the file in read mode (`'r'`) and use `json.load` to read the data back into a list. We need to handle several potential issues:
*   What if the file doesn't exist yet (e.g., the first time running the app)?
*   What if the file exists but is corrupted and doesn't contain valid JSON?
*   What if there are other file system errors?

```python
import json # Ensure this is imported at the top of your file

def load_tasks(filename="tasks.json"):
    """Loads tasks from a JSON file. Returns an empty list if the file doesn't exist or is corrupted."""
    try:
        with open(filename, 'r') as f: # Open file in read mode
            tasks = json.load(f) # Load JSON data from the file
        print(f"Tasks loaded from {filename}")
        return tasks
    except FileNotFoundError:
        print(f"No task file found ({filename}). Starting with an empty list.")
        return [] # Return an empty list if the file doesn't exist
    except json.JSONDecodeError:
        print(f"Error: Could not read tasks from {filename}. File might be corrupted.")
        return [] # Return empty list if file is corrupted
    except OSError as e: # Catching OSError for other file system errors
        print(f"Error: Could not load tasks from {filename}. Reason: {e}")
        return []

# Example usage (at the very beginning of run_app):
# tasks = load_tasks()
```

Now, let's integrate all these functions into our `run_app` function. We'll load tasks once at the start of the application, offer a manual save option, and also save automatically when the user chooses to exit.

```python
# Make sure all your functions (main_menu, add_task, view_tasks, 
# mark_task_complete, delete_task, save_tasks, load_tasks) are defined above this.

def run_app():
    tasks = load_tasks() # Load tasks when the app starts
    
    while True:
        choice = main_menu()
        
        if choice == '1':
            description = input("Enter task description: ")
            if description: # Ensure description is not empty
                add_task(tasks, description)
            else:
                print("Task description cannot be empty.")
        elif choice == '2':
            view_tasks(tasks)
        elif choice == '3':
            view_tasks(tasks) # Show tasks first so user can pick
            try:
                task_num = int(input("Enter the number of the task to mark complete: "))
                mark_task_complete(tasks, task_num)
            except ValueError:
                print("Invalid input. Please enter a number.")
        elif choice == '4':
            view_tasks(tasks) # Show tasks first
            try:
                task_num = int(input("Enter the number of the task to delete: "))
                delete_task(tasks, task_num)
            except ValueError:
                print("Invalid input. Please enter a number.")
        elif choice == '5':
            save_tasks(tasks) # Manually save tasks
        elif choice == '6':
            # Loading again will overwrite current tasks if not saved!
            # For a simple app, we might just reload. For more complex apps,
            # you might ask the user if they want to discard unsaved changes.
            tasks = load_tasks() 
        elif choice == '7':
            save_tasks(tasks) # Save tasks automatically before exiting
            print("Exiting To-Do List. Goodbye!")
            break # Exit the main loop
        else:
            print("Invalid choice. Please try again.")

# This ensures run_app() is called only when the script is executed directly
if __name__ == "__main__":
    run_app()
```

### 5. Handling Errors Gracefully (Error Handling)

You might have noticed `try-except` blocks appearing throughout our code, especially when dealing with user input (`int(input(...))`) and file operations. This is **error handling**, and it's absolutely crucial for making your application robust and user-friendly.

Instead of letting your program crash when something unexpected happens, `try-except` blocks allow you to "catch" errors and respond to them gracefully. Here's a summary of the common errors we've handled:

*   **`ValueError`**: This occurs when we try to convert user input to an integer (`int()`), but the user types something that isn't a valid number (like "hello" or an empty string). Our `try-except ValueError` blocks catch this, print a helpful message, and prevent the program from crashing.
*   **`FileNotFoundError`**: When `load_tasks` tries to open a file that doesn't exist (e.g., the first time the application is run), Python raises a `FileNotFoundError`. We catch this to gracefully start with an empty task list instead of crashing.
*   **`json.JSONDecodeError`**: If the `tasks.json` file exists but contains malformed JSON (e.g., someone manually edited it incorrectly), `json.load` will raise this error. We catch it to prevent a crash and start fresh with an empty list.
*   **`OSError`**: This is a base class for various operating system-related errors, including `FileNotFoundError`, `PermissionError`, and others that might occur during file operations (e.g., disk full, invalid path). By catching `OSError`, we can handle a broader range of file-related issues gracefully, providing informative messages to the user.

By anticipating these common problems and providing specific `except` blocks, we make our application much more reliable and pleasant to use, guiding the user rather than frustrating them with crashes.

## Wrap-Up

Congratulations! You've just built a complete, albeit simple, command-line To-Do List application. This project brought together almost everything you've learned so far:
*   **Lists and Dictionaries** for structured data storage.
*   **Functions** for organizing your code into logical, reusable blocks.
*   **Loops** for the main application flow, keeping it interactive.
*   **Conditional Statements** (`if/elif/else`) for handling user choices and logic.
*   **File I/O** (using the `json` module) for making your data persistent across sessions.
*   **Error Handling** (`try-except`) for making your application robust and user-friendly.

This is a huge step in your programming journey! You've moved from understanding individual concepts to seeing how they interoperate seamlessly to create a functional program. This project serves as a fantastic foundation. You could expand it by adding features like task priorities, due dates, searching, or even a graphical user interface (GUI) later on! Keep experimenting and building!