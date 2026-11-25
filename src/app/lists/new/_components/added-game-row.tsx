"use client";

import { EditGameRow } from "@/features/game-list/components/edit-game-row";
import { useGameDetail } from "@/features/game-list/hooks/use-game-detail";

export interface AddedGameRowProps {
  appId: number;
  name: string;
  featured: boolean;
  comment: string;
  onCommentChange: (comment: string) => void;
  onToggleFeatured: () => void;
  onRemove: () => void;
}

export function AddedGameRow({
  appId,
  name,
  featured,
  comment,
  onCommentChange,
  onToggleFeatured,
  onRemove,
}: AddedGameRowProps) {
  const { data: detail, isPending } = useGameDetail(appId);

  return (
    <EditGameRow
      name={name}
      imageSrc={detail?.headerImageUrl ?? undefined}
      imageAlt={name}
      description={detail?.shortDescription ?? undefined}
      descriptionLoading={isPending}
      featured={featured}
      comment={comment}
      commentLimit={100}
      onCommentChange={onCommentChange}
      onToggleFeatured={onToggleFeatured}
      onRemove={onRemove}
    />
  );
}
