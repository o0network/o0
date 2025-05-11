#!/usr/bin/env python3
"""
Main evaluation script for comparing predictions against ground truth.
"""

import argparse
import json
import logging
import os

from dotenv import load_dotenv
from evaluators import EvaluatorRegistry


# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluate predictions against ground truth."
    )
    parser.add_argument(
        "ground_truth_path", help="Path to ground truth parquet or CSV file"
    )
    parser.add_argument("submission_path", help="Path to submission CSV file")
    parser.add_argument(
        "metric_name",
        help=f"Metric to compute. Available metrics: {EvaluatorRegistry.list_evaluator_names()}",
    )
    parser.add_argument(
        "--data-portion",
        type=float,
        default=1.0,
        help="Portion of ground truth data to use for evaluation (between 0 and 1)",
    )
    parser.add_argument(
        "--after-split",
        action="store_true",
        help="If true, use remaining (1-data_portion) of data after the split point instead of the first data_portion",
    )
    parser.add_argument(
        "--custom-split",
        type=str,
        choices=['public', 'private'],
        help="Filter data by split type (public or private)",
    )
    parser.add_argument(
        "--skip-column-check",
        action="store_true",
        help="Deprecated. Column checks are implemented in the evaluators. The argument is kept for backward compatibility.",
    )
    args, extra_args = parser.parse_known_args()
    # Convert extra_args to a dictionary
    extra_args_dict = {}
    for arg in extra_args:
        if "=" in arg:
            # Handle key=value format
            key, value = arg.split("=", 1)
            key = key.lstrip("-")
            extra_args_dict[key] = value
        elif arg.startswith("--") and len(extra_args) > extra_args.index(arg) + 1:
            # Handle --key value format
            key = arg.lstrip("-")
            value = extra_args[extra_args.index(arg) + 1]
            if not value.startswith("--"):
                extra_args_dict[key] = value
            else:
                # Handle flags (arguments with no values)
                extra_args_dict[key] = True
        elif arg.startswith("--"):
            # Handle flags (arguments with no values)
            key = arg.lstrip("-")
            extra_args_dict[key] = True

    # Validate arguments
    if args.data_portion != 1.0 and args.custom_split is not None:
        parser.error("--data-portion and --custom-split cannot be used together")

    if args.after_split and args.data_portion >= 1:
        raise ValueError(
            "data-portion must be less than 1 when --after-split is enabled"
        )
    
    if not 0 < args.data_portion <= 1:
        raise ValueError("data-portion must be between 0 and 1")

    # Load environment variables
    if not load_dotenv():
        logger.warning("No .env file found.")
    required_vars = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        logger.warning(f"Missing environment variables: {missing_vars}. Will not be able to read from AWS S3.")

    try:
        logger.info("Starting evaluation")

        logger.info(f"Metric: {args.metric_name}")
        if args.metric_name not in EvaluatorRegistry.list_evaluator_names():
            raise ValueError(
                f"Unknown metric: {args.metric_name}. "
                f"Available metrics: {EvaluatorRegistry.list_evaluator_names()}"
            )
        evaluator = EvaluatorRegistry.get_evaluator(args.metric_name)
        score = evaluator.evalute(
            args.ground_truth_path, args.submission_path, args.data_portion, args.after_split, args.custom_split, **extra_args_dict
        )
        logger.info(f"Score: {score}")
        logger.info("Evaluation completed successfully")

        ret = {
            "submission_url": args.submission_path,
            "status": 200,
            "error_reason": "",
            "final_result": score,
        }
        print("Final result: " + json.dumps(ret))
        exit(0)
    except Exception as e:
        logger.error(f"Error during evaluation: {str(e)}")
        ret = {
            "submission_url": args.submission_path,
            "status": 400,
            "error_reason": str(e),
            "final_result": "",
        }
        print("Final result: " + json.dumps(ret))
        exit(1)


if __name__ == "__main__":
    main()
