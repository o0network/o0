"""
Validators module for validating input data for metrics evaluation.
"""

from typing import List, Optional

import numpy as np
import pandas as pd


def validate_column_names(
    df: pd.DataFrame, expected_columns: List[str], ignore_case: bool = True
) -> bool:
    """Validate that dataframe has expected column names.

    Args:
        df: DataFrame to validate
        expected_columns: List of expected column names
        ignore_case: If True, column name comparison is case-insensitive

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if ignore_case:
        df_cols = [col.lower() for col in df.columns]
        expected = [col.lower() for col in expected_columns]
    else:
        df_cols = list(df.columns)
        expected = expected_columns

    if not np.array_equal(df_cols, expected):
        raise ValueError(f"Expected columns {expected}, got {df_cols}")

    return True


def validate_no_duplicates(
    df: pd.DataFrame,
    columns: Optional[List[str]] = None,
    col_indices: Optional[List[int]] = None,
) -> bool:
    """Validate that dataframe has no duplicate values in specified columns or column indices.

    Args:
        df: DataFrame to validate
        columns: Optional list of columns to check for duplicates
        col_indices: Optional list of column indices to check for duplicates

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if columns is not None and len(df[columns].drop_duplicates()) != len(df):
        raise ValueError(f"Duplicate values found in columns {columns}")

    if col_indices is not None and len(
        df.iloc[:, col_indices].drop_duplicates()
    ) != len(df):
        raise ValueError(f"Duplicate values found in columns {col_indices}")

    return True


def validate_no_missing_values(
    df: pd.DataFrame, columns: Optional[List[str]] = None
) -> bool:
    """Validate that dataframe has no missing values.

    Args:
        df: DataFrame to validate
        columns: Optional list of columns to check. If None, checks all columns.

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if columns is None:
        columns = df.columns

    for col in columns:
        if df[col].isnull().any():
            raise ValueError(f"Missing values found in column {col}")

    return True


def validate_numeric_columns(df: pd.DataFrame, columns: List[str]) -> bool:
    """Validate that specified columns contain only numeric values.

    Args:
        df: DataFrame to validate
        columns: List of columns to check

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    for col in columns:
        if not np.issubdtype(df[col].dtype, np.number):
            raise ValueError(f"Column {col} must contain only numeric values")

    return True


def validate_value_range(
    x: np.ndarray, min_val: float = float('-inf'), max_val: float = float('inf')
) -> bool:
    """Validate that values in array are within specified range.

    Args:
        x: Array to validate
        min_val: Minimum allowed value
        max_val: Maximum allowed value

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if not all((x >= min_val) & (x <= max_val)):
        raise ValueError(
            f"Values in array must be between {min_val} and {max_val}"
        )

    return True


def validate_split_column(df: pd.DataFrame, split_value: str) -> bool:
    """Validate that dataframe has a split column with the specified value.

    Args:
        df: DataFrame to validate
        split_value: Expected split value ('public' or 'private')

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if "split" not in [col.lower() for col in df.columns]:
        raise ValueError("DataFrame does not contain a 'split' column")

    split_col = next(col for col in df.columns if col.lower() == "split")

    if split_value.lower() not in ["public", "private"]:
        raise ValueError("split_value must be either 'public' or 'private'")

    if not any(df[split_col].str.lower() == split_value.lower()):
        raise ValueError(f"No data found for split value '{split_value}'")

    return True


def validate_numeric_inputs(y_true: np.ndarray, y_pred: np.ndarray) -> bool:
    """Validate input arrays for numeric metrics.

    Args:
        y_true: Ground truth values
        y_pred: Predicted values

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if not isinstance(y_true, np.ndarray) or not isinstance(y_pred, np.ndarray):
        raise ValueError("Inputs must be numpy arrays")

    if len(y_true) == 0 or len(y_pred) == 0:
        raise ValueError("Input data cannot be empty")

    if len(y_true) != len(y_pred):
        raise ValueError("Ground truth and predictions must have the same length")

    # Check for non-numeric values first
    if not np.issubdtype(y_true.dtype, np.number) or not np.issubdtype(
        y_pred.dtype, np.number
    ):
        raise ValueError(
            "Ground truth and predictions must contain only numeric values"
        )

    # Only check for NaN if arrays are numeric
    if np.any(np.isnan(y_true)) or np.any(np.isnan(y_pred)):
        raise ValueError("Predictions cannot contain missing values")

    return True


def validate_rec_inputs(y_true: pd.DataFrame, y_pred: pd.DataFrame) -> bool:
    """Validate input dataframes for recommendation metrics.

    Args:
        y_true: Ground truth items
        y_pred: Recommendations

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if not isinstance(y_true, pd.DataFrame) or not isinstance(y_pred, pd.DataFrame):
        raise ValueError("Inputs must be pandas DataFrames")

    if len(y_true) == 0 or len(y_pred) == 0:
        raise ValueError("Input data cannot be empty")

    if len(set(y_true["ADDRESS"]) - set(y_pred["ADDRESS"])) > 0:
        raise ValueError("Missing recommendations for some addresses")

    return True


def validate_rank(df: pd.DataFrame, column: str, max_rank: int) -> bool:
    """Validate that values in column are within specified rank range.

    Args:
        df: DataFrame to validate
        column: Column to check
        max_rank: Maximum allowed rank

    Returns:
        bool: True if validation passes

    Raises:
        ValueError: If validation fails
    """
    if not np.issubdtype(df[column].dtype, np.number):
        raise ValueError(f"Column {column} must contain only numeric values")

    if not all((df[column] >= 1) & (df[column] <= max_rank)):
        raise ValueError(f"Values in column {column} must be between 1 and {max_rank}")

    return True
