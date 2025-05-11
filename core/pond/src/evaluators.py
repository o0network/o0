"""
Evaluator module for metrics evaluation.

This module contains the base evaluator class, registry, and implementations
for different metrics.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple

import logging
import numpy as np
import pandas as pd

import validators
import metrics

logger = logging.getLogger(__name__)


class BaseEvaluator(ABC):
    """Base class for all evaluators.

    This class defines the interface that all evaluators must implement.
    """

    def __init__(self, name: str, description: str = ""):
        """Initialize the evaluator.

        Args:
            name: Name of the evaluator
            description: Description of the evaluator
        """
        self.name = name
        self.description = description

    def read_data(
        self, ground_truth_path: str, submission_path: str
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Load ground truth and submission data.

        Args:
            ground_truth_path: Path to ground truth file
            submission_path: Path to submission file

        Returns:
            Tuple of (ground_truth_df, submission_df)
        """
        # Load ground truth data
        if ground_truth_path.endswith("parquet"):
            ground_truth_df = pd.read_parquet(ground_truth_path)
        elif ground_truth_path.endswith("csv"):
            ground_truth_df = pd.read_csv(ground_truth_path)
        else:
            raise ValueError(
                f"Unsupported file type for ground truth: {ground_truth_path}"
            )
        logger.debug(f"Ground truth shape: {ground_truth_df.shape}")

        # Load submission data
        submission_df = pd.read_csv(submission_path)
        logger.debug(f"Submission shape: {submission_df.shape}")

        return ground_truth_df, submission_df

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        # Check required columns
        if custom_split:
            validators.validate_split_column(ground_truth_df, custom_split)

        expected_cols = [
            col for col in ground_truth_df.columns if col.lower() != "split"
        ]
        validators.validate_column_names(
            submission_df, expected_cols, ignore_case=False
        )
        # Check for duplicate addresses in submission
        validators.validate_no_duplicates(submission_df, col_indices=[0])

        return True

    @abstractmethod
    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[Any, Any]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) in the format required by compute_metric
        """
        pass

    @abstractmethod
    def compute_metric(self, y_true: Any, y_pred: Any, **kwargs) -> float:
        """Compute the metric.

        Args:
            y_true: Ground truth values
            y_pred: Predicted values
            **kwargs: Additional parameters for metric computation

        Returns:
            float: Computed metric value
        """
        pass

    @abstractmethod
    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        pass

    def evalute(
        self,
        ground_truth_path: str,
        submission_path: str,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
        **kwargs,
    ) -> float:
        """
        Evaluate the metric on the given data.

        Args:
            ground_truth_path: Path to ground truth file
            submission_path: Path to submission file
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data
            **kwargs: Additional parameters for metric computation

        Returns:
            float: Computed metric value
        """
        logger.debug(f"Reading data from {ground_truth_path} and {submission_path}")
        ground_truth_df, submission_df = self.read_data(
            ground_truth_path, submission_path
        )

        logger.debug("Validating data")
        self.validate(ground_truth_df, submission_df, custom_split)

        logger.debug("Transforming data")
        y_true, y_pred = self.transform(
            ground_truth_df,
            submission_df,
            data_portion=data_portion,
            after_split=after_split,
            custom_split=custom_split,
        )

        logger.debug("Computing metric")
        params = self.get_default_params()
        params.update(kwargs)

        return self.compute_metric(y_true, y_pred, **params)


# Registry for evaluators
class EvaluatorRegistry:
    """Registry for evaluators.

    This class maintains a registry of all available evaluators.
    """

    _registry = {}

    @classmethod
    def register(cls, evaluator_class):
        """Register an evaluator class.

        Args:
            evaluator_class: Evaluator class to register

        Returns:
            The registered evaluator class (for decorator use)
        """
        instance = evaluator_class()
        cls._registry[instance.name] = instance
        return evaluator_class

    @classmethod
    def get_evaluator(cls, name: str) -> BaseEvaluator:
        """Get an evaluator by name.

        Args:
            name: Name of the evaluator

        Returns:
            BaseEvaluator: The requested evaluator

        Raises:
            ValueError: If evaluator is not found
        """
        if name not in cls._registry:
            raise ValueError(
                f"Unknown evaluator: {name}. "
                f"Available evaluators: {list(cls._registry.keys())}"
            )
        return cls._registry[name]

    @classmethod
    def list_evaluators(cls) -> Dict[str, BaseEvaluator]:
        """List all registered evaluators.

        Returns:
            Dict[str, BaseEvaluator]: Dictionary of evaluator names to evaluators
        """
        return cls._registry.copy()

    @classmethod
    def list_evaluator_names(cls) -> List[str]:
        """Get a list of all available evaluator names.

        Returns:
            List[str]: List of evaluator names
        """
        return list(cls._registry.keys())


@EvaluatorRegistry.register
class AccuracyEvaluator(BaseEvaluator):
    """Evaluator for accuracy metric."""

    def __init__(self):
        """Initialize the evaluator."""
        super().__init__(name="accuracy", description="Accuracy score")

    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) as numpy arrays
        """
        if after_split and data_portion >= 1:
            raise ValueError(
                "data_portion must be less than 1 when after_split is enabled"
            )
        if not 0 < data_portion <= 1:
            raise ValueError("data_portion must be between 0 and 1")

        # Standardize column names
        cols = ["ADDRESS", "LABEL"]
        if custom_split:
            cols.append("SPLIT")
        ground_truth_df.columns = cols
        ground_truth_df["ADDRESS"] = ground_truth_df["ADDRESS"].astype(str).str.upper()
        ground_truth_df["LABEL"] = pd.to_numeric(ground_truth_df["LABEL"])

        submission_df.columns = ["ADDRESS", "PRED"]
        submission_df["ADDRESS"] = submission_df["ADDRESS"].astype(str).str.upper()
        submission_df["PRED"] = pd.to_numeric(submission_df["PRED"])

        # Merge data
        df = ground_truth_df.merge(submission_df, how="left", on="ADDRESS")

        # Filter by split if specified
        if custom_split:
            split_value = custom_split.lower()
            df = df[df["SPLIT"].str.lower() == split_value]
            logger.debug(f"Filtered to {split_value} split, new shape: {df.shape}")

        # Apply data portion
        if data_portion < 1.0:
            n_samples = int(len(df) * data_portion)
            if after_split:
                df = df.iloc[n_samples:]
            else:
                df = df.iloc[:n_samples]

        # Extract arrays
        y_true = df["LABEL"].values
        y_pred = df["PRED"].values

        return y_true, y_pred

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute accuracy score.

        Args:
            y_true: Ground truth binary labels
            y_pred: Predicted binary labels

        Returns:
            float: Accuracy score
        """
        return metrics.accuracy(y_true, y_pred)

    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        return {}


@EvaluatorRegistry.register
class RMSEEvaluator(AccuracyEvaluator):
    """Evaluator for root mean squared error metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "rmse"
        self.description = "Root mean squared error"

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute root mean squared error.

        Args:
            y_true: Ground truth values
            y_pred: Predicted values

        Returns:
            float: Root mean squared error
        """
        return metrics.root_mean_squared_error(y_true, y_pred)


@EvaluatorRegistry.register
class MSEEvaluator(AccuracyEvaluator):
    """Evaluator for mean squared error metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "mse"
        self.description = "Mean squared error"

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute mean squared error.

        Args:
            y_true: Ground truth values
            y_pred: Predicted values

        Returns:
            float: Mean squared error
        """
        return metrics.mean_squared_error(y_true, y_pred)


@EvaluatorRegistry.register
class WMSEEvaluator(AccuracyEvaluator):
    """Evaluator for weighted mean squared error metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "wmse"
        self.description = "Weighted mean squared error"

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute weighted mean squared error.

        Args:
            y_true: Ground truth values
            y_pred: Predicted values

        Returns:
            float: Weighted mean squared error
        """
        return metrics.weighted_mean_squared_error(y_true, y_pred)


@EvaluatorRegistry.register
class AUCEvaluator(AccuracyEvaluator):
    """Evaluator for AUC metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "auc"
        self.description = "Area Under the ROC Curve"

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute AUC score.

        Args:
            y_true: Ground truth binary labels
            y_pred: Predicted probabilities or scores

        Returns:
            float: AUC score
        """
        return metrics.auc(y_true, y_pred)


@EvaluatorRegistry.register
class PrecisionAtKEvaluator(AccuracyEvaluator):
    """Evaluator for precision at k metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "precision_at_k"
        self.description = "Precision at k"

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        # Check required columns
        if custom_split:
            validators.validate_split_column(ground_truth_df, custom_split)
            expected_cols = [
                col for col in ground_truth_df.columns if col.lower() != "split"
            ]
            validators.validate_column_names(
                submission_df, expected_cols, ignore_case=False
            )
        else:
            validators.validate_column_names(
                submission_df, list(ground_truth_df.columns), ignore_case=False
            )

        return True

    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) as dataframes
        """
        if after_split and data_portion >= 1:
            raise ValueError(
                "data-portion must be less than 1 when after_split is enabled"
            )
        if not 0 < data_portion <= 1:
            raise ValueError("data-portion must be between 0 and 1")

        # Standardize column names
        cols = ["ADDRESS", "REC"]
        if custom_split:
            cols.append("SPLIT")
        ground_truth_df.columns = cols
        ground_truth_df["ADDRESS"] = ground_truth_df["ADDRESS"].astype(str).str.upper()
        ground_truth_df["REC"] = ground_truth_df["REC"].astype(str).str.upper()

        submission_df.columns = ["ADDRESS", "REC"]
        submission_df["ADDRESS"] = submission_df["ADDRESS"].astype(str).str.upper()
        submission_df["REC"] = submission_df["REC"].astype(str).str.upper()

        # Filter by split if specified
        if custom_split:
            split_value = custom_split.lower()
            ground_truth_df = ground_truth_df[
                ground_truth_df["SPLIT"].str.lower() == split_value
            ]
            logger.debug(f"Filtered to {split_value} split, new shape: {ground_truth_df.shape}")

        # Apply data portion
        if data_portion < 1.0:
            addresses = ground_truth_df["ADDRESS"].unique()
            n_addresses = int(len(addresses) * data_portion)
            if after_split:
                selected_addresses = addresses[n_addresses:]
                logger.debug(
                f"Selected remaining {1-data_portion:.2%} of unique addresses, length: {len(selected_addresses)}"
            )
            else:
                selected_addresses = addresses[:n_addresses]
                logger.debug(
                    f"Selected first {data_portion:.2%} of unique addresses, length: {len(selected_addresses)}"
                )
            ground_truth_df = ground_truth_df[
                ground_truth_df["ADDRESS"].isin(selected_addresses)
            ]
            submission_df = submission_df[
                submission_df["ADDRESS"].isin(selected_addresses)
            ]
            logger.debug(
                f"Ground truth new shape: {ground_truth_df.shape}, submission new shape: {submission_df.shape}"
            )

        return ground_truth_df, submission_df

    def compute_metric(
        self, y_true: pd.DataFrame, y_pred: pd.DataFrame, **kwargs
    ) -> float:
        """Compute precision at k.

        Args:
            y_true: Ground truth items
            y_pred: Recommendations

        Returns:
            float: Precision at k score
        """
        k = kwargs.get("topk", 5)

        return metrics.precision_at_k(y_true, y_pred, k)

    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        return {"topk": 5}


@EvaluatorRegistry.register
class DCGEvaluator(AccuracyEvaluator):
    """Evaluator for discounted cumulative gain metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "dcg"
        self.description = "Discounted Cumulative Gain"

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        super().validate(ground_truth_df, submission_df, custom_split)
        validators.validate_rank(submission_df, "RANK", len(ground_truth_df))

        return True

    def compute_metric(self, y_true: np.ndarray, y_pred: np.ndarray, **kwargs) -> float:
        """Compute discounted cumulative gain.

        Args:
            y_true: Ground truth relevance score
            y_pred: Recommendations rank

        Returns:
            float: Discounted cumulative gain score
        """
        return metrics.discounted_cumulative_gain(y_true, y_pred)

    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        return {}


@EvaluatorRegistry.register
class PairwiseCostEvaluator(BaseEvaluator):
    """Evaluator for pairwise cost metric."""

    def __init__(self):
        """Initialize the evaluator."""
        super().__init__(name="pairwise_cost", description="Pairwise cost")

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        # Check required columns
        s3_url = "https://pond-open-files.s3.us-east-1.amazonaws.com/competition_2564617/sample_submission_deepfunding.csv"
        sample_submission = pd.read_csv(s3_url)
        validators.validate_column_names(submission_df, list(sample_submission.columns), ignore_case=False)

        validators.validate_no_duplicates(submission_df, columns=["repo", "parent"])

        sample_submission = sample_submission.drop(columns=["weight"])
        sample_submission = sample_submission.merge(submission_df, on=["repo", "parent"], how="left")
        if sample_submission['weight'].isnull().any():
            raise ValueError("Missing rows in submission data")

        validators.validate_value_range(submission_df["weight"], min_val=0)

        # If custom_split is specified, validate split column
        if custom_split:
            validators.validate_split_column(ground_truth_df, custom_split)

        return True

    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) as dataframes
        """
        # Standardize column names
        cols = ["SOURCE_A", "SOURCE_B", "TARGET", "B_OVER_A"]
        if custom_split:
            cols.append("SPLIT")
        ground_truth_df.columns = cols
        ground_truth_df["SOURCE_A"] = (
            ground_truth_df["SOURCE_A"].astype(str).str.upper()
        )
        ground_truth_df["SOURCE_B"] = (
            ground_truth_df["SOURCE_B"].astype(str).str.upper()
        )
        ground_truth_df["TARGET"] = ground_truth_df["TARGET"].astype(str).str.upper()
        ground_truth_df["B_OVER_A"] = pd.to_numeric(ground_truth_df["B_OVER_A"])

        submission_df.columns = ["SOURCE", "TARGET", "WEIGHT"]
        submission_df["SOURCE"] = submission_df["SOURCE"].astype(str).str.upper()
        submission_df["TARGET"] = submission_df["TARGET"].astype(str).str.upper()
        submission_df["WEIGHT"] = pd.to_numeric(submission_df["WEIGHT"])

        zero_weights = submission_df["WEIGHT"] == 0
        submission_df.loc[zero_weights, "WEIGHT"] = np.log(1e-18)
        submission_df.loc[~zero_weights, "WEIGHT"] = np.log(submission_df.loc[~zero_weights, "WEIGHT"])

        # Filter by split if specified
        if custom_split:
            split_value = custom_split.lower()
            ground_truth_df = ground_truth_df[
                ground_truth_df["SPLIT"].str.lower() == split_value
            ]

        return ground_truth_df, submission_df

    def compute_metric(
        self, y_true: pd.DataFrame, y_pred: pd.DataFrame, **kwargs
    ) -> float:
        """Compute pairwise cost.

        Args:
            y_true: Ground truth items
            y_pred: Recommendations

        Returns:
            float: Pairwise cost score
        """
        return metrics.pairwise_cost(y_true, y_pred)

    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        return {}


@EvaluatorRegistry.register
class DeepfundingEvaluator(BaseEvaluator):
    """Evaluator for deepfunding metric."""

    def __init__(self):
        """Initialize the evaluator."""
        super().__init__(name="deepfunding", description="Deepfunding optimization")

    def read_data(
        self, ground_truth_path: str, submission_path: str
    ) -> Tuple[pd.DataFrame, List[pd.DataFrame]]:
        logger.debug(f"Loading ground truth data from {ground_truth_path}")
        ground_truth_df = pd.read_csv(ground_truth_path)
        logger.debug(f"Ground truth shape: {ground_truth_df.shape}")

        logger.debug(f"Loading submissions from {submission_path}")
        all_submissions = pd.read_csv(submission_path)
        submissions = []
        for sub in all_submissions.iloc[:, 0]:
            submission_df = pd.read_csv(sub.strip())
            submissions.append(submission_df)
        logger.debug(f"Number of submissions: {len(submissions)}")

        return ground_truth_df, submissions

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_dfs: List[pd.DataFrame],
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe with paths to multiple submission files
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        # If custom_split is specified, validate split column
        if custom_split:
            validators.validate_split_column(ground_truth_df, custom_split)

        return True

    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_dfs: List[pd.DataFrame],
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[pd.DataFrame, List[pd.DataFrame]]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe with paths to multiple submission files
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) where y_pred is a list of dataframes
        """
        # Standardize column names
        cols = ["SOURCE_A", "SOURCE_B", "TARGET", "B_OVER_A"]
        if custom_split:
            cols.append("SPLIT")
        ground_truth_df.columns = cols
        ground_truth_df["SOURCE_A"] = (
            ground_truth_df["SOURCE_A"].astype(str).str.upper()
        )
        ground_truth_df["SOURCE_B"] = (
            ground_truth_df["SOURCE_B"].astype(str).str.upper()
        )
        ground_truth_df["TARGET"] = ground_truth_df["TARGET"].astype(str).str.upper()
        ground_truth_df["B_OVER_A"] = pd.to_numeric(ground_truth_df["B_OVER_A"])

        # Filter out originality scores
        # ground_truth_df = ground_truth_df[ground_truth_df["TARGET"] != "ORIGINALITY"]

        # Filter by split if specified
        if custom_split:
            split_value = custom_split.lower()
            ground_truth_df = ground_truth_df[
                ground_truth_df["SPLIT"].str.lower() == split_value
            ]
            logger.debug(f"Ground truth filtered to {split_value} split, new shape: {ground_truth_df.shape}")

        source_target = pd.concat(
            [
                ground_truth_df[["SOURCE_A", "TARGET"]].rename(
                    columns={"SOURCE_A": "SOURCE"}
                ),
                ground_truth_df[["SOURCE_B", "TARGET"]].rename(
                    columns={"SOURCE_B": "SOURCE"}
                ),
            ],
            axis=0,
        )
        source_target = source_target.drop_duplicates()

        # Load all submissions from their paths
        submissions = []
        for sub_df in submission_dfs:
            sub_df.columns = ["SOURCE", "TARGET", "WEIGHT"]
            sub_df["SOURCE"] = sub_df["SOURCE"].astype(str).str.upper()
            sub_df["TARGET"] = sub_df["TARGET"].astype(str).str.upper()
            sub_df["WEIGHT"] = pd.to_numeric(sub_df["WEIGHT"])
            sub_df = source_target.merge(sub_df, on=["SOURCE", "TARGET"], how="left")
            # Log-transform weights
            zero_weights = sub_df["WEIGHT"] == 0
            sub_df.loc[zero_weights, "WEIGHT"] = np.log(1e-18)
            sub_df.loc[~zero_weights, "WEIGHT"] = np.log(
                sub_df.loc[~zero_weights, "WEIGHT"]
            )
            sub_df.sort_values(by=["TARGET", "SOURCE"], inplace=True)
            submissions.append(sub_df)

        return ground_truth_df, submissions

    def compute_metric(
        self, y_true: pd.DataFrame, y_pred: List[pd.DataFrame], **kwargs
    ) -> float:
        """Compute optimal linear combination of weights.

        Args:
            y_true: Ground truth judgement between every pair of projects
            y_pred: List of dataframes where each dataframe contains one submission of weights

        Returns:
            float: Weights for the optimal linear combination of the submissions
        """
        return metrics.deepfunding(y_true, y_pred)

    def get_default_params(self) -> Dict[str, Any]:
        """Get default parameters for the metric.

        Returns:
            Dict[str, Any]: Default parameters for the metric
        """
        return {}


@EvaluatorRegistry.register
class GitcoinEvaluator(RMSEEvaluator):
    """Evaluator for root mean squared error metric."""

    def __init__(self):
        """Initialize the evaluator."""
        self.name = "gitcoin"
        self.description = "Evaluator for Gitcoin funding prediction"

    def read_data(
        self, ground_truth_path: str, submission_path: str
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Load ground truth and submission data.

        Args:
            ground_truth_path: Path to ground truth file
            submission_path: Path to submission file

        Returns:
            Tuple of (ground_truth_df, submission_df)
        """
        # Load ground truth data
        if ground_truth_path.endswith("parquet"):
            ground_truth_df = pd.read_parquet(ground_truth_path)
        elif ground_truth_path.endswith("csv"):
            ground_truth_df = pd.read_csv(ground_truth_path)
        else:
            raise ValueError(
                f"Unsupported file type for ground truth: {ground_truth_path}"
            )
        logger.debug(f"Ground truth shape: {ground_truth_df.shape}")

        # Load submission data
        submission_df = pd.read_csv(submission_path)
        if submission_df["ROUND"].str.contains("ACY").any().item():
            logger.warning("Submission is encoded with utf-7")
            submission_df = pd.read_csv(submission_path, encoding="utf-7")
        logger.debug(f"Submission shape: {submission_df.shape}")

        return ground_truth_df, submission_df

    def clean_alphanumeric(self, text: str) -> str:
        """
        Keeps only English letters and numbers in a string.
        
        Args:
            text (str): The input string to clean
            
        Returns:
            str: String containing only alphanumeric characters
        """     
        text = text.encode("ascii", "ignore").decode("ascii")
        return ''.join(char for char in text if char.isalnum())

    def validate(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        custom_split: Optional[str] = None,
    ) -> bool:
        """Validate input data.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            bool: True if validation passes

        Raises:
            ValueError: If validation fails
        """
        # Check required columns
        if custom_split:
            validators.validate_split_column(ground_truth_df, custom_split)

        expected_cols = ["PROJECT_ID", "PROJECT", "ROUND", "AMOUNT"]
        if submission_df.shape[1] == 4:
            validators.validate_column_names(
                submission_df, expected_cols, ignore_case=True
            )
            submission_df.columns = expected_cols
        else:
            validators.validate_column_names(
                submission_df, expected_cols[1:], ignore_case=True
            )
            submission_df.columns = expected_cols[1:]
        # Check for duplicate addresses in submission
        submission_df.drop_duplicates(inplace=True)
        validators.validate_no_duplicates(submission_df, columns=["PROJECT", "ROUND"])

        # Check if all projects are included
        project_df = pd.read_csv("projects_Apr_1.csv", usecols=["PROJECT", "ROUND"])
        project_df["PROJECT"] = project_df["PROJECT"].apply(self.clean_alphanumeric).str.upper()
        project_df["ROUND"] = project_df["ROUND"].apply(self.clean_alphanumeric).str.upper()
        submission_df["PROJECT"] = submission_df["PROJECT"].apply(self.clean_alphanumeric).str.upper()
        submission_df["ROUND"] = submission_df["ROUND"].apply(self.clean_alphanumeric).str.upper()
        project_df = project_df.merge(submission_df, on=["PROJECT", "ROUND"], how="left")
        if project_df["AMOUNT"].isnull().any():
            raise ValueError("Not all projects are included in the submission")
        
        return True

    def transform(
        self,
        ground_truth_df: pd.DataFrame,
        submission_df: pd.DataFrame,
        data_portion: float = 1.0,
        after_split: bool = False,
        custom_split: Optional[str] = None,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Transform input data for metric computation.

        Args:
            ground_truth_df: Ground truth dataframe
            submission_df: Submission dataframe
            data_portion: Portion of data to use (between 0 and 1)
            after_split: If True, use remaining portion after split point
            custom_split: Optional split type ('public' or 'private') to filter data

        Returns:
            Tuple of (y_true, y_pred) as numpy arrays
        """
        if after_split and data_portion >= 1:
            raise ValueError(
                "data_portion must be less than 1 when after_split is enabled"
            )
        if not 0 < data_portion <= 1:
            raise ValueError("data_portion must be between 0 and 1")

        # Round name to ID mapping
        round_df = pd.DataFrame({
            "ROUND": ["WEB3INFRA", "DEVTOOLING", "DAPPSAPPS"],
            "ROUND_ID": ["865", "863", "867"]})
        submission_df["ROUND"] = submission_df["ROUND"].apply(self.clean_alphanumeric).str.upper()
        submission_df = submission_df.merge(round_df, on="ROUND")

        # project name to ID mapping
        if "PROJECT_ID" not in submission_df.columns:
            project_df = pd.read_csv("projects_Apr_1.csv", usecols=["PROJECT_ID", "PROJECT"])
            project_df.drop_duplicates(inplace=True)
            project_df["PROJECT"] = project_df["PROJECT"].apply(self.clean_alphanumeric).str.upper()
            submission_df["PROJECT"] = submission_df["PROJECT"].apply(self.clean_alphanumeric).str.upper()
            submission_df = submission_df.merge(project_df, on="PROJECT")

        # Group by PROJECT_ID and ROUND_ID and normalize amounts within each group
        submission_df["AMOUNT"] = pd.to_numeric(submission_df["AMOUNT"])
        submission_df_grouped = submission_df.groupby("ROUND_ID")
        submission_df["PRED"] = submission_df_grouped["AMOUNT"].transform(
            lambda x: x / x.sum() if x.sum() > 0 else 0
        )

        ground_truth_df["AMOUNT2"] = pd.to_numeric(ground_truth_df["AMOUNT"])
        ground_truth_df["ROUND_ID"] = ground_truth_df["ROUND_ID"].astype(str)
        ground_truth_df = submission_df.merge(ground_truth_df, on=["PROJECT_ID", "ROUND_ID"], how="left")
        ground_truth_df.fillna(0, inplace=True)
        ground_truth_df_grouped = ground_truth_df.groupby("ROUND_ID")
        ground_truth_df["LABEL"] = ground_truth_df_grouped["AMOUNT2"].transform(
            lambda x: x / x.sum() if x.sum() > 0 else 0
        )

        # Extract arrays
        y_true = ground_truth_df["LABEL"].values
        y_pred = ground_truth_df["PRED"].values

        return y_true, y_pred

