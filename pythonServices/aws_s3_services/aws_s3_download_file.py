import PyPDF2
import os
import dotenv
import sys
import io
from boto3.session import Session
from dotenv import load_dotenv

load_dotenv()

def download_from_aws_s3(filename):
    try:
        file_stream = io.BytesIO()
        session = Session(aws_access_key_id=os.getenv('AWS_ACCESS_KEY'), aws_secret_access_key=os.getenv('AWS_SECRET_KEY'))
        s3 = session.resource('s3')
        bucket = os.getenv('AWS_BUCKET_NAME')
        my_bucket = s3.Bucket(bucket)
        my_bucket.download_fileobj(filename, file_stream)

    except Exception as error:
        raise error
        # print(str(error), flush=True)
        # exit(1)
    else:
        return { "file_stream":file_stream, "filename":filename }

# download_from_aws_s3("EngineeringDrawing.pdf")   


