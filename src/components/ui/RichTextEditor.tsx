'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css'; // ⚠️ Updated CSS import

// ⚠️ Updated Dynamic Import
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <Box p={2}>Loading Editor...</Box>
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        borderRadius: 2,
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        '& .quill': { 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        },
        '& .ql-toolbar': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderColor: '#e0e0e0',
            bgcolor: '#f5f5f7',
            flexShrink: 0 // Prevent toolbar from shrinking
        },
        '& .ql-container': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderColor: '#e0e0e0',
            flexGrow: 1, // Let content area fill space
            overflowY: 'auto', // Scroll content internally
            fontSize: '1rem',
            fontFamily: 'inherit'
        }
      }}
    >
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
      />
    </Box>
  );
}