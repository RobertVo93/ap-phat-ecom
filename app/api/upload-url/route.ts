import { NextRequest, NextResponse } from 'next/server'
import { getSignedUploadUrl } from '@/lib/s3.server'
import { env } from '@/constants/env'
import { getUserFromRequest } from '@/lib/auth/request-user'

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType, pathname } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
    }
    // Optionally, add a folder or timestamp to the key
    const key = `${env.S3_ROOT_PATH}/${pathname}/${Date.now()}-${filename}`
    const { url } = await getSignedUploadUrl({ key, contentType })

    if (!env.S3_BUCKET_NAME || !env.AWS_REGION) {
      return NextResponse.json({ error: 'Missing S3 public URL configuration' }, { status: 500 })
    }

    const publicUrl = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
    return NextResponse.json({ url, key, publicUrl })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
} 
