import config from '../config';
import SliceDrawingParameters from '../types/sliceDrawingParameters';

export default function getSlicePdfFile (args: SliceDrawingParameters){

    console.log("...askingForSlicedPdfFile...");

    return new Promise((resolve, reject) => {
        const urlToFetch = `${config.BACKEND_SERVER}//slice/${args}`
        fetch(urlToFetch)
        .then(resolve)
        .catch(reject)
    })


}