import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

interface OutputMessage {
    status : string,
    uploadedFile: string
}

export default function uploadFileToAWS(filesOnBucket:string[]): Promise<(OutputMessage)>  {
    return new Promise(async (resolve, reject) => {
        const s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        
        const objectDeleteFiles = filesOnBucket.map(key => ({ Key: key }))
        
        s3bucket.createBucket(() => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: { Objects: objectDeleteFiles }
            };
            s3bucket.deleteObjects(params, (err: any, data: any) => {
                if (err) {
                    reject({
                        status: `Error occured while clearing files on ${process.env.AWS_BUCKET_NAME}`,
                        error: err
                    });
                }
                resolve({
                    status: `Data ${file.name} has been succesfully uploaded to S3.`,
                    uploadedFile: file.name
                });
            });
        });
    });

}