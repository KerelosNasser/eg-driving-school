"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "./AdminProvider";
import { cmsService } from "@/lib/services/cms.service";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, Upload } from "lucide-react";

interface EditableImageProps {
  section: string;
  field: string;
  initialSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function EditableImage({
  section,
  field,
  initialSrc,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: EditableImageProps) {
  const { isAdmin, isEditing } = useAdmin();
  const [src, setSrc] = useState(initialSrc);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      console.error("Firebase storage is not initialized");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(
        storage,
        `cms/${section}/${field}_${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      await cmsService.updateSiteContent(section, { [field]: downloadURL });
      setSrc(downloadURL);
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Optionally show error toast
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (isAdmin && isEditing) {
    return (
      <div className={`relative group inline-block ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity ${isUploading ? "opacity-50" : ""}`}
          priority={priority}
        />

        <div
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-2 border-dashed border-white/50 rounded"
          onClick={triggerUpload}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <div className="flex flex-col items-center text-white">
              <Upload className="w-8 h-8 mb-1" />
              <span className="text-xs font-medium">Change Image</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
