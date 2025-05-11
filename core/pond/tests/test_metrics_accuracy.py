"""
Unit tests for accuracy metric.
"""
import numpy as np
import pytest
from metrics import accuracy

def test_accuracy_valid(valid_binary_data):
    y_true, y_pred = valid_binary_data
    assert accuracy(y_true, y_pred) == 0.75

def test_accuracy_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        accuracy(np.array([]), np.array([]))

def test_accuracy_nan():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        accuracy(np.array([1, np.nan]), np.array([1, 0]))

def test_accuracy_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        accuracy(np.array([1, "a"]), np.array([1, 0]))

def test_accuracy_different_lengths():
    with pytest.raises(ValueError, match="Ground truth and predictions must have the same length"):
        accuracy(np.array([1, 0]), np.array([1]))

def test_accuracy_not_numpy():
    with pytest.raises(ValueError, match="Inputs must be numpy arrays"):
        accuracy([1, 0], [1, 0])
