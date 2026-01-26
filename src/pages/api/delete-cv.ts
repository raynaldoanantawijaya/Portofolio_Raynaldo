
import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { url, resourceType = 'raw' } = body;

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
            });
        }

        // Configure Cloudinary
        // Note: credentials should be in environment variables
        const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'damgnsraa';
        const apiKey = import.meta.env.CLOUDINARY_API_KEY;
        const apiSecret = import.meta.env.CLOUDINARY_API_SECRET;

        console.log('Attempting to delete from cloud:', cloudName);

        if (!apiKey || !apiSecret) {
            return new Response(JSON.stringify({ error: 'Server configuration error: Missing Cloudinary keys' }), {
                status: 500,
            });
        }

        // Basic configuration
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Extract Public ID from URL
        // Example: https://res.cloudinary.com/damgnsraa/raw/upload/v1737866384/Raynaldo_CV.pdf
        // For raw files, we generally want the filename at the end
        // Pattern: .../upload/(v<version>/)?<public_id>

        let publicId = '';
        try {
            const urlParts = url.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            if (uploadIndex !== -1) {
                // Get parts after 'upload'
                const contentParts = urlParts.slice(uploadIndex + 1);
                // Remove version if present (starts with 'v')
                if (contentParts[0].startsWith('v') && !isNaN(Number(contentParts[0].substring(1)))) {
                    contentParts.shift();
                }
                // Join the rest
                publicId = contentParts.join('/');

                // For raw files, Cloudinary might expect the extension if it's part of the public_id
                // Usually it is for raw files.
                // If it's an image, we typically strip the extension.
                if (resourceType === 'image') {
                    const lastDotIndex = publicId.lastIndexOf('.');
                    if (lastDotIndex !== -1) {
                        publicId = publicId.substring(0, lastDotIndex);
                    }
                }
            }
        } catch (err) {
            console.error('Error parsing URL:', err);
            return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
                status: 400,
            });
        }

        if (!publicId) {
            return new Response(JSON.stringify({ error: 'Could not extract public_id' }), {
                status: 400,
            });
        }

        console.log('Deleting public_id:', publicId, 'type:', resourceType);

        // Perform deletion
        let result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });

        console.log('Delete result (initial):', result);

        // Fallback: If not found as 'raw', try 'image' (or vice versa)
        if (result.result === 'not found') {
            const altType = resourceType === 'raw' ? 'image' : 'raw';
            console.log(`File not found as ${resourceType}, trying as ${altType}...`);

            // For images, we might need to strip extension from publicId if it was kept
            let altPublicId = publicId;
            if (altType === 'image' && altPublicId.includes('.')) {
                altPublicId = altPublicId.split('.').slice(0, -1).join('.');
            }

            const altResult = await cloudinary.uploader.destroy(altPublicId, {
                resource_type: altType,
                invalidate: true
            });
            console.log('Delete result (fallback):', altResult);
            if (altResult.result === 'ok') {
                result = altResult;
            }
        }

        if (result.result !== 'ok' && result.result !== 'not found') {
            return new Response(JSON.stringify({ error: 'Cloudinary Error', details: result }), {
                status: 500,
            });
        }

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
        });

    } catch (error: any) {
        console.error('Server error deleting file:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
        });
    }
}
