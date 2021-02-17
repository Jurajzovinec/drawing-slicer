import AWS from 'aws-sdk';
import config from '../config';

interface OutputMessage {
    status : string,
    uploadedFile: string
}

export default function uploadFileToAWS(file: any): Promise<(OutputMessage)>  {
    return new Promise(async (resolve, reject) => {
        let s3bucket = new AWS.S3({
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY
        });
        s3bucket.createBucket(() => {
            var params = {
                Bucket: config.AWS_BUCKET_NAME,
                Key: file.name,
                Body: file.data
            };
            s3bucket.upload(params, (err: any, data: any) => {
                if (err) {
                    console.log('error in callback');
                    reject({
                        status: `Error occured while uploading ${file.name} to S3: ${err}.`,
                        uploadedFile: file.name
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