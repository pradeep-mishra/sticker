// RTE Toolbar Button Component
export function ToolbarButton(props: {
  onClick: () => void;
  title: string;
  children: any;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick();
      }}
      title={props.title}
      style={{
        padding: "4px 6px",
        background: "transparent",
        border: "none",
        "border-radius": "4px",
        cursor: "pointer",
        color: "#6b7280",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        transition: "background 0.15s, color 0.15s"
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLButtonElement).style.color = "#1f2937";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
      }}>
      {props.children}
    </button>
  );
}
