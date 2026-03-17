# File Input/Output

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain why file input/output (I/O) is essential for data persistence.
- Open text files in Python using the `open()` function for reading, writing, and appending.
- Read content from a file using methods like `read()`, `readline()`, and `readlines()`.
- Write new content or append to existing content in a file using the `write()` method.
- Safely manage file resources using the `with` statement to ensure files are properly closed.
- Understand the basic concepts of file paths and text encoding.

## Introduction
Imagine you're writing a Python program that calculates a user's high score in a game. Every time the program runs, it asks for the user's name and score, but once the program finishes, all that information vanishes! The next time you run it, it's like starting from scratch. This happens because, by default, Python programs work with data held in your computer's temporary memory (RAM), which gets cleared when the program closes.

This is where **File Input/Output (I/O)** comes in. File I/O allows your programs to interact with files stored permanently on your computer's hard drive or other storage devices. This means you can save data from your program to a file, and later, your program (or another program) can read that data back. It's how applications remember your settings, how documents are saved, and how large datasets are processed. In this lesson, we'll learn how to read from and write to text files, giving your Python programs the power of memory!

## Concept Progression

### Why Files? The Need for Persistence

Think of your program's variables like notes written on a whiteboard. While the program is running, you can write, erase, and update these notes. But as soon as you turn off the whiteboard (close the program), all the notes are gone forever.

Files, on the other hand, are like a permanent notebook. Whatever you write in the notebook stays there, even after you close it and come back later. This ability to store data beyond the lifetime of a running program is called **persistence**. Files provide a way for your programs to achieve persistence, allowing them to:
*   Save user data (like game scores, preferences).
*   Store configuration settings.
*   Log events or errors.
*   Exchange data with other programs.
*   Process large amounts of data that don't fit into memory.

[IMAGE_PLACEHOLDER: A simple diagram contrasting RAM and Disk storage. On the left, a whiteboard labeled "RAM (Temporary Memory)" with ephemeral notes. On the right, a notebook labeled "Disk (Persistent Storage)" with written notes that remain. An arrow from the program to the whiteboard, and another from the program to the notebook, illustrating data flow.]

Now that we understand *why* files are so important, let's dive into *how* we can interact with them using Python.

### Opening Files: Your Gateway to Data

Before you can read from or write to a file, your program needs to "open" it. Opening a file is like telling the operating system, "Hey, I want to work with this specific file." When you open a file, Python gives you back a special object called a **file object** (sometimes called a file handle). This file object is your program's direct link to the file on disk. You'll use this object to perform all your reading and writing operations.

To open a file, you use the built-in `open()` function. It takes at least two arguments:
1.  The **file path**: A string indicating where the file is located (e.g., `"my_data.txt"`).
2.  The **mode**: A string indicating what you intend to do with the file (e.g., read, write, append).

Here's the basic syntax:

```python
file_object = open("filename.txt", "mode")
```

Let's look at the most common modes for text files:
*   `"r"` (read mode): Opens the file for reading. This is the default mode. If the file doesn't exist, Python will raise a `FileNotFoundError`.
*   `"w"` (write mode): Opens the file for writing. **WARNING: If the file already exists, its contents will be completely erased!** If the file doesn't exist, Python will create a new one. Use this mode with caution.
*   `"a"` (append mode): Opens the file for appending. If the file exists, new data will be added to the end of the file. If the file doesn't exist, Python will create a new one.

**Important: Always Close Your Files!**
After you're done working with a file, it's crucial to **close** it. Closing a file releases the system resources it was using and ensures that any buffered writes are actually saved to disk. If you don't close a file, you risk data loss or corruption, and other programs might not be able to access it. You close a file using the `close()` method of the file object:

```python
# Example: Opening and closing a file (we'll learn reading/writing next)
my_file = open("hello.txt", "w") # Open in write mode
print("File 'hello.txt' is now open.")
my_file.close() # Close the file
print("File 'hello.txt' is now closed.")
```

If you run this code, a new empty file named `hello.txt` will be created in the same directory as your Python script.

### Reading from Files: Bringing Data In

Once you've successfully opened a file in read mode (`"r"`), you can start pulling data from it into your program. The file object provides several convenient methods for reading:

First, let's create a sample file that we can read from in the following examples. We'll use the basic `open().write().close()` pattern for now.

```python
# Create a file named 'my_story.txt' for our reading examples
f = open("my_story.txt", "w")
f.write("Once upon a time,\n")
f.write("in a land far, far away,\n")
f.write("lived a brave Python programmer.\n")
f.close()
print("Created 'my_story.txt' for reading examples.")
```

#### `read()`: Read the entire file
The `read()` method reads the entire content of the file as a single string.

```python
my_file = open("my_story.txt", "r")
content = my_file.read()
print("--- Content from read() ---")
print(content)
my_file.close()
```
**Output:**
```
--- Content from read() ---
Once upon a time,
in a land far, far away,
lived a brave Python programmer.
```

#### `readline()`: Read one line at a time
The `readline()` method reads a single line from the file, including the newline character (`\n`) at the end of the line. Each subsequent call to `readline()` reads the next line. When there are no more lines, it returns an empty string.

```python
my_file = open("my_story.txt", "r")
line1 = my_file.readline()
line2 = my_file.readline()
line3 = my_file.readline()
line4 = my_file.readline() # This will be an empty string

print("\n--- Content from readline() ---")
print(f"First line: '{line1.strip()}'") # .strip() removes leading/trailing whitespace, including \n
print(f"Second line: '{line2.strip()}'")
print(f"Third line: '{line3.strip()}'")
print(f"Fourth line (empty): '{line4}'")
my_file.close()
```
**Output:**
```
--- Content from readline() ---
First line: 'Once upon a time,'
Second line: 'in a land far, far away,'
Third line: 'lived a brave Python programmer.'
Fourth line (empty): ''
```

#### `readlines()`: Read all lines into a list
The `readlines()` method reads all lines from the file and returns them as a list of strings, where each string in the list represents one line (including the newline character).

```python
my_file = open("my_story.txt", "r")
all_lines = my_file.readlines()
print("\n--- Content from readlines() ---")
print(all_lines)
my_file.close()
```
**Output:**
```
--- Content from readlines() ---
['Once upon a time,\n', 'in a land far, far away,\n', 'lived a brave Python programmer.\n']
```

#### Iterating through a file object
Perhaps the most Pythonic and memory-efficient way to read a file line by line is to simply iterate over the file object itself using a `for` loop. This reads one line at a time, making it suitable for very large files that might not fit entirely into memory.

```python
print("\n--- Reading line by line using a loop ---")
my_file = open("my_story.txt", "r")
for line in my_file:
    print(f"Line: '{line.strip()}'") # Again, .strip() to clean up newlines
my_file.close()
```
**Output:**
```
--- Reading line by line using a loop ---
Line: 'Once upon a time,'
Line: 'in a land far, far away,'
Line: 'lived a brave Python programmer.'
```

### Writing to Files: Saving Your Work

Writing to files is how your program stores information permanently. As we discussed, you'll use either `"w"` (write mode) or `"a"` (append mode). Remember to always close the file after writing!

#### `write()`: Writing strings to a file
The `write()` method takes a string as an argument and writes it to the file. It does *not* automatically add a newline character, so you need to include `\n` yourself if you want to write multiple lines.

```python
# Writing in "w" mode (WARNING: this will erase existing content!)
print("--- Writing to 'my_notes.txt' in 'w' mode ---")
my_notes = open("my_notes.txt", "w")
my_notes.write("This is my first note.\n")
my_notes.write("It's a very important note.\n")
my_notes.close()

# Let's verify what's in the file
print("Content after initial 'w' mode write:")
read_file = open("my_notes.txt", "r")
print(read_file.read())
read_file.close()

# Now, let's open in "w" mode again. This will completely erase the previous content.
print("\n--- Writing to 'my_notes.txt' again in 'w' mode (erasing previous content) ---")
my_notes = open("my_notes.txt", "w")
my_notes.write("This is a brand new note.\n")
my_notes.close()

# Verify again
print("Content after second 'w' mode write:")
read_file = open("my_notes.txt", "r")
print(read_file.read())
read_file.close()
```
**Output:**
```
--- Writing to 'my_notes.txt' in 'w' mode ---
Content after initial 'w' mode write:
This is my first note.
It's a very important note.

--- Writing to 'my_notes.txt' again in 'w' mode (erasing previous content) ---
Content after second 'w' mode write:
This is a brand new note.
```
Notice how the first two lines were completely replaced by the new single line. This demonstrates the destructive nature of `"w"` mode.

#### Appending in "a" mode
If you want to add content to an existing file without erasing it, use append mode (`"a"`). New content will be added at the very end of the file.

```python
# Let's start with a file containing one line
f = open("my_log.txt", "w")
f.write("Log entry 1: Program started.\n")
f.close()

# Now, append new entries
print("--- Appending to 'my_log.txt' in 'a' mode ---")
my_log = open("my_log.txt", "a")
my_log.write("Log entry 2: User logged in.\n")
my_log.write("Log entry 3: Data processed successfully.\n")
my_log.close()

# Verify the full content
print("Content after 'a' mode append:")
read_file = open("my_log.txt", "r")
print(read_file.read())
read_file.close()
```
**Output:**
```
--- Appending to 'my_log.txt' in 'a' mode ---
Content after 'a' mode append:
Log entry 1: Program started.
Log entry 2: User logged in.
Log entry 3: Data processed successfully.
```
As you can see, the original line was preserved, and the new lines were added after it.

### The `with` Statement: Safer File Handling

As you've seen, remembering to close a file is crucial. Forgetting to do so is a common mistake that can lead to problems like:
*   **Data corruption:** Not all changes might be written to disk.
*   **Resource leaks:** The operating system holds onto the file, preventing other programs from accessing it.
*   **Errors:** If your program crashes before `close()` is called, the file might remain open indefinitely.

Python provides a much safer and more convenient way to handle files using the `with` statement, also known as a **context manager**. When you use `with`, Python automatically ensures that the file is closed properly, even if errors occur during your file operations. This makes your code more robust and easier to manage.

The syntax looks like this:

```python
with open("filename.txt", "mode") as file_object:
    # Perform file operations here
    # The file is automatically closed when the 'with' block ends
```

Let's rewrite our previous examples using the `with` statement to see how much cleaner and safer our code becomes:

```python
# Reading a file safely
print("--- Reading 'my_story.txt' using 'with' statement ---")
with open("my_story.txt", "r") as story_file:
    content = story_file.read()
    print(content)
# No need to call story_file.close() here, it's automatic!

# Writing to a file safely
print("\n--- Writing to 'new_file.txt' using 'with' statement ---")
with open("new_file.txt", "w") as output_file:
    output_file.write("Hello from the 'with' statement!\n")
    output_file.write("This is much safer.\n")

# Appending to a file safely
print("\n--- Appending to 'new_file.txt' using 'with' statement ---")
with open("new_file.txt", "a") as output_file:
    output_file.write("And this line was appended.\n")

# Verify the content
print("\n--- Final content of 'new_file.txt' ---")
with open("new_file.txt", "r") as f:
    print(f.read())
```
**Output:**
```
--- Reading 'my_story.txt' using 'with' statement ---
Once upon a time,
in a land far, far away,
lived a brave Python programmer.


--- Writing to 'new_file.txt' using 'with' statement ---

--- Appending to 'new_file.txt' using 'with' statement ---

--- Final content of 'new_file.txt' ---
Hello from the 'with' statement!
This is much safer.
And this line was appended.
```

The `with` statement is considered best practice for file handling in Python. Always use it unless you have a very specific reason not to (which is rare for typical file I/O).

[IMAGE_PLACEHOLDER: A flowchart illustrating the `with` statement. Start node "Program enters 'with' block". Arrow to "File is opened". Arrow to "Perform operations". Decision node "Error occurred?". If yes, arrow to "File is closed (automatically)". If no, arrow to "Program exits 'with' block". Arrow to "File is closed (automatically)". End node.]

### File Paths and Encoding

To wrap up our discussion on file I/O, let's briefly touch on two important considerations: where your files are located and how their characters are stored.

#### File Paths
When you specify a filename like `"my_data.txt"`, Python looks for that file in the **current working directory** (usually the directory where your Python script is located).
*   **Relative Path:** A path that describes the location of a file relative to the current working directory (e.g., `"data/reports.csv"` means a file named `reports.csv` inside a folder named `data` which is in the current directory).
*   **Absolute Path:** A path that specifies the exact location of a file from the root of the file system (e.g., `"/Users/yourname/Documents/data.txt"` on macOS/Linux or `"C:\\Users\\yourname\\Documents\\data.txt"` on Windows).

It's generally good practice to use relative paths for files within your project, as it makes your code more portable. However, sometimes absolute paths are necessary, especially when accessing files outside your project structure. Be mindful of the operating system's path separators (`/` for Unix-like systems, `\` for Windows). Python's `os.path` module can help handle path differences across operating systems, but for simple cases, direct strings often suffice.

#### Encoding
Text files store characters (like 'A', 'B', '!', 'é', '你好') as sequences of bytes. The way these characters are converted to bytes when written to a file, and back to characters when read, is called **encoding**. Different encodings exist (e.g., ASCII, Latin-1, UTF-8).

The most common and recommended encoding for text files today is **UTF-8**. It can represent almost all characters from all languages, making it highly versatile. When you open a file, Python tries to guess the encoding, but it's best to explicitly specify it, especially if you're dealing with non-English characters or files created on different systems.

You can specify the encoding using the `encoding` parameter in the `open()` function:

```python
# Writing with a specific encoding
with open("unicode_example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, world!\n")
    f.write("Привет, мир!\n") # Russian
    f.write("你好，世界！\n") # Chinese

# Reading with the same encoding
with open("unicode_example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print("\n--- Content from unicode_example.txt ---")
    print(content)
```
If you omit `encoding="utf-8"`, Python might use your system's default encoding, which could lead to a `UnicodeDecodeError` if the file contains characters not supported by that default encoding. Always specifying `encoding="utf-8"` is a good habit to prevent unexpected errors and ensure your text is displayed correctly.

## Wrap-Up
Congratulations! You've taken a significant step in making your Python programs more powerful by learning how to interact with files. You now understand the importance of persistence, how to open files in different modes (`"r"`, `"w"`, `"a"`), and how to read and write data using various methods. Most importantly, you've learned to use the `with` statement for safe and reliable file handling, which is a cornerstone of good Python practice. You also have a basic understanding of file paths and text encoding.

In future lessons, you might explore more advanced file operations, such as handling binary files (for images, audio, etc.), working with structured data formats like CSV or JSON, and robust [error handling](../python/error-handling.md) for file operations. For now, practice these fundamental concepts to solidify your understanding and give your Python programs the gift of memory!