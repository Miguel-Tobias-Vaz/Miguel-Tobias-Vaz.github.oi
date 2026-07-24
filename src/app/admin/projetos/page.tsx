import { redirect } from "next/navigation";
import { ProjectAdmin } from "@/components/admin/project-admin";
import { isAuthenticated } from "@/lib/auth";
import { getProjects } from "@/lib/projects";
import "@/styles/admin.css";

export default async function AdminProjectsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return (
    <main className="admin-shell">
      <ProjectAdmin initialProjects={projects} />
    </main>
  );
}
