import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

export default function downloadFileFromAWS(fileName:string) {
    return new Promise(async (resolve, reject) => {
        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        s3bucket.createBucket(() => {
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName
            };
            s3bucket.getObject(params, (err:any, data:any) => {
                if (err) {
                    reject(`Error occured while uploading ${fileName} to S3: ${err}.`);
                }
                resolve(data);
            });
        });   
    });
}