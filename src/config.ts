import path from 'path';

interface configVariablesInterface {
    PYTHON_INTERPRETER_PATH: string;
    PYTHON_SLICE_SERVICE_PATH: string;
    PYTHON_INPUT_TEST_SERVICE_PATH: string;
}

const config: configVariablesInterface = {
    PYTHON_INTERPRETER_PATH: (process.env.NODE_ENV === 'production') ?
        'python' : (path.resolve(process.cwd(), 'python_modules/Scripts/python')),
    PYTHON_SLICE_SERVICE_PATH: (path.resolve(process.cwd(), 'python_services/service_slice_file.py')),
    PYTHON_INPUT_TEST_SERVICE_PATH: (path.resolve(process.cwd(), 'python_services/service_validate_file.py'))
}

export default config;

