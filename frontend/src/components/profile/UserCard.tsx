import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { EditProfilePopup } from "@/components/profile/EditProfilePopup";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { UserInfo } from "@/components/profile/UserInfo";
import { UserStats } from "@/components/profile/UserStats";
import { UserActionButton } from "@/components/profile/UserActionButton";

interface UserCardProps {
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
}

export function UserCard() {
  const navigate = useNavigate();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;

  // Fake user data (will be updated via edit profile popup)
  const [currentUser, setCurrentUser] = useState({
    name: "theaux",
    email: "theauxperso@gmail.com",
    bio: "Tasty crousty, 67, pied de 92i el mordjene, doro party a chatelet, labubu, vody, esprit kaizen, en goumin, j'en parlerais dans mon livre, squeezie",
    followers: 123,
    following: 456,
  });

  const isOwnProfile = true;
  const isFollowing = false;
  const [showEditPopup, setShowEditPopup] = useState(false);

  const onToggleFollow = () => {
    // Implement follow/unfollow logic here
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-between w-full gap-8">
        {/* Avatar + name + bio */}
        <div className="flex items-center space-x-4 flex-1">
          <UserAvatar name={currentUser.name} />
          <UserInfo name={currentUser.name} bio={currentUser.bio} />
        </div>
        {/* Edit profile button / follow/unfollow */}
        <UserActionButton
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEdit={() => setShowEditPopup(true)}
          onToggleFollow={onToggleFollow}
        />
      </div>
      {/* Stats */}
      <UserStats
        followers={currentUser.followers}
        following={currentUser.following}
      />

      {showEditPopup && (
        <EditProfilePopup
          currentUser={currentUser}
          onSave={(updatedUser) =>
            setCurrentUser({ ...currentUser, ...updatedUser })
          }
          onClose={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
}
