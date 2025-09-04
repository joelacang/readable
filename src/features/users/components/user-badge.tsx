import React from "react";
import { X, User, Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { getNameInitials } from "~/utils/get-values";

const UserBadge = ({
  user,
  mode = "default", // 'compact' | 'default' | 'detailed'
  showRemoveButton = false,
  showEmail = false,
  showPhone = false,
  showLocation = false,
  showMenu = false,
  isOnline = false,
  onClick,
  onRemove,
  onMenuClick,
  className = "",
  maxNameLength = null,
}) => {
  // Truncate name if needed
  const getTruncatedName = (name: string, maxLength: number) => {
    if (!maxLength || name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Mode-specific configurations
  const modeConfig = {
    compact: {
      containerClass: "px-2 py-1",
      imageSize: "w-6 h-6",
      textSize: "text-xs",
      nameOnly: true,
      defaultMaxName: 12,
    },
    default: {
      containerClass: "px-3 py-2",
      imageSize: "w-8 h-8",
      textSize: "text-sm",
      nameOnly: false,
      defaultMaxName: 20,
    },
    detailed: {
      containerClass: "px-4 py-3",
      imageSize: "w-12 h-12",
      textSize: "text-base",
      nameOnly: false,
      defaultMaxName: null,
    },
  };

  const config = modeConfig[mode] || modeConfig.default;
  const displayName = getTruncatedName(
    user.name,
    maxNameLength || config.defaultMaxName,
  );

  // Base classes
  const baseClasses = `
    inline-flex items-center rounded-full bg-white border border-gray-200 
    shadow-sm hover:shadow-md transition-all duration-200 
    ${config.containerClass} ${className}
  `;

  const clickableClasses = onClick ? "cursor-pointer hover:bg-gray-50" : "";

  return (
    <div className={`${baseClasses} ${clickableClasses}`} onClick={onClick}>
      {/* User Image/Avatar */}
      <div className={`relative ${config.imageSize} flex-shrink-0`}>
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className={`${config.imageSize} rounded-full object-cover`}
          />
        ) : (
          <div
            className={` ${config.imageSize} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-semibold text-white ${mode === "compact" ? "text-xs" : mode === "detailed" ? "text-sm" : "text-xs"} `}
          >
            {getNameInitials(user.name)}
          </div>
        )}

        {/* Online Status Indicator */}
        {isOnline && (
          <div
            className={`absolute -right-0 -bottom-0 rounded-full border-2 border-white bg-green-500 ${mode === "compact" ? "h-2 w-2" : mode === "detailed" ? "h-4 w-4" : "h-3 w-3"} `}
          />
        )}
      </div>

      {/* User Info */}
      <div
        className={`ml-2 min-w-0 flex-1 ${mode === "compact" ? "mr-1" : "mr-2"}`}
      >
        {/* Name */}
        <div
          className={`font-medium text-gray-900 ${config.textSize} truncate`}
        >
          {displayName}
        </div>

        {/* Additional Info for non-compact modes */}
        {!config.nameOnly && (
          <div className="space-y-1">
            {showEmail && user.email && (
              <div className="flex items-center text-xs text-gray-500">
                <Mail className="mr-1 h-3 w-3" />
                <span className="truncate">{user.email}</span>
              </div>
            )}

            {showPhone && user.phone && (
              <div className="flex items-center text-xs text-gray-500">
                <Phone className="mr-1 h-3 w-3" />
                <span>{user.phone}</span>
              </div>
            )}

            {showLocation && user.location && (
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span className="truncate">{user.location}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Menu Button */}
        {showMenu && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick?.(user);
            }}
            className={`rounded-full p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 ${mode === "compact" ? "h-5 w-5" : "h-6 w-6"} `}
          >
            <MoreVertical className="h-full w-full" />
          </button>
        )}

        {/* Remove Button */}
        {showRemoveButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(user);
            }}
            className={`rounded-full p-1 text-gray-400 transition-colors duration-200 hover:bg-red-100 hover:text-red-600 ${mode === "compact" ? "h-5 w-5" : "h-6 w-6"} `}
          >
            <X className="h-full w-full" />
          </button>
        )}
      </div>
    </div>
  );
};
