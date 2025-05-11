"""
Unit tests for DCGEvaluator class.
"""
import numpy as np
import pandas as pd
import pytest
from unittest.mock import patch

from src.evaluators import DCGEvaluator


@pytest.fixture
def dcg_evaluator():
    return DCGEvaluator()


@pytest.fixture
def sample_data():
    ground_truth_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3"],
        "RELEVANCE": [3.0, 2.0, 1.0],
        "SPLIT": ["public", "public", "private"]
    })
    
    submission_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3"],
        "RELEVANCE": [3.0, 2.0, 1.0],
        "SPLIT": ["public", "public", "private"]
    })
    
    return ground_truth_df, submission_df


def test_dcg_evaluator_init(dcg_evaluator):
    """Test initialization of DCGEvaluator."""
    assert dcg_evaluator.name == "dcg"
    assert dcg_evaluator.description == "Discounted Cumulative Gain"


def test_dcg_evaluator_validate(dcg_evaluator, sample_data):
    """Test validate method of DCGEvaluator."""
    ground_truth_df, submission_df = sample_data
    
    # Create copies of the dataframes to avoid modifying the fixtures
    gt_df = ground_truth_df.copy()
    sub_df = submission_df.copy()
    
    # Rename columns to match expected column names
    sub_df = sub_df.rename(columns={'RELEVANCE': 'RANK'})
    sub_df = sub_df[['ADDRESS', 'RANK']]
    
    # Mock the validation functions to return True
    with patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True), \
         patch('src.evaluators.validators.validate_split_column', return_value=True):
        # Test validation with custom split
        assert dcg_evaluator.validate(gt_df, sub_df, custom_split="public") is True
        
        # Test validation without custom split
        assert dcg_evaluator.validate(gt_df, sub_df) is True


@patch('metrics.discounted_cumulative_gain')
def test_dcg_evaluator_compute_metric(mock_dcg, dcg_evaluator):
    """Test compute_metric method of DCGEvaluator."""
    y_true = np.array([3.0, 2.0, 1.0])
    y_pred = np.array([1, 2, 3])
    
    mock_dcg.return_value = 0.85
    
    result = dcg_evaluator.compute_metric(y_true, y_pred)
    
    mock_dcg.assert_called_once_with(y_true, y_pred)
    assert result == 0.85


def test_dcg_evaluator_get_default_params(dcg_evaluator):
    """Test get_default_params method of DCGEvaluator."""
    params = dcg_evaluator.get_default_params()
    assert isinstance(params, dict)
    assert len(params) == 0
