<a id="concept-functions-in-python"></a>
# Functions in Python

## Learning Objectives
By the end of this lesson, you will be able to:
- Define and call your own Python functions to organize code.
- Understand and use `parameter`s and `argument`s, including `positional argument`s and `keyword argument`s, to make functions flexible.
- Return values from functions to get results back from computations.
- Explain `scope` using the `LEGB rule` to understand where variables are accessible.
- Create simple `anonymous function`s using `lambda` expressions for quick, single-line operations.

## Introduction
Imagine you're building a house. You wouldn't build every single brick, window, and door from scratch each time you need one, right? Instead, you'd have blueprints for windows, a process for making bricks, and so on. You'd reuse these plans and processes whenever necessary.

In programming, especially in Python, we have a similar concept called **functions**. A function is like a mini-program or a blueprint for a specific task. It's a block of organized, reusable code that performs a single, related action. When you need to perform that action, you simply "call" the function, rather than writing the same code over and over again.

Why are functions so important?
1.  **Reusability:** Write code once, use it many times. This saves effort and reduces the chance of errors.
2.  **Modularity:** Break down complex problems into smaller, manageable pieces. Each function handles a specific part of the problem, making your code easier to understand, test, and debug.
3.  **Readability:** Well-named functions make your code almost read like plain English, improving clarity for yourself and others. This contributes to overall [code readability](../python/introduction-to-python-programming.md#concept-code-readability).

In this lesson, we'll explore how to create and use these powerful building blocks in Python, starting from the very basics.

## Concept Progression

<a id="concept-function"></a>
### Defining and Calling Your First Function

Let's start with the fundamental steps: how to tell Python you want to create a function and then how to make that function actually run.

To define a function in Python, you use the `def` keyword, followed by the function's name, a pair of parentheses `()`, and a colon `:`. The code that belongs to the function (its "body") is then indented below this line.

Think of the `def` line as giving your mini-program a name and saying, "Here's what this function is going to do."

```python
# This is how you define a function named 'greet'
def greet():
    print("Hello, Python learner!")
    print("Welcome to functions!")

# Nothing happens until you call the function
print("Before the function call.")

# This is how you call the function by its name followed by parentheses
greet()

print("After the function call.")
```

**Output:**
```
Before the function call.
Hello, Python learner!
Welcome to functions!
After the function call.
```

In this example, `greet` is the name of our function. The two `print()` statements form the "body" of the function. Notice that when we run the script, "Before the function call." prints first, then the lines inside `greet()` execute, and finally "After the function call." prints. This clearly shows that the code inside the function only executes when it's explicitly called.

[IMAGE_PLACEHOLDER: A flowchart showing program execution. Start -> Print "Before..." -> Call greet() -> (Inside greet: Print "Hello...", Print "Welcome...") -> Return from greet() -> Print "After..." -> End. Illustrates the flow of control when a function is called.]

### Passing Information: Parameters and Arguments

Our `greet()` function is a good start, but it always says the same thing. What if we want to greet different people or perform operations on different pieces of data? This is where **parameters** and **arguments** come in. They allow you to pass information into your functions, making them much more flexible and useful.

-   A **parameter** is a variable listed inside the parentheses in the function definition. It acts as a placeholder for the data the function expects to receive.
-   An **argument** is the actual value that is passed to the function when it is called.

Let's modify our `greet` function to accept a name:

```python
def greet_person(name): # 'name' is a parameter
    print(f"Hello, {name}!")
    print("Welcome to functions!")

# Calling the function with different arguments
greet_person("Alice") # "Alice" is an argument
greet_person("Bob")   # "Bob" is an argument
```

**Output:**
```
Hello, Alice!
Welcome to functions!
Hello, Bob!
Welcome to functions!
```

Now, our `greet_person` function can greet anyone we specify! The `name` parameter inside the function takes on the value of the argument passed during the call.

#### Types of Arguments

Python offers several convenient ways to pass arguments to a function:

1.  **Positional Arguments:** These are the most common. The order in which you pass the arguments matters, as Python matches them to parameters based on their position.

    ```python
    def describe_pet(animal_type, pet_name):
        print(f"\nI have a {animal_type}.")
        print(f"Its name is {pet_name}.")

    # Positional arguments: 'dog' matches animal_type, 'Buddy' matches pet_name
    describe_pet('dog', 'Buddy')

    # Order matters! If you swap them, the meaning changes:
    describe_pet('Whiskers', 'cat') # This implies 'Whiskers' is the animal_type and 'cat' is the pet_name
    ```

    **Output:**
    ```
    I have a dog.
    Its name is Buddy.

    I have a Whiskers.
    Its name is cat.
    ```

2.  **Keyword Arguments:** You can explicitly name the parameters when you call the function. This way, the order of the arguments doesn't matter, which can make your code more readable, especially with many parameters.

    ```python
    def describe_pet(animal_type, pet_name):
        print(f"\nI have a {animal_type}.")
        print(f"Its name is {pet_name}.")

    # Keyword arguments: order doesn't matter
    describe_pet(pet_name='Max', animal_type='hamster')
    describe_pet(animal_type='fish', pet_name='Goldie')
    ```

    **Output:**
    ```
    I have a hamster.
    Its name is Max.

    I have a fish.
    Its name is Goldie.
    ```

3.  **Default Parameter Values:** You can assign default values to parameters in the function definition. If an argument isn't provided for that parameter when the function is called, the default value is used. This makes functions more flexible, allowing them to be called with fewer arguments in common scenarios.

    ```python
    def greet_user(name="Guest", greeting="Hello"):
        print(f"{greeting}, {name}!")

    greet_user("Charlie") # Uses default greeting "Hello"
    greet_user(greeting="Hi", name="Diana") # Overrides both defaults using keyword arguments
    greet_user() # Uses both default values
    ```

    **Output:**
    ```
    Hello, Charlie!
    Hi, Diana!
    Hello, Guest!
    ```
    **Important:** Parameters with default values must come *after* any parameters without default values in the function definition.

### Getting Results Back: Return Values

So far, our functions have printed things directly to the console. But often, you want a function to perform a calculation or process some data and then give you back a result that you can use elsewhere in your program. This is done using the `return` statement. The `return` statement sends a value (or values) back to the part of the code that called the function.

```python
def add_numbers(num1, num2):
    sum_result = num1 + num2
    return sum_result # The function sends 'sum_result' back

# Call the function and store its return value in a variable
total = add_numbers(5, 3)
print(f"The sum is: {total}") # Output: The sum is: 8

# You can also use the returned value directly in an expression
print(f"Another sum: {add_numbers(10, 20)}") # Output: Another sum: 30
```

**Output:**
```
The sum is: 8
Another sum: 30
```

If a function doesn't have an explicit `return` statement, it implicitly returns `None`. `None` is a special Python value that represents the absence of a value.

```python
def do_nothing():
    pass # 'pass' is a placeholder, means "do nothing"

result = do_nothing()
print(f"The result of do_nothing is: {result}")
```

**Output:**
```
The result of do_nothing is: None
```

Functions can also return multiple values. When you `return` multiple items separated by commas, Python automatically packs them into a `tuple` and returns that `tuple`. You can then "unpack" these values into separate variables when you call the function.

```python
def get_user_info(name, age):
    # Returns a tuple containing name, age, and a string
    return name, age, "Python Enthusiast"

# Unpack the returned tuple into three separate variables
user_name, user_age, user_hobby = get_user_info("Eve", 30)
print(f"Name: {user_name}, Age: {user_age}, Hobby: {user_hobby}")
```

**Output:**
```
Name: Eve, Age: 30, Hobby: Python Enthusiast
```

<a id="concept-name-resolution"></a>
### Understanding Scope: Where Variables Live (The LEGB Rule)

When you create variables inside a function, they don't exist everywhere in your program. The region of your code where a variable is accessible is called its **scope**. Python follows a specific rule called the **LEGB rule** to determine the scope of a variable and how to resolve its name:

-   **L**ocal: Names assigned inside a function (e.g., `x` in `def func(): x = 10`). These variables are only accessible within that function.
-   **E**nclosing-function locals: Names in the local scope of any enclosing (outer) functions. This applies to nested functions.
-   **G**lobal: Names assigned at the top level of a module (a Python file). These are accessible throughout the module.
-   **B**uilt-in: Names pre-assigned in Python (e.g., `print`, `len`, `str`). These are always available.

Python searches for a variable name in this order: Local -> Enclosing -> Global -> Built-in. If it doesn't find the name after checking all these scopes, it raises a `NameError`.

Let's see this in action:

```python
# Global scope variable
global_message = "I am a global message."

def outer_function():
    # Enclosing scope variable (for inner_function)
    enclosing_message = "I am from the outer function."

    def inner_function():
        # Local scope variable
        local_message = "I am a local message."
        print(f"Inside inner_function: {local_message}")          # Accesses Local
        print(f"Inside inner_function: {enclosing_message}")      # Accesses Enclosing
        print(f"Inside inner_function: {global_message}")         # Accesses Global
        # print(f"Inside inner_function: {non_existent_var}")     # This would cause a NameError!

    inner_function()
    print(f"Inside outer_function: {enclosing_message}")
    print(f"Inside outer_function: {global_message}")
    # print(f"Inside outer_function: {local_message}")           # This would cause a NameError!

outer_function()
print(f"Outside functions: {global_message}")
# print(f"Outside functions: {enclosing_message}")               # This would cause a NameError!
# print(f"Outside functions: {local_message}")                   # This would cause a NameError!
```

**Output:**
```
Inside inner_function: I am a local message.
Inside inner_function: I am from the outer function.
Inside inner_function: I am a global message.
Inside outer_function: I am from the outer function.
Inside outer_function: I am a global message.
Outside functions: I am a global message.
```

[IMAGE_PLACEHOLDER: A diagram illustrating LEGB scope. Four concentric rectangles: Innermost "Local" (inner_function's variables), then "Enclosing" (outer_function's variables), then "Global" (module-level variables), and outermost "Built-in" (Python's default functions/types). Arrows show search direction from inner to outer.]

**Important Note on Modifying Global Variables:**
If you want to modify a global variable from inside a function, you need to explicitly tell Python using the `global` keyword. Otherwise, Python will assume you're creating a *new local variable* with the same name, which will not affect the global variable.

```python
global_counter = 0

def increment_global_counter():
    global global_counter # Declare intent to modify the global variable
    global_counter += 1
    print(f"Global counter inside function: {global_counter}")

def try_to_change_global_without_global():
    # This creates a NEW local variable 'global_counter' within this function's scope.
    # It does NOT modify the global_counter defined outside.
    global_counter = 100
    print(f"Local global_counter inside function: {global_counter}")

print(f"Initial global counter: {global_counter}")
increment_global_counter()
increment_global_counter()
print(f"Global counter after increments: {global_counter}")

try_to_change_global_without_global()
print(f"Global counter after local attempt to change: {global_counter}") # Still 2, not 100
```

**Output:**
```
Initial global counter: 0
Global counter inside function: 1
Global counter inside function: 2
Global counter after increments: 2
Local global_counter inside function: 100
Global counter after local attempt to change: 2
```

Using `global` is generally discouraged for complex programs as it can make code harder to follow and debug. It's often better practice to pass values as arguments to functions and return new values, rather than directly modifying global state.

<a id="concept-lambda"></a>
### Quick Functions: Lambda Expressions (Anonymous Functions)

Sometimes you need a small, simple function for a short period, and defining a full function with `def` feels like overkill. For these situations, Python offers **lambda expressions**, which create **anonymous functions** (functions without a name).

A lambda function can take any number of arguments, but it can only have one [expression](../python/operators-and-expressions.md#concept-expression). The result of this expression is implicitly returned.

The syntax is: `lambda arguments: expression`

```python
# A regular function to square a number
def square(x):
    return x * x

print(f"Square of 5 (def function): {square(5)}")

# The equivalent lambda function
square_lambda = lambda x: x * x

print(f"Square of 5 (lambda function): {square_lambda(5)}")

# Lambda with multiple arguments
add_lambda = lambda a, b: a + b
print(f"Sum of 3 and 7 (lambda function): {add_lambda(3, 7)}")
```

**Output:**
```
Square of 5 (def function): 25
Square of 5 (lambda function): 25
Sum of 3 and 7 (lambda function): 10
```

Lambda functions are often used as arguments to higher-order functions (functions that take other functions as arguments), like `map()`, `filter()`, and `sorted()`, where a small, single-purpose function is needed on the fly.

```python
numbers = [1, 2, 3, 4, 5]

# Use lambda with map() to square each number in the list
squared_numbers = list(map(lambda x: x * x, numbers))
print(f"Squared numbers: {squared_numbers}")

# Use lambda with filter() to get only the even numbers
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Even numbers: {even_numbers}")

# Use lambda with sorted() to sort a list of tuples by their second element
pairs = [(1, 'b'), (3, 'a'), (2, 'c')]
sorted_pairs = sorted(pairs, key=lambda pair: pair[1])
print(f"Sorted pairs by second element: {sorted_pairs}")
```

**Output:**
```
Squared numbers: [1, 4, 9, 16, 25]
Even numbers: [2, 4]
Sorted pairs by second element: [(3, 'a'), (1, 'b'), (2, 'c')]
```

<a id="concept-call-stack"></a>
### Functions Calling Themselves: Recursion and the Call Stack

Sometimes, a problem can be solved by breaking it down into smaller, similar versions of itself. This is where **recursion** comes in: a function that calls itself.

A recursive function needs two main parts to work correctly:
1.  **Base Case:** A condition that stops the recursion. Without it, the function would call itself indefinitely, leading to an error (specifically, a `RecursionError`).
2.  **Recursive Step:** The part where the function calls itself with a modified (usually smaller or simpler) input, moving closer to the base case.

A classic example is calculating the factorial of a number (e.g., 5! = 5 * 4 * 3 * 2 * 1).

```python
def factorial(n):
    # Base case: if n is 0 or 1, factorial is 1
    if n == 0 or n == 1:
        return 1
    # Recursive step: n multiplied by the factorial of (n-1)
    else:
        return n * factorial(n - 1)

print(f"Factorial of 5: {factorial(5)}") # Expected: 120
print(f"Factorial of 0: {factorial(0)}") # Expected: 1
```

**Output:**
```
Factorial of 5: 120
Factorial of 0: 1
```

How does this work behind the scenes? Every time a function is called (whether it's a regular call or a recursive call), Python creates a new **call stack** frame. This frame is like a temporary workspace that keeps track of that function's local variables, its parameters, and where to return to after it finishes.

Let's trace `factorial(5)`:
1.  `factorial(5)` is called. It sees `n` is not 0 or 1, so it needs `5 * factorial(4)`. It pauses and pushes `factorial(4)` onto the stack.
2.  `factorial(4)` is called. It needs `4 * factorial(3)`. It pauses and pushes `factorial(3)` onto the stack.
3.  `factorial(3)` is called. It needs `3 * factorial(2)`. It pauses and pushes `factorial(2)` onto the stack.
4.  `factorial(2)` is called. It needs `2 * factorial(1)`. It pauses and pushes `factorial(1)` onto the stack.
5.  `factorial(1)` is called. It hits the base case (`n == 1`) and immediately returns `1`.
6.  `factorial(2)` receives `1` (from `factorial(1)`). It calculates `2 * 1 = 2` and returns `2`.
7.  `factorial(3)` receives `2` (from `factorial(2)`). It calculates `3 * 2 = 6` and returns `6`.
8.  `factorial(4)` receives `6` (from `factorial(3)`). It calculates `4 * 6 = 24` and returns `24`.
9.  `factorial(5)` receives `24` (from `factorial(4)`). It calculates `5 * 24 = 120` and returns `120`.

[IMAGE_PLACEHOLDER: A stack diagram showing the call stack for factorial(5). Each layer of the stack represents a function call, showing its local variables (e.g., n=5, n=4, etc.) and the return address. The stack grows as functions are called and shrinks as they return.]

While powerful and elegant for certain problems, recursion can be less efficient for very deep calls due to the overhead of managing the call stack. Python also has a default recursion limit (usually around 1000 calls) to prevent infinite recursion from crashing your program. For problems that can be solved iteratively (with loops), an iterative solution is often preferred in Python for performance and clarity.

## Wrap-Up

Congratulations! You've covered the essential concepts of functions in Python. You've learned how to define them, pass arguments to make them flexible, retrieve results using `return` statements, and understand the `scope` of variables using the `LEGB rule`. We also touched upon `lambda` expressions for quick, `anonymous function`s and the concept of `recursion` with the `call stack`.

Functions are fundamental to writing clean, efficient, and maintainable Python code. They are the building blocks that allow you to construct complex and powerful programs by breaking them into manageable, reusable parts. As you continue your Python journey, you'll find yourself using and creating functions constantly. Next, we'll explore more advanced ways to handle data in Python, building on your understanding of variables and functions.