import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/styles/utils";

export interface GameImageProps {
  /** 없으면 bg-line 면에 이미지 아이콘을 보여준다 */
  src?: string;
  alt?: string;
  className?: string;
}

export function GameImage({ src, alt = "", className }: GameImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-[460/215] w-full overflow-hidden rounded-md bg-line text-fg-tertiary",
        className,
      )}
    >
      {src ? (
        // 게임 이미지 호스트가 정해지지 않아 next/image의 remotePatterns를 설정할 수 없다
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <ImageIcon
          className="absolute inset-0 m-auto size-icon-md"
          strokeWidth={1.75}
        />
      )}
    </div>
  );
}
