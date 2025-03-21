// components/Header.jsx
import React from 'react';

import { Bell, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from './ModeToogle';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="font-bold text-xl">Interviewer Dashboard</div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/40/40" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;