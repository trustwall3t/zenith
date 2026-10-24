/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['trustochain.com', 'res.cloudinary.com'],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
};

module.exports = nextConfig;
