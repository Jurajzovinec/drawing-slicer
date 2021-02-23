//
import config from '../config';
import SliceDrawingParameters from '../types/sliceDrawingParameters';

export default function getSlicePdfFile (args: SliceDrawingParameters): Promise<(any)>{

    console.log("...askingForSlicedPdfFile...");

    return new Promise((resolve, reject) => {
        const urlToFetch = `${config.BACKEND_SERVER}//slice/${args}`
        fetch(urlToFetch)
        .then(response=> resolve(response))
        .catch(error=>reject(error))
    })

}