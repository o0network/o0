"""
Unit tests for pairwise cost metric.
"""
import numpy as np
import pytest
import pandas as pd
from metrics import pairwise_cost

@pytest.fixture
def valid_pairwise_data():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b", "c"],
        "SOURCE_B": ["b", "c", "a"],
        "TARGET": ["t", "t", "t"],
        "B_OVER_A": [2.0, 1.5, 0.5]
    })
    y_pred = pd.DataFrame({
        "SOURCE": ["a", "b", "c"],
        "TARGET": ["t", "t", "t"],
        "WEIGHT": [1.0, 2.0, 3.0]
    })
    return y_true, y_pred

def test_pairwise_cost_valid(valid_pairwise_data):
    y_true, y_pred = valid_pairwise_data
    # For our test data:
    # (a,b): WEIGHT_B=2.0, WEIGHT_A=1.0, B_OVER_A=2.0
    #        Difference = 2.0 - 1.0 - 2.0 = -1.0, squared = 1.0
    # (b,c): WEIGHT_B=3.0, WEIGHT_A=2.0, B_OVER_A=1.5
    #        Difference = 3.0 - 2.0 - 1.5 = -0.5, squared = 0.25
    # (c,a): WEIGHT_B=1.0, WEIGHT_A=3.0, B_OVER_A=0.5
    #        Difference = 1.0 - 3.0 - 0.5 = -2.5, squared = 6.25
    cost = pairwise_cost(y_true, y_pred)
    assert isinstance(cost, float)
    assert cost >= 0
    sum_squared_diff = 1.0 + 0.25 + 6.25  # Sum of squared differences
    expected_cost = sum_squared_diff / 3  # Average of squared differences (3 pairs)
    assert np.isclose(cost, expected_cost, rtol=1e-10)

def test_pairwise_cost_empty():
    y_true = pd.DataFrame(columns=["SOURCE_A", "SOURCE_B", "TARGET", "B_OVER_A"])
    y_pred = pd.DataFrame(columns=["SOURCE", "TARGET", "WEIGHT"])
    with pytest.raises(ValueError, match="Missing weights in submission data"):
        pairwise_cost(y_true, y_pred)

def test_pairwise_cost_missing_weights():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b"],
        "SOURCE_B": ["b", "c"],
        "TARGET": ["t", "t"],
        "B_OVER_A": [2.0, 1.5]
    })
    y_pred = pd.DataFrame({
        "SOURCE": ["a", "b"],  # Missing weight for "c"
        "TARGET": ["t", "t"],
        "WEIGHT": [1.0, 2.0]
    })
    with pytest.raises(ValueError, match="Missing weights in submission data"):
        pairwise_cost(y_true, y_pred)

def test_pairwise_cost_missing_predictions():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b"],
        "SOURCE_B": ["b", "c"],
        "TARGET": ["t", "t"],
        "B_OVER_A": [2.0, 1.5]
    })
    y_pred = pd.DataFrame({
        "SOURCE": ["a"],  # Missing predictions
        "TARGET": ["t"],
        "WEIGHT": [1.0]
    })
    with pytest.raises(ValueError, match="Missing weights in submission data"):
        pairwise_cost(y_true, y_pred)

def test_pairwise_cost_invalid_input_type():
    with pytest.raises(TypeError, match="y_true must be a pandas DataFrame"):
        pairwise_cost(
            np.array([1, 2]),
            np.array([1, 2])
        )
