// Suppress DEP0169 deprecation warning from cloudinary dependency
// This warning is about url.parse() usage in cloudinary's dependencies
// It's safe to suppress as cloudinary handles URL parsing correctly
if (typeof process !== 'undefined' && process.on) {
	// Intercept process.emitWarning to filter out DEP0169 warnings
	const originalEmitWarning = process.emitWarning;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(process as any).emitWarning = function (warning: any, ...args: any[]) {
		// Check if this is a DEP0169 deprecation warning
		if (
			typeof warning === 'object' &&
			warning.name === 'DeprecationWarning' &&
			warning.code === 'DEP0169'
		) {
			return;
		}
		// Check if code is passed as a parameter
		if (args[1] === 'DEP0169' || args[0] === 'DEP0169') {
			return;
		}
		// Call original with proper arguments
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (originalEmitWarning as any).apply(process, [warning, ...args]);
	};

	// Also listen to warning events as a fallback
	process.on('warning', (warning: NodeJS.ErrnoException) => {
		if (
			warning.name === 'DeprecationWarning' &&
			warning.code === 'DEP0169'
		) {
			// Suppress by not propagating - already handled above
			return;
		}
	});
}

// Define the Cloudinary upload result interface
interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	tags: string[];
	bytes: number;
	type: string;
	etag: string;
	placeholder: boolean;
	url: string;
	signature: string;
	original_filename: string;
}

// Lazy initialization - only config Cloudinary when actually needed
let cloudinaryInitialized = false;
type CloudinaryV2 = Awaited<typeof import('cloudinary')>['v2'];
let cloudinaryInstance: CloudinaryV2 | null = null;

async function getCloudinary() {
	// Dynamic import to avoid loading Cloudinary at module load time
	// This prevents initialization errors in serverless environments
	if (!cloudinaryInstance) {
		const cloudinaryModule = await import('cloudinary');
		cloudinaryInstance = cloudinaryModule.v2;

		// Only configure once
		if (!cloudinaryInitialized) {
			cloudinaryInstance.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			cloudinaryInitialized = true;
		}
	}

	return cloudinaryInstance;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
	try {
		// Initialize Cloudinary only when this function is called
		const cloudinary = await getCloudinary();

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Upload to Cloudinary
		const result = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: 'image',
							folder: 'kyc-documents',
						},
						(
							error: Error | undefined,
							result: CloudinaryUploadResult | undefined
						) => {
							if (error) {
								reject(error);
							} else if (result) {
								resolve(result);
							} else {
								reject(
									new Error(
										'Upload completed but no result received'
									)
								);
							}
						}
					)
					.end(buffer);
			}
		);

		return result.secure_url;
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error);
		throw new Error('Failed to upload image');
	}
};
