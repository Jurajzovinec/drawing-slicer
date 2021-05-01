export interface uploadFileToAwsS3Message {
    status: "OK" | "FAILED",
    error?: string,
    filesOnBucket?: object[],
    uploadedFile?: string
}

export interface listFilesOnBucketAwsS3Message {
    status: "OK" | "FAILED",
    listedBucket: string,
    error?: string,
    filesOnBucket?: object[]
}

export interface downloadFileFromAwsS3Message {
    status: "OK" | "FAILED",
    downloadedFilename: string,
    data: object,
    error?: string,
}

export interface clearFilesOnBucketAwsS3Message {
    status: "OK" | "FAILED",
    error?: string,
}