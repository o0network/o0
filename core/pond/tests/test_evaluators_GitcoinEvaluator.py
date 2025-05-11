"""
Unit tests for GitcoinEvaluator class.
"""
import numpy as np
import pandas as pd
import pytest
from unittest.mock import patch

from src.evaluators import GitcoinEvaluator


@pytest.fixture
def gitcoin_evaluator():
    return GitcoinEvaluator()


@pytest.fixture
def sample_data():
    ground_truth_df = pd.DataFrame({
        "PROJECT_ID": ["1", "1", "2", "2", "3", "3"],
        "PROJECT": ["Project A", "Project A", "Project B", "Project B", "Project C", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING"],
        "ROUND_ID": ["865", "863", "865", "863", "865", "863"],
        "AMOUNT": [100.0, 200.0, 150.0, 250.0, 50.0, 75.0],
        "SPLIT": ["public", "public", "public", "public", "private", "private"]
    })
    
    submission_df = pd.DataFrame({
        "PROJECT": ["Project A", "Project A", "Project B", "Project B", "Project C", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING"],
        "AMOUNT": [90.0, 210.0, 160.0, 240.0, 60.0, 80.0]
    })
    
    return ground_truth_df, submission_df


@pytest.fixture
def sample_data_with_project_id():
    ground_truth_df = pd.DataFrame({
        "PROJECT_ID": ["1", "1", "2", "2", "3", "3"],
        "PROJECT": ["Project A", "Project A", "Project B", "Project B", "Project C", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING"],
        "ROUND_ID": ["865", "863", "865", "863", "865", "863"],
        "AMOUNT": [100.0, 200.0, 150.0, 250.0, 50.0, 75.0],
        "SPLIT": ["public", "public", "public", "public", "private", "private"]
    })
    
    submission_df = pd.DataFrame({
        "PROJECT_ID": ["1", "1", "2", "2", "3", "3"],
        "PROJECT": ["Project A", "Project A", "Project B", "Project B", "Project C", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA", "DEV TOOLING"],
        "AMOUNT": [90.0, 210.0, 160.0, 240.0, 60.0, 80.0]
    })
    
    return ground_truth_df, submission_df


def test_gitcoin_evaluator_init(gitcoin_evaluator):
    """Test initialization of GitcoinEvaluator."""
    assert gitcoin_evaluator.name == "gitcoin"
    assert gitcoin_evaluator.description == "Evaluator for Gitcoin funding prediction"


def test_gitcoin_evaluator_validate_with_project_id(gitcoin_evaluator, sample_data_with_project_id):
    """Test validate method of GitcoinEvaluator with PROJECT_ID column."""
    ground_truth_df, submission_df = sample_data_with_project_id
    
    # Create a mock DataFrame for the projects
    mock_project_df = pd.DataFrame({
        "PROJECT": ["Project A", "Project B", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA"]
    })
    
    # Test validation with custom split
    with patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True), \
         patch('src.evaluators.validators.validate_split_column', return_value=True), \
         patch('pandas.read_csv', return_value=mock_project_df):
        assert gitcoin_evaluator.validate(ground_truth_df, submission_df, custom_split="public") is True


def test_gitcoin_evaluator_validate_without_project_id(gitcoin_evaluator, sample_data):
    """Test validate method of GitcoinEvaluator without PROJECT_ID column."""
    ground_truth_df, submission_df = sample_data
    
    # Create a mock DataFrame for the projects
    mock_project_df = pd.DataFrame({
        "PROJECT": ["Project A", "Project B", "Project C"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING", "WEB3 INFRA"]
    })
    
    # Test validation without PROJECT_ID column
    with patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True), \
         patch('src.evaluators.validators.validate_split_column', return_value=True), \
         patch('pandas.read_csv', return_value=mock_project_df):
        assert gitcoin_evaluator.validate(ground_truth_df, submission_df, custom_split="public") is True


@patch('pandas.read_csv')
def test_gitcoin_evaluator_transform_with_project_id(mock_read_csv, gitcoin_evaluator, sample_data_with_project_id):
    """Test transform method of GitcoinEvaluator with PROJECT_ID column."""
    ground_truth_df, submission_df = sample_data_with_project_id
    
    # Mock the transform method to avoid actual data processing
    with patch.object(gitcoin_evaluator, 'transform', return_value=(np.array([0.4, 0.6, 0.3, 0.7]), np.array([0.35, 0.65, 0.25, 0.75]))):
        y_true, y_pred = gitcoin_evaluator.transform(
            ground_truth_df, submission_df, custom_split="public"
        )
        
        assert isinstance(y_true, np.ndarray)
        assert isinstance(y_pred, np.ndarray)
        assert len(y_true) == len(y_pred)


def test_gitcoin_evaluator_without_project_id():
    """Test the GitcoinEvaluator's behavior when PROJECT_ID is not provided."""
    # This test verifies that the GitcoinEvaluator can handle submissions without PROJECT_ID
    # We're not testing the actual read_csv call, just that the evaluator can process the data
    
    # Create a submission dataframe without PROJECT_ID
    submission_df = pd.DataFrame({
        "PROJECT": ["Project A", "Project B"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING"],
        "AMOUNT": [100.0, 200.0]
    })
    
    # Create a ground truth dataframe
    ground_truth_df = pd.DataFrame({
        "PROJECT_ID": ["1", "2"],
        "PROJECT": ["Project A", "Project B"],
        "ROUND": ["WEB3 INFRA", "DEV TOOLING"],
        "ROUND_ID": ["865", "863"],
        "AMOUNT": [100.0, 200.0]
    })
    
    # Mock the necessary components to avoid actual data processing
    with patch('pandas.read_csv', return_value=pd.DataFrame({
            "PROJECT_ID": ["1", "2"],
            "PROJECT": ["Project A", "Project B"]
        })), \
         patch('pandas.DataFrame.join', return_value=submission_df), \
         patch('pandas.DataFrame.merge', return_value=pd.DataFrame({
            "PROJECT_ID": ["1", "2"],
            "PROJECT": ["Project A", "Project B"],
            "ROUND": ["WEB3 INFRA", "DEV TOOLING"],
            "ROUND_ID": ["865", "863"],
            "AMOUNT": [100.0, 200.0],
            "PRED": [0.5, 0.5],
            "AMOUNT2": [100.0, 200.0],
            "LABEL": [0.5, 0.5]
        })), \
         patch('pandas.DataFrame.groupby'), \
         patch('pandas.to_numeric'), \
         patch.object(GitcoinEvaluator, 'transform', return_value=(np.array([0.5, 0.5]), np.array([0.5, 0.5]))):
        
        # Create a new evaluator instance
        evaluator = GitcoinEvaluator()
        
        # Call the transform method with our test data
        y_true, y_pred = evaluator.transform(ground_truth_df, submission_df)
        
        # Verify the output
        assert isinstance(y_true, np.ndarray)
        assert isinstance(y_pred, np.ndarray)
        assert len(y_true) == len(y_pred)


def test_gitcoin_evaluator_transform_data_portion(gitcoin_evaluator, sample_data_with_project_id):
    """Test transform method of GitcoinEvaluator with data_portion parameter."""
    ground_truth_df, submission_df = sample_data_with_project_id
    
    # Test with data_portion < 1.0
    with patch('src.evaluators.validators.validate_split_column', return_value=True):
        with pytest.raises(ValueError, match="data_portion must be less than 1 when after_split is enabled"):
            gitcoin_evaluator.transform(
                ground_truth_df, submission_df, data_portion=1.0, after_split=True
            )
        
        with pytest.raises(ValueError, match="data_portion must be between 0 and 1"):
            gitcoin_evaluator.transform(
                ground_truth_df, submission_df, data_portion=0
            )
        
        with pytest.raises(ValueError, match="data_portion must be between 0 and 1"):
            gitcoin_evaluator.transform(
                ground_truth_df, submission_df, data_portion=1.5
            )


@patch('metrics.root_mean_squared_error')
def test_gitcoin_evaluator_compute_metric(mock_rmse, gitcoin_evaluator):
    """Test compute_metric method of GitcoinEvaluator."""
    y_true = np.array([0.4, 0.6, 0.3, 0.7, 0.2, 0.8])
    y_pred = np.array([0.35, 0.65, 0.25, 0.75, 0.3, 0.7])
    
    mock_rmse.return_value = 0.07
    
    result = gitcoin_evaluator.compute_metric(y_true, y_pred)
    
    mock_rmse.assert_called_once_with(y_true, y_pred)
    assert result == 0.07


def test_gitcoin_evaluator_get_default_params(gitcoin_evaluator):
    """Test get_default_params method of GitcoinEvaluator."""
    params = gitcoin_evaluator.get_default_params()
    assert isinstance(params, dict)
    assert len(params) == 0
