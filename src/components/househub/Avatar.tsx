import { avatarColor } from "@/lib/househub";

interface AvatarProps {
  name: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}

const Avatar = ({ name, size = 44, radius = 14, fontSize = 18 }: AvatarProps) => (
  <div
    className="flex items-center justify-center font-display font-bold shrink-0"
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: avatarColor(name),
      color: "#fff",
      fontSize,
    }}
  >
    {name?.[0] || "?"}
  </div>
);

export default Avatar;
