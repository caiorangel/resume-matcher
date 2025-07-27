export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90">
      {children}
    </div>
  );
}