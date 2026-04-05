import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { getProfileMe, profileMeQueryKey } from "@/lib/profile-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DesktopModal } from "@/components/ui/DesktopModal";
import { MobileModal } from "@/components/ui/MobileModal";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";

interface CreatedPost {
  id: number;
  link: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  author: {
    id: string;
    name: string;
  };
}

interface NewPostModalProps {
  onClose: () => void;
  onCreated: (post: CreatedPost) => void;
}

const MAX_POST_LENGTH = 300;

function isValidUrl(value: string): boolean {
  try {
    const normalizedValue =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;
    const url = new URL(normalizedValue);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function extractLink(text: string): {
  url?: string;
  contentWithoutLink: string;
} {
  const match = text.match(/\S+/g);
  const rawUrl = match?.find(isValidUrl);

  if (!rawUrl) {
    return { contentWithoutLink: text.trim() };
  }

  const contentWithoutLink = text.replace(rawUrl, "").trim();

  return {
    url: rawUrl,
    contentWithoutLink,
  };
}

export function NewPostModal({ onClose, onCreated }: NewPostModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobileViewport(700);
  const { data: profile } = useQuery({
    queryKey: profileMeQueryKey,
    queryFn: getProfileMe,
  });
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = profile?.name ?? "";
  const userAvatar = profile?.avatarUrl;

  const handlePasteLink = async () => {
    try {
      const clipboardText = (await navigator.clipboard.readText()).trim();
      if (!clipboardText) return;
      if (!isValidUrl(clipboardText)) {
        setSubmitError(t("PasteLinkInvalid"));
        return;
      }

      setContent((prev) => {
        const trimmedPrev = prev.trimEnd();
        return trimmedPrev ? `${trimmedPrev} ${clipboardText}` : clipboardText;
      });
      setSubmitError("");
    } catch {
      setSubmitError(t("PasteLinkError"));
    }
  };

  const handleSubmit = async () => {
    if (!content) {
      setSubmitError(t("EmptyContent"));
      return;
    }

    const { url, contentWithoutLink } = extractLink(content);
    if (!url) {
      setSubmitError(t("LinkInclusion"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: contentWithoutLink,
          link: url,
        }),
      });

      if (!response.ok) {
        setSubmitError(t("PostCreationError"));
        return;
      }

      const createdPost = (await response.json()) as CreatedPost;
      onCreated(createdPost);
      onClose();
    } catch {
      setSubmitError(t("PostCreationError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const body = (
    <Card
      className={`relative flex h-full w-full flex-col rounded-none border-0 shadow-none`}
    >
      {!isMobile ? (
        <CardHeader className="px-6 pb-4">
          <CardTitle className="text-xl">{t("newPostHeading")}</CardTitle>
        </CardHeader>
      ) : null}

      <CardContent
        className={`min-h-0 flex-1 ${isMobile ? "px-4 pt-4" : "px-6 pb-6 pt-0"}`}
      >
        <div className="flex items-start gap-3">
          <UserAvatar
            name={userName || "User"}
            avatarUrl={userAvatar}
            className="h-10 w-10 shrink-0"
          />
          <textarea
            rows={3}
            maxLength={MAX_POST_LENGTH}
            placeholder={t("newPostPlaceholder")}
            className="min-h-24 w-full resize-none border-0 bg-transparent px-0 py-2 text-lg leading-relaxed shadow-none outline-none placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSubmitError("");
            }}
          />
        </div>
        {submitError ? (
          <div className="mt-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}
      </CardContent>

      {!isMobile ? (
        <CardFooter className="justify-between gap-2 px-6 pb-6 pt-0">
          <Button
            variant="outline"
            onClick={() => void handlePasteLink()}
            disabled={isSubmitting}
            className="rounded-full px-4"
          >
            {t("PasteLink")}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-4"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="rounded-full px-4"
            >
              {t("Confirm")}
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );

  const Modal = isMobile ? MobileModal : DesktopModal;

  return (
    <Modal
      onClose={onClose}
      overlayClassName="bg-black/20"
      panelClassName={isMobile ? undefined : "w-full max-w-3xl"}
      title={isMobile ? t("newPostHeading") : undefined}
      action={
        isMobile ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void handlePasteLink()}
              disabled={isSubmitting}
              className="rounded-full px-4"
            >
              {t("PasteLink")}
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="rounded-full px-4"
            >
              {t("Confirm")}
            </Button>
          </div>
        ) : undefined
      }
      body={body}
    />
  );
}
