export interface spawnValidateRequest {
    uploadedFile: string
}

export interface spawnValidateResponse {
    status : "OK" | "FAILED",
    filename: string,
    numberOfPages?: string,
    drawingFormat?: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8",
    error?: string,
}

export interface spawnSliceRequest {
    filename: string,
    scalingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" | "None",
    slicingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" | "None"
}

export interface spawnSliceResponse {
    status : "OK" | "FAILED",
    uploadedFileName? : string,
    error?: string
}
