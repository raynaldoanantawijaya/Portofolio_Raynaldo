
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Config:', {
    cloudName,
    apiKey: apiKey ? '***' : 'missing',
    apiSecret: apiSecret ? '***' : 'missing'
});

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

async function testDelete() {
    const publicId = 'zlfzdj0dm2ohecw7ykqp.pdf'; // The ID user mentioned
    console.log(`Attempting to delete raw file: ${publicId}`);

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw',
            invalidate: true
        });
        console.log('Delete Result:', result);
    } catch (error) {
        console.error('Delete Error:', error);
    }
}

testDelete();
