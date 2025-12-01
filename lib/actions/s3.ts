"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { verifySession } from "./session";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "../s3Client";

export async function getSignedURL(
  fileName: string,
  fileType: string,
  fileSize: number
) {
  const session = await verifySession();
  if (!session) return { failure: { message: "Not authenticated" } };

  const uniqueKey = `${uuidv4()}-${fileName}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  const signedURL = await getSignedUrl(S3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedURL } };
}
