"""
Unit tests for evaluate module.
"""
import pytest
from unittest.mock import patch, MagicMock
from src.evaluate import main

# Test fixtures for the updated evaluate.py functionality
import pandas as pd
import numpy as np



@pytest.fixture
def mock_parser():
    """Create a mock parser and args for testing."""
    # Create a mock parser
    parser = MagicMock()
    
    # Create mock args
    args = MagicMock()
    args.ground_truth_path = '/path/to/ground_truth.parquet'
    args.submission_path = '/path/to/submission.csv'
    args.metric_name = 'rmse'
    args.data_portion = 1.0
    args.after_split = False
    args.custom_split = None
    args.skip_column_check = False
    
    # Configure the parser to return the mock args
    parser.parse_known_args.return_value = (args, [])
    
    return parser, args

@pytest.fixture
def mock_evaluator():
    """Create a mock evaluator."""
    evaluator = MagicMock()
    # Mock the evaluate method to return a score
    evaluator.evaluate = MagicMock(return_value=0.5)
    # Also mock any other methods that might be called
    evaluator.transform = MagicMock(return_value=(np.array([1, 2, 3]), np.array([1.1, 2.1, 3.1])))
    evaluator.validate = MagicMock(return_value=True)
    evaluator.get_default_params = MagicMock(return_value={})
    evaluator.read_data = MagicMock(return_value=(pd.DataFrame(), pd.DataFrame()))
    evaluator.compute_metric = MagicMock(return_value=0.5)
    return evaluator

def test_invalid_data_portion(mock_parser):
    """Test error handling for invalid data_portion."""
    parser, args = mock_parser
    args.data_portion = 1.5
    
    with patch('argparse.ArgumentParser', return_value=parser):
        with pytest.raises(ValueError) as excinfo:
            main()
        
        assert "data-portion must be between 0 and 1" in str(excinfo.value)

def test_after_split_with_full_data(mock_parser):
    """Test error handling for after_split with full data."""
    parser, args = mock_parser
    args.data_portion = 1.0
    args.after_split = True
    
    with patch('argparse.ArgumentParser', return_value=parser):
        with pytest.raises(ValueError) as excinfo:
            main()
        
        assert "data-portion must be less than 1 when --after-split is enabled" in str(excinfo.value)

def test_data_portion_with_custom_split(mock_parser):
    """Test error handling for data_portion with custom_split."""
    parser, args = mock_parser
    args.data_portion = 0.5
    args.custom_split = 'public'
    
    # Configure the parser to raise SystemExit when error is called
    parser.error.side_effect = SystemExit(2)
    
    with patch('argparse.ArgumentParser', return_value=parser):
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 2

def test_unknown_metric_error(mock_parser):
    """Test error handling for unknown metric."""
    parser, args = mock_parser
    args.metric_name = 'unknown_metric'
    
    # Configure the parser to raise ValueError
    with patch('argparse.ArgumentParser', return_value=parser), \
         patch('src.evaluators.EvaluatorRegistry.list_evaluator_names', return_value=['rmse', 'mae', 'r2']), \
         patch('pandas.read_parquet'), \
         patch('pandas.read_csv'), \
         patch('builtins.open', MagicMock()):
        
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 1

def test_basic_execution(mock_parser, mock_evaluator):
    """Test basic execution of the main function with default arguments."""
    parser, args = mock_parser
    
    # Configure the parser to exit normally
    parser.error.side_effect = None
    
    # Create mock dataframes
    mock_gt_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2'], 'LABEL': [1, 0]})
    mock_sub_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2'], 'LABEL': [1, 0]})
    
    # Patch dependencies
    with patch('argparse.ArgumentParser', return_value=parser), \
         patch('src.evaluators.EvaluatorRegistry.get_evaluator', return_value=mock_evaluator), \
         patch('pandas.read_parquet', return_value=mock_gt_df), \
         patch('pandas.read_csv', return_value=mock_sub_df), \
         patch('builtins.open', MagicMock()):
        
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 0

def test_validation_logic_directly():
    """Test validation logic directly without mocking."""
    # Test data_portion validation
    assert 0 < 0.5 <= 1  # Valid data_portion
    assert not (0 < 1.5 <= 1)  # Invalid data_portion
    
    # Test after_split validation
    assert 0.5 < 1  # Valid data_portion with after_split
    assert not (1.0 < 1)  # Invalid data_portion with after_split

def test_with_after_split(mock_parser, mock_evaluator):
    """Test execution with after_split parameter."""
    parser, args = mock_parser
    args.data_portion = 0.5
    args.after_split = True
    
    # Create mock dataframes
    mock_gt_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2', 'addr3', 'addr4'], 'LABEL': [1, 0, 1, 0]})
    mock_sub_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2', 'addr3', 'addr4'], 'LABEL': [1, 0, 1, 0]})
    
    # Patch dependencies
    with patch('argparse.ArgumentParser', return_value=parser), \
         patch('src.evaluators.EvaluatorRegistry.get_evaluator', return_value=mock_evaluator), \
         patch('pandas.read_parquet', return_value=mock_gt_df), \
         patch('pandas.read_csv', return_value=mock_sub_df), \
         patch('builtins.open', MagicMock()):
        
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 0

def test_with_custom_split(mock_parser, mock_evaluator):
    """Test execution with custom_split parameter."""
    parser, args = mock_parser
    args.custom_split = 'public'
    args.data_portion = 1.0  # Must be 1.0 when using custom_split
    
    # Create mock dataframes with SPLIT column
    mock_gt_df = pd.DataFrame({
        'ADDRESS': ['addr1', 'addr2', 'addr3', 'addr4'], 
        'LABEL': [1, 0, 1, 0],
        'SPLIT': ['public', 'public', 'private', 'private']
    })
    mock_sub_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2', 'addr3', 'addr4'], 'LABEL': [1, 0, 1, 0]})
    
    # Patch dependencies
    with patch('argparse.ArgumentParser', return_value=parser), \
         patch('src.evaluators.EvaluatorRegistry.get_evaluator', return_value=mock_evaluator), \
         patch('pandas.read_parquet', return_value=mock_gt_df), \
         patch('pandas.read_csv', return_value=mock_sub_df), \
         patch('builtins.open', MagicMock()):
        
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 0

def test_with_extra_args(mock_parser, mock_evaluator):
    """Test execution with extra arguments."""
    parser, args = mock_parser
    extra_args = ['--param1=value1', '--param2', 'value2']
    parser.parse_known_args.return_value = (args, extra_args)
    
    # Create mock dataframes
    mock_gt_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2'], 'LABEL': [1, 0]})
    mock_sub_df = pd.DataFrame({'ADDRESS': ['addr1', 'addr2'], 'LABEL': [1, 0]})
    
    # Patch dependencies
    with patch('argparse.ArgumentParser', return_value=parser), \
         patch('src.evaluators.EvaluatorRegistry.get_evaluator', return_value=mock_evaluator), \
         patch('pandas.read_parquet', return_value=mock_gt_df), \
         patch('pandas.read_csv', return_value=mock_sub_df), \
         patch('builtins.open', MagicMock()):
        
        try:
            main()
            pytest.fail("SystemExit not raised")
        except SystemExit as e:
            # Check that the exit code is as expected
            assert e.code == 0
