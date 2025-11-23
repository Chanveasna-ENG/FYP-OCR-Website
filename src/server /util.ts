import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
const SPACES_ENDPOINT = process.env.SPACE_END_POINT_URL;
const REGION = process.env.REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

export async function getSessionId() {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => dec.toString(16).padStart(8, "0")).join("-");
}

if (!SPACES_ENDPOINT || !REGION || !BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error(
    "Missing required environment variables: SPACE_END_POINT_URL, REGION, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY"
  );
}

const s3Client = new S3({
  forcePathStyle: true,
  endpoint: SPACES_ENDPOINT!,
  region: REGION!,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});
// Single file upload helper
async function uploadToS3(key: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);
}

// Batch upload
export async function uploadFilesToS3(files: File[], sessionId: string) {
  const results: { fileName: string; s3Key: string }[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Unique key per file using sessionId + timestamp
    const key = `uploads/${sessionId}/${Date.now()}-${file.name}`;

    await uploadToS3(key, buffer, file.type);

    results.push({ fileName: file.name, s3Key: key });
  }

  return results; // [{ fileName, s3Key }]
}
