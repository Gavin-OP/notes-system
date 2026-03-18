# Object-Oriented Programming (OOP)

## Learning Objectives
By the end of this lesson, you will be able to:
- Explain the core concepts of classes and objects in Python.
- Define and use attributes to store data within objects.
- Create and call methods to define object behaviors.
- Understand and apply inheritance to reuse code and build relationships between classes.
- Describe polymorphism and how it allows objects of different classes to be treated uniformly.
- Grasp the principle of encapsulation for organizing and protecting object data.

## Introduction
Imagine you're building a complex system, like a video game with characters, items, and levels, or a social media application with users, posts, and comments. In such systems, you'll encounter many different "things" that each have their own unique characteristics and can perform specific actions. For instance, a `Player` might have `health` and `score`, and can `attack()` or `move()`. A `Post` might have `content` and `author`, and can be `liked()` or `commented_on()`.

As your project grows, simply writing [functions](../python/functions.md) that operate on disconnected pieces of data can quickly become messy, hard to track, and difficult to maintain. This is where Object-Oriented Programming (OOP) comes to the rescue!

OOP is a powerful programming paradigm that helps you organize your code by bundling related data (characteristics) and behaviors (actions) into self-contained units called **objects**. It's like creating miniature, intelligent entities within your program that know about themselves and how to interact. This approach leads to cleaner, more modular, and easier-to-understand code, making complex systems much more manageable.

Let's embark on a journey to understand the fundamental building blocks of OOP, starting with the very first concept: the blueprint for these intelligent entities.

## Concept Progression

### Classes: The Blueprints for Objects

At the heart of OOP is the concept of a **class**. Think of a class as a blueprint, a template, or a cookie cutter. It's not the actual house or the actual cookie, but rather a detailed plan or a mold that describes *how* to create one. A class defines the common characteristics (what kind of data it holds) and behaviors (what actions it can perform) that all "things" created from this blueprint will share.

For example, if you wanted to create many different cars in your program, you wouldn't describe each car from scratch every time. Instead, you'd define a "Car" class. This `Car` blueprint would specify that every car has a `color`, a `make`, a `model`, and can `start_engine()` or `drive()`.

In Python, you define a class using the `class` keyword, followed by the class name (conventionally capitalized):

```python
class Car:
    # This is our blueprint for a Car
    pass # 'pass' is a placeholder; it means "do nothing for now."
         # We'll add details to our blueprint very soon!
```

Right now, our `Car` blueprint is quite empty, but it establishes the idea that a `Car` exists as a conceptual entity in our program. It's the abstract definition, not a concrete item.

[IMAGE_PLACEHOLDER: A simple diagram showing a "Class: Car" box at the top. Below it, an arrow points down to a thought bubble or text that says "Blueprint / Template". The box lists "Attributes: color, make, model" and "Methods: start_engine(), drive()". The overall style should be clean and illustrative, emphasizing the abstract nature of a class.]

### Objects: The Actual Things (Instances)

If a class is the blueprint, then an **object** (also frequently called an **instance**) is the actual "thing" created from that blueprint. Following our analogy, if `Car` is the blueprint, then *your specific red Toyota Camry* is an object of the `Car` class. Each object is a unique, tangible entity, even if it shares the same fundamental structure defined by its class blueprint.

You can create multiple objects from the same class, just like you can build many distinct houses from the same architectural plan. Each house will be unique – perhaps with different paint colors, interior designs, or addresses – but they all adhere to the same underlying structure defined by the blueprint.

To create an object from a class in Python, you "call" the class name as if it were a function. This process is called **instantiation**:

```python
# We're creating two actual Car objects from our Car blueprint
my_car = Car()
your_car = Car()

print(type(my_car))
print(type(your_car))
print(my_car == your_car) # Are they the exact same object in memory?
```

**Output:**
```
<class '__main__.Car'>
<class '__main__.Car'>
False
```

As you can see, `my_car` and `your_car` are both `Car` objects, confirming they were created from the `Car` class. However, `my_car == your_car` evaluates to `False` because they are distinct instances in memory, each occupying its own space.

Now that we know how to create individual objects, the next logical step is to give them unique characteristics.

### Attributes: Describing Your Objects

Objects aren't very useful if they can't hold data. This is where **attributes** come in. Attributes are variables associated with an object that store data about that specific object. They are like the specific details filled into the blueprint for a particular house – its address, its paint color, the number of bedrooms.

There are two main types of attributes:

1.  **Instance Attributes:** These are unique to each individual object (instance). For example, `my_car` might have `color = "Red"`, while `your_car` might have `color = "Blue"`.
2.  **Class Attributes:** These are shared by *all* objects of a class. They are defined directly within the class but outside any method. For example, perhaps all `Car` objects inherently have `wheels = 4`.

Let's add some instance attributes to our `Car` class. We do this using a special method called `__init__` (pronounced "dunder init"). This method is automatically called whenever a new object is created from the class. It's often referred to as the **constructor** because it's where you set up the initial state and attributes of your object.

```python
class Car:
    # Class attribute: shared by all Car objects
    wheels = 4

    # The __init__ method is called when a new Car object is created
    def __init__(self, make, model, color):
        # 'self' refers to the specific object being created/initialized
        # Instance attributes: unique to each Car object
        self.make = make
        self.model = model
        self.color = color
        self.is_running = False # All new cars start with their engine off
        print(f"A new {self.color} {self.make} {self.model} has been created!")

# Create Car objects with specific attributes
my_car = Car("Toyota", "Camry", "Red")
your_car = Car("Honda", "Civic", "Blue")

# Accessing instance attributes using dot notation
print(f"My car is a {my_car.color} {my_car.make} {my_car.model}.")
print(f"Your car is a {your_car.color} {your_car.make} {your_car.model}.")

# Accessing a class attribute (can be accessed via class or instance)
print(f"All cars have {Car.wheels} wheels.")
print(f"My car also has {my_car.wheels} wheels.")
```

**Output:**
```
A new Red Toyota Camry has been created!
A new Blue Honda Civic has been created!
My car is a Red Toyota Camry.
Your car is a Blue Honda Civic.
All cars have 4 wheels.
My car also has 4 wheels.
```

Notice how `self` is used in the `__init__` method. `self` is a convention (though not a keyword) that refers to the *current instance* of the class. When you write `self.make = make`, you're saying "for *this specific car object* that is currently being initialized, set its `make` attribute to the value passed in as `make`."

Beyond just holding data, objects can also perform actions. This brings us to methods.

### Methods: Actions Your Objects Can Perform

Objects don't just passively hold data; they can also *do* things. These actions are defined by **methods**. Methods are essentially [functions](../python/functions.md) that belong to a class and operate on the data (attributes) of an object. They define the behaviors and capabilities of your objects, allowing them to interact with their own data and potentially with other objects.

Continuing with our `Car` example, a car can `start_engine()`, `drive()`, or `honk()`. These would be methods of the `Car` class. By bundling these actions with the `Car` object itself, we ensure that the logic for operating a car is contained within the `Car` blueprint, making our code more organized and intuitive.

Let's add some methods to our `Car` class:

```python
class Car:
    wheels = 4

    def __init__(self, make, model, color):
        self.make = make
        self.model = model
        self.color = color
        self.is_running = False # Initial state

    # Instance method: operates on the object's data (self.is_running)
    def start_engine(self):
        if not self.is_running:
            self.is_running = True
            print(f"The {self.color} {self.make} {self.model} engine starts.")
        else:
            print(f"The {self.make} engine is already running.")

    # Another instance method
    def drive(self):
        if self.is_running:
            print(f"The {self.make} {self.model} is driving.")
        else:
            print(f"The {self.make} {self.model} needs to be started first!")

    # A simple method to honk
    def honk(self):
        print("Beep! Beep!")

# Create a Car object
my_car = Car("Tesla", "Model 3", "White")

# Call methods on the object using dot notation
my_car.drive() # Try to drive before starting
my_car.start_engine()
my_car.drive()
my_car.honk()
my_car.start_engine() # Try to start again
```

**Output:**
```
A new White Tesla Model 3 has been created!
The Tesla Model 3 needs to be started first!
The White Tesla Model 3 engine starts.
The Tesla Model 3 is driving.
Beep! Beep!
The Tesla engine is already running.
```

Just like `__init__`, all instance methods take `self` as their first parameter. This allows the method to access and modify the specific object's attributes (like `self.is_running`). When you call `my_car.start_engine()`, Python automatically passes `my_car` as the `self` argument to the `start_engine` method.

[IMAGE_PLACEHOLDER: A diagram showing a "Car Object" box. Inside, it clearly separates "Attributes" (e.g., color: Red, make: Toyota, model: Camry, is_running: True) from "Methods" (e.g., start_engine(), drive(), honk()). Arrows could show methods interacting with attributes (e.g., `start_engine()` changing `is_running`).]

As our programs grow, we often find commonalities between different types of objects. This leads us to a powerful OOP principle for code reuse: inheritance.

### Inheritance: Building on Existing Foundations

Imagine you've successfully created a `Vehicle` class that defines common characteristics and behaviors for all vehicles, like having a `make`, `model`, and the ability to `start_engine()` and `stop_engine()`. Now, you want to create more specific classes like `Car` and `Motorcycle`. Both cars and motorcycles are types of vehicles, so they naturally share these common traits.

Instead of rewriting the `make`, `model`, `start_engine()`, and `stop_engine()` logic in both `Car` and `Motorcycle` classes, OOP offers **inheritance**. Inheritance is a mechanism where a new class (called the **child class**, **subclass**, or **derived class**) can inherit (receive) attributes and methods from an existing class (called the **parent class**, **superclass**, or **base class**). This promotes code reuse, reduces redundancy, and establishes a natural "is-a" relationship (e.g., a `Car` *is a* `Vehicle`, a `Motorcycle` *is a* `Vehicle`).

Let's create a `Vehicle` parent class and then make `Car` and `Motorcycle` child classes that inherit from it:

```python
class Vehicle: # This is our parent class
    def __init__(self, make, model):
        self.make = make
        self.model = model
        self.is_running = False
        print(f"A new Vehicle ({self.make} {self.model}) has been created.")

    def start_engine(self):
        if not self.is_running:
            self.is_running = True
            print(f"The {self.make} {self.model} engine starts.")
        else:
            print(f"The {self.make} engine is already running.")

    def stop_engine(self):
        if self.is_running:
            self.is_running = False
            print(f"The {self.make} {self.model} engine stops.")
        else:
            print(f"The {self.make} engine is already off.")

class Car(Vehicle): # Car inherits from Vehicle (Vehicle is in parentheses)
    def __init__(self, make, model, num_doors):
        # Call the parent class's __init__ method to handle make and model
        super().__init__(make, model)
        self.num_doors = num_doors
        print(f"This Car has {self.num_doors} doors.")

    def drive(self): # Car-specific method
        if self.is_running:
            print(f"The {self.make} {self.model} with {self.num_doors} doors is driving.")
        else:
            print(f"The {self.make} {self.model} needs to be started first!")

class Motorcycle(Vehicle): # Motorcycle also inherits from Vehicle
    def __init__(self, make, model, has_sidecar):
        super().__init__(make, model) # Call parent's __init__
        self.has_sidecar = has_sidecar
        print(f"This Motorcycle {'has' if self.has_sidecar else 'does not have'} a sidecar.")

    def wheelie(self): # Motorcycle-specific method
        if self.is_running:
            print(f"The {self.make} {self.model} is doing a wheelie!")
        else:
            print(f"The {self.make} {self.model} needs to be started to do a wheelie!")

# Create objects
my_car = Car("Ford", "Focus", 4)
my_motorcycle = Motorcycle("Harley-Davidson", "Iron 883", False)

print("\n--- Actions ---")
# Both can start their engines (inherited from Vehicle)
my_car.start_engine()
my_motorcycle.start_engine()

# Each has its own specific methods
my_car.drive()
my_motorcycle.wheelie()

# Both can stop their engines (inherited from Vehicle)
my_car.stop_engine()
my_motorcycle.stop_engine()
```

**Output:**
```
A new Vehicle (Ford Focus) has been created.
This Car has 4 doors.
A new Vehicle (Harley-Davidson Iron 883) has been created.
This Motorcycle does not have a sidecar.

--- Actions ---
The Ford Focus engine starts.
The Harley-Davidson Iron 883 engine starts.
The Ford Focus with 4 doors is driving.
The Harley-Davidson Iron 883 is doing a wheelie!
The Ford Focus engine stops.
The Harley-Davidson Iron 883 engine stops.
```

The `super().__init__(make, model)` call is crucial here. It ensures that the parent class's `__init__` method is executed, setting up the `make` and `model` attributes that all `Vehicle`s share, before the child class adds its own specific attributes like `num_doors` or `has_sidecar`.

[IMAGE_PLACEHOLDER: A hierarchical diagram showing "Vehicle" as the top parent class. Two arrows point down from "Vehicle" to "Car" and "Motorcycle" classes, indicating inheritance. "Vehicle" lists common attributes/methods (e.g., make, model, start_engine). "Car" adds specific attributes/methods (e.g., num_doors, drive). "Motorcycle" adds specific attributes/methods (e.g., has_sidecar, wheelie). Labels should clearly show "Parent Class" and "Child Class".]

Inheritance allows us to build hierarchies, and this leads naturally to another powerful concept: polymorphism.

### Polymorphism: Many Forms, One Action

**Polymorphism** (from Greek, meaning "many forms") is a core concept in OOP that allows objects of different classes to be treated as objects of a common type. In simpler terms, it means that a single interface (like a method name) can be used to represent different underlying forms or behaviors. When you call that method, the specific implementation that runs depends on the actual type of the object you're interacting with.

The most common way to see polymorphism in action is through **method overriding**. A child class can provide its own specific implementation of a method that is already defined in its parent class. When you call that method on an object, Python (or any OOP language) determines which version of the method to run based on the object's actual type at runtime.

Let's extend our `Vehicle` example. What if we want each vehicle to make a unique sound? The generic `Vehicle` might have a default sound, but `Car`, `Motorcycle`, and `Bicycle` (a new type of vehicle) should each make their characteristic noise.

```python
class Vehicle:
    def __init__(self, make, model):
        self.make = make
        self.model = model

    def make_sound(self):
        # Default sound for any generic vehicle
        print("Generic vehicle sound.")

class Car(Vehicle):
    def __init__(self, make, model, num_doors):
        super().__init__(make, model)
        self.num_doors = num_doors

    def make_sound(self): # Overriding the make_sound method from Vehicle
        print("Vroom! Vroom!")

class Motorcycle(Vehicle):
    def __init__(self, make, model, has_sidecar):
        super().__init__(make, model)
        self.has_sidecar = has_sidecar

    def make_sound(self): # Overriding the make_sound method from Vehicle
        print("Brum! Brum!")

class Bicycle(Vehicle): # A new child class, also inheriting from Vehicle
    def __init__(self, make, model, num_gears):
        super().__init__(make, model)
        self.num_gears = num_gears

    # Bicycle doesn't have an engine, so its sound is different
    def make_sound(self): # Overriding the make_sound method from Vehicle
        print("Ring! Ring! (Bell sound)")

# Create a list containing different vehicle objects
vehicles = [
    Car("Toyota", "Camry", 4),
    Motorcycle("Kawasaki", "Ninja", False),
    Bicycle("Giant", "Escape", 21)
]

print("\n--- Vehicle Sounds ---")
# Iterate through the list and call make_sound on each object
# Python automatically calls the correct make_sound based on the object's type
for vehicle in vehicles:
    print(f"{vehicle.make} {vehicle.model}: ", end="")
    vehicle.make_sound()
```

**Output:**
```
A new Vehicle (Toyota Camry) has been created.
This Car has 4 doors.
A new Vehicle (Kawasaki Ninja) has been created.
This Motorcycle does not have a sidecar.
A new Vehicle (Giant Escape) has been created.

--- Vehicle Sounds ---
Toyota Camry: Vroom! Vroom!
Kawasaki Ninja: Brum! Brum!
Giant Escape: Ring! Ring! (Bell sound)
```

Even though we're calling `make_sound()` on a generic `vehicle` variable within the loop, Python correctly executes the `make_sound` method specific to whether the `vehicle` object is a `Car`, `Motorcycle`, or `Bicycle`. This dynamic dispatch of methods based on the object's type is the essence of polymorphism. It makes our code more flexible and extensible, as we can add new vehicle types without changing the loop that processes them.

Finally, let's look at how OOP helps us manage and protect an object's internal workings.

### Encapsulation: Keeping Things Tidy and Safe

**Encapsulation** is about bundling data (attributes) and the methods that operate on that data within a single unit (the class). It also involves restricting direct access to some of an object's internal components, meaning that internal data should ideally only be accessed or modified through the object's public methods.

Think of it like a car's dashboard and engine. You, as the driver, don't directly manipulate the pistons or spark plugs while driving. Instead, you interact with the engine through a well-defined **public interface** – the accelerator pedal, the brake, the ignition switch. The complex internal workings of the engine are "encapsulated" away from you. This prevents you from accidentally (or intentionally) damaging the engine by messing with its internal parts directly.

The main benefits of encapsulation are:
1.  **Data Hiding/Protection:** It protects an object's internal state from external, unauthorized, or incorrect access/modification. This ensures data integrity.
2.  **Modularity:** It makes objects self-contained and independent, easier to understand, test, and manage.
3.  **Flexibility:** It allows the internal implementation of a class to change without affecting the code that uses the class, as long as the public interface (the methods you call) remains the same.

In Python, there isn't strict "private" access like in some other languages (where you literally cannot access a private variable from outside the class). Instead, Python relies on conventions to indicate that an attribute or method is intended for internal use only:

*   **Single underscore prefix (`_attribute`):** This is a widely accepted convention indicating that an attribute or method is "protected" and should not be accessed directly from outside the class. It's a hint to other developers: "Hey, this is internal, use my public methods instead!"
*   **Double underscore prefix (`__attribute`):** This triggers "name mangling," making the attribute harder (but not impossible) to access from outside the class. It's typically used to avoid naming conflicts in inheritance scenarios, rather than for strict security. For general data hiding, the single underscore is more common.

Let's see an example with a `BankAccount` class, where we want to control how the `_balance` is modified:

```python
class BankAccount:
    def __init__(self, account_holder, initial_balance=0):
        self.account_holder = account_holder
        # _balance is a "protected" attribute, indicating it's for internal use
        # We initialize it here, but external code should use methods to change it.
        if initial_balance >= 0:
            self._balance = initial_balance
        else:
            self._balance = 0
            print("Initial balance cannot be negative. Setting to 0.")
        print(f"Account for {self.account_holder} created with balance: ${self._balance}")

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"Deposited ${amount}. New balance: ${self._balance}")
        else:
            print("Deposit amount must be positive.")

    def withdraw(self, amount):
        if amount > 0 and self._balance >= amount:
            self._balance -= amount
            print(f"Withdrew ${amount}. New balance: ${self._balance}")
        elif amount <= 0:
            print("Withdrawal amount must be positive.")
        else:
            print("Insufficient funds.")

    def get_balance(self):
        # This method provides a controlled, read-only way to access the balance
        return self._balance

# Create an account
my_account = BankAccount("Alice", 100)
another_account = BankAccount("Bob", -50) # Test negative initial balance

print(f"\nAlice's account balance (via method): ${my_account.get_balance()}")

# We can technically access _balance directly, but it's discouraged and bypasses logic
print(f"Alice's balance (direct access - discouraged): ${my_account._balance}")

# Use methods for controlled access and modification
my_account.deposit(50)
my_account.withdraw(20)
my_account.withdraw(200) # This will correctly trigger "Insufficient funds."

print(f"Alice's current balance (via method): ${my_account.get_balance()}")

# What if someone tries to mess with the balance directly, ignoring the convention?
# This is possible in Python, but it breaks the principle of encapsulation!
my_account._balance = -1000
print(f"Alice's balance after direct (bad) modification: ${my_account.get_balance()}")
```

**Output:**
```
Account for Alice created with balance: $100
Initial balance cannot be negative. Setting to 0.
Account for Bob created with balance: $0

Alice's account balance (via method): $100
Alice's balance (direct access - discouraged): $100
Deposited $50. New balance: $150
Withdrew $20. New balance: $130
Insufficient funds.
Alice's current balance (via method): $130
Alice's balance after direct (bad) modification: $-1000
```

The example clearly shows that while Python doesn't strictly prevent direct access to `_balance`, the convention of using `_balance` signals that you should interact with the balance only through the `deposit()`, `withdraw()`, and `get_balance()` methods. These methods contain the crucial logic to ensure the balance is handled correctly (e.g., preventing negative deposits or withdrawals exceeding funds). Directly modifying `_balance` bypasses this protective logic, leading to an inconsistent and potentially problematic state, as seen when `my_account._balance` was set to `-1000`.

[IMAGE_PLACEHOLDER: A diagram illustrating encapsulation. Show a "BankAccount Object" as a box. Inside the box, clearly label `_balance` as "Internal Data (Protected)". Around it, show public methods like `deposit()`, `withdraw()`, `get_balance()` as "Public Interface". Arrows should show external interaction only with the public methods, and these methods then interact with the internal data. A dashed arrow could show a discouraged direct access to `_balance` from outside the box.]

## Wrap-Up

Congratulations! You've just taken a significant step into the powerful world of Object-Oriented Programming. We started by understanding that **classes** are like blueprints, defining the structure and behavior, while **objects** are the actual, unique instances created from those blueprints. We then learned how **attributes** store data specific to each object, and how **methods** define the actions objects can perform, operating on their own data.

We explored **inheritance** as a fundamental principle for code reuse and for modeling "is-a" relationships, allowing child classes to extend and specialize parent classes. **Polymorphism** then showed us how different objects can respond to the same method call in their own unique ways, making our code more flexible and adaptable. Finally, **encapsulation** taught us about bundling data and behavior together, and the importance of controlling access to an object's internal state for better organization, data integrity, and maintainability.

These core OOP principles – Classes, Objects, Attributes, Methods, Inheritance, Polymorphism, and Encapsulation – are the cornerstones for designing robust, scalable, and maintainable Python applications. By thinking in terms of objects and their interactions, you can tackle increasingly complex programming challenges with clarity and efficiency. In the next lesson, we'll explore more advanced OOP features and design patterns to further enhance your object-oriented programming skills.