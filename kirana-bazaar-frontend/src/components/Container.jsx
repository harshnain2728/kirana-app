export default function Container({ children }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      {children}
    </div>
  );
}