'use client';

import { Box, Button, Stack, IconButton } from '@mui/material';
import { CloudUpload, Delete, Movie } from '@mui/icons-material';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes('/video/upload');

  return (
    <Box>
      <Stack spacing={2}>
        
        {value && (
          <Box 
            sx={{ 
                position: 'relative', 
                width: 200, 
                height: 200, 
                borderRadius: 2, 
                overflow: 'hidden', 
                border: '1px solid #eee',
                bgcolor: '#000'
            }}
          >
            <IconButton 
                size="small" 
                onClick={() => onRemove(value)}
                sx={{ 
                    position: 'absolute', top: 5, right: 5, zIndex: 10, 
                    bgcolor: 'error.main', color: 'white',
                    '&:hover': { bgcolor: 'error.dark' }
                }}
            >
                <Delete fontSize="small" />
            </IconButton>

            {isVideo ? (
                // ⚠️ Fix: Use Box component="video" with sx
                <Box 
                    component="video"
                    src={value} 
                    autoPlay 
                    muted 
                    loop 
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <Image 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    alt="Media" 
                    src={value} 
                />
            )}
          </Box>
        )}

        <CldUploadWidget 
            onSuccess={onUpload} 
            uploadPreset="woodsphere_preset" 
            options={{
                maxFiles: 1,
                resourceType: "auto",
                clientAllowedFormats: ["image", "video"],
                sources: ['local', 'url'],
            }}
        >
          {({ open }) => {
            return (
              <Button 
                variant="outlined" 
                startIcon={isVideo ? <Movie /> : <CloudUpload />}
                onClick={() => open()}
                fullWidth={false}
                sx={{ width: 'fit-content', borderStyle: 'dashed', borderWidth: 2 }}
              >
                {value ? "Change Media" : "Upload Image or Video"}
              </Button>
            );
          }}
        </CldUploadWidget>
      </Stack>
    </Box>
  );
}