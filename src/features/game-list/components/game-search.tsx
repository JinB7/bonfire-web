"use client";

import { Check, CircleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
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
  // 결과가 있으면 판을 연다. 사용자가 닫았으면(Esc, 바깥 클릭, 결과 선택) 다시 입력할 때까지 닫아 둔다
  const [dismissed, setDismissed] = useState(false);

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
        open={results !== undefined && !dismissed}
        onOpenChange={(open, { reason }) => {
          // 입력에 따른 여닫기는 따르지 않는다. Base UI는 한글처럼 조합 중인 글자를 검색어와 따로 다뤄서, 입력으로 여닫으면 판이 검색 결과와 어긋난다
          if (reason !== "input-change" && reason !== "input-clear")
            setDismissed(!open);
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
          // Base UI는 한글처럼 조합 중인 글자를 조합이 끝날 때(포커스를 잃는 등)에야 onValueChange로 알린다. 마지막 글자까지 바로 검색되게 입력값을 직접 넘긴다
          onChange={(event) => {
            setDismissed(false);
            onQueryChange(event.currentTarget.value);
          }}
        />
        <AutocompleteContent>
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
