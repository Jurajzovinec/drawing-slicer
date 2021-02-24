from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
import sys

def init_arguments():
    
    try:
        input_file = download_from_aws_s3(sys.argv[1])['file_stream']
        slice_by_format = "none"
        scale_to_format = "none"
    except Exception as error:
        raise error
    else:
        return {
                "input_file":input_file, 
                "slice_by_format":slice_by_format,
                "scale_to_format": scale_to_format,
                "filename": sys.argv[1]
                }

def main():

    try:
        pdf_object = PdfSlicer(**init_arguments())
    except Exception as error:
        raise error
    else:
        print({'Status':'OK'}, flush=True)        
        print({'NumberOfPages':pdf_object.number_of_pages}, flush=True)        
        print({'DrawingFormat':pdf_object.input_drawing_format['drawing_format']}, flush=True)
        print({'Filename':sys.argv[1]}, flush=True)

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print({'Status':'Failed'}, flush=True)
        print({'Error':str(error)}, flush=True)
        exit(1)


    