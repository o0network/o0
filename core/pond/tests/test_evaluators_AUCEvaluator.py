"""
Unit tests for AUCEvaluator class.
"""
import numpy as np
import pandas as pd
import pytest
from unittest.mock import patch, MagicMock

from src.evaluators import AUCEvaluator


@pytest.fixture
def auc_evaluator():
    return AUCEvaluator()


@pytest.fixture
def sample_data():
    ground_truth_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "LABEL": [1, 0, 1, 0],
        "SPLIT": ["public", "public", "private", "private"]
    })
    
    submission_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "LABEL": [0.9, 0.1, 0.8, 0.2]
    })
    
    return ground_truth_df, submission_df


def test_auc_evaluator_init(auc_evaluator):
    """Test initialization of AUCEvaluator."""
    assert auc_evaluator.name == "auc"
    assert auc_evaluator.description == "Area Under the ROC Curve"


@patch('metrics.auc')
def test_auc_evaluator_compute_metric(mock_auc, auc_evaluator):
    """Test compute_metric method of AUCEvaluator."""
    y_true = np.array([1, 0, 1, 0])
    y_pred = np.array([0.9, 0.1, 0.8, 0.2])
    
    mock_auc.return_value = 1.0
    
    result = auc_evaluator.compute_metric(y_true, y_pred)
    
    mock_auc.assert_called_once_with(y_true, y_pred)
    assert result == 1.0


def test_auc_evaluator_get_default_params(auc_evaluator):
    """Test get_default_params method of AUCEvaluator."""
    params = auc_evaluator.get_default_params()
    assert isinstance(params, dict)
    assert len(params) == 0
