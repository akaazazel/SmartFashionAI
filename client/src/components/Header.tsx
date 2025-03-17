import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Search,
  Menu,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
            <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 12H4M20 12H22M12 2V4M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <Link href="/">
            <a className="ml-2 text-xl font-bold text-gray-800">SmartWardrobe AI</a>
          </Link>
        </div>
        
        <div className="md:flex items-center space-x-4 hidden">
          {user && (
            <>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search your wardrobe..."
                  className="pl-10 pr-4 py-2 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || user.username} />
                    <AvatarFallback>{(user.displayName || user.username).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden sm:inline-block">
                    {user.displayName || user.username}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {}} className="cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer" 
                  onSelect={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <div className="relative my-2">
            <Input
              type="text"
              placeholder="Search your wardrobe..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <nav className="mt-2 space-y-1">
            <Link href="/wardrobe">
              <a className={`block px-3 py-2 rounded-md ${location === '/wardrobe' || location === '/' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                My Wardrobe
              </a>
            </Link>
            <Link href="/outfits">
              <a className={`block px-3 py-2 rounded-md ${location === '/outfits' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Outfits
              </a>
            </Link>
            <Link href="/recommendations">
              <a className={`block px-3 py-2 rounded-md ${location === '/recommendations' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Recommendations
              </a>
            </Link>
            <Link href="/sustainability">
              <a className={`block px-3 py-2 rounded-md ${location === '/sustainability' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                Sustainability
              </a>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
