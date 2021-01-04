import path from 'path';

interface configVariablesInterface {
    PYTHON_INTERPRETER: string;
    PYTHON_SLICE_SERVICE: string;
}

const config: configVariablesInterface = {
    PYTHON_INTERPRETER: (path.resolve(process.cwd(), 'pythonServices\\environment\\Scripts\\python')),
    PYTHON_SLICE_SERVICE: (path.resolve(process.cwd(), 'pythonServices\\slice_service.py'))
}

export default config;

