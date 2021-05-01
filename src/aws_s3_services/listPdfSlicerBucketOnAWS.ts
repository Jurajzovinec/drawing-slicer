import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { listFilesOnBucketAwsS3Message } from './types/awsResponseObjects';

dotenv.config();

export default function listPdfSlicerBucketOnAWS(): Promise<listFilesOnBucketAwsS3Message> {

    return new Promise(async (resolve, reject) => {
        
        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME!,
            };
            s3bucket.listObjects(params, (err: any, data: any) => {

                if (err) {

                    reject({
                        status: `FAILED`,
                        error: err,
                        listedBucket: process.env.AWS_BUCKET_NAME!
                    });

                } else {

                    let outputListOfFiles: object[] = []

                    data.Contents.map((fileDetails: any) => {
                        outputListOfFiles.push({ Key: fileDetails.Key })
                    })

                    resolve({
                        status: `OK`,
                        listedBucket: process.env.AWS_BUCKET_NAME!,
                        filesOnBucket: outputListOfFiles
                    });

                }
            });
        });
    });

}