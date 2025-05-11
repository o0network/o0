"""
Unit tests for deepfunding metric.
"""
import numpy as np
import pytest
import pandas as pd
from metrics import deepfunding, pairwise_cost

@pytest.fixture
def valid_deepfunding_data():
    # Ground truth data
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b", "c"],
        "SOURCE_B": ["b", "c", "a"],
        "TARGET": ["t", "t", "t"],
        "B_OVER_A": [2.0, 1.5, 0.5]
    })
    
    # First prediction - good at predicting a vs b
    y_pred1 = pd.DataFrame({
        "SOURCE": ["a", "b", "c"],
        "TARGET": ["t", "t", "t"],
        "WEIGHT": [1.0, 2.0, 1.5]  # ratio b/a = 2.0 (perfect), c/b = 0.75 (off), a/c = 0.67 (off)
    })
    
    # Second prediction - good at predicting b vs c
    y_pred2 = pd.DataFrame({
        "SOURCE": ["a", "b", "c"],
        "TARGET": ["t", "t", "t"],
        "WEIGHT": [1.2, 2.0, 3.0]  # ratio b/a = 1.67 (off), c/b = 1.5 (perfect), a/c = 0.4 (off)
    })
    
    # Third prediction - good at predicting c vs a
    y_pred3 = pd.DataFrame({
        "SOURCE": ["a", "b", "c"],
        "TARGET": ["t", "t", "t"],
        "WEIGHT": [2.0, 1.5, 1.0]  # ratio b/a = 0.75 (off), c/b = 0.67 (off), a/c = 2.0 (matches 0.5)
    })
    
    return y_true, [y_pred1, y_pred2, y_pred3]

def test_deepfunding_valid(valid_deepfunding_data):
    y_true, y_pred = valid_deepfunding_data
    weights = deepfunding(y_true, y_pred)
    
    # Check that weights are valid
    assert isinstance(weights, np.ndarray)
    assert len(weights) == len(y_pred)
    assert np.all(weights >= 0)  # All weights should be non-negative
    assert np.isclose(np.sum(weights), 1.0)  # Weights should sum to 1
    
    # Check that combined prediction has lower cost than any individual prediction
    individual_costs = [pairwise_cost(y_true, pred) for pred in y_pred]
    
    # Calculate combined prediction cost
    combined_logits = sum(w * df["WEIGHT"] for w, df in zip(weights, y_pred))
    combined_df = y_pred[0].copy()
    combined_df["WEIGHT"] = combined_logits
    combined_cost = pairwise_cost(y_true, combined_df)
    
    # Combined cost should be less than or equal to the minimum individual cost
    assert combined_cost <= min(individual_costs)

def test_deepfunding_empty():
    y_true = pd.DataFrame(columns=["SOURCE_A", "SOURCE_B", "TARGET", "B_OVER_A"])
    y_pred = [pd.DataFrame(columns=["SOURCE", "TARGET", "WEIGHT"])]
    with pytest.raises(ValueError, match="Missing weights in submission data"):
        deepfunding(y_true, y_pred)

def test_deepfunding_missing_predictions():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b"],
        "SOURCE_B": ["b", "c"],
        "TARGET": ["t", "t"],
        "B_OVER_A": [2.0, 1.5]
    })
    y_pred = [pd.DataFrame({
        "SOURCE": ["a"],  # Missing predictions
        "TARGET": ["t"],
        "WEIGHT": [1.0]
    })]
    with pytest.raises(ValueError, match="Missing weights in submission data"):
        deepfunding(y_true, y_pred)

def test_deepfunding_no_predictions():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b"],
        "SOURCE_B": ["b", "c"],
        "TARGET": ["t", "t"],
        "B_OVER_A": [2.0, 1.5]
    })
    with pytest.raises(ValueError, match="No predictions provided"):
        deepfunding(y_true, [])

def test_deepfunding_inconsistent_predictions():
    y_true = pd.DataFrame({
        "SOURCE_A": ["a", "b"],
        "SOURCE_B": ["b", "c"],
        "TARGET": ["t", "t"],
        "B_OVER_A": [2.0, 1.5]
    })
    y_pred1 = pd.DataFrame({
        "SOURCE": ["a", "b", "c"],
        "TARGET": ["t", "t", "t"],
        "WEIGHT": [1.0, 2.0, 3.0]
    })
    y_pred2 = pd.DataFrame({
        "SOURCE": ["a", "b"],  # Different structure
        "TARGET": ["t", "t"],
        "WEIGHT": [1.0, 2.0]
    })
    with pytest.raises(ValueError, match="All predictions must have the same structure"):
        deepfunding(y_true, [y_pred1, y_pred2])

def test_deepfunding_invalid_input_type():
    with pytest.raises(TypeError, match="y_true must be a pandas DataFrame"):
        deepfunding(
            np.array([1, 2]),
            [pd.DataFrame({"SOURCE": ["a"], "TARGET": ["t"], "WEIGHT": [1.0]})]
        )
