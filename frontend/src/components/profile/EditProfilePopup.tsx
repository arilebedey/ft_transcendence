import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { usernameSchema } from "@/lib/profile-api";

interface EditProfilePopupProps {
  currentUser: { name: string; bio: string; avatarUrl?: string | null };
  onSave: (updatedUser: {
    name: string;
    bio: string;
    avatarUrl?: string | null;
  }) => void;
  isSaving?: boolean;
  onClose: () => void;
}

export function EditProfilePopup({
  currentUser,
  onSave,
  isSaving = false,
  onClose,
}: EditProfilePopupProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentUser.avatarUrl ?? null,
  );
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleSave = () => {
    // Validate username with Zod
    const result = usernameSchema.safeParse(name.toLowerCase());

    if (!result.success) {
      const errors = result.error.flatten().formErrors;
      setUsernameError(errors[0] || "Invalid username");
      return;
    }

    // Clear error on success
    setUsernameError(null);
    onSave({ name: result.data, bio, avatarUrl });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-20"
        onClick={onClose}
      ></div>

      <Card className="relative w-120 max-h-150  shadow-lg z-50 flex flex-col pt-6">
        <CardContent className="space-y-4 px-6">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <AvatarUpload
              name={name}
              currentAvatarUrl={avatarUrl}
              onUploaded={(newUrl) => setAvatarUrl(newUrl)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("Name")}</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setUsernameError(null);
              }}
              placeholder={"John Doe"}
              className={usernameError ? "border-red-500" : ""}
            />
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bio">{"Bio"}</Label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={"Tell us about yourself..."}
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
            />
          </div>
        </CardContent>

        <CardFooter className="justify-center gap-3 py-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
            disabled={isSaving}
          >
            {t("Close")}
          </Button>
          <Button onClick={handleSave} className="px-6" disabled={isSaving}>
            {t("save")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
