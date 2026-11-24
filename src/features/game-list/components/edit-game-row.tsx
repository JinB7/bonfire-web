"use client";

import { GripVertical, Star, X } from "lucide-react";
import { useId, type ButtonHTMLAttributes } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GameImage } from "@/features/game-list/components/game-image";
import { cn } from "@/lib/styles/utils";

export interface EditGameRowProps {
  /** 게임 이름. 추천 코멘트 입력창의 이름("<게임 이름> 추천 코멘트")에도 쓴다 */
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  /** 스팀 설명. 이름 아래 1줄로 말줄임하고 전체 문장은 툴팁(title)으로. 비어 있으면 줄을 숨긴다 */
  description?: string;
  /** 스팀 설명을 받는 중. 설명 자리에 스켈레톤을 보여준다 */
  descriptionLoading?: boolean;
  /** 대표 게임. ★를 채우고 이름 옆에 "대표" 태그를 붙인다 */
  featured?: boolean;
  /** 추천 코멘트 */
  comment: string;
  onCommentChange: (comment: string) => void;
  /** 기본 "이 게임을 추천하는 이유를 적어주세요 (선택)" */
  commentPlaceholder?: string;
  /** 주면 입력창 아래 "N/한도" 카운터를 보여주고, 넘으면 danger */
  commentLimit?: number;
  /** 끌고 있는 행 */
  dragging?: boolean;
  /** 드래그 라이브러리가 주는 순서 손잡이 속성 */
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  onToggleFeatured: () => void;
  onRemove: () => void;
  className?: string;
}

export function EditGameRow({
  name,
  imageSrc,
  imageAlt,
  description,
  descriptionLoading = false,
  featured = false,
  comment,
  onCommentChange,
  commentPlaceholder = "이 게임을 추천하는 이유를 적어주세요 (선택)",
  commentLimit,
  dragging = false,
  dragHandleProps,
  onToggleFeatured,
  onRemove,
  className,
}: EditGameRowProps) {
  const counterId = useId();
  const featuredLabel = featured ? "대표 해제" : "대표로 지정";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border bg-surface p-3 transition-colors duration-fast ease-out motion-reduce:transition-none",
        dragging && "border-line-selected bg-surface-overlay",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <GameImage
          src={imageSrc}
          alt={imageAlt}
          className="w-24 shrink-0 rounded-sm md:w-40"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-heading-md text-fg">{name}</span>
            {featured && <Badge>대표</Badge>}
          </div>
          {descriptionLoading ? (
            // 설명 1줄과 같은 줄 높이(text-body-sm) 안에 스켈레톤을 두어, 받은 뒤에도 행 높이가 바뀌지 않게 한다
            <div role="status" className="text-body-sm">
              <span
                aria-hidden
                className="inline-block h-3 w-7/10 animate-[pulse_1.4s_ease-out_infinite] rounded-sm bg-line align-middle motion-reduce:animate-none"
              />
              <span className="sr-only">게임 설명을 불러오는 중</span>
            </div>
          ) : (
            description && (
              <p
                title={description}
                className="truncate text-body-sm text-fg-tertiary"
              >
                {description}
              </p>
            )
          )}
        </div>
        <div className="flex shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label={featuredLabel}
            title={featuredLabel}
            aria-pressed={featured}
            onClick={onToggleFeatured}
          >
            <Star
              strokeWidth={1.75}
              fill={featured ? "currentColor" : "none"}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="순서 바꾸기"
            title="순서 바꾸기"
            className="cursor-grab"
            {...dragHandleProps}
          >
            <GripVertical strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="목록에서 빼기"
            title="목록에서 빼기"
            onClick={onRemove}
          >
            <X strokeWidth={1.75} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          placeholder={commentPlaceholder}
          aria-label={`${name} 추천 코멘트`}
          aria-describedby={commentLimit !== undefined ? counterId : undefined}
        />
        {commentLimit !== undefined && (
          <span
            id={counterId}
            className={cn(
              "self-end text-caption text-fg-tertiary",
              comment.length > commentLimit && "text-danger",
            )}
          >
            {comment.length}/{commentLimit}
          </span>
        )}
      </div>
    </div>
  );
}
