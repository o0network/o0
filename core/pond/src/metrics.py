"""
Metrics module for evaluating predictions against ground truth.
"""
from typing import List

import numpy as np
import pandas as pd
from scipy.optimize import minimize
from sklearn.metrics import accuracy_score, roc_auc_score

import validators


def accuracy(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculate accuracy between ground truth and predictions.
    
    Args:
        y_true: Ground truth labels
        y_pred: Predicted labels
        
    Returns:
        float: Accuracy score
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(y_true, y_pred)
    return float(accuracy_score(y_true, y_pred))

def root_mean_squared_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculate mean squared error between ground truth and predictions.
    
    Args:
        y_true: Ground truth values
        y_pred: Predicted values
        
    Returns:
        float: Mean squared error
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(y_true, y_pred)
    return np.sqrt(np.mean((y_true - y_pred) ** 2))

def mean_squared_error(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculate mean squared error between ground truth and predictions.
    
    Args:
        y_true: Ground truth values
        y_pred: Predicted values
        
    Returns:
        float: Mean squared error
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(y_true, y_pred)
    return np.mean((y_true - y_pred) ** 2)

def weighted_mean_squared_error(
    y_true: np.ndarray, 
    y_pred: np.ndarray, 
) -> float:
    """Calculate weighted mean squared error between ground truth and predictions.
    
    Args:
        y_true: Ground truth values
        y_pred: Predicted values
        
    Returns:
        float: Weighted mean squared error
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(y_true, y_pred)
    return np.sqrt(np.mean(np.abs(y_true) * (y_true - y_pred)**2))

def auc(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Calculate Area Under the ROC Curve (AUC) between ground truth and predictions.
    
    Args:
        y_true: Ground truth binary labels
        y_pred: Predicted probabilities or scores
        
    Returns:
        float: AUC score
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(y_true, y_pred)
    validators.validate_value_range(y_pred, 0, 1)
    return float(roc_auc_score(y_true, y_pred))
        
def precision_at_k(
    y_true: pd.DataFrame, 
    y_pred: pd.DataFrame, 
    k: int
) -> float:
    """Calculate precision at k between ground truth and recommendations.
    
    Args:
        y_true: Ground truth items
        y_pred: Recommendations
        k: Number of items recommended
        
    Returns:
        float: Precision at k score
        
    Raises:
        ValueError: If inputs are invalid or k is not a positive integer
    """
    if not isinstance(k, int) or k <= 0:
        raise ValueError("k must be a positive integer")
        
    validators.validate_rec_inputs(y_true, y_pred)
    
    y_pred["score"] = 1
    combined_df = y_true.merge(y_pred, on=["ADDRESS", "REC"], how="left")
    combined_df = combined_df.groupby("ADDRESS").sum("score")
    precision = combined_df/k

    return float(precision.mean().item())

def discounted_cumulative_gain(
    true_relavance: np.ndarray, 
    ranks: np.ndarray
) -> float:
    """Calculate normalized discounted cumulative gain between ground truth relavance score and ranks.
    
    Args:
        true_relavance: Ground truth relavance score
        ranks: Recommendations rank
        
    Returns:
        float: Normalized discounted cumulative gain score
        
    Raises:
        ValueError: If inputs are invalid
    """
    validators.validate_numeric_inputs(true_relavance, ranks)
    if not np.issubdtype(ranks.dtype, np.integer) or np.any(ranks <= 0):
        raise ValueError("Ranks must be positive integers")
    if len(ranks) != len(set(ranks)):
        raise ValueError("Ranks must not contain any duplicates")
    discount = 1 / np.log2(ranks + 1)
    dcg = np.mean(true_relavance * discount)
    return dcg

def pairwise_cost(
    y_true: pd.DataFrame, 
    y_pred: pd.DataFrame
) -> float:
    """Calculate pairwise cost between ground truth and recommendations.

    This is adapted from vbuterin's cost function at https://github.com/deepfunding/scoring/blob/main/scoring.py#L18.
    y_true is a dataframe containing juror's samples. It must have columns "SOURCE_A", "SOURCE_B", "TARGET", and "B_OVER_A". 
    y_pred is a dataframe containing submitted weights for each project with respect to the target project. It must have columns "SOURCE", "TARGET", and "WEIGHT". 
    
    Args:
        y_true: Ground truth items
        y_pred: Recommendations
        
    Returns:
        float: Pairwise cost score
        
    Raises:
        TypeError: If inputs are not pandas DataFrames
        ValueError: If inputs are invalid or missing required data
    """
    if not isinstance(y_true, pd.DataFrame):
        raise TypeError("y_true must be a pandas DataFrame")
    if not isinstance(y_pred, pd.DataFrame):
        raise TypeError("y_pred must be a pandas DataFrame")
    
    # Check for empty DataFrames
    if len(y_true) == 0 or len(y_pred) == 0:
        raise ValueError("Missing weights in submission data")
        
    # Cost on pairs where TARGET != "originality"
    y_true_pair = y_true[y_true["TARGET"]!="ORIGINALITY"]
    combined_df = y_true_pair.merge(
        y_pred, 
        left_on=["SOURCE_A", "TARGET"], 
        right_on=["SOURCE", "TARGET"],
        how="left")
    if combined_df['WEIGHT'].isnull().any():
        raise ValueError("Missing weights in submission data")
    combined_df.rename(columns={"WEIGHT": "WEIGHT_A"}, inplace=True)
    
    combined_df = combined_df.merge(
        y_pred, 
        left_on=["SOURCE_B", "TARGET"], 
        right_on=["SOURCE", "TARGET"],
        how="left")
    if combined_df['WEIGHT'].isnull().any():
        raise ValueError("Missing weights in submission data")
    combined_df.rename(columns={"WEIGHT": "WEIGHT_B"}, inplace=True)
    
    cost_pair = ((combined_df["WEIGHT_B"] - combined_df["WEIGHT_A"] - combined_df["B_OVER_A"])**2).sum()
    len_pair = len(combined_df)

    # Cost on pairs where TARGET == "originality"
    y_true_origin = y_true[y_true["TARGET"]=="ORIGINALITY"]
    if len(y_true_origin) == 0:
        cost_origin = 0
        len_origin = 0
    else:
        combined_df = y_true_origin.merge(
            y_pred, 
            left_on=["SOURCE_A", "TARGET"], 
            right_on=["SOURCE", "TARGET"],
            how="left")
        if combined_df['WEIGHT'].isnull().any():
            raise ValueError("Missing weights in submission data")
        cost_origin = ((combined_df["WEIGHT"] - combined_df["B_OVER_A"])**2).sum()
        len_origin = len(combined_df)

    return (float(cost_pair) + float(cost_origin))/(len_pair + len_origin)

def deepfunding(
    y_true: pd.DataFrame, 
    y_pred: List[pd.DataFrame]
) -> float:
    """Calculate the optimal linear combination of submitted weights to minimize pairwise cost with a given set of juror samples.

    This is adapted from vbuterin's optimization function at https://github.com/deepfunding/scoring/blob/main/scoring.py#L28.
    y_true is a dataframe containing juror's samples. It must have columns "SOURCE_A", "SOURCE_B", "TARGET", and "B_OVER_A". 
    y_pred is a list of dataframes where each dataframe contains one submission of weights. Every dataframe must have the same "SOURCE" and "TARGET" with each other and sorted the same way. 

    Args:
        y_true: Ground truth judgement between every pair of projects
        y_pred: List of dataframes where each dataframe contains one submission of weights
        
    Returns:
        float: Weights for the optimal linear combination of the submissions. 
        
    Raises:
        TypeError: If inputs are not pandas DataFrames
        ValueError: If inputs are invalid or missing required data
    """
    if not isinstance(y_true, pd.DataFrame):
        raise TypeError("y_true must be a pandas DataFrame")
    if not isinstance(y_pred, list):
        raise TypeError("y_pred must be a list of pandas DataFrames")
    if len(y_pred) == 0:
        raise ValueError("No predictions provided")
    
    # Validate that all predictions have the same structure
    first_pred = y_pred[0]
    for i, pred in enumerate(y_pred[1:], 1):
        if not isinstance(pred, pd.DataFrame):
            raise TypeError(f"Prediction {i} is not a pandas DataFrame")
        if not pred.equals(first_pred[['SOURCE', 'TARGET']].assign(WEIGHT=pred['WEIGHT'])):
            raise ValueError("All predictions must have the same structure")

    def split_cost(weights):
        combined_logits = sum(w * df["WEIGHT"] for w, df in zip(weights, y_pred))
        combined_df = y_pred[0].copy()
        combined_df["WEIGHT"] = combined_logits
        return pairwise_cost(y_true, combined_df)

    # Initial guess: equal weights
    initial_weights = [1 / len(y_pred)] * len(y_pred)

    # Constraint: weights must sum to 1
    constraints = ({'type': 'eq', 'fun': lambda w: sum(w) - 1})

    # Bounds: weights must be between 0 and 1
    bounds = [(0, 1)] * len(y_pred)

    # Minimize the split cost
    result = minimize(
        split_cost,
        initial_weights,
        bounds=bounds,
        constraints=constraints
    )
    return result.x

# Dictionary mapping metric names to functions
METRICS = {
    'accuracy': accuracy,
    'rmse': root_mean_squared_error,
    'wmse': weighted_mean_squared_error,
    'precision_at_k': precision_at_k,
    'dcg': discounted_cumulative_gain,
    'auc': auc,
    'mse': mean_squared_error,
    'pairwise_cost': pairwise_cost,
    'deepfunding': deepfunding
}
