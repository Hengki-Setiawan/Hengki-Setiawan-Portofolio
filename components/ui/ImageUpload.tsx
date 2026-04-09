import React, { useState, useRef } from 'react';
import { db } from '../../lib/db';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    currentImage?: string;
    onUpload: (url: string) => void;
    bucket?: string;
    folder?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImage,
    onUpload,
    bucket = 'images',
    folder = 'uploads',
    className = ''
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await db.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = db.storage
                .from(bucket)
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            setPreview(publicUrl);
            onUpload(publicUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');

            // If bucket doesn't exist, show helpful message
            if (err.message?.includes('Bucket not found')) {
                setError('Storage bucket not configured. Please create "images" bucket in Supabase Storage.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
            />

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Error';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${uploading ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}`}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <span className="text-sm text-slate-500">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-slate-100 rounded-full mb-2">
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                        </>
                    )}
                </label>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;
