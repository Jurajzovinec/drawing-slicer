import unittest
import io
from application_library.pdf_slicer_exceptions import *
from application_library.pdf_slicer_lib import *

#       TTTTT   EEEE    SS  TTTTT
#         T     E      S      T  
#         T     EEE     S     T
#         T     E        S    T
#         T     EEEE   SS     T


# init testing with commands cd pythonServices && python testing_services.py
# before testing change at pdf_slicer_lib.py line 242

# this:
#        # Switch to Random generating name when testing
#        # result_pdf_name = (f"UnitTestOutputFiles/{self.pdf_name_generator()}.pdf")
#        result_pdf_name = self.input_file_name
# to this: 
#        # Switch to Random generating name when testing
#       result_pdf_name = (f"UnitTestOutputFiles/{self.pdf_name_generator()}.pdf")
#        # result_pdf_name = self.input_file_name

def declare_files():
    global standard_a1_drawing, standard_a4_drawing1, standard_a4_drawing2, nonstandard_drawing_size, multipage_drawing, drawing_with_spacebar, hebrew_file, greek_file,invalid_file_type, building_drawing_1, building_drawing_1

    standard_a1_drawing_Multipage = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\VykresA1_1_Multipage.pdf'
    standard_a4_drawing1 = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\VykresA4_1.pdf'
    standard_a4_drawing2 = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\VykresA4_2.pdf'
    nonstandard_drawing_size = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\ANSI_D_INCH.pdf'
    multipage_drawing = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\MultipageExample.pdf'
    drawing_with_spacebar = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\Name with spacebar.pdf'
    hebrew_file  = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\קובץ מסמך.pdf'
    greek_file  = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\Αρχείο εγγράφων.pdf'
    invalid_file_type  = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\InvalidFileType.pd'
    building_drawing_1  = 'C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\UnitTestFiles\\Building_Drawing.pdf'
    

def slice_service(input_drawing_file, slice_by_format, scale_to_format):
    
    pdf_object = PdfSlicer(input_drawing_file, slice_by_format, scale_to_format)
    return pdf_object.main_run()   

class TestSliceService(unittest.TestCase):

    def test_input_files(self):
        
        self.assertRaises(InvalidPdfSizeError, slice_service, nonstandard_drawing_size, "a4", "none")
        self.assertRaises(MultiPageInputPdfError, slice_service, multipage_drawing, "a4", "none")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_a4_drawing2, "a4", "none")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_a4_drawing2, "a3", "none")
        self.assertRaises(InvalidInputPdfFile, slice_service, invalid_file_type, "a5", "none")
    
    def test_result_types(self):

        self.assertIsInstance(slice_service(standard_a4_drawing1, "a5", "none"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(drawing_with_spacebar, "a5", "none"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(standard_a4_drawing1, "a1", "a0"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(hebrew_file, "a5", "none"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(greek_file, "a5", "none"), str , "Result of the application is not str")
        self.assertIsInstance(slice_service(building_drawing_1, "a5", "none"), str , "Result of the application is not str")


if __name__ == '__main__':
    declare_files()
    unittest.main()