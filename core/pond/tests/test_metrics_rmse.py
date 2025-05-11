"""
Unit tests for root mean squared error metric.
"""
import numpy as np
import pytest
from metrics import root_mean_squared_error

def test_mse_valid(valid_continuous_data):
    y_true, y_pred = valid_continuous_data
    assert np.isclose(root_mean_squared_error(y_true, y_pred), np.sqrt(0.01))

def test_mse_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        root_mean_squared_error(np.array([]), np.array([]))

def test_mse_nan():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        root_mean_squared_error(np.array([1.0, np.nan]), np.array([1.0, 2.0]))

def test_mse_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        root_mean_squared_error(np.array([1, "a"]), np.array([1, 2]))

def test_mse_different_lengths():
    with pytest.raises(ValueError, match="Ground truth and predictions must have the same length"):
        root_mean_squared_error(np.array([1.0, 2.0]), np.array([1.0]))

def test_mse_not_numpy():
    with pytest.raises(ValueError, match="Inputs must be numpy arrays"):
        root_mean_squared_error([1.0, 2.0], [1.0, 2.0])
