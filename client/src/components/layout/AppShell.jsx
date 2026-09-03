import Navbar from './Navbar';

export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh bg-surface-muted">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
