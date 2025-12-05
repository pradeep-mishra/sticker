// CSS Styles for content script UI
export function getStyles(): string {
  return `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    [contenteditable]:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
    }
    
    [contenteditable]:focus {
      outline: none;
    }
    
    .sticker-ui * {
      box-sizing: border-box;
    }
    
    .sticker-ui button:hover {
      opacity: 0.8;
    }
    
    /* Rich text formatting styles */
    .sticker-ui ul, .sticker-ui ol {
      margin: 4px 0;
      padding-left: 20px;
    }
    
    .sticker-ui ul {
      list-style-type: disc;
    }
    
    .sticker-ui ol {
      list-style-type: decimal;
    }
    
    .sticker-ui li {
      margin: 2px 0;
    }
    
    .sticker-ui b, .sticker-ui strong {
      font-weight: 600;
    }
    
    .sticker-ui i, .sticker-ui em {
      font-style: italic;
    }
  `;
}
