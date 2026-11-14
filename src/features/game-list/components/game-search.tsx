"use client";

import { Check, CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";
import { cn } from "@/lib/styles/utils";

export interface GameSearchResult {
  id: string;
  name: string;
  /** 이미 담은 게임. 고를 수 없고 오른쪽에 "담음"을 보여준다 */
  added?: boolean;
}

export interface GameSearchProps {
  /** 입력창의 검색어 */
  query: string;
  onQueryChange: (query: string) => void;
  /** 검색어에 맞는 게임. undefined(받는 중)면 결과 판을 띄우지 않고, 빈 배열이면 "검색 결과가 없어요" */
  results?: GameSearchResult[];
  /** 결과를 누르거나 Enter로 골랐을 때 */
  onSelect: (game: GameSearchResult) => void;
  /** 입력창 아래 안내 문구 */
  helper?: ReactNode;
  /** 입력창 아래 에러 문구. 있으면 helper 대신 보이고 테두리가 danger로 바뀐다 */
  error?: ReactNode;
  disabled?: boolean;
  /** 기본 "게임 이름으로 검색" */
  placeholder?: string;
  className?: string;
}

export function GameSearch({
  query,
  onQueryChange,
  results,
  onSelect,
  helper,
  error,
  disabled = false,
  placeholder = "게임 이름으로 검색",
  className,
}: GameSearchProps) {
  const inputId = useId();
  const messageId = useId();

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-label-md text-fg">
        게임 검색
      </label>
      <Autocomplete
        items={results ?? []}
        filter={null}
        value={query}
        onValueChange={(value, { reason }) => {
          // 결과를 고르면 Base UI가 입력창을 게임 이름으로 채운다. 검색어는 사용하는 쪽이 정한다
          if (reason !== "item-press") onQueryChange(value);
        }}
        itemToStringValue={(game) => game.name}
        disabled={disabled}
      >
        <AutocompleteInput
          id={inputId}
          type="search"
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? messageId : undefined}
        />
        <AutocompleteContent hidden={results === undefined}>
          <AutocompleteEmpty>검색 결과가 없어요</AutocompleteEmpty>
          <AutocompleteList>
            {(game: GameSearchResult) => (
              <AutocompleteItem
                key={game.id}
                value={game}
                disabled={game.added}
                onClick={() => onSelect(game)}
              >
                <span className="min-w-0 flex-1 truncate">{game.name}</span>
                {game.added && (
                  <span className="inline-flex shrink-0 items-center gap-1">
                    <Check strokeWidth={1.75} />
                    담음
                  </span>
                )}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      {error ? (
        <p
          id={messageId}
          className="flex items-center gap-1 text-caption text-danger"
        >
          <CircleAlert className="size-icon-sm shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : helper ? (
        <p id={messageId} className="text-caption text-fg-tertiary">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
