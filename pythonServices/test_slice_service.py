import unittest
import io
from slice_service import *
from application_library.pdf_slicer_exceptions import *
from application_library.pdf_slicer_lib import *

def open_files():
    global standard_a1_drawing, standard_a4_drawing1, standard_a4_drawing2, nonstandard_drawing_size, multipage_drawing, drawing_with_spacebar, hebrew_file, greek_file,invalid_file_type
    standard_a1_drawing = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA1_1.pdf', "rb")
    standard_a4_drawing1 = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_1.pdf', "rb")
    standard_a4_drawing2 = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\VykresA4_2.pdf', "rb")
    nonstandard_drawing_size = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\ANSI_D_INCH.pdf', "rb")
    multipage_drawing = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\MultipageExample.pdf', "rb")
    drawing_with_spacebar = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\Name with spacebar.pdf', "rb")
    hebrew_file  = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\קובץ מסמך.pdf', "rb")
    greek_file  = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\Αρχείο εγγράφων.pdf', "rb")
    invalid_file_type  = open('C:\\Users\\user\\Desktop\\CODING\\MojeProjekty\\drawingSlicer\\public\\InvalidFileType.pd', "rb")

def close_files():
    standard_a1_drawing.close()
    standard_a4_drawing1.close()
    standard_a4_drawing2.close()
    nonstandard_drawing_size.close()
    multipage_drawing.close()
    drawing_with_spacebar.close()
    hebrew_file.close()
    greek_file.close()
    invalid_file_type.close()


class TestSliceService(unittest.TestCase):

    def test_input_files(self):
        
        open_files()
        self.assertIsInstance(standard_a1_drawing, io.BufferedReader , "Input drawing is not type of Buffered Reader")
        self.assertRaises(InvalidPdfSizeError, slice_service, nonstandard_drawing_size, "a4")
        self.assertRaises(MultiPageInputPdfError, slice_service, multipage_drawing, "a4")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_a4_drawing2, "a4")
        self.assertRaises(InvalidDrawingInputFormat, slice_service, standard_a4_drawing2, "a3")
        self.assertRaises(InvalidInputPdfFile, slice_service, invalid_file_type, "a5")
        close_files()
    
    def test_result_types(self):

        open_files()
        self.assertIsInstance(slice_service(standard_a1_drawing, "a2"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(standard_a1_drawing, "a3"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(standard_a1_drawing, "a4", scale_to_format="a0"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(standard_a1_drawing, "a5"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(standard_a4_drawing1, "a5"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(drawing_with_spacebar, "a5"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(standard_a4_drawing1, "a1", scale_to_format="a0"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(hebrew_file, "a5"), io.BufferedWriter , "Result of the application is not bufferWriter")
        self.assertIsInstance(slice_service(greek_file, "a5"), io.BufferedWriter , "Result of the application is not bufferWriter")
        close_files()


if __name__ == '__main__':
    unittest.main()