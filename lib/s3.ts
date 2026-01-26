import { env } from '@/constants/env'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
})

export interface SignedUrlParams {
  key: string
  contentType: string
}

export interface SignedUrlResult {
  url: string
  key: string
}

export async function getSignedUploadUrl({ 
  key, 
  contentType 
}: SignedUrlParams): Promise<SignedUrlResult> {
  try {
    // Create PutObjectCommand
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    // Generate signed URL
    const url = await getSignedUrl(s3Client, command, { 
      expiresIn: 60 
    })

    return { url, key }
  } catch (error) {
    throw new Error('Failed to generate signed S3 URL: ' + (error as Error).message)
  }
}

// Reusable client-side upload helper
export async function uploadFileToS3(file: File, pathname: string): Promise<string> {
  try {
    // 1. Get signed URL from API
    const res = await fetch(new URL("/api/upload-url", window.location.origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        filename: file.name, 
        contentType: file.type, 
        pathname 
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to get upload URL: ${errorText}`)
    }

    const { url, key } = await res.json()

    // 2. Upload file to S3 using signed URL
    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { 
        "Content-Type": file.type,
      },
      body: file,
    })

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload to S3: ${uploadRes.statusText}`)
    }

    // 3. Return public S3 URL
    if (!env.NEXT_PUBLIC_S3_BUCKET_NAME || !env.NEXT_PUBLIC_AWS_REGION) {
      throw new Error("Missing S3 bucket or region env")
    }

    const publicUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
    return publicUrl
  } catch (err) {
    console.error("Upload error:", err)
    throw err
  }
}

export async function deleteFileFromS3(url: string): Promise<void> {
  try {
    if (!url) return

    // Extract key from URL
    const key = env.NEXT_PUBLIC_S3_ROOT_PATH + "/" + 
                url.split(`/${env.NEXT_PUBLIC_S3_ROOT_PATH}/`)[1]

    // Create DeleteObjectCommand
    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    })
    // Execute delete operation
    await s3Client.send(command)
  } catch (error) {
    throw new Error('Failed to delete file from S3: ' + (error as Error).message)
  }
}

// Optional: Helper to check if file exists
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    const command = new HeadObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key,
    })
    await s3Client.send(command)
    return true
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false
    }
    throw error
  }
}
