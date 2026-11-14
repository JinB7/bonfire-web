"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/styles/utils";

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInput({
  className,
  ...props
}: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.InputGroup
      data-slot="autocomplete-input-group"
      className={cn(
        "flex h-control-lg items-center gap-2 rounded-md border border-line-strong bg-surface-elevated px-3 transition-colors duration-fast ease-out focus-within:border-2 focus-within:border-focus-ring focus-within:px-[calc(var(--spacing-md)-1px)] has-aria-invalid:not-focus-within:border-danger motion-reduce:transition-none data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:bg-canvas",
        className,
      )}
    >
      <SearchIcon
        className="size-icon-md shrink-0 text-fg-tertiary"
        strokeWidth={1.75}
      />
      <AutocompletePrimitive.Input
        data-slot="autocomplete-input"
        className="min-w-0 flex-1 self-stretch bg-transparent text-body-md text-fg outline-hidden placeholder:text-fg-tertiary disabled:cursor-not-allowed disabled:text-fg-disabled disabled:placeholder:text-fg-disabled"
        {...props}
      />
    </AutocompletePrimitive.InputGroup>
  );
}

function AutocompleteContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  anchor,
  hidden,
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<
    AutocompletePrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    // hidden은 Portal째 숨긴다 (결과를 받기 전처럼 판을 잠시 감출 때)
    <AutocompletePrimitive.Portal hidden={hidden}>
      <AutocompletePrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        {/* 최대 6행: 행 높이 control-md × 6 + 안쪽 여백 + 테두리 */}
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            "max-h-[calc(6*var(--control-md)+2*var(--spacing-xs)+2px)] w-(--anchor-width) animate-in overflow-y-auto overscroll-contain rounded-lg border border-line-strong bg-surface-overlay p-1 duration-normal ease-out fade-in motion-reduce:animate-none",
            className,
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

function AutocompleteList({ ...props }: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List data-slot="autocomplete-list" {...props} />
  );
}

function AutocompleteItem({
  className,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "flex h-control-md w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-label-md whitespace-nowrap text-fg-secondary transition-colors duration-fast ease-out not-data-disabled:data-highlighted:bg-surface-selected not-data-disabled:data-highlighted:text-fg motion-reduce:transition-none data-disabled:cursor-default data-disabled:text-fg-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-sm",
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    // 결과가 있으면 Base UI가 children을 비운다. 알림 영역은 남겨 두고 여백만 없앤다
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "px-3 py-4 text-center text-caption text-fg-tertiary empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
};
