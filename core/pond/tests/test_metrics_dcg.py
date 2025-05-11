"""
Unit tests for discounted cumulative gain metric.
"""
import numpy as np
import pytest
from metrics import discounted_cumulative_gain

def test_dcg_valid():
    true_relevance = np.array([3.0, 2.0, 1.0])
    ranks = np.array([1, 2, 3])
    expected = (3.0 / np.log2(2) + 2.0 / np.log2(3) + 1.0 / np.log2(4))/3
    assert np.isclose(discounted_cumulative_gain(true_relevance, ranks), expected)

def test_dcg_single_item():
    true_relevance = np.array([1.0])
    ranks = np.array([1])
    expected = 1.0 / np.log2(2)
    assert np.isclose(discounted_cumulative_gain(true_relevance, ranks), expected)

def test_dcg_zero_relevance():
    true_relevance = np.array([0.0, 0.0, 0.0])
    ranks = np.array([1, 2, 3])
    assert discounted_cumulative_gain(true_relevance, ranks) == 0.0

def test_dcg_empty():
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        discounted_cumulative_gain(np.array([]), np.array([]))

def test_dcg_nan():
    with pytest.raises(ValueError, match="Predictions cannot contain missing values"):
        discounted_cumulative_gain(np.array([1, np.nan]), np.array([1, 2]))

def test_dcg_non_numeric():
    with pytest.raises(ValueError, match="Ground truth and predictions must contain only numeric values"):
        discounted_cumulative_gain(np.array([1, "a"]), np.array([1, 2]))

def test_dcg_non_positive_ranks():
    with pytest.raises(ValueError, match="Ranks must be positive integers"):
        discounted_cumulative_gain(np.array([1.0]), np.array([0]))

def test_dcg_duplicate_ranks():
    with pytest.raises(ValueError, match="Ranks must not contain any duplicates"):
        discounted_cumulative_gain(np.array([1.0, 2.0]), np.array([1, 1]))

def test_dcg_non_integer_ranks():
    with pytest.raises(ValueError, match="Ranks must be positive integers"):
        discounted_cumulative_gain(np.array([1.0]), np.array([1.5]))
