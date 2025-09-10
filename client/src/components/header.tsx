import type { SystemStats } from "@shared/schema";

interface HeaderProps {
  systemStats?: SystemStats;
}

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";

export default function Header({ systemStats }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
      <div className="relative flex items-center justify-between px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300 touch-manipulation backdrop-blur-sm">
                <i className="fas fa-bars text-lg drop-shadow-sm"></i>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-gradient-to-b from-primary to-secondary">
              <Sidebar systemStats={systemStats} />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm floating-element">
              <i className="fas fa-shield-alt text-lg md:text-2xl drop-shadow-sm"></i>
            </div>
            <h1 className="text-base md:text-xl font-bold truncate drop-shadow-sm" data-testid="text-app-title">
              <span className="hidden sm:inline">CCTV Operations Dashboard</span>
              <span className="sm:hidden">CCTV Dashboard</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
            <div className="w-3 h-3 bg-success rounded-full status-indicator drop-shadow-sm"></div>
            <span className="text-xs md:text-sm font-medium drop-shadow-sm" data-testid="text-system-status">
              <span className="hidden md:inline">System </span>Online
            </span>
          </div>
          <div className="hidden md:block text-sm" data-testid="text-user-name">
            Administrator
          </div>
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
