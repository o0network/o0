"""
Unit tests for validators module.
"""
import numpy as np
import pandas as pd
import pytest

from src.validators import (
    validate_column_names,
    validate_no_duplicates,
    validate_no_missing_values,
    validate_numeric_columns,
    validate_value_range,
    validate_split_column,
    validate_numeric_inputs,
    validate_rec_inputs,
    validate_rank
)

# Test fixtures
@pytest.fixture
def sample_dataframe():
    return pd.DataFrame({
        "ID": [1, 2, 3, 4],
        "Value": [10.0, 20.0, 30.0, 40.0],
        "Category": ["A", "B", "C", "D"],
        "Split": ["public", "public", "private", "private"]
    })

@pytest.fixture
def dataframe_with_duplicates():
    return pd.DataFrame({
        "ID": [1, 2, 2, 4],
        "Value": [10.0, 20.0, 30.0, 40.0]
    })

@pytest.fixture
def dataframe_with_missing():
    return pd.DataFrame({
        "ID": [1, 2, 3, 4],
        "Value": [10.0, np.nan, 30.0, 40.0]
    })

@pytest.fixture
def dataframe_with_non_numeric():
    return pd.DataFrame({
        "ID": [1, 2, 3, 4],
        "Value": [10.0, "text", 30.0, 40.0]
    })

# Tests for validate_column_names
def test_validate_column_names_valid(sample_dataframe):
    # Test with correct column names
    assert validate_column_names(sample_dataframe, ["ID", "Value", "Category", "Split"]) is True
    
    # Test case insensitive
    assert validate_column_names(sample_dataframe, ["id", "value", "category", "split"]) is True

def test_validate_column_names_invalid(sample_dataframe):
    # Test with incorrect column names
    with pytest.raises(ValueError, match="Expected columns"):
        validate_column_names(sample_dataframe, ["ID", "Value", "Wrong"])
    
    # Test case sensitive
    with pytest.raises(ValueError, match="Expected columns"):
        validate_column_names(sample_dataframe, ["id", "value", "category", "split"], ignore_case=False)

# Tests for validate_no_duplicates
def test_validate_no_duplicates_valid(sample_dataframe):
    assert validate_no_duplicates(sample_dataframe, columns=["ID"]) is True
    assert validate_no_duplicates(sample_dataframe, col_indices=[0]) is True

def test_validate_no_duplicates_invalid(dataframe_with_duplicates):
    with pytest.raises(ValueError, match="Duplicate values found"):
        validate_no_duplicates(dataframe_with_duplicates, columns=["ID"])
    
    with pytest.raises(ValueError, match="Duplicate values found"):
        validate_no_duplicates(dataframe_with_duplicates, col_indices=[0])

# Tests for validate_no_missing_values
def test_validate_no_missing_values_valid(sample_dataframe):
    assert validate_no_missing_values(sample_dataframe) is True
    assert validate_no_missing_values(sample_dataframe, columns=["ID"]) is True

def test_validate_no_missing_values_invalid(dataframe_with_missing):
    with pytest.raises(ValueError, match="Missing values found"):
        validate_no_missing_values(dataframe_with_missing)
    
    with pytest.raises(ValueError, match="Missing values found"):
        validate_no_missing_values(dataframe_with_missing, columns=["Value"])

# Tests for validate_numeric_columns
def test_validate_numeric_columns_valid(sample_dataframe):
    assert validate_numeric_columns(sample_dataframe, columns=["ID", "Value"]) is True

def test_validate_numeric_columns_invalid(sample_dataframe, dataframe_with_non_numeric):
    with pytest.raises(ValueError, match="must contain only numeric values"):
        validate_numeric_columns(sample_dataframe, columns=["Category"])
    
    with pytest.raises(ValueError, match="must contain only numeric values"):
        validate_numeric_columns(dataframe_with_non_numeric, columns=["Value"])

# Tests for validate_value_range
def test_validate_value_range_valid():
    assert validate_value_range(np.array([1, 2, 3]), 0, 5) is True
    assert validate_value_range(np.array([0, 1, 5]), 0, 5) is True

def test_validate_value_range_invalid():
    with pytest.raises(ValueError, match="Values in array must be between"):
        validate_value_range(np.array([1, 2, 6]), 0, 5)
    
    with pytest.raises(ValueError, match="Values in array must be between"):
        validate_value_range(np.array([-1, 2, 3]), 0, 5)

# Tests for validate_split_column
def test_validate_split_column_valid(sample_dataframe):
    assert validate_split_column(sample_dataframe, "public") is True
    assert validate_split_column(sample_dataframe, "private") is True

def test_validate_split_column_invalid(sample_dataframe):
    # Test with invalid split value
    with pytest.raises(ValueError, match="split_value must be either"):
        validate_split_column(sample_dataframe, "invalid")
    
    # Test with missing split column
    df_no_split = sample_dataframe.drop(columns=["Split"])
    with pytest.raises(ValueError, match="does not contain a 'split' column"):
        validate_split_column(df_no_split, "public")
    
    # Test with missing split value
    df_no_test = pd.DataFrame({
        "ID": [1, 2],
        "Split": ["public", "public"]
    })
    with pytest.raises(ValueError, match="No data found for split value"):
        validate_split_column(df_no_test, "private")

# Tests for validate_numeric_inputs
def test_validate_numeric_inputs_valid():
    y_true = np.array([1.0, 2.0, 3.0])
    y_pred = np.array([1.1, 2.1, 3.1])
    assert validate_numeric_inputs(y_true, y_pred) is True

def test_validate_numeric_inputs_not_numpy():
    with pytest.raises(ValueError, match="Inputs must be numpy arrays"):
        validate_numeric_inputs([1, 2, 3], [1, 2, 3])

def test_validate_numeric_inputs_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        validate_numeric_inputs(np.array([]), np.array([]))

def test_validate_numeric_inputs_different_lengths():
    with pytest.raises(ValueError, match="Ground truth and predictions must have the same length"):
        validate_numeric_inputs(np.array([1, 2]), np.array([1]))

def test_validate_numeric_inputs_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        validate_numeric_inputs(np.array([1, "a"], dtype=object), np.array([1, 2]))

def test_validate_numeric_inputs_nan():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        validate_numeric_inputs(np.array([1.0, np.nan]), np.array([1.0, 2.0]))

# Tests for validate_rec_inputs
@pytest.fixture
def rec_dataframe_valid():
    y_true = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3"],
        "REC": ["rec1", "rec2", "rec3"]
    })
    y_pred = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3"],
        "REC": ["rec1", "rec3", "rec2"]
    })
    return y_true, y_pred

@pytest.fixture
def rec_dataframe_missing_address():
    y_true = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3"],
        "REC": ["rec1", "rec2", "rec3"]
    })
    y_pred = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2"],  # Missing addr3
        "REC": ["rec1", "rec3"]
    })
    return y_true, y_pred

def test_validate_rec_inputs_valid(rec_dataframe_valid):
    y_true, y_pred = rec_dataframe_valid
    assert validate_rec_inputs(y_true, y_pred) is True

def test_validate_rec_inputs_not_dataframe():
    with pytest.raises(ValueError, match="Inputs must be pandas DataFrames"):
        validate_rec_inputs(np.array([1, 2, 3]), pd.DataFrame({"A": [1, 2, 3]}))
    
    with pytest.raises(ValueError, match="Inputs must be pandas DataFrames"):
        validate_rec_inputs(pd.DataFrame({"A": [1, 2, 3]}), np.array([1, 2, 3]))

def test_validate_rec_inputs_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        validate_rec_inputs(pd.DataFrame(), pd.DataFrame({"ADDRESS": [], "REC": []}))
    
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        validate_rec_inputs(pd.DataFrame({"ADDRESS": ["addr1"], "REC": ["rec1"]}), pd.DataFrame())

def test_validate_rec_inputs_missing_addresses(rec_dataframe_missing_address):
    y_true, y_pred = rec_dataframe_missing_address
    with pytest.raises(ValueError, match="Missing recommendations for some addresses"):
        validate_rec_inputs(y_true, y_pred)

# Tests for validate_rank
@pytest.fixture
def rank_dataframe_valid():
    return pd.DataFrame({
        "ID": [1, 2, 3],
        "RANK": [1, 2, 3]
    })

@pytest.fixture
def rank_dataframe_invalid():
    return pd.DataFrame({
        "ID": [1, 2, 3],
        "RANK": [0, 2, 6]  # 0 is below min (1), 6 is above max (5)
    })

@pytest.fixture
def rank_dataframe_non_numeric():
    return pd.DataFrame({
        "ID": [1, 2, 3],
        "RANK": [1, "two", 3]
    })

def test_validate_rank_valid(rank_dataframe_valid):
    assert validate_rank(rank_dataframe_valid, "RANK", 5) is True

def test_validate_rank_invalid_range(rank_dataframe_invalid):
    with pytest.raises(ValueError, match="Values in column RANK must be between 1 and 5"):
        validate_rank(rank_dataframe_invalid, "RANK", 5)

def test_validate_rank_non_numeric(rank_dataframe_non_numeric):
    with pytest.raises(ValueError, match="Column RANK must contain only numeric values"):
        validate_rank(rank_dataframe_non_numeric, "RANK", 5)
