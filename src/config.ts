import path from 'path';

interface configVariablesInterface {
    PYTHON_INTERPRETER_PATH: string;
    PYTHON_SLICE_SERVICE_PATH: string;
    PYTHON_INPUT_TEST_SERVICE_PATH: string;
}

const config: configVariablesInterface = {
    PYTHON_INTERPRETER_PATH: (process.env.NODE_ENV === 'production') ?
        '\\usr\\bin\\python' : (path.resolve(process.cwd(), 'pythonServices\\environment\\Scripts\\python')),
    PYTHON_SLICE_SERVICE_PATH: (path.resolve(process.cwd(), 'pythonServices\\slice_service.py')),
    PYTHON_INPUT_TEST_SERVICE_PATH: (path.resolve(process.cwd(), 'pythonServices\\input_test_service.py'))
}

export default config;

