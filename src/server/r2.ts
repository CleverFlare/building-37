import { env } from "@/env";
import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
  accessKeyId: env.OBJECT_STORAGE_ACCESS_KEY,
  secretAccessKey: env.OBJECT_STORAGE_SECRET_KEY,
};

export const r2 = new S3Client({
  region: "garage",
  endpoint: env.OBJECT_STORAGE_ENDPOINT,
  forcePathStyle: true,
  credentials,
});

export const r2Public = new S3Client({
  region: "garage",
  endpoint: env.OBJECT_STORAGE_PUBLIC_ENDPOINT,
  forcePathStyle: true,
  credentials,
});
