"""
Common test fixtures for metrics tests.
"""
import numpy as np
import pytest
import pandas as pd

@pytest.fixture
def valid_binary_data():
    return np.array([0, 1, 1, 0]), np.array([0, 1, 0, 0])

@pytest.fixture
def valid_continuous_data():
    return np.array([1.0, 2.0, 3.0, 4.0]), np.array([1.1, 2.1, 3.1, 4.1])

@pytest.fixture
def valid_rec_data():
    y_true = pd.DataFrame({
        "ADDRESS": ["addr1", "addr1", "addr2", "addr2"],
        "REC": ["rec1", "rec2", "rec3", "rec4"]
    })
    y_pred = pd.DataFrame({
        "ADDRESS": ["addr1", "addr1", "addr2", "addr2"],
        "REC": ["rec1", "rec3", "rec3", "rec4"]
    })
    return y_true, y_pred
