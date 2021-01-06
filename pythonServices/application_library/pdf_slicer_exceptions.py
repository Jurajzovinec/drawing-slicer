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

