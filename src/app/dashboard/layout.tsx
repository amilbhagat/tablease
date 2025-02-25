import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Restaurant POS</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/signout"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Link>
          </nav>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6">
            <nav className="flex flex-col gap-2">
              <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                Dashboard
              </NavItem>
              <NavItem href="/dashboard/orders" icon={<ShoppingCart className="h-4 w-4" />}>
                Orders
              </NavItem>
              <NavItem href="/dashboard/reservations" icon={<CalendarDays className="h-4 w-4" />}>
                Reservations
              </NavItem>
              <NavItem href="/dashboard/customers" icon={<Users className="h-4 w-4" />}>
                Customers
              </NavItem>
              <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />}>
                Settings
              </NavItem>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}

function NavItem({ href, icon, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
} 