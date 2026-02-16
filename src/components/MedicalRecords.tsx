import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf', // Change if not PDF
        'Content-Disposition': `inline; filename="${filename}"`, // 'inline' to view in browser
      },
    });
  } catch (_error) {
    return new NextResponse('File not found', { status: 404 });
  }
}

<a
  href={`/api/documents/${record.filename}`}
  target="_blank"
  rel="noopener noreferrer"
  style={{ textDecoration: 'none' }}
>
  <button>View Original Report</button>
</a>