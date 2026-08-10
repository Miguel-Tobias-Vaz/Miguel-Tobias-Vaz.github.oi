import { redirect } from "next/navigation";
import { ContentAdmin } from "@/components/admin/content-admin";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import "@/styles/admin.css";

export default async function AdminContentPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return (
    <main className="admin-shell">
      <ContentAdmin initialContent={content} />
    </main>
  );
}
