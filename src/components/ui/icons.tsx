import { Component, JSX } from "solid-js";

interface IconProps {
  class?: string;
  size?: number;
  style?: JSX.CSSProperties;
}

export const PlusIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export const TrashIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export const EyeIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export const EyeOffIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

export const StickerIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-5 h-5"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

export const ChevronDownIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const SuperStickerIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class ?? "w-5 h-5"}
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="noteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE066" />
        <stop offset="100%" stop-color="#FFCC00" />
      </linearGradient>
      <linearGradient id="foldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#E6B800" />
        <stop offset="100%" style="stop-color:#FFD633" />
      </linearGradient>
      <filter id="noteShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="3"
          flood-color="#000"
          flood-opacity="0.2"
        />
      </filter>
    </defs>

    <g filter="url(#noteShadow)">
      <path
        d="M8 8C8 3.582 11.582 0 16 0h96c4.418 0 8 3.582 8 8v80L88 120H16c-4.418 0-8-3.582-8-8V8z"
        fill="url(#noteGrad)"
      />

      <path
        d="M120 88v24c0 4.418-3.582 8-8 8H88l32-32z"
        fill="url(#foldGrad)"
      />

      <path d="M88 120l32-32v6L94 120h-6z" fill="#C9A000" opacity="0.5" />

      <path
        d="M8 8C8 3.582 11.582 0 16 0h96c4.418 0 8 3.582 8 8v3H8V8z"
        fill="#fff"
        opacity="0.35"
      />
    </g>

    <g>
      <rect
        x="20"
        y="28"
        width="72"
        height="8"
        rx="4"
        fill="#B8860B"
        opacity="0.45"
      />
      <rect
        x="20"
        y="46"
        width="58"
        height="8"
        rx="4"
        fill="#B8860B"
        opacity="0.35"
      />
      <rect
        x="20"
        y="64"
        width="66"
        height="8"
        rx="4"
        fill="#B8860B"
        opacity="0.3"
      />
    </g>
  </svg>
);

export const BoldIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    width={props.size ?? 14}
    height={props.size ?? 14}
    style={props.style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

export const ItalicIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    width={props.size ?? 14}
    height={props.size ?? 14}
    style={props.style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

export const UnderlineIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    width={props.size ?? 14}
    height={props.size ?? 14}
    style={props.style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);

export const LinkIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    width={props.size ?? 14}
    height={props.size ?? 14}
    style={props.style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const BulletListIcon: Component<IconProps> = (props) => (
  <svg
    class={props.class}
    width={props.size ?? 14}
    height={props.size ?? 14}
    style={props.style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2">
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </svg>
);
