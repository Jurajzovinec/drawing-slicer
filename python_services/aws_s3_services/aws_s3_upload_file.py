import os
from boto3.session import Session
from dotenv import load_dotenv


def upload_to_aws_s3(file_object):

    load_dotenv()

    file_stream = file_object['file_stream']
    file_name = file_object['filename']

    session = Session(aws_access_key_id=os.getenv(
        'AWS_ACCESS_KEY'), aws_secret_access_key=os.getenv('AWS_SECRET_KEY'))
    s3 = session.resource('s3')
    bucket = os.getenv('AWS_BUCKET_NAME')
    my_bucket = s3.Bucket(bucket)

    file_stream.seek(0)
    my_bucket.upload_fileobj(file_stream, file_name)

    return {"file_stream": file_stream, "filename": file_name}

# upload_to_aws_s3(download_from_aws_s3("EngineeringDrawing.pdf"))
