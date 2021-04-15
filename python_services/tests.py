import unittest
import io
import os
import glob
from application_library.pdf_slicer_exceptions import *
from application_library.pdf_slicer_lib import *

#       TTTTT   EEEE    SS  TTTTT
#         T     E      S      T  
#         T     EEE     S     T
#         T     E        S    T
#         T     EEEE   SS     T


# init testing with commands cd python_services && python tests.py
# before testing change at pdf_slicer_lib.py line 251

# this:
#       testing = False
# to this:
#       testing = True


def declare_files():
    
    global standard_a1_drawing, a4_standard, a4_multipage, non_iso_drawing, multipage_drawing, drawing_with_spacebar, hebrew_file, greek_file,invalid_file_type, map_drawing, building_drawing_1, cv_file

    a1_multipage = 'unit_test_input_files\\A1_Multipage.pdf'
    a4_multipage = 'unit_test_input_files\\A4_Multipage.pdf'
    a4_standard = 'unit_test_input_files\\A4_Standard.pdf'
    non_iso_drawing = 'unit_test_input_files\\NonIsoDrawing.pdf'
    multipage_drawing = 'unit_test_input_files\\MultipageExample.pdf'
    drawing_with_spacebar = 'unit_test_input_files\\Name with spacebar.pdf'
    hebrew_file  = 'unit_test_input_files\\קובץ מסמך.pdf'
    greek_file  = 'unit_test_input_files\\Αρχείο εγγράφων.pdf'
    invalid_file_type  = 'unit_test_input_files\\InvalidFileType.pd'
    building_drawing_1  = 'unit_test_input_files\\BuildingDrawing.pdf'
    map_drawing  = 'unit_test_input_files\\MapDrawing.pdf'
    cv_file = 'unit_test_input_files\\CV.pdf'
    

def slice_service(input_drawing_file, slice_by_format, scale_to_format):
    
    pdf_object = PdfSlicer(input_drawing_file, slice_by_format, scale_to_format)
    return pdf_object.main_run()   

class TestSliceService(unittest.TestCase):

    def test_input_files(self):
        
        self.assertRaises(InvalidPdfSizeError, slice_service, non_iso_drawing, "a4", "none")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, a4_standard, "a4", "none")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, a4_standard, "a3", "none")
        self.assertRaises(InvalidInputPdfFile, slice_service, invalid_file_type, "a5", "none")
        self.assertRaises(MultiPageInputPdfError, slice_service, building_drawing_1, "a4", "none")
        self.assertRaises(MultiPageInputPdfError, slice_service, multipage_drawing, "a4", "none")
    
    def test_result_types(self):

        #self.assertIsInstance(slice_service(drawing_with_spacebar, "a5", "none"), str , "Result of the application is not str")
        #self.assertIsInstance(slice_service(hebrew_file, "a5", "none"), str , "Result of the application is not str")
        #self.assertIsInstance(slice_service(greek_file, "a5", "none"), str , "Result of the application is not str")
        #self.assertIsInstance(slice_service(a4_standard, "a5", "none"), str , "Result of the application is not str")
        #self.assertIsInstance(slice_service(map_drawing, "a5", "none"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(cv_file, "a5", "none"), str , "Result of the application is not str")
        
if __name__ == '__main__':
    declare_files()
    unittest.main()