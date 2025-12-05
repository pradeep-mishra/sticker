import { onCleanup } from "solid-js";

// Selection Overlay Component
export function SelectionOverlay(props: {
  onElementSelected: (el: Element) => void;
  onCancel: () => void;
}) {
  let lastHighlighted: Element | null = null;

  const clearHighlight = () => {
    if (lastHighlighted) {
      (lastHighlighted as HTMLElement).style.outline = "";
      lastHighlighted = null;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const target = e.target as Element;
    if (target.closest(".sticker-ui")) return;

    if (lastHighlighted && lastHighlighted !== target) {
      (lastHighlighted as HTMLElement).style.outline = "";
    }

    if (target !== document.body && target !== document.documentElement) {
      (target as HTMLElement).style.outline = "2px dashed #3B82F6";
      lastHighlighted = target;
    }
  };

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as Element;
    if (target.closest(".sticker-ui")) return;

    clearHighlight();

    if (target !== document.body && target !== document.documentElement) {
      props.onElementSelected(target);
    }
  };

  // Add event listeners
  document.addEventListener("mousemove", handleMouseMove, true);
  document.addEventListener("click", handleClick, true);

  // Proper cleanup using SolidJS onCleanup
  onCleanup(() => {
    clearHighlight();
    document.removeEventListener("mousemove", handleMouseMove, true);
    document.removeEventListener("click", handleClick, true);
  });

  return (
    <div
      class="sticker-ui"
      style={{
        position: "fixed",
        inset: "0",
        "z-index": "2147483645",
        "pointer-events": "none"
      }}>
      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          "pointer-events": "auto"
        }}>
        <div
          style={{
            background: "#3B82F6",
            color: "white",
            padding: "8px 16px",
            "border-radius": "9999px",
            "box-shadow": "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            "align-items": "center",
            gap: "8px",
            "font-size": "14px",
            "font-weight": "500",
            "font-family": "system-ui, sans-serif"
          }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "white",
              "border-radius": "50%",
              animation: "pulse 2s infinite"
            }}
          />
          Click an element to add a note
          <button
            type="button"
            onClick={() => props.onCancel()}
            style={{
              "margin-left": "8px",
              padding: "2px 8px",
              background: "rgba(255,255,255,0.2)",
              "border-radius": "4px",
              "font-size": "12px",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}>
            Done (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
