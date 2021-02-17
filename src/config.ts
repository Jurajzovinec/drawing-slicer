import path from 'path';

// TODO : private data move to .ENV

interface configVariablesInterface {
    PYTHON_INTERPRETER_PATH: string;
    PYTHON_SLICE_SERVICE_PATH: string;
    PYTHON_INPUT_TEST_SERVICE_PATH: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
    AWS_ARN: string;
    AWS_BUCKET_NAME: string;
    NODE_MAILER_ACC: string;
    NODE_MAILER_PASS: string;
    NODE_MAILER_ADMIN_ACC: string
}

const config: configVariablesInterface = {
    PYTHON_INTERPRETER_PATH: (process.env.NODE_ENV === 'production') ?
        '\\usr\\bin\\python' : (path.resolve(process.cwd(), 'python_modules\\Scripts\\python')),
    PYTHON_SLICE_SERVICE_PATH: (path.resolve(process.cwd(), 'pythonServices\\service_slice_file.py')),
    PYTHON_INPUT_TEST_SERVICE_PATH: (path.resolve(process.cwd(), 'pythonServices\\service_validate_file.py')),
    AWS_ACCESS_KEY: 'AKIARIWICTPS5GWWZV4Q',
    AWS_SECRET_KEY: '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',
    AWS_ARN: 'arn:aws:iam::087392689125:user/pdf-slicer-user',
    AWS_BUCKET_NAME: 'pdf-slicer-bucket',
    NODE_MAILER_ACC: 'DrawingSlicerAppSender@outlook.com',
    NODE_MAILER_PASS: 'Hfca9Xyzx6vdCF5',
    NODE_MAILER_ADMIN_ACC: 'juraj.zovinecc@gmail.com'
}


export default config;

