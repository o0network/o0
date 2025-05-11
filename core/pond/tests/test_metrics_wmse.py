"""
Unit tests for weighted mean squared error metric.
"""
import numpy as np
import pytest
from metrics import weighted_mean_squared_error

def test_wmse_valid(valid_continuous_data):
    y_true, y_pred = valid_continuous_data
    expected = np.sqrt(np.mean(np.abs(y_true) * (y_true - y_pred) ** 2))
    assert np.isclose(weighted_mean_squared_error(y_true, y_pred), expected)

def test_wmse_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        weighted_mean_squared_error(np.array([]), np.array([]))

def test_wmse_nan_values():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        weighted_mean_squared_error(
            np.array([1.0, np.nan]), 
            np.array([1.0, 2.0]), 
        )

def test_wmse_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        weighted_mean_squared_error(
            np.array([1, "a"]), 
            np.array([1, 2]), 
        )

def test_wmse_different_lengths():
    with pytest.raises(ValueError, match="Ground truth and predictions must have the same length"):
        weighted_mean_squared_error(
            np.array([1.0, 2.0]), 
            np.array([1.0]), 
        )

def test_wmse_not_numpy():
    with pytest.raises(ValueError, match="Inputs must be numpy arrays"):
        weighted_mean_squared_error([1.0, 2.0], [1.0, 2.0])
