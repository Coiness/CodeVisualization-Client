import "./widgetPanel.css";

export function WidgetPanel() {
  return (
    <div className="widgetPanel">
      <button
        onClick={() => {
          console.log("DEBUG: ", "add number widget");
        }}
      >
        number
      </button>
      <button
        onClick={() => {
          console.log("DEBUG: ", "add string widget");
        }}
      >
        string
      </button>
    </div>
  );
}
