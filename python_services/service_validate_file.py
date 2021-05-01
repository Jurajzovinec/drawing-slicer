from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
import sys
import json


def init_arguments():

    input_file = download_from_aws_s3(sys.argv[1])['file_stream'] 
    slice_by_format = None
    scale_to_format = None

    return {
        "input_file": input_file,
        "slice_by_format": slice_by_format,
        "scale_to_format": scale_to_format,
        "filename": sys.argv[1]
    }


def main():

    pdf_object = PdfSlicer(**init_arguments())

    return pdf_object.validate()


if __name__ == "__main__":

    try:
        result = main()
    except Exception as error:

        result = {
            'status': 'FAILED',
            'error': str(error)
        }

        print(json.dumps(result))
        exit(1)

    else:
        print(json.dumps(result))
