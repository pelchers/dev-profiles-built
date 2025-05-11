import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { Dropdown, DropdownItem } from "./Dropdown";
import ProfilePage from './../../pages/ProfilePage';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 w-full flex items-center justify-between px-4 md:px-8 py-3 bg-white text-black border-b-4 border-arcade-blue shadow-[0_0_8px_#00CFFF] rounded-b-lg z-40">
      {/* Left side: Hamburger menu and desktop nav */}
      <div className="flex items-center space-x-4">
        {/* Hamburger menu */}
        <div className="relative" ref={menuRef}>
          <button 
            className="p-2 rounded-full transition-all duration-150 shadow-[0_4px_0_0_#00CFFF] hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px] active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-arcade-blue focus:ring-opacity-50"
            aria-label="Open menu" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <Dropdown align="left">
              <div className="p-3 border-b border-arcade-blue/20">
                <Button as={Link} to="/boilerplates" className="w-full mb-2 block md:hidden" onClick={() => setMenuOpen(false)}>
                  Boilerplates
                </Button>
                <Button as={Link} to="/explore" className="w-full block md:hidden" onClick={() => setMenuOpen(false)}>
                  Explore
                </Button>
              </div>
              <div className="py-2">
                <DropdownItem to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </DropdownItem>
                <DropdownItem to="/about" onClick={() => setMenuOpen(false)}>
                  About
                </DropdownItem>
                <DropdownItem to="/styles" onClick={() => setMenuOpen(false)}>
                  Styles
                </DropdownItem>
                <DropdownItem to="/contact" onClick={() => setMenuOpen(false)}>
                  Contact
                </DropdownItem>
                <DropdownItem to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </DropdownItem>
              </div>
            </Dropdown>
          )}
        </div>

        {/* Desktop navigation buttons */}
        <div className="hidden md:block">
          <Button as={Link} to="/boilerplates">
            Boilerplates
          </Button>
        </div>
      </div>

      {/* Center: Brand name */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="font-brand text-3xl tracking-wide select-none whitespace-nowrap animate-growShrink">
          Dev Profiles
        </span>
      </div>

      {/* Right side: Explore button and profile */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <Button as={Link} to="/explore">
            Explore
          </Button>
        </div>
        
        <div className="relative" ref={profileRef}>
          <button 
            className="p-2 rounded-full transition-all duration-150 shadow-[0_4px_0_0_#00CFFF] hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px] active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-arcade-blue focus:ring-opacity-50"
            aria-label="Profile"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
            </svg>
          </button>

          {profileOpen && (
            <Dropdown align="right">
              <div className="py-2">
                <DropdownItem to="/profile" onClick={() => setProfileOpen(false)}>
                  Profile
                </DropdownItem>
                <DropdownItem to="/edit-profile" onClick={() => setProfileOpen(false)}>
                  Edit Profile
                </DropdownItem>
                <DropdownItem to="/settings" onClick={() => setProfileOpen(false)}>
                  Settings
                </DropdownItem>
                <DropdownItem to="/login" onClick={() => setProfileOpen(false)}>
                  Login
                </DropdownItem>
                <DropdownItem to="/logout" onClick={() => setProfileOpen(false)}>
                  Logout
                </DropdownItem>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 