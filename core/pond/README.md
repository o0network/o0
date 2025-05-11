# Competition Evaluation

A Python package for evaluating competition submissions.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Set up environment variables by copying `.env.example` to `.env` and filling in your credentials if you want to use AWS S3:
```bash
cp .env.example .env
# Edit .env with your database and AWS credentials
```

## Usage

The `evaluate.py` script compares predictions against ground truth using various metrics:

```bash
python evaluate.py <ground_truth_file> <submission_file> <metric> [--data-portion PORTION] [--after-split] [--custom-split SPLIT_TYPE] [additional metric-specific arguments]
```

Arguments:
- `ground_truth_file`: Path to ground truth parquet or csv file. Can be local path or S3 URL.
- `submission_file`: Path to submission CSV file. Can be local path or S3 URL.
- `metric`: Metric to compute (see Available Metrics below)
- `--data-portion`: Portion of ground truth data to use (float between 0 and 1, default: 1.0)
- `--after-split`: If set, use remaining (1-portion) of data after the split point
- `--custom-split`: Customized split ('public' or 'private') of ground truth data to use for evaluation. Cannot be used with `--data-portion`. If None, no split is applied. Default: None
- `--skip-column-check`: Deprecated. Column checks are now implemented in the evaluators. Kept for backward compatibility.
- Additional metric-specific arguments can be passed in either `--key=value` or `--key value` format

Available metrics:
- `accuracy`: Classification accuracy
- `rmse`: Root mean squared error
- `wmse`: Weighted mean squared error (weighted by absolute ground truth value)
- `precision_at_k`: Precision at k for ranking tasks
- `dcg`: Discounted Cumulative Gain for ranking tasks (evaluates both the rank position and relevance of recommendations)
- `auc`: Area Under the Curve for binary classification tasks
- `mse`: Mean squared error
- `pairwise_cost`: Evaluates pairwise preferences between items. Ground truth should contain columns SOURCE_A, SOURCE_B, TARGET, and B_OVER_A (indicating how much B is preferred over A). Submission should contain SOURCE, TARGET, and WEIGHT columns. The metric computes how well the predicted weights match the ground truth preferences.
- `deepfunding`: Optimizes weights for combining multiple submissions to minimize pairwise preference costs. Ground truth format is the same as `pairwise_cost`. Instead of a single submission file, takes a text file containing paths to multiple submission files, each following the same format as `pairwise_cost` submissions. Returns optimized weights that minimize the overall cost when combining predictions from all submissions.
- `gitcoin`: Evaluates predictions for Gitcoin funding distribution. Ground truth should contain columns PROJECT_ID, ROUND_ID, and AMOUNT. Submission should contain PROJECT, ROUND, and AMOUNT columns (PROJECT_ID is optional). The metric normalizes funding amounts within each round and computes RMSE between predicted and actual normalized distributions.

Example:
```bash
# Evaluate using all data
python evaluate.py data/123_ground_truth.parquet data/123_1_dev1.csv rmse

# Evaluate using first 75% of data
python evaluate.py data/123_ground_truth.parquet data/123_1_dev1.csv rmse --data-portion 0.75

# Evaluate using remaining 25% of data after 75% split point
python evaluate.py data/123_ground_truth.parquet data/123_1_dev1.csv rmse --data-portion 0.75 --after-split

# Evaluate using public split
python evaluate.py data/123_ground_truth.parquet data/123_1_dev1.csv rmse --custom-split public

# Evaluate precision at k with custom k value
python evaluate.py data/123_ground_truth.parquet data/123_1_dev1.csv precision_at_k --topk=10

# Evaluate pairwise preferences
python evaluate.py data/pairwise_ground_truth.parquet data/pairwise_submission.csv pairwise_cost

# Optimize weights for combining multiple submissions
python evaluate.py data/pairwise_ground_truth.parquet data/submission_paths.csv deepfunding

# Evaluate Gitcoin funding predictions
python evaluate.py data/gitcoin_ground_truth.parquet data/gitcoin_submission.csv gitcoin
```

Example pairwise ground truth format:
```csv
SOURCE_A,SOURCE_B,TARGET,B_OVER_A
src1,src2,quality,1.5
src2,src3,quality,0.8
src1,src3,originality,2.0
```

Example pairwise submission format:
```csv
SOURCE,TARGET,WEIGHT
src1,quality,3.0
src2,quality,4.5
src3,quality,3.6
src1,originality,2.0
src3,originality,4.0
```

Example submission paths file format for deepfunding metric:
```csv
path
/path/to/submission1.csv
/path/to/submission2.csv
/path/to/submission3.csv
```
Each submission file should follow the pairwise submission format above. The submission paths file must be a CSV file with a 'path' column containing the paths to each submission file.

Example Gitcoin ground truth format:
```csv
PROJECT_ID,ROUND_ID,AMOUNT
123,865,1000
456,865,2000
789,863,1500
```

Example Gitcoin submission format:
```csv
PROJECT,ROUND,AMOUNT
Project A,WEB3 INFRA,900
Project B,WEB3 INFRA,2100
Project C,DEV TOOLING,1600
```
The evaluator normalizes amounts within each round to calculate the funding distribution percentages, then computes RMSE between predicted and actual distributions. The evaluator requires a `projects_Apr_1.csv` file with PROJECT_ID and PROJECT columns for mapping if PROJECT_ID is not provided in the submission.

Output:

Evaluation results are printed to the console in the following format:

- If submission is valid: 
  ```json
  Final result: {"submission_url": "s3://submissions/123_1_dev1.csv", "status": 200, "error_reason": "", "final_result": 0.996}
  ```

- If submission is invalid:
  ```json
  Final result: {"submission_url": "s3://submissions/123_1_dev1.csv", "status": 400, "error_reason": "Input arrays cannot contain missing values (NaN)", "final_result": ""}
  ```

## Development

### Project Organization

The project is organized into several key modules:

- **metrics.py**: Contains the mathematical functions for calculating metrics. These are the core algorithms that perform the actual metric calculations.

- **evaluators.py**: Contains evaluator classes that wrap around the math metrics. Evaluators handle data loading, validation, and transformation before applying the metric calculations. Even for the same mathematical metric, there could be different evaluators depending on how the data needs to be transformed. Evaluators are the "metrics" used in competitions.

- **evaluate.py**: The main script that processes command-line arguments and calls the appropriate evaluator.

- **validators.py**: Contains validation functions used by evaluators to ensure data integrity.

Parameters for metrics are passed as extra arguments in the command line. The evaluator parses these arguments and passes them to the metric calculation functions. Arguments can be specified in either `--key=value` or `--key value` format.

### General Procedure
1. Create a new branch for your changes
2. Make changes and add new tests into the `tests/` directory. `Pytest` is used for testing.
3. Run `pytest tests/` to make sure all tests are passing
4. Commit changes
5. Push changes to GitHub
6. Create a pull request
7. Request a review from a code reviewer
8. Merge the pull request once review is complete

### Running Tests
```bash
pytest tests/
```

### Adding New Metrics
1. Add the mathematical metric function to `metrics.py`
2. Create a new evaluator class in `evaluators.py` that extends `BaseEvaluator`
3. Implement the required methods in your evaluator:
   - `transform()`: Prepare the data for metric calculation
   - `compute_metric()`: Apply the metric calculation
   - `get_default_params()`: Define default parameters
   - `validate()`: (Optional) Overwrite the default validation logic in the BaseEvaluator class
   - `read_data()`: (Optional) Overwrite the default data reading logic in the BaseEvaluator class
4. Register your evaluator in the `EvaluatorRegistry`
5. Add corresponding unit tests in `tests/test_metrics.py` and `tests/test_evaluators.py`



