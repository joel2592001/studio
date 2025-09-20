'use client';

import Link from 'next/link';
import { CircleUser, Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { TransactionForm } from './dashboard/transaction-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out. Please try again.',
      });
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo />
        </Link>
        <Link
          href="/dashboard"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/transactions"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Transactions
        </Link>
        <Link
          href="/dashboard/goals"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Goals
        </Link>
        <Link
          href="/dashboard/reports"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Reports
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo />
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/dashboard/transactions"
              className="text-muted-foreground hover:text-foreground"
            >
              Transactions
            </Link>
            <Link
              href="/dashboard/goals"
              className="text-muted-foreground hover:text-foreground"
            >
              Goals
            </Link>
            <Link
              href="/dashboard/reports"
              className="text-muted-foreground hover:text-foreground"
            >
              Reports
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
        <TransactionForm />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
