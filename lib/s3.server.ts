import 'server-only';

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/constants/env';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export interface SignedUrlParams {
  key: string;
  contentType: string;
}

export interface SignedUrlResult {
  url: string;
  key: string;
}

function assertS3Config() {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.S3_BUCKET_NAME) {
    throw new Error('Missing S3 server configuration');
  }
}

export async function getSignedUploadUrl({
  key,
  contentType,
}: SignedUrlParams): Promise<SignedUrlResult> {
  try {
    assertS3Config();

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return { url, key };
  } catch (error) {
    throw new Error(`Failed to generate signed S3 URL: ${(error as Error).message}`);
  }
}

export async function deleteFileFromS3(url: string): Promise<void> {
  try {
    if (!url) return;
    assertS3Config();

    const [, keyPath] = url.split(`/${env.S3_ROOT_PATH}/`);
    if (!keyPath) return;

    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: `${env.S3_ROOT_PATH}/${keyPath}`,
    });

    await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${(error as Error).message}`);
  }
}

export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    assertS3Config();

    const command = new HeadObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}
