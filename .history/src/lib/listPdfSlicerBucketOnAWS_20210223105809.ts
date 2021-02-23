import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();



export default function listPdfSlicerBucketOnAWS(): Promise<object>  {
    return new Promise(async (resolve, reject) => {
        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
            };
            s3bucket.listObjects(params, (err: any, data: any) => {
                if (err) {
                    reject({
                        status: `Error occured while listing files on S3: ${err}.`,
                    });
                } else {
                    let outputListOfFiles:string[] = []
                    data.Contents.map(fileDetails =>{
                        outputListOfFiles.push(fileDetails.Key)
                    })
                    resolve({
                        status: `OK`,
                        filesOnBucket: outputListOfFiles
                    });
                }
            });
        });
    });

}