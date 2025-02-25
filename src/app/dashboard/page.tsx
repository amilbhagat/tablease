import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {session.user?.name || "User"}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Orders" 
          description="Create and manage orders"
          href="/orders"
        />
        <DashboardCard 
          title="Menu" 
          description="Manage menu items and categories"
          href="/menu"
        />
        <DashboardCard 
          title="Reports" 
          description="View sales and performance reports"
          href="/reports"
        />
        <DashboardCard 
          title="Staff" 
          description="Manage staff and permissions"
          href="/staff"
        />
        <DashboardCard 
          title="Settings" 
          description="Configure system settings"
          href="/settings"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

function DashboardCard({ title, description, href }: DashboardCardProps) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
} 