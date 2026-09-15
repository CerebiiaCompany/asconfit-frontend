import React from "react";

interface UserAvatarProps {
  name?: string | null;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-2xl",
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  photoUrl,
  size = "md",
  className = "",
}) => {
  const initial = (name || "").trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-orange-100 text-orange-600 font-semibold flex-shrink-0 ${className}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};
