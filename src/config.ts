import path from 'path';

export default {
    PYTHON_INTERPRETER: (path.resolve(process.cwd(), 'pythonServices\\environment\\Scripts\\python')),
    PYTHON_SLICE_SERVICE: (path.resolve(process.cwd(), 'pythonServices\\slice_service.py'))
};

