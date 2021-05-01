import unittest
from application_library.pdf_slicer_exceptions import *
from application_library.pdf_slicer_lib import *
from aws_s3_services.aws_s3_download_file import *
from aws_s3_services.aws_s3_upload_file import *

#       TTTTT   EEEE    SS  TTTTT
#         T     E      S      T
#         T     EEE     S     T
#         T     E        S    T
#         T     EEEE   SS     T


# init testing with commands cd python_services && python tests.py

global building_drw, city_area_drw, engineering_drw, fruitfly_drw, hamboard_drw, multipage_drw, non_iso_drw, non_pdf_drw

building_drw = open('unit_test_input_files\\building_drw.pdf', 'rb')
city_area_drw = open('unit_test_input_files\\city_area_drw.pdf', 'rb')
engineering_drw = open('unit_test_input_files\\engineering_drw.pdf', 'rb')
fruitfly_drw = open('unit_test_input_files\\fruitfly_drw.pdf', 'rb')
hamboard_drw = open('unit_test_input_files\\hamboard_drw.pdf', 'rb')
multipage_drw = open('unit_test_input_files\\multipage_drw.pdf', 'rb')
non_iso_drw = open('unit_test_input_files\\non_iso_drw.pdf', 'rb')
non_pdf_drw = open('unit_test_input_files\\non_pdf_drw.pd', 'rb')


def initialize_pdf_object(input_file, slice_by_format=None, scale_to_format=None, filename=None):

    PdfSlicer(
        input_file,
        slice_by_format,
        scale_to_format
    )


def validate_file(input_file, slice_by_format=None, scale_to_format=None, filename=None):

    pdf_object = PdfSlicer(
        input_file,
        slice_by_format,
        scale_to_format
    )

    return pdf_object.validate()


def slice_file(input_file, slice_by_format=None, scale_to_format=None, filename=None):

    pdf_object = PdfSlicer(
        input_file,
        slice_by_format,
        scale_to_format,
        test_mode = True
    )

    return pdf_object.main_run()


class TestSliceService(unittest.TestCase):

    def test_input_files(self):

        self.assertRaises(MultiPageInputPdfError, initialize_pdf_object,
                          multipage_drw)

        self.assertRaises(InvalidPdfSizeError, initialize_pdf_object,
                          non_iso_drw)

        self.assertRaises(InvalidInputPdfFile, initialize_pdf_object,
                          non_pdf_drw)

        self.assertRaises(InvalidSlicingFormat, initialize_pdf_object,
                          fruitfly_drw, slice_by_format='not a0 or a1 or a2 . . . ')

        self.assertRaises(InvalidScalingFormat, initialize_pdf_object,
                          fruitfly_drw, scale_to_format='not a0 or a1 or a2 . . . ')

    def test_validation_files(self):

        self.assertDictEqual({
            'drawingFormat': 'a3',
            'numberOfPages': '1'
        },
            validate_file(fruitfly_drw)
        )

        self.assertDictEqual({
            'drawingFormat': 'a0',
            'numberOfPages': '1'
        },
            validate_file(building_drw)
        )

        self.assertDictEqual({
            'drawingFormat': 'a3',
            'numberOfPages': '1'
        },
            validate_file(engineering_drw)
        )

    def test_execution_files(self):

        self.assertTrue('filename' in slice_file(fruitfly_drw, slice_by_format='a4'))
        
        self.assertTrue('filename' in slice_file(engineering_drw, slice_by_format='a4'))
        
        self.assertTrue('filename' in slice_file(building_drw, slice_by_format='a5'))
        

if __name__ == '__main__':

    unittest.main()

    building_drw.close()
    city_area_drw.close()
    engineering_drw.close()
    fruitfly_drw.close()
    hamboard_drw.close()
    multipage_drw.close()
    non_iso_drw.close()
    non_pdf_drw.close()
