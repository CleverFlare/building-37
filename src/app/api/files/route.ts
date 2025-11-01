import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import pLimit from "p-limit";
import { env } from "@/env";
import { r2 } from "@/server/r2";

const CONCURRENCY_LIMIT = 5;
const QUEUE_SIZE = 10; // parts uploaded in parallel per file
const PART_SIZE = 8 * 1024 * 1024; // 8MB per file

// ---------- POST: Upload multiple files ----------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No files provided" }, { status: 400 });

    const limit = pLimit(CONCURRENCY_LIMIT);

    const upload = await limit(async () => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

      // Use multipart upload for reliability and parallel part uploads
      const upload = new Upload({
        client: r2,
        params: {
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        },
        queueSize: QUEUE_SIZE,
        partSize: PART_SIZE,
        leavePartsOnError: false,
      });

      await upload.done();

      const url = `${env.R2_PUBLIC_SERVE_URL}/${env.R2_BUCKET_NAME}/${key}`;
      return { key, url, name: file.name };
    });

    return NextResponse.json({ files: upload });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// ---------- PUT: Replace a single file ----------
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string | null;

    if (!file || !key)
      return NextResponse.json(
        { error: "Missing file or key" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const limit = pLimit(CONCURRENCY_LIMIT);

    const upload = await limit(async () => {
      const upload = new Upload({
        client: r2,
        params: {
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        },
        queueSize: QUEUE_SIZE,
        partSize: PART_SIZE,
        leavePartsOnError: false,
      });

      await upload.done();

      const url = `${env.R2_PUBLIC_SERVE_URL}/${env.R2_BUCKET_NAME}/${key}`;
      return { key, url, name: file.name };
    });

    return NextResponse.json({ key: upload.key, url: upload.url });
  } catch (err) {
    console.error("REPLACE ERROR:", err);
    return NextResponse.json({ error: "Replace failed" }, { status: 500 });
  }
}

// ---------- DELETE: Delete a single file ----------
export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json();

    if (!key)
      return NextResponse.json({ error: "No key provided" }, { status: 400 });

    await r2.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      }),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
