import React, { useState } from "react";
import type { SystemStats } from "@shared/schema";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Sidebar from "@/components/sidebar";

interface HeaderProps {
  systemStats?: SystemStats;
}

export default function Header({ systemStats }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation">
                <i className="fas fa-bars text-lg"></i>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-primary">
              <Sidebar systemStats={systemStats} />
            </SheetContent>
          </Sheet>

          <i className="fas fa-shield-alt text-lg md:text-2xl"></i>
          <h1 className="text-base md:text-xl font-bold truncate" data-testid="text-app-title">
            <span className="hidden sm:inline">CCTV Operations Dashboard</span>
            <span className="sm:hidden">CCTV Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full status-indicator"></div>
            <span className="text-xs md:text-sm" data-testid="text-system-status">
              <span className="hidden md:inline">System </span>Online
            </span>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary text-primary-foreground" align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block text-sm" data-testid="text-user-name">
              Administrator
            </div>
          )}
          <button
            className="p-2 hover:bg-secondary rounded-lg transition-colors touch-manipulation"
            data-testid="button-settings"
          >
            <i className="fas fa-cog text-sm md:text-base"></i>
          </button>
        </div>
      </div>
    </header>
  );
}