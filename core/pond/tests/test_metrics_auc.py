"""
Unit tests for area under curve metric.
"""
import numpy as np
import pytest
from metrics import auc

def test_auc_valid():
    y_true = np.array([0, 0, 1, 1])
    y_pred = np.array([0.1, 0.4, 0.35, 0.8])
    assert np.isclose(auc(y_true, y_pred), 0.75)

def test_auc_perfect_prediction():
    y_true = np.array([0, 1, 0, 1])
    y_pred = np.array([0.1, 0.9, 0.1, 0.9])
    assert np.isclose(auc(y_true, y_pred), 1.0)

def test_auc_random_prediction():
    y_true = np.array([0, 1, 0, 1])
    y_pred = np.array([0.5, 0.5, 0.5, 0.5])
    assert np.isclose(auc(y_true, y_pred), 0.5)

def test_auc_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        auc(np.array([]), np.array([]))

def test_auc_nan():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        auc(np.array([1, np.nan]), np.array([1, 0]))

def test_auc_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        auc(np.array([1, "a"]), np.array([1, 0]))

def test_auc_different_lengths():
    with pytest.raises(ValueError, match="Ground truth and predictions must have the same length"):
        auc(np.array([1, 0]), np.array([1]))

def test_auc_not_numpy():
    with pytest.raises(ValueError, match="Inputs must be numpy arrays"):
        auc([1, 0], [1, 0])
