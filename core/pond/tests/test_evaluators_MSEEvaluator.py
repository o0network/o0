"""
Unit tests for MSEEvaluator class.
"""
import numpy as np
import pandas as pd
import pytest
from unittest.mock import patch

from src.evaluators import MSEEvaluator


@pytest.fixture
def mse_evaluator():
    return MSEEvaluator()


@pytest.fixture
def sample_data():
    ground_truth_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "LABEL": [1.0, 2.0, 3.0, 4.0],
        "SPLIT": ["public", "public", "private", "private"]
    })
    
    submission_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "LABEL": [1.1, 2.2, 2.9, 4.1]
    })
    
    return ground_truth_df, submission_df


def test_mse_evaluator_init(mse_evaluator):
    """Test initialization of MSEEvaluator."""
    assert mse_evaluator.name == "mse"
    assert mse_evaluator.description == "Mean squared error"


def test_mse_evaluator_validate(mse_evaluator, sample_data):
    """Test validate method of MSEEvaluator."""
    ground_truth_df, submission_df = sample_data
    
    # Test validation with custom split
    with patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True), \
         patch('src.evaluators.validators.validate_split_column', return_value=True):
        assert mse_evaluator.validate(ground_truth_df, submission_df, custom_split="public") is True


def test_mse_evaluator_transform(mse_evaluator, sample_data):
    """Test transform method of MSEEvaluator."""
    ground_truth_df, submission_df = sample_data
    
    # Since MSEEvaluator inherits transform from AccuracyEvaluator, we'll test that
    with patch('src.evaluators.validators.validate_split_column', return_value=True):
        y_true, y_pred = mse_evaluator.transform(
            ground_truth_df, submission_df, custom_split="public"
        )
        assert isinstance(y_true, np.ndarray)
        assert isinstance(y_pred, np.ndarray)
        assert len(y_true) == 2  # Only public split data
        assert len(y_pred) == 2


@patch('metrics.mean_squared_error')
def test_mse_evaluator_compute_metric(mock_mse, mse_evaluator):
    """Test compute_metric method of MSEEvaluator."""
    y_true = np.array([1.0, 2.0, 3.0, 4.0])
    y_pred = np.array([1.1, 2.2, 2.9, 4.1])
    
    mock_mse.return_value = 0.0225
    
    result = mse_evaluator.compute_metric(y_true, y_pred)
    
    mock_mse.assert_called_once_with(y_true, y_pred)
    assert result == 0.0225


def test_mse_evaluator_get_default_params(mse_evaluator):
    """Test get_default_params method of MSEEvaluator."""
    params = mse_evaluator.get_default_params()
    assert isinstance(params, dict)
    assert len(params) == 0
