import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getSession } from '@/lib/session'; // Your auth function

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await getSession();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Validate file size (10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: 'File size must be less than 10MB' },
				{ status: 400 }
			);
		}

		// Validate file type
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/jpg',
			'image/gif',
			'application/pdf',
		];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{
					error: 'Invalid file type. Only images and PDFs are allowed',
				},
				{ status: 400 }
			);
		}

		// Upload to Cloudinary using your existing function
		const imageUrl = await uploadToCloudinary(file);

		return NextResponse.json({ url: imageUrl }, { status: 200 });
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{ error: 'Failed to upload file' },
			{ status: 500 }
		);
	}
}
