import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth/request-user';
import { deleteFileFromS3 } from '@/lib/s3.server';

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing file URL' }, { status: 400 });
    }

    await deleteFileFromS3(url);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
