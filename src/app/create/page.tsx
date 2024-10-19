'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { useUploadFile } from '@/hooks/queries';

const CreatePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);

  const uploadFileMutation = useUploadFile();

  useEffect(() => {
    crypto.subtle
      .generateKey(
        {
          name: 'AES-GCM',
          length: 256, // Key length in bits
        },
        true, // Extractable
        ['encrypt', 'decrypt'] // Key usages
      )
      .then(setKey);

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file || !key) {
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));

    const fileData = await file.arrayBuffer();
    const encryptedFile = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(12), // Initialization vector
      },
      key,
      fileData
    );

    setEncryptedBlob(new Blob([encryptedFile]));

    uploadFileMutation.mutateAsync(encryptedFile)
      .then(response => {
      console.log('Upload successful:', response);
      // Handle successful upload (e.g., show success message to user)
      })
      .catch(error => {
      console.error('Upload failed:', error);
      // Handle error (e.g., show error message to user)
      });
  };

  return (
    <div className="flex w-full items-center justify-between p-10">
      {/* Upload Content Card */}
      <Card className="w-[38%] p-3">
        <CardHeader>
          <CardTitle>Create Content</CardTitle>
          <CardDescription>Upload any content of your choosing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-[100%] flex-col items-center justify-center">
            <Card className="h-[20vh] w-full">
              {previewUrl && (
                <div className="flex h-full w-full items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </Card>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="invisible"
            />
            <Button variant="outline" onClick={handleButtonClick} disabled={!key}>
              Upload File
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground">
            Note: The file will be encrypted before being uploaded.
          </p>
        </CardFooter>
      </Card>

      {/* Carousel of Previous Uploads */}
      <Card className="w-[58%] p-4">
        <CardHeader>
          <CardTitle>Posted Content</CardTitle>
          <CardDescription>View all of your uploaded content</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePage;