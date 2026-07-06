export default function PanelContainer({ children }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {children}
    </div>
  );
}