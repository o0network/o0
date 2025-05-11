import os
import tempfile
import pandas as pd
import numpy as np
import pytest
from unittest.mock import patch, MagicMock

from src.evaluators import BaseEvaluator


# Create a concrete implementation of BaseEvaluator for testing
class TestEvaluator(BaseEvaluator):
    """Concrete implementation of BaseEvaluator for testing."""
    def __init__(self):
        super().__init__(name="test_evaluator", description="Test evaluator")
    
    def transform(self, ground_truth_df, submission_df, data_portion=1.0, after_split=False, custom_split=None):
        """Implement abstract method."""
        # Simple implementation for testing
        return ground_truth_df.values, submission_df.values
    
    def compute_metric(self, y_true, y_pred, **kwargs):
        """Implement abstract method."""
        # Simple implementation for testing
        return 0.5
    
    def get_default_params(self):
        """Implement abstract method."""
        # Simple implementation for testing
        return {"param1": 1, "param2": 2}


@pytest.fixture
def test_evaluator():
    """Create a test evaluator instance."""
    return TestEvaluator()


@pytest.fixture
def sample_data():
    """Create sample data for testing."""
    ground_truth_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "VALUE": [1, 2, 3, 4],
        "SPLIT": ["public", "public", "private", "private"]
    })
    
    submission_df = pd.DataFrame({
        "ADDRESS": ["addr1", "addr2", "addr3", "addr4"],
        "VALUE": [1.1, 2.2, 3.3, 4.4]
    })
    
    return ground_truth_df, submission_df


def test_base_evaluator_init(test_evaluator):
    """Test initialization of BaseEvaluator."""
    assert test_evaluator.name == "test_evaluator"
    assert test_evaluator.description == "Test evaluator"


def test_base_evaluator_read_data():
    """Test read_data method of BaseEvaluator."""
    evaluator = TestEvaluator()
    
    # Create temporary CSV files for testing
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as gt_file, \
         tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as sub_file:
        
        # Create sample data
        gt_df = pd.DataFrame({
            "ADDRESS": ["addr1", "addr2"],
            "VALUE": [1, 2],
            "SPLIT": ["public", "private"]
        })
        
        sub_df = pd.DataFrame({
            "ADDRESS": ["addr1", "addr2"],
            "VALUE": [1.1, 2.2]
        })
        
        # Write to temp files
        gt_df.to_csv(gt_file.name, index=False)
        sub_df.to_csv(sub_file.name, index=False)
        
        # Test read_data
        try:
            gt_read, sub_read = evaluator.read_data(gt_file.name, sub_file.name)
            
            # Check shapes
            assert gt_read.shape == (2, 3)
            assert sub_read.shape == (2, 2)
            
            # Check content
            assert list(gt_read["ADDRESS"]) == ["addr1", "addr2"]
            assert list(sub_read["ADDRESS"]) == ["addr1", "addr2"]
        finally:
            # Clean up temp files
            os.unlink(gt_file.name)
            os.unlink(sub_file.name)


def test_base_evaluator_read_data_parquet():
    """Test read_data method with parquet file."""
    evaluator = TestEvaluator()
    
    # Create temporary parquet file for testing
    with tempfile.NamedTemporaryFile(suffix=".parquet", delete=False) as gt_file, \
         tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as sub_file:
        
        # Create sample data
        gt_df = pd.DataFrame({
            "ADDRESS": ["addr1", "addr2"],
            "VALUE": [1, 2],
            "SPLIT": ["public", "private"]
        })
        
        sub_df = pd.DataFrame({
            "ADDRESS": ["addr1", "addr2"],
            "VALUE": [1.1, 2.2]
        })
        
        # Write to temp files
        gt_df.to_parquet(gt_file.name, index=False)
        sub_df.to_csv(sub_file.name, index=False)
        
        # Test read_data
        try:
            gt_read, sub_read = evaluator.read_data(gt_file.name, sub_file.name)
            
            # Check shapes
            assert gt_read.shape == (2, 3)
            assert sub_read.shape == (2, 2)
            
            # Check content
            assert list(gt_read["ADDRESS"]) == ["addr1", "addr2"]
            assert list(sub_read["ADDRESS"]) == ["addr1", "addr2"]
        finally:
            # Clean up temp files
            os.unlink(gt_file.name)
            os.unlink(sub_file.name)


def test_base_evaluator_read_data_unsupported_format():
    """Test read_data method with unsupported file format."""
    evaluator = TestEvaluator()
    
    # Create temporary files for testing
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as gt_file, \
         tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as sub_file:
        
        # Write something to the files
        gt_file.write(b"test data")
        sub_file.write(b"test data")
        
        # Test read_data with unsupported format
        try:
            with pytest.raises(ValueError, match="Unsupported file type"):
                evaluator.read_data(gt_file.name, sub_file.name)
        finally:
            # Clean up temp files
            os.unlink(gt_file.name)
            os.unlink(sub_file.name)


def test_base_evaluator_validate(test_evaluator, sample_data):
    """Test validate method of BaseEvaluator."""
    ground_truth_df, submission_df = sample_data
    
    # Test validation without custom split
    with patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True):
        assert test_evaluator.validate(ground_truth_df, submission_df) is True
    
    # Test validation with custom split
    with patch('src.evaluators.validators.validate_split_column', return_value=True), \
         patch('src.evaluators.validators.validate_column_names', return_value=True), \
         patch('src.evaluators.validators.validate_no_duplicates', return_value=True):
        assert test_evaluator.validate(ground_truth_df, submission_df, custom_split="public") is True


def test_base_evaluator_transform(test_evaluator, sample_data):
    """Test transform method of the concrete implementation."""
    ground_truth_df, submission_df = sample_data
    
    y_true, y_pred = test_evaluator.transform(ground_truth_df, submission_df)
    
    assert isinstance(y_true, np.ndarray)
    assert isinstance(y_pred, np.ndarray)
    assert y_true.shape == ground_truth_df.values.shape
    assert y_pred.shape == submission_df.values.shape


def test_base_evaluator_compute_metric(test_evaluator):
    """Test compute_metric method of the concrete implementation."""
    y_true = np.array([1, 2, 3])
    y_pred = np.array([1.1, 2.2, 3.3])
    
    result = test_evaluator.compute_metric(y_true, y_pred)
    assert result == 0.5


def test_base_evaluator_get_default_params(test_evaluator):
    """Test get_default_params method of the concrete implementation."""
    params = test_evaluator.get_default_params()
    assert params == {"param1": 1, "param2": 2}


def test_base_evaluator_evaluate(test_evaluator):
    """Test evaluate method of BaseEvaluator."""
    # Mock the required methods
    test_evaluator.read_data = MagicMock(return_value=(pd.DataFrame(), pd.DataFrame()))
    test_evaluator.validate = MagicMock(return_value=True)
    test_evaluator.transform = MagicMock(return_value=(None, None))
    test_evaluator.compute_metric = MagicMock(return_value=0.75)
    
    # Test evaluate
    result = test_evaluator.evalute(
        ground_truth_path="dummy_gt.csv",
        submission_path="dummy_sub.csv",
        data_portion=0.8,
        custom_split="public"
    )
    
    # Check result
    assert result == 0.75
    
    # Verify method calls
    test_evaluator.read_data.assert_called_once_with("dummy_gt.csv", "dummy_sub.csv")
    test_evaluator.validate.assert_called_once()
    test_evaluator.transform.assert_called_once()
    test_evaluator.compute_metric.assert_called_once()
