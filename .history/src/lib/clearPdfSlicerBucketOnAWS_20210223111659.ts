import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import ListClearFilesOnS3 from '../types/listClearFilesOnS3';

dotenv.config();

export default function uploadFileToAWS(filesOnBucket:object[]) {
    return new Promise(async (resolve, reject) => {
        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        
        
        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: { Objects: filesOnBucket }
            };
            s3bucket.deleteObjects(params, (err: any, data: any) => {
                if (err) {
                    reject({
                        status: `Error occured while clearing files on ${process.env.AWS_BUCKET_NAME}`,
                        error: err
                    });
                }
                resolve({
                    status: `Data has been sucessfully deleted from ${process.env.AWS_BUCKET_NAME}.`,
                    data: data
                });
            });
        });
    });

}