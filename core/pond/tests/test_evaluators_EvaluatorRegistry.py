"""
Unit tests for EvaluatorRegistry class.
"""
import pytest
from unittest.mock import patch

from src.evaluators import EvaluatorRegistry, BaseEvaluator


class MockEvaluator(BaseEvaluator):
    """Mock evaluator for testing."""
    
    def __init__(self):
        super().__init__(name="mock", description="Mock evaluator")
    
    def validate(self, ground_truth_df, submission_df, custom_split=None):
        return True
    
    def transform(self, ground_truth_df, submission_df, data_portion=1.0, after_split=False, custom_split=None):
        return None, None
    
    def compute_metric(self, y_true, y_pred, **kwargs):
        return 0.0
    
    def get_default_params(self):
        return {}


def test_evaluator_registry_register():
    """Test register method of EvaluatorRegistry."""
    # Clear the registry before testing
    EvaluatorRegistry._registry = {}
    
    # Prepare for testing
    
    # Mock the register method to avoid creating instances
    with patch.object(EvaluatorRegistry, 'register', return_value=None) as mock_register:
        # Register a mock evaluator
        EvaluatorRegistry.register(MockEvaluator)
        
        # Check if register was called with the correct class
        mock_register.assert_called_once_with(MockEvaluator)


def test_evaluator_registry_get_evaluator():
    """Test get_evaluator method of EvaluatorRegistry."""
    # Clear the registry before testing
    EvaluatorRegistry._registry = {}
    
    # Register a mock evaluator
    EvaluatorRegistry.register(MockEvaluator)
    
    # Get the evaluator
    evaluator = EvaluatorRegistry.get_evaluator("mock")
    
    # Check if the correct evaluator is returned
    assert isinstance(evaluator, MockEvaluator)
    assert evaluator.name == "mock"
    assert evaluator.description == "Mock evaluator"
    
    # Test getting a non-existent evaluator
    with pytest.raises(ValueError):
        EvaluatorRegistry.get_evaluator("non_existent")


def test_evaluator_registry_list_evaluator_names():
    """Test list_evaluator_names method of EvaluatorRegistry."""
    # Clear the registry before testing
    EvaluatorRegistry._registry = {}
    
    # Register mock evaluators
    EvaluatorRegistry.register(MockEvaluator)
    
    # Create another mock evaluator class
    class AnotherMockEvaluator(BaseEvaluator):
        def __init__(self):
            super().__init__(name="another_mock", description="Another mock evaluator")
        
        def validate(self, ground_truth_df, submission_df, custom_split=None):
            return True
        
        def transform(self, ground_truth_df, submission_df, data_portion=1.0, after_split=False, custom_split=None):
            return None, None
        
        def compute_metric(self, y_true, y_pred, **kwargs):
            return 0.0
        
        def get_default_params(self):
            return {}
    
    # Register the second mock evaluator
    EvaluatorRegistry.register(AnotherMockEvaluator)
    
    # Get the list of evaluator names
    names = EvaluatorRegistry.list_evaluator_names()
    
    # Check if all evaluators are listed
    assert "mock" in names
    assert "another_mock" in names
    assert len(names) == 2
