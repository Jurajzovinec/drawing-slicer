# Initialize pythonServices virtual python_modules (Windows)

1. Create python venv in this folder with *python -m venv python_modules* command
2. Activate venv with >*. python_modules\Scripts\activate* command
3. Install external packages with *pip install -r requirements.txt* command
4. Set path to interpreter at config.js file

Alternatively put this sequence into cmd.
python -m venv python_modules && python_modules\Scripts\activate && pip install -r requirements.txt