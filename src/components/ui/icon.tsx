import React from "react";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  fallback?: keyof typeof LucideIcons;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
  fallback = "CircleAlert",
}) => {
  const IconComponent = LucideIcons[name] || LucideIcons[fallback];

  if (!IconComponent) {
    const FallbackComponent = LucideIcons[fallback];
    return <FallbackComponent size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};

export default Icon;
