import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// globals.css의 Bonfire 이름을 등록한다. 없으면 text-body-md를 글자색으로 보고
// text-fg와 합칠 때 하나를 지운다.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "title-lg",
        "title-md",
        "heading-lg",
        "heading-md",
        "quote-lg",
        "quote-sm",
        "body-md",
        "body-sm",
        "label-md",
        "caption",
        "caption-sm",
      ],
      spacing: [
        "control-sm",
        "control-md",
        "control-lg",
        "control-xl",
        "icon-xs",
        "icon-sm",
        "icon-md",
        "icon-lg",
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
