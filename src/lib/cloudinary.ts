export const cloudinaryConfig = {
    cloudName: 'damgnsraa',
    uploadPreset: 'portfolio_uploads',
};

// Upload file to Cloudinary
export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    // Note: unauthenticated uploads rely on the preset for access control.
    // Make sure your Cloudinary Settings > Security > "PDF and ZIP files delivery" is unchecked (public).

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}

// Upload image specifically
export async function uploadImage(file: File): Promise<string> {
    return uploadToCloudinary(file);
}

// Upload PDF (for CV) - using 'raw' to avoid image delivery restrictions
export async function uploadPDF(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    try {
        // Use 'raw' resource type for documents
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/raw/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary PDF upload error:', error);
        throw error;
    }
}

// Delete file from Cloudinary (via server-side API)
export async function deleteCV(url: string): Promise<boolean> {
    try {
        const response = await fetch('/api/delete-cv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, resourceType: 'raw' }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Delete failed');
        }

        return true;
    } catch (error) {
        console.error('Error deleting CV:', error);
        throw error;
    }
}
