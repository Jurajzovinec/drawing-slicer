import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import ListClearFilesOnS3 from '../types/listClearFilesOnS3';

dotenv.config();

export default function listPdfSlicerBucketOnAWS(): Promise<ListClearFilesOnS3>  {
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
                        status: `Error occured while listing files on bucket ${process.env.AWS_BUCKET_NAME}`,
                        error: err
                    });
                } else {
                    let outputListOfFiles:object[] = []
                    data.Contents.map(fileDetails =>{
                        outputListOfFiles.push({Key: fileDetails.Key})
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