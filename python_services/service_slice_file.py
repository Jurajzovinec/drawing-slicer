from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
from aws_s3_services.aws_s3_upload_file import *
import sys

def init_arguments():
    
    try:

        input_file = download_from_aws_s3(sys.argv[1])
        scale_to_format = sys.argv[2]
        slice_by_format = sys.argv[3]
        
    except Exception as error:
        raise error
    else:
        return {
                "input_file":input_file['file_stream'], 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format,
                "filename": input_file['filename']
                }

def main():
    
    try:
        pdf_object = PdfSlicer(**init_arguments())
        result_pdf_object = pdf_object.main_run()
        upload_to_aws_s3(result_pdf_object)
    except Exception as error:
        raise error
    else:
        print({'Status':'OK'}, flush=True)        
        print({'ResultPdfName':result_pdf_object['filename']}, flush=True)        

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print({'Status':'Failed'}, flush=True)
        print({'Error':str(error)}, flush=True)
        exit(1)
    
    
    

