import AWS from 'aws-sdk';
import { GetObjectRequest } from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { downloadFileFromAwsS3Message } from './types/awsResponseObjects';

dotenv.config();

export default function downloadFileFromAWS(fileName: string): Promise<downloadFileFromAwsS3Message> {

    return new Promise(async (resolve, reject) => {

        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName
            };

            s3bucket.getObject(params as GetObjectRequest, (err: any, data: any) => {

                if (err) {
                    reject(
                        {
                            status: "FAILED",
                            downloadedFilename: fileName,
                            error: err
                        }
                    )
                }

                resolve(
                    {
                        status: "OK",
                        downloadedFilename: fileName,
                        data: data
                    }
                )
                
            });
        });
    });
}