---
title: "Linear Algebra"
slug: linear-algebra
display: true
order: 11
tags:
  - statistics
---

<a id="concept-linear-algebra"></a>
# Linear Algebra

## Learning Objectives
By the end of this lesson, you will be able to:
- Define a matrix and understand its basic properties and dimensions.
- Perform fundamental matrix operations including addition, subtraction, and scalar multiplication.
- Understand and compute matrix multiplication, recognizing its unique rules.
- Calculate the transpose and trace of a matrix.
- Compute the determinant and inverse of a 2x2 matrix and understand their significance.
- Grasp the basic concept of matrix differentiation and its role in optimization.

## Introduction
Welcome to the fascinating world of Linear Algebra! You might be wondering why a topic that sounds so mathematical is crucial for fields like [data](../data-science/data-fundamentals-and-types.md#concept-data) science, machine learning, and statistics. The truth is, linear algebra is the language of data. Whether you're working with images, text, or numerical datasets, they are often represented and manipulated as **matrices** and **vectors**.

Understanding linear algebra isn't just about solving equations; it's about developing an intuition for how data transforms, how relationships between variables are expressed, and how complex problems can be simplified. From training machine learning models to analyzing large datasets, the tools of linear algebra are indispensable. This lesson will introduce you to the core concepts, starting with the basics and progressively building your understanding.

## Concept Progression

### What is a Matrix? Basic Operations

At its heart, a **matrix** is simply a rectangular arrangement of numbers, symbols, or expressions, organized into rows and columns. Think of it like a spreadsheet or a table of data. Each individual number within the matrix is called an **element**.

The size or **dimension** of a matrix is described by the number of its rows and columns. For example, a matrix with `m` rows and `n` columns is an `m x n` matrix.

Let's look at an example:

$$
A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}
$$

This matrix `A` has 2 rows and 3 columns, so it's a `2 x 3` matrix.

**Basic Operations: Addition, Subtraction, and Scalar Multiplication**

Just like with regular numbers, we can perform operations on matrices. These initial operations are quite intuitive.

1.  **Matrix Addition and Subtraction**: To add or subtract two matrices, they must have the exact same dimensions. You simply add or subtract the corresponding elements.

    Example:
    If $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ and $B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$

    Then $A + B = \begin{bmatrix} 1+5 & 2+6 \\ 3+7 & 4+8 \end{bmatrix} = \begin{bmatrix} 6 & 8 \\ 10 & 12 \end{bmatrix}$

    And $A - B = \begin{bmatrix} 1-5 & 2-6 \\ 3-7 & 4-8 \end{bmatrix} = \begin{bmatrix} -4 & -4 \\ -4 & -4 \end{bmatrix}$

2.  **Scalar Multiplication**: A **scalar** is just a single number (not a matrix). When you multiply a matrix by a scalar, you multiply *every element* in the matrix by that scalar.

    Example:
    If $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ and $c = 3$

    Then $c \cdot A = 3 \cdot \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 \cdot 1 & 3 \cdot 2 \\ 3 \cdot 3 & 3 \cdot 4 \end{bmatrix} = \begin{bmatrix} 3 & 6 \\ 9 & 12 \end{bmatrix}$

These basic operations are straightforward and intuitive, much like operations with single numbers. However, matrix multiplication introduces a new set of rules.

<a id="concept-matrix-multiplication"></a>
### Matrix Multiplication

Matrix multiplication is where things get a bit more interesting and less intuitive than simple element-wise operations. It's a fundamental operation with wide-ranging applications in transforming [data](../data-science/data-fundamentals-and-types.md#concept-data), solving systems of equations, and powering machine learning algorithms.

**Rules for Matrix Multiplication:**
For two matrices, `A` and `B`, to be multiplied to form `C = A * B`, there's a crucial dimension compatibility rule: the number of columns in the first matrix (`A`) must be equal to the number of rows in the second matrix (`B`).

If `A` is an `m x n` matrix (m rows, n columns) and `B` is an `n x p` matrix (n rows, p columns), then the resulting matrix `C` will be an `m x p` matrix. Notice how the 'inner' dimensions (`n`) must match, and the 'outer' dimensions (`m` and `p`) determine the size of the result.

**How to Multiply:**
Each element `(i, j)` in the resulting matrix `C` (meaning the element in the `i`-th row and `j`-th column) is found by taking the **dot product** of the `i`-th row of `A` and the `j`-th column of `B`. A dot product means you multiply corresponding elements from the row and column, and then sum all those products.

Let's walk through an example to make this clear:

Suppose $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ (a `2 x 2` matrix) and $B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}$ (a `2 x 2` matrix).
The number of columns in A (2) equals the number of rows in B (2), so we can multiply them. The result will be a `2 x 2` matrix.

Let $C = A \cdot B = \begin{bmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{bmatrix}$

*   **To find $c_{11}$** (element in row 1, column 1 of C):
    Take row 1 of A: `[1 2]`
    Take column 1 of B: `[5 7]`
    $c_{11} = (1 \cdot 5) + (2 \cdot 7) = 5 + 14 = 19$

*   **To find $c_{12}$** (element in row 1, column 2 of C):
    Take row 1 of A: `[1 2]`
    Take column 2 of B: `[6 8]`
    $c_{12} = (1 \cdot 6) + (2 \cdot 8) = 6 + 16 = 22$

*   **To find $c_{21}$** (element in row 2, column 1 of C):
    Take row 2 of A: `[3 4]`
    Take column 1 of B: `[5 7]`
    $c_{21} = (3 \cdot 5) + (4 \cdot 7) = 15 + 28 = 43$

*   **To find $c_{22}$** (element in row 2, column 2 of C):
    Take row 2 of A: `[3 4]`
    Take column 2 of B: `[6 8]`
    $c_{22} = (3 \cdot 6) + (4 \cdot 8) = 18 + 32 = 50$

So, the result is: $A \cdot B = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}$

**Important Note**: Matrix multiplication is generally **not commutative**, meaning $A \cdot B \neq B \cdot A$. This is a key difference from scalar multiplication. Try calculating $B \cdot A$ yourself to see the difference!

<!-- IMAGE_SLOT: img-001 -->
![A diagram illustrating matrix multiplication. Show two matrices A (2x2) and B (2x2) side-by-side. Use arrows to visually](../../../../../image/statistics/linear-algebra/img-001.png)


In Python, using the powerful [NumPy library](../python/intro-scientific-computing.md#concept-numpy-library), this operation is straightforward:

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

C = np.dot(A, B) # or A @ B in Python 3.5+
print(C)
# Output:
# [[19 22]
#  [43 50]]
```

### Transpose and Trace

Beyond basic arithmetic and multiplication, two other fundamental operations provide useful ways to transform or summarize matrices: the transpose and the trace.

**1. Transpose of a Matrix**

The **transpose** of a matrix, denoted as $A^T$ (or sometimes $A'$), is obtained by "flipping" the matrix over its main diagonal. This means that the rows of the original matrix become the columns of the transposed matrix, and vice-versa.

If `A` is an `m x n` matrix, then its transpose $A^T$ will be an `n x m` matrix.

Example:
If $A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}$ (a `2 x 3` matrix)

Then $A^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}$ (a `3 x 2` matrix)

Notice how the first row `[1 2 3]` of `A` becomes the first column of $A^T$, and the second row `[4 5 6]` becomes the second column.

In NumPy:

```python
import numpy as np

A = np.array([[1, 2, 3], [4, 5, 6]])
A_T = A.T
print(A_T)
# Output:
# [[1 4]
#  [2 5]
#  [3 6]]
```

The transpose is particularly useful in many areas, such as converting row vectors to column vectors (and vice-versa) for multiplication, or in defining symmetric matrices ($A = A^T$), which have special properties.

**2. Trace of a Matrix**

The **trace** of a square matrix (a matrix with the same number of rows and columns) is simply the sum of the elements on its **main diagonal** (the elements running from the top-left corner to the bottom-right corner). The trace is only defined for square matrices.

If $A = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix}$

Then $Trace(A) = a_{11} + a_{22} + a_{33}$

Example:
If $A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$

Then $Trace(A) = 1 + 5 + 9 = 15$

The trace has applications in various mathematical contexts, including eigenvalue analysis and matrix calculus, where it can simplify certain expressions.

In NumPy:

```python
import numpy as np

A = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
trace_A = np.trace(A)
print(trace_A)
# Output: 15
```

<a id="concept-matrix-determinant"></a>
### Determinant of a Matrix

Moving beyond operations, the **determinant** is a special scalar value that can be computed from the elements of any square matrix. It provides important information about the matrix, such as whether it's invertible (which we'll discuss next) and how it scales space during transformations.

**Determinant of a 2x2 Matrix:**

For a `2 x 2` matrix $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the determinant is calculated using a simple cross-multiplication pattern:

$det(A) = ad - bc$

Example:
If $A = \begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix}$

$det(A) = (3 \cdot 4) - (1 \cdot 2) = 12 - 2 = 10$

<!-- IMAGE_SLOT: img-002 -->
![A simple diagram showing a 2x2 matrix with elements a, b, c, d. Arrows should connect 'a' to](../../../../../image/statistics/linear-algebra/img-002.png)


**Significance of the Determinant:**
*   **Invertibility**: This is perhaps the most crucial property for beginners. If the determinant of a matrix is non-zero ($det(A) \neq 0$), then the matrix is **invertible** (it has an inverse). If $det(A) = 0$, the matrix is called **singular** and does not have an inverse. This means it cannot be "undone" by another matrix.
*   **Geometric Interpretation**: In 2D, the absolute value of the determinant represents the area of the parallelogram formed by the column (or row) vectors of the matrix. In 3D, it represents the volume of the parallelepiped. A zero determinant means the vectors are "flat" and don't form a true area or volume.

For larger matrices (e.g., 3x3 or more), the calculation becomes more complex, often involving a method called cofactor expansion. For now, understanding the 2x2 case and the significance of the determinant is key.

In NumPy, calculating the determinant is straightforward:

```python
import numpy as np

A = np.array([[3, 1], [2, 4]])
det_A = np.linalg.det(A)
print(det_A)
# Output: 10.0
```

### Inverse of a Matrix

Building on the concept of the determinant, the **inverse** of a square matrix `A`, denoted as $A^{-1}$, is another matrix that, when multiplied by `A`, yields the **identity matrix** `I`. The identity matrix is a special square matrix that acts like the number '1' in scalar multiplication; it has ones on its main diagonal and zeros everywhere else.

For example, a `2 x 2` identity matrix is $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$.

So, the defining property of an inverse is: $A \cdot A^{-1} = A^{-1} \cdot A = I$.

**Condition for Existence:**
As mentioned with the determinant, a matrix `A` has an inverse if and only if its determinant is non-zero ($det(A) \neq 0$). If $det(A) = 0$, the matrix is singular and does not have an inverse.

**Calculating the Inverse of a 2x2 Matrix:**

For a `2 x 2` matrix $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$, its inverse is given by the formula:

$A^{-1} = \frac{1}{det(A)} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$

Notice how the elements `a` and `d` swap positions, and `b` and `c` change signs.

Example:
Let's use the matrix $A = \begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix}$ from our determinant example. We found $det(A) = 10$.

Now, let's apply the inverse formula:

$A^{-1} = \frac{1}{10} \begin{bmatrix} 4 & -1 \\ -2 & 3 \end{bmatrix} = \begin{bmatrix} 4/10 & -1/10 \\ -2/10 & 3/10 \end{bmatrix} = \begin{bmatrix} 0.4 & -0.1 \\ -0.2 & 0.3 \end{bmatrix}$

To verify our calculation, let's multiply $A \cdot A^{-1}$ and see if we get the identity matrix:

$A \cdot A^{-1} = \begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix} \begin{bmatrix} 0.4 & -0.1 \\ -0.2 & 0.3 \end{bmatrix} = \begin{bmatrix} (3 \cdot 0.4) + (1 \cdot -0.2) & (3 \cdot -0.1) + (1 \cdot 0.3) \\ (2 \cdot 0.4) + (4 \cdot -0.2) & (2 \cdot -0.1) + (4 \cdot 0.3) \end{bmatrix}$
$= \begin{bmatrix} 1.2 - 0.2 & -0.3 + 0.3 \\ 0.8 - 0.8 & -0.2 + 1.2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$

It works!

**Why is the Inverse Important?**
The inverse matrix is crucial for solving systems of linear equations. Just as you divide by a number to solve a simple equation like $ax=b$ (which is equivalent to $x = b/a = a^{-1}b$), you multiply by the inverse matrix to solve matrix equations like $Ax=B$ ($x = A^{-1}B$). This is fundamental in many scientific, engineering, and [data analysis](../python/intro-scientific-computing.md#concept-data-analysis) applications.

In NumPy, finding the inverse is also a single [function](../python/functions-in-python.md#concept-function) call:

```python
import numpy as np

A = np.array([[3, 1], [2, 4]])
A_inv = np.linalg.inv(A)
print(A_inv)
# Output:
# [[ 0.4 -0.1]
#  [-0.2  0.3]]

# Verify with NumPy:
identity_matrix = A @ A_inv
print(identity_matrix)
# Output (may have very small floating point errors due to floating-point precision):
# [[1.0000000e+00 0.0000000e+00]
#  [1.1102230e-16 1.0000000e+00]]
```

<a id="concept-matrix-differentiation"></a>
### Matrix Differentiation (Introduction)

So far, we've focused on algebraic operations. Now, let's briefly touch upon a concept that bridges linear algebra with calculus: **matrix differentiation**, also known as **vector calculus**. In traditional calculus, we differentiate functions with respect to a single variable. In fields like machine learning and optimization, we often need to differentiate functions that take vectors or matrices as input and output a scalar or another vector/matrix.

For a beginner, the most intuitive starting point is differentiating a scalar function with respect to a vector.

Consider a scalar function $f(\mathbf{x})$ where $\mathbf{x}$ is a vector $\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{bmatrix}$.

The derivative of $f(\mathbf{x})$ with respect to $\mathbf{x}$ is called the **gradient** of $f$, denoted as $\nabla f(\mathbf{x})$ or $\frac{\partial f}{\partial \mathbf{x}}$. It's a vector containing the partial derivatives of $f$ with respect to each individual element of $\mathbf{x}$:

$$
\nabla f(\mathbf{x}) = \frac{\partial f}{\partial \mathbf{x}} = \begin{bmatrix} \frac{\partial f}{\partial x_1} \\ \frac{\partial f}{\partial x_2} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{bmatrix}
$$

**Example:**
Let $f(\mathbf{x}) = x_1^2 + 2x_2 + 3x_3^2$, where $\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}$.

To find the gradient, we take the partial derivative of $f$ with respect to each component of $\mathbf{x}$:

*   $\frac{\partial f}{\partial x_1} = \frac{\partial}{\partial x_1}(x_1^2 + 2x_2 + 3x_3^2) = 2x_1$
*   $\frac{\partial f}{\partial x_2} = \frac{\partial}{\partial x_2}(x_1^2 + 2x_2 + 3x_3^2) = 2$
*   $\frac{\partial f}{\partial x_3} = \frac{\partial}{\partial x_3}(x_1^2 + 2x_2 + 3x_3^2) = 6x_3$

So, the gradient is $\nabla f(\mathbf{x}) = \begin{bmatrix} 2x_1 \\ 2 \\ 6x_3 \end{bmatrix}$.

**Why is this important?**
In machine learning, we often define a "loss [function](../python/functions-in-python.md#concept-function)" that measures how well our model is performing. We want to minimize this loss function to make our model as accurate as possible. Optimization algorithms like **[gradient descent](../data-science/supervised-learning-regression.md#concept-gradient-descent)** use the gradient to find the direction of steepest ascent (or descent if we take the negative gradient) to iteratively update model parameters (which are often vectors or matrices) until the loss is minimized.

This is just a glimpse into matrix differentiation. As you progress, you'll encounter more complex rules for differentiating with respect to matrices, but the fundamental idea of finding how a function changes with respect to its vector/matrix inputs remains the same.

## Wrap-Up

Congratulations! You've taken your first steps into the world of linear algebra. We've covered the foundational concepts: what matrices are, how to perform basic arithmetic, the crucial operation of matrix multiplication, and the properties of transpose and trace. You also learned about the determinant and inverse, which are vital for understanding matrix properties and solving systems of equations. Finally, we touched upon matrix differentiation, a powerful tool for optimization in advanced applications.

These concepts form the bedrock for understanding more complex topics in data science, machine learning, and statistics. As you continue your learning journey, you'll find these tools indispensable for manipulating and interpreting data. Keep practicing these operations, and you'll build a strong intuition for how linear algebra empowers data analysis.