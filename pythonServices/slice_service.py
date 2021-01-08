from application_library.pdf_slicer_lib import *

input_drawing_file = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_1.pdf', "rb")

# input_drawing_file = open('VykresA1_1.pdf', "rb")b n
# treba sa naucit kwarqs a args

def slice_service(input_drawing_file, slice_to_format, **kwargs):

    return pdf_object = PdfSlicer(input_drawing_file, slice_to_format=slice_to_format, kwargs)

