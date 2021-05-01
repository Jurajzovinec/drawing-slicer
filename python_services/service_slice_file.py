from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
from aws_s3_services.aws_s3_upload_file import *
import sys
import json


def init_arguments():
    
    
    input_file = download_from_aws_s3(sys.argv[1])
    
    if sys.argv[2]!='None':
        slice_by_format = sys.argv[2]
    else:
        slice_by_format=None
    
    if sys.argv[3]!='None':
        scale_to_format = sys.argv[3]
    else:
        scale_to_format=None
    
    return {
        "input_file": input_file['file_stream'],
        "slice_by_format": slice_by_format,
        "scale_to_format": scale_to_format,
        "filename": input_file['filename']
    }


def main():

    pdf_object = PdfSlicer(**init_arguments())
    result_pdf_object = pdf_object.main_run()
    upload_to_aws_s3(result_pdf_object)

    result = {
        'status': 'OK',
        'uploadedFileName': result_pdf_object['filename']
    }

    return result


if __name__ == "__main__":

    try:
        
        result = main()

    except Exception as error:

        result = {
            'Status': 'FAILED',
            'Error': str(error)
        }

        print(json.dumps(result))
        exit(1)
        # raise error
    else:

        print(json.dumps(result))
