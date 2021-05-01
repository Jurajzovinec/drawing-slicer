import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { uploadFileToAwsS3Message } from './types/awsResponseObjects';

dotenv.config();

export default function uploadFileToAWS(file: any): Promise<(uploadFileToAwsS3Message)> {

    return new Promise(async (resolve, reject) => {

        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });


        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.name,
                Body: file.data
            };
            s3bucket.upload(params as PutObjectRequest, (err: any, data: any) => {
                if (err) {

                    reject(
                        {
                            status: `FAILED`,
                            error: `${err}`,
                            uploadedFile: file.name
                        }
                    );
                }

                resolve(
                    {
                        status: 'OK',
                        uploadedFile: file.name
                    }
                );
            });
        });
    });

};
