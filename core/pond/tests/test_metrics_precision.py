"""
Unit tests for precision at k metric.
"""
import numpy as np
import pytest
import pandas as pd
from metrics import precision_at_k

def test_precision_at_k_valid(valid_rec_data):
    y_true, y_pred = valid_rec_data
    # For addr1: 1/2 matches out of 2 recs
    # For addr2: 2/2 matches out of 2 recs
    # Average precision = (0.5 + 1.0)/2 = 0.75
    assert np.isclose(precision_at_k(y_true, y_pred, k=2), 0.75)

def test_precision_at_k_empty():
    y_true = pd.DataFrame(columns=["ADDRESS", "REC"])
    y_pred = pd.DataFrame(columns=["ADDRESS", "REC"])
    with pytest.raises(ValueError, match="Input data cannot be empty"):
        precision_at_k(y_true, y_pred, k=1)

def test_precision_at_k_missing_addresses():
    y_true = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2"],
        "REC": ["rec1", "rec2"]
    })
    y_pred = pd.DataFrame({
        "ADDRESS": ["addr1"],
        "REC": ["rec1"]
    })
    with pytest.raises(ValueError, match="Missing recommendations for some addresses"):
        precision_at_k(y_true, y_pred, k=1)

def test_precision_at_k_invalid_input_type():
    with pytest.raises(ValueError, match="Inputs must be pandas DataFrames"):
        precision_at_k(
            np.array([1, 2]),
            np.array([1, 2]),
            k=1
        )

def test_precision_at_k_perfect_match(valid_rec_data):
    y_true, _ = valid_rec_data
    # Perfect match case
    y_pred = y_true.copy()
    assert np.isclose(precision_at_k(y_true, y_pred, k=2), 1.0)

def test_precision_at_k_no_match(valid_rec_data):
    y_true, _ = valid_rec_data
    # No matches case
    y_pred = pd.DataFrame({
        "ADDRESS": ["addr1", "addr1", "addr2", "addr2"],
        "REC": ["rec5", "rec6", "rec7", "rec8"]
    })
    assert np.isclose(precision_at_k(y_true, y_pred, k=2), 0.0)
