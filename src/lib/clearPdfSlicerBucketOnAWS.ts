import AWS from 'aws-sdk';
import { DeleteObjectRequest } from 'aws-sdk/clients/clouddirectory';
import { DeleteObjectsRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import APIObjectAWS from '../types/APIObjectAWS';
// import APIObjectAWSListOutputClearInput from '../types/APIObjectAWSListOutputClearInput';

dotenv.config();

export default function clearPdfSlicerBucketOnAWS(filesOnBucket: object[]): Promise<{ status: string, error?: string }> {
    return new Promise(async (resolve, reject) => {

        if (filesOnBucket.length === 0) {
            resolve({
                status: `OK`
            });
        }

        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Delete: { Objects: filesOnBucket } 
            };
            s3bucket.deleteObjects(params as DeleteObjectsRequest, (err: any, data: any) => {
                if (err) {
                    reject({
                        status: `Error occured while clearing files on ${process.env.AWS_BUCKET_NAME}`,
                        error: err
                    });
                }
                resolve({
                    status: `OK`
                });
            });
        });
    });

}