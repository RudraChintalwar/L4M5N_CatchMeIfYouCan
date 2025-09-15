import Layout from "@/components/Layout";

export default function Page() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <div className="text-sm text-gray-500">Welcome — add tasks to get analytics</div>
        </div>

        <div className="border-dashed border-2 border-gray-200 rounded p-8 text-center text-gray-500">
          Empty task list — we'll add CRUD in Phase 2
        </div>
      </div>
    </Layout>
  );
}
