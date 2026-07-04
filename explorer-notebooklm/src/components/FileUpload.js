'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

export default function FileUpload({ notebookId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('notebookId', notebookId);

          const response = await fetch('/api/documents/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
          }

          const data = await response.json();
          setUploadedFiles((prev) => [...prev, data.document]);
          
          if (onUploadComplete) {
            onUploadComplete(data.document);
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      setUploading(false);
    },
    [notebookId, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Uploading and processing...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop files here...'
                  : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOCX, TXT, MD (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">Recently uploaded:</p>
          {uploadedFiles.map((file) => (
            <div
              key={file._id}
              className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded"
            >
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 flex-1">{file.fileName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
