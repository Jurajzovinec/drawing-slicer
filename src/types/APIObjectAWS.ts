export default interface APIObjectAWS {
    status : string,
    error?: string,
    filesOnBucket?:object[],
    uploadedFile?: string
}
