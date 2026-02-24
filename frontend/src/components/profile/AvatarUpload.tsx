import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { Camera } from "lucide-react";
import { profileMeQueryKey } from "@/lib/profile-api";

interface AvatarUploadProps {
  name: string;
  currentAvatarUrl?: string | null;
  onUploaded: (newAvatarUrl: string | null) => void;
}

async function uploadAvatarFn(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/users/me/avatar", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Upload failed");
  }

  return response.json();
}

export function AvatarUpload({
  name,
  currentAvatarUrl,
  onUploaded,
}: AvatarUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: uploadAvatarFn,
    onSuccess: (data) => {
      // Only update avatar AFTER server confirms
      onUploaded(data.avatarUrl);
      queryClient.invalidateQueries({ queryKey: profileMeQueryKey });
      setLocalPreviewUrl(null);
    },
    onError: (error) => {
      console.error("Avatar upload failed:", error);
      setLocalPreviewUrl(null);
    },
    onSettled: () => {
      // Clean up local preview on both success and error
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview while uploading (not committed yet)
    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);
    uploadAvatar(file);
  };

  // Show local preview while uploading, otherwise show current avatar
  const displayUrl = localPreviewUrl ? undefined : currentAvatarUrl;

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      {localPreviewUrl ? (
        <div className="h-30 w-30 rounded-full overflow-hidden">
          <img
            src={localPreviewUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <UserAvatar name={name} avatarUrl={displayUrl} />
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="h-8 w-8 text-white" />
      </div>

      {/* Loading spinner */}
      {isPending && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
