'use client';

import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
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
    // Cloudinary returns the secure_url
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null; // Hydration fix

  return (
    <Box>
      <Stack spacing={2}>
        
        {/* Preview Area */}
        {value && (
          <Box 
            sx={{ 
                position: 'relative', 
                width: 200, 
                height: 200, 
                borderRadius: 2, 
                overflow: 'hidden', 
                border: '1px solid #eee' 
            }}
          >
            <IconButton 
                size="small" 
                onClick={() => onRemove(value)}
                sx={{ 
                    position: 'absolute', 
                    top: 5, 
                    right: 5, 
                    zIndex: 10, 
                    bgcolor: 'error.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'error.dark' }
                }}
            >
                <Delete fontSize="small" />
            </IconButton>
            <Image 
                fill 
                style={{ objectFit: 'cover' }} 
                alt="Product Image" 
                src={value} 
            />
          </Box>
        )}

        {/* Upload Button Wrapper */}
        <CldUploadWidget 
            onSuccess={onUpload} 
            uploadPreset="woodsphere_preset" // ⚠️ Must match your Unsigned Preset Name
            options={{
                maxFiles: 1,
                sources: ['local', 'url', 'camera'],
                styles: {
                    palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#0071E3", // Apple Blue
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#0071E3",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1"
                    }
                }
            }}
        >
          {({ open }) => {
            return (
              <Button 
                variant="outlined" 
                startIcon={<CloudUpload />}
                onClick={() => open()}
                fullWidth={false}
                sx={{ 
                    width: 'fit-content', 
                    borderStyle: 'dashed', 
                    borderWidth: 2, 
                    textTransform: 'none' 
                }}
              >
                Upload Image
              </Button>
            );
          }}
        </CldUploadWidget>
      </Stack>
    </Box>
  );
}