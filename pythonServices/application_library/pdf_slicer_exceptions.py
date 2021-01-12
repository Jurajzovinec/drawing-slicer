class InvalidPdfSizeError(Exception):
    def __init__(self, message):
        super().__init__(message)


class MultiPageInputPdfError(Exception):
    def __init__(self, message):
        super().__init__(message)


class InvalidDrawingInputFormat(Exception):
    def __init__(self, message):
        super().__init__(message)


class AcceptedDeviationError(Exception):
    def __init__(self, message):
        super().__init__(message)


class InvalidInputPdfFile(Exception):
    def __init__(self, message):
        super().__init__(message)


class ResultPDFSizeFailure(Exception):
    def __init__(self, message):
        super().__init__(message)

class InvalidSlicingFormat(Exception):
    def __init__(self, message):
        super().__init__(message)

class InvalidScalingFormat(Exception):
    def __init__(self, message):
        super().__init__(message)