import config from '../config';

export default function getSlicePdfFile (args): void  {

    console.log("...askingForSlicedPdfFile...");

    const urlToFetch = `${config.BACKEND_SERVER}/clearawsbucket/${args}`
    fetch(urlToFetch)

}