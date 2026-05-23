"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { ControllerRenderProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2, Trash } from "lucide-react";

import Image from "@/components/ui/image";
import { cn } from "@/lib/utils";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const authenticator = async (): Promise<{
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}> => {
  try {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const { signature, expire, token, publicKey } = data;

    return {
      signature,
      expire,
      token,
      publicKey,
    };
  } catch (error) {
    console.error("Authentication error:", error);

    throw new Error("Authentication request failed");
  }
};

interface ImageInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  placeholder?: string;
  disabled?: boolean;
  folder?: string;

  previewClassName?: string;
  previewContainerClassName?: string;
  renderPreview?: (imageUrl: string) => React.ReactNode;

  uploadContainerClassName?: string;
  renderEmptyState?: () => React.ReactNode;
}

export function ImageInput({
  field,
  placeholder = "Upload an image",
  disabled = false,
  folder = "/",

  previewClassName,
  previewContainerClassName,

  uploadContainerClassName,
  renderEmptyState,

  renderPreview,
}: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(field.value || "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleSetPreviewUrl = () => setPreviewUrl(field.value);
    handleSetPreviewUrl();
  }, [field.value]);

  const handleUploadClick = () => {
    if (disabled || isUploading) return;

    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (disabled) return;

    field.onChange("");
    setPreviewUrl("");
    setUploadError(null);
    setProgress(0);
  };

  const handleAbortUpload = () => {
    abortControllerRef.current?.abort();

    setIsUploading(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      const { signature, expire, token, publicKey } = await authenticator();

      const abortController = new AbortController();

      abortControllerRef.current = abortController;

      const response = await upload({
        file,
        fileName: `${file.name.split(".")[0]}-${crypto.randomUUID()}.${file.name.split(".")[1]}`,
        folder,

        publicKey,
        signature,
        expire,
        token,

        abortSignal: abortController.signal,

        onProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);

          setProgress(percent);
        },
      });

      console.log("Upload Success:", response);

      const imageUrl = response.url;

      field.onChange(imageUrl);

      setPreviewUrl(imageUrl || "");
      setUploadError(null);
    } catch (error) {
      console.error("Upload Error:", error);

      if (error instanceof ImageKitAbortError) {
        setUploadError("Upload cancelled");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setUploadError(error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setUploadError(error.message);
      } else if (error instanceof ImageKitServerError) {
        setUploadError(error.message);
      } else {
        setUploadError("Upload failed");
      }
    } finally {
      setIsUploading(false);

      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />

      {/* Preview */}
      {previewUrl ? (
        <div className={cn("relative group", previewContainerClassName)}>
          <div className="relative overflow-hidden">
            {renderPreview ? (
              renderPreview(previewUrl)
            ) : (
              <Image
                path={previewUrl.replace(urlEndpoint!, "")}
                w={500}
                h={500}
                alt="uploaded image"
                className={cn(
                  "aspect-square w-full rounded-xl object-cover mx-auto",
                  previewClassName,
                )}
              />
            )}

            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                disabled={disabled}
                onClick={handleRemoveImage}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            `
    w-full h-48 border-2 border-dashed border-border rounded-lg
    flex flex-col items-center justify-center space-y-4
    transition-colors duration-200 cursor-pointer
    `,
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "hover:border-border hover:bg-muted/5",
            isUploading && "border-blue-300 bg-muted/5",
            uploadContainerClassName,
          )}
          onClick={handleUploadClick}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-muted animate-spin" />

              <div className="space-y-2 w-full max-w-xs px-6">
                <p className="text-sm text-center text-muted font-medium">
                  Uploading... {progress}%
                </p>

                <progress value={progress} max={100} className="w-full h-2" />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAbortUpload();
                }}
              >
                Cancel Upload
              </Button>
            </>
          ) : renderEmptyState ? (
            renderEmptyState()
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted" />

              <div className="text-center">
                <p className="text-sm font-medium text-accent-foreground">
                  Upload an image
                </p>

                <p className="text-xs text-muted mt-1">{placeholder}</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
              >
                <Upload size={16} />
                Choose File
              </Button>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="font-medium">Upload Error:</p>
          <p>{uploadError}</p>
        </div>
      )}

      {/* Debug URL */}
      {process.env.NODE_ENV == "development" && field.value && (
        <div className="text-2xs rounded p-2 break-all">
          <span className="font-medium">Current URL:</span> {field.value}
        </div>
      )}
    </div>
  );
}
