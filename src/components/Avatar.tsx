import Image from "next/image";

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg"; // 👈 flexible sizing
}

const sizeMap = {
  sm: { container: "w-9 h-9", text: "text-xs", img: 36 },
  md: { container: "w-12 h-12", text: "text-sm", img: 48 },
  lg: { container: "w-24 h-24", text: "text-2xl", img: 96 },
};

export default function Avatar({ name, image, size = "md" }: AvatarProps) {
  const { container, text, img } = sizeMap[size];

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${container} rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0`}>
      {image ? (
        <Image
          src={image}
          width={img}
          height={img}
          alt={name}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={`${text} font-bold text-indigo-600`}>
          {initials}
        </span>
      )}
    </div>
  );
}