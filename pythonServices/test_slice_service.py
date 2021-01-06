import unittest
import slice_service
import io

from slice_service import *
from application_library.pdf_slicer_exceptions import *

# check pdf object -> test for PDF object, test for different size, test for strange name (if neccessary implement utf-8)
# <_io.BufferedReader name='C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA1_1.pdf'>
# <class '_io.BufferedReader'>
# invalid input drawing format - test for smaller also

def open_files():
    global standard_A1_drawing1, standard_A4_drawing1, standard_A4_drawing2, irregular_drawing_size, multipage_pdf_example
    standard_A1_drawing1 = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA1_1.pdf', "rb")
    standard_A4_drawing1 = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_1.pdf', "rb")
    standard_A4_drawing2 = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_2.pdf', "rb")
    irregular_drawing_size = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\ANSI_D_INCH.pdf', "rb")
    multipage_pdf_example = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\MultipageExample.pdf', "rb")

def close_files():
    standard_A1_drawing1.close()
    standard_A4_drawing1.close()
    standard_A4_drawing2.close()
    irregular_drawing_size.close()
    multipage_pdf_example.close()

class TestSliceService(unittest.TestCase):

    def test_input_files(self):
        
        open_files()
        self.assertIsInstance(standard_A1_drawing1, io.BufferedReader , "Input drawing is not type of Buffered Reader")
        self.assertRaises(InvalidPdfSizeError, slice_service, irregular_drawing_size, "a4")
        self.assertRaises(MultiPageInputPdfError, slice_service, multipage_pdf_example, "a4")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_A4_drawing2, "a4")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_A4_drawing2, "a3")
        self.assertIsInstance(slice_service(standard_A1_drawing1, "a4"), list , "Result value for Standard A1 is not list")
        self.assertIsInstance(slice_service(standard_A4_drawing1, "a5"), list , "Result value for Standard A4_1 is not list")
        self.assertIsInstance(slice_service(standard_A4_drawing2, "a5"), list , "Result value for Standard A4_2 is not list")
        close_files()
        
if __name__ == '__main__':
    unittest.main()