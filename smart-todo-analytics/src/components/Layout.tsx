// components/Layout.tsx
import AuthActions from "./Auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Smart To-Do • Analytics</h1>
          <AuthActions />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-4 gap-6">
          <aside className="col-span-1 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-medium">Projects</h2>
            {/* later: project list */}
          </aside>

          <section className="col-span-3 bg-white p-6 rounded-lg shadow-sm">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
