export async function uploadFileToS3(file: File, pathname: string): Promise<string> {
  try {
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        pathname,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to get upload URL: ${errorText}`);
    }

    const { url, publicUrl } = await res.json();

    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload to S3: ${uploadRes.statusText}`);
    }

    return publicUrl;
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
}

export async function deleteFileFromS3(url: string): Promise<void> {
  if (!url) return;

  const res = await fetch('/api/delete-file', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete file from S3: ${errorText}`);
  }
}
