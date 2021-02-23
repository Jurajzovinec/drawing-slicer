interface configVariablesInterface {
    BACKEND_SERVER: string
}

const config: configVariablesInterface = {
    BACKEND_SERVER: (process.env.NODE_ENV === 'production') ? "https://drawing-slicer.herokuapp.com/":"http://localhost:5050/" 
}

export default config;

