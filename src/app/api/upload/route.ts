import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Image must be under 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 for Cloudinary upload
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Clean filename for public_id
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^/.]+$/, ''); // remove extension
    const publicId = `afshan-gift-centre/${Date.now()}-${sanitizedName}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      public_id: publicId,
      folder: 'afshan-gift-centre',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1600, crop: 'limit', quality: 'auto' },
      ],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      filename: `${Date.now()}-${file.name}`,
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to upload image. Make sure Cloudinary credentials are set in environment variables.',
      },
      { status: 500 }
    );
  }
}
