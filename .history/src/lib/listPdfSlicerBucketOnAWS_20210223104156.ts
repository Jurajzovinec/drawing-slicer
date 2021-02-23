import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();



export default function listPdfSlicerBucketOnAWS(file: any): Promise<any>  {
    return new Promise(async (resolve, reject) => {
        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.name,
            };
            s3bucket.listObjects(params, (err: any, data: any) => {
                if (err) {
                    reject({
                        status: `Error occured while uploading ${file.name} to S3: ${err}.`,
                        uploadedFile: file.name
                    });
                }
                resolve({
                    status: `Data ${file.name} has been succesfully uploaded to S3.`,
                    uploadedFile: file.name,
                    data: data
                });
            });
        });
    });

}