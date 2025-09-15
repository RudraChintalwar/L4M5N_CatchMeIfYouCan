import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <Layout>
        <h2 className="text-2xl font-bold mb-6">Analytics</h2>
        <AnalyticsDashboard />
      </Layout>
    </AuthGuard>
  );
}
