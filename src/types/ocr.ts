export type FileMetadata = {
  filename: string;
  content_type: string;
};

export type PresignedUpload = {
  filename: string;
  key: string;
  upload_url: string;
};

export type InitiateUploadResponse = {
  job_id: string;
  uploads: PresignedUpload[];
};

export type OCRFinalResult = {
  filename: string;
  text: string;
};

export type OCRResultWithPreview = OCRFinalResult & {
  previewUrl: string;
};