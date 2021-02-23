export default interface ListClearFilesOnS3 {
    status : string,
    error?: string,
    filesOnBucket?:object[],
    uploadedFile?: string
}
