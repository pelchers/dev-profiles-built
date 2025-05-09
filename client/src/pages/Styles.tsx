import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Tag from '../components/common/Tag';
import { Dropdown, DropdownItem } from '../components/common/Dropdown';

const Styles = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <Section className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
      <div className="pb-8">
        <h1 className="text-4xl font-brand mb-8 animate-growShrink">Arcade Neon Style Guide</h1>

        {/* Color System */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Color System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Base Colors</h3>
              <div className="bg-white border border-gray-200 p-4 rounded-lg">Light Background (#FFFFFF)</div>
              <div className="bg-[#0F0F0F] text-white p-4 rounded-lg">Dark Background (#0F0F0F)</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Primary Colors</h3>
              <div className="bg-g3 text-black p-4 rounded-lg">g3 (Green) (#00FF5F)</div>
              <div className="bg-b3 text-black p-4 rounded-lg">b3 (Blue) (#00CFFF)</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Accent Colors</h3>
              <div className="bg-r3 text-white p-4 rounded-lg">r3 (Red) (#FF4C4C)</div>
              <div className="bg-o3 text-black p-4 rounded-lg">o3 (Orange) (#FFA500)</div>
              <div className="bg-y3 text-black p-4 rounded-lg">y3 (Yellow) (#F9FF33)</div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Typography</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-brand mb-2">Brand Font (Honk)</h3>
              <div className="font-brand space-y-2">
                <p className="text-4xl">The quick brown fox (4xl)</p>
                <p className="text-3xl">The quick brown fox (3xl)</p>
                <p className="text-2xl">The quick brown fox (2xl)</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-brand mb-2">Body Font (Inter)</h3>
              <div className="font-body space-y-2">
                <p className="text-lg font-bold">The quick brown fox (lg bold)</p>
                <p className="text-base">The quick brown fox (base)</p>
                <p className="text-sm">The quick brown fox (sm)</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-brand mb-2">Mono Font (VT323)</h3>
              <div className="font-mono space-y-2">
                <p className="text-lg">The quick brown fox (lg)</p>
                <p className="text-base">The quick brown fox (base)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Buttons</h2>
          <div className="grid gap-4">
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Regular Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button as={Link} to="/styles">Link Button</Button>
                <Button className="bg-b3">b3 Variant</Button>
                <Button className="bg-r3 text-white">r3 Variant</Button>
                <Button className="bg-o3 text-black">o3 Variant</Button>
                <Button className="bg-y3 text-black">y3 Variant</Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="opacity-50 cursor-not-allowed">Disabled</Button>
                <Button className="animate-pulse">Loading...</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Interactive Elements</h2>
          
          {/* Dropdowns */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-brand mb-2">Dropdowns</h3>
            <div className="relative">
              <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
                Toggle Dropdown
              </Button>
              {dropdownOpen && (
                <Dropdown>
                  <div className="py-2">
                    <DropdownItem to="/profile">Profile</DropdownItem>
                    <DropdownItem to="/settings">Settings</DropdownItem>
                    <DropdownItem to="/logout">Logout</DropdownItem>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-brand mb-2">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <h4 className="font-brand text-xl mb-2">Default Card</h4>
                <p className="text-gray-600">With blue shadow</p>
              </Card>
              <Card className="bg-g3 text-black">
                <h4 className="font-brand text-xl mb-2">g3 Card</h4>
                <p className="text-black/80">With arcade styling</p>
              </Card>
              <Card className="border-2 border-b3">
                <h4 className="font-brand text-xl mb-2">Bordered Card</h4>
                <p className="text-gray-600">With b3 border</p>
              </Card>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-xl font-brand mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Tag colorClass="bg-r3 text-white hover:animate-tag-grow">r3</Tag>
              <Tag colorClass="bg-o3 text-black hover:animate-tag-grow">o3</Tag>
              <Tag colorClass="bg-y3 text-black hover:animate-tag-grow">y3</Tag>
              <Tag colorClass="bg-g3 text-black hover:animate-tag-grow">g3</Tag>
              <Tag colorClass="bg-b3 text-black hover:animate-tag-grow">b3</Tag>
              <Tag colorClass="bg-i3 text-white hover:animate-tag-grow">i3</Tag>
              <Tag colorClass="bg-v3 text-white hover:animate-tag-grow">v3</Tag>
            </div>
          </div>
        </div>

        {/* Basic Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Basic Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Grow & Shrink</h3>
              <div className="flex flex-wrap gap-4">
                <span className="font-brand text-2xl animate-growShrink">Animated Text</span>
                <Card className="animate-growShrink">
                  Animated Card
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Float</h3>
              <div className="flex flex-wrap gap-4">
                <Card className="animate-float">
                  Float (3s)
                </Card>
                <Card className="animate-float-slow">
                  Float Slow (6s)
                </Card>
                <Card className="animate-float-fast">
                  Float Fast (1.5s)
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Pulse Effects</h3>
              <div className="flex flex-wrap gap-4">
                <Card className="animate-pulse-subtle">
                  Pulse Subtle
                </Card>
                <Card className="animate-pulse-glow text-b3">
                  Pulse Glow
                </Card>
                <Button className="animate-pulse">
                  Pulse (Tailwind Default)
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Movement</h3>
              <div className="flex flex-wrap gap-4">
                <Card className="animate-slide-in">
                  Slide In
                </Card>
                <Card className="animate-fade-in">
                  Fade In
                </Card>
                <Card className="animate-shake">
                  Shake
                </Card>
                <div className="animate-spin-slow bg-g3 w-12 h-12 rounded-full flex items-center justify-center">
                  <span>Spin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Banner Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Sliding Banners</h3>
              <div className="relative overflow-hidden h-16 bg-b5 rounded-lg mb-4">
                <div className="animate-banner-slide-left absolute whitespace-nowrap py-4 flex items-center">
                  <span className="text-white mx-4 text-xl font-brand">Breaking News</span>
                  <span className="text-white mx-4">Arcade Dev Profiles Launches New Features</span>
                  <span className="text-white mx-4 text-xl font-brand">Breaking News</span>
                  <span className="text-white mx-4">Arcade Dev Profiles Launches New Features</span>
                </div>
              </div>
              
              <div className="relative overflow-hidden h-16 bg-r5 rounded-lg">
                <div className="animate-banner-slide-right absolute whitespace-nowrap py-4 flex items-center">
                  <span className="text-white mx-4 text-xl font-brand">Limited Time Offer</span>
                  <span className="text-white mx-4">Join Premium For 30% Discount</span>
                  <span className="text-white mx-4 text-xl font-brand">Limited Time Offer</span>
                  <span className="text-white mx-4">Join Premium For 30% Discount</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Attention-Grabbing Banners</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-g3 text-black p-4 rounded-lg animate-banner-fade">
                  <h4 className="font-brand text-xl">Fading Banner</h4>
                  <p>Subtly fades in and out</p>
                </div>
                
                <div className="bg-y3 text-black p-4 rounded-lg animate-banner-scale">
                  <h4 className="font-brand text-xl">Scaling Banner</h4>
                  <p>Slightly scales up and down</p>
                </div>
                
                <div className="bg-b3 text-black p-4 rounded-lg animate-banner-attention">
                  <h4 className="font-brand text-xl">Attention Banner</h4>
                  <p>Pulses with glow effect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grid Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Grid Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Grid Appearance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="bg-b3 p-4 rounded-lg text-center animate-grid-appear"
                    style={{ animationDelay: `${(item - 1) * 0.1}s` }}
                  >
                    Grid Item {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Cascading Grid</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="bg-r3 p-4 rounded-lg text-white text-center animate-grid-cascade"
                    style={{ '--animation-delay': `${(item - 1) * 0.2}s` } as React.CSSProperties}
                  >
                    Cascade {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Staggered Grid</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div 
                    key={item}
                    className="bg-g3 p-4 rounded-lg text-center animate-grid-stagger"
                    style={{ '--animation-delay': `${(item - 1) * 0.1}s` } as React.CSSProperties}
                  >
                    Item {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Pop Grid</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="bg-y3 p-4 rounded-lg text-center animate-grid-pop"
                    style={{ '--animation-delay': `${(item - 1) * 0.15}s` } as React.CSSProperties}
                  >
                    Pop {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Gallery Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Gallery Item Effects</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group relative cursor-pointer overflow-hidden rounded-lg">
                  <div className="bg-g3 h-32 w-full"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-brand text-xl group-hover:animate-gallery-zoom">Zoom</span>
                  </div>
                </div>
                
                <div className="group relative cursor-pointer overflow-hidden rounded-lg">
                  <div className="bg-b3 h-32 w-full"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-brand text-xl group-hover:animate-gallery-slide">Slide</span>
                  </div>
                </div>
                
                <div className="group relative cursor-pointer overflow-hidden rounded-lg">
                  <div className="bg-r3 h-32 w-full"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-brand text-xl group-hover:animate-gallery-rotate">Rotate</span>
                  </div>
                </div>
                
                <div className="group relative cursor-pointer overflow-hidden rounded-lg">
                  <div className="bg-y3 h-32 w-full"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-brand text-xl group-hover:animate-gallery-flip">Flip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Scroll Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Page Scroll Animations</h2>
          <p className="mb-4 text-gray-600">These animations typically activate when elements enter the viewport.</p>
          
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Scroll Reveal Effects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="animate-scroll-fade-up">
                  <h4 className="font-brand text-xl mb-2">Fade Up</h4>
                  <p>Fades in while moving up</p>
                </Card>
                
                <Card className="animate-scroll-fade-left">
                  <h4 className="font-brand text-xl mb-2">Fade Left</h4>
                  <p>Fades in while moving left</p>
                </Card>
                
                <Card className="animate-scroll-fade-right">
                  <h4 className="font-brand text-xl mb-2">Fade Right</h4>
                  <p>Fades in while moving right</p>
                </Card>
                
                <Card className="animate-scroll-zoom-in">
                  <h4 className="font-brand text-xl mb-2">Zoom In</h4>
                  <p>Fades in while zooming</p>
                </Card>
                
                <Card className="col-span-1 md:col-span-2 animate-scroll-reveal">
                  <h4 className="font-brand text-xl mb-2">Dramatic Reveal</h4>
                  <p>Combines multiple effects for a dramatic entrance</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Load In/Out Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Load In/Out Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Load Effects</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="animate-load-in">
                  Load In
                </Button>
                
                <Button className="animate-load-in-out">
                  Load In & Out
                </Button>
                
                <Button onClick={handleShowToast}>
                  Show Toast
                </Button>
                
                <Button onClick={handleShowNotification}>
                  Show Notification
                </Button>
              </div>
              
              {/* Toast Example */}
              {showToast && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white p-4 rounded-lg animate-toast-in-out">
                  This is a toast notification
                </div>
              )}
              
              {/* Notification Example */}
              {showNotification && (
                <div className="fixed top-4 right-4 bg-g3 text-black p-4 rounded-lg shadow-lg animate-notify-in">
                  <div className="flex items-center gap-2">
                    <div className="font-bold">New Message</div>
                    <button 
                      onClick={() => setShowNotification(false)}
                      className="text-black ml-4"
                    >
                      ✕
                    </button>
                  </div>
                  <p>You have a new notification</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Fun Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Fun Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Playful Effects</h3>
              <div className="flex flex-wrap gap-6">
                <div className="animate-bounce-rotate bg-r3 w-16 h-16 rounded-full flex items-center justify-center text-white">
                  Bounce
                </div>
                
                <div className="animate-disco-spin bg-b3 w-16 h-16 rounded-full flex items-center justify-center text-white">
                  Disco
                </div>
                
                <div className="animate-heartbeat bg-r3 w-16 h-16 flex items-center justify-center text-white">
                  ❤️
                </div>
                
                <Button className="animate-rubber-band">
                  Rubber
                </Button>
                
                <Button className="animate-jelly">
                  Jelly
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Special Effects</h3>
              <div className="flex flex-wrap gap-6">
                <div className="animate-glitch bg-b3 p-4 rounded-lg text-white inline-block">
                  Glitch Effect
                </div>
                
                <div className="animate-rainbow bg-white p-4 rounded-lg inline-block">
                  Rainbow Effect
                </div>
                
                <div className="overflow-hidden whitespace-nowrap border-r-2 border-b3 pr-1 animate-typing inline-block">
                  <span className="font-mono">Typing animation effect...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Hover Animations</h2>
          <p className="mb-4 text-gray-600">Hover over these elements to see the animations.</p>
          
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Basic Hover Effects</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="hover:animate-hover-lift">
                  Lift on Hover
                </Button>
                <Button className="hover:animate-hover-glow text-r3">
                  Glow on Hover
                </Button>
                <Card className="hover:bg-b1 transition-colors duration-300">
                  Color Transition
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Interactive Hover</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="hover:animate-hover-bounce">
                  Bounce on Hover
                </Button>
                <Card className="hover:animate-hover-shake">
                  Shake on Hover
                </Card>
                <Button className="hover:animate-hover-pulse text-b3">
                  Pulse on Hover
                </Button>
                <div className="w-12 h-12 bg-y3 rounded-full flex items-center justify-center hover:animate-hover-spin">
                  <span>Spin</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Combined Effects</h3>
              <div className="flex flex-wrap gap-4">
                <Card className="hover:animate-hover-lift hover:shadow-lg transition-shadow duration-300">
                  Lift + Shadow
                </Card>
                <Button className="hover:animate-hover-glow hover:bg-r3 hover:text-white transition-colors duration-300">
                  Glow + Color
                </Button>
                <Tag colorClass="bg-b3 text-black hover:animate-hover-pulse hover:bg-b4 transition-colors duration-300">
                  Pulse + Dark
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Hover Effects */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Grid Hover Effects</h2>
          <p className="mb-4 text-gray-600">Hover over grid items to see effects. These can be applied to images in galleries.</p>
          
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Grid Item Hover</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-b3 p-4 rounded-lg text-center">
                  <div className="hover:scale-110 transition-transform duration-300">
                    Zoom on Hover
                  </div>
                </div>
                
                <div className="bg-g3 p-4 rounded-lg text-center">
                  <div className="hover:-translate-y-2 transition-transform duration-300">
                    Lift on Hover
                  </div>
                </div>
                
                <div className="bg-r3 text-white p-4 rounded-lg text-center">
                  <div className="hover:shadow-[0_0_8px_2px_rgba(0,207,255,0.6)] transition-shadow duration-300">
                    Glow on Hover
                  </div>
                </div>
                
                <div className="bg-y3 p-4 rounded-lg text-center">
                  <div className="hover:rotate-3 transition-transform duration-300">
                    Rotate on Hover
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Masonry Grid Layout */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Masonry-Style Grid</h2>
          <p className="mb-4 text-gray-600">Grid with varying heights to create a masonry effect.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 1, height: 'h-48', color: 'bg-b3' },
              { id: 2, height: 'h-64', color: 'bg-g3' },
              { id: 3, height: 'h-40', color: 'bg-r3', textColor: 'text-white' },
              { id: 4, height: 'h-56', color: 'bg-y3', span: 'md:col-span-2' },
              { id: 5, height: 'h-40', color: 'bg-i3', textColor: 'text-white' },
              { id: 6, height: 'h-52', color: 'bg-b3' },
            ].map((item) => (
              <div 
                key={item.id}
                className={`${item.color} ${item.height} ${item.span || ''} ${item.textColor || ''} p-4 rounded-lg flex items-center justify-center relative overflow-hidden group`}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  Item {item.id}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Staggered Grid Animation */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Staggered Grid Animation</h2>
          <p className="mb-4 text-gray-600">Grid items that appear with a cascading delay.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
              // Apply different colors in a pattern
              const bgColor = item % 4 === 1 ? "bg-b3" : 
                              item % 4 === 2 ? "bg-g3" : 
                              item % 4 === 3 ? "bg-r3" : "bg-y3";
              
              const textColor = item % 4 === 3 ? "text-white" : "";
              
              return (
                <div 
                  key={item} 
                  className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center justify-center opacity-0`}
                  style={{ 
                    animation: `fade-in 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  Item {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Image Gallery Grid</h2>
          <p className="mb-4 text-gray-600">Grid layout with hover effects suitable for image galleries.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => {
              // Apply different colors in a pattern
              const bgColor = item % 3 === 1 ? "bg-b3" : 
                              item % 3 === 2 ? "bg-g3" : "bg-r3";
              
              const textColor = item % 3 === 0 ? "text-white" : "";
              
              return (
                <div key={item} className="relative group overflow-hidden rounded-lg">
                  <div className={`${bgColor} h-48 w-full transition-transform duration-300 group-hover:scale-110`}></div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <span className={`text-transparent group-hover:text-white transition-colors duration-300 font-brand`}>
                      Gallery Item {item}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shadows & Effects */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Shadows & Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-[0_4px_0_0_#00CFFF]">
              b3 Shadow
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_0_8px_#00CFFF]">
              b3 Glow
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-b3">
              b3 Border
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_4px_0_0_#00FF5F]">
              g3 Shadow
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_0_8px_#00FF5F]">
              g3 Glow
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-g3">
              g3 Border
            </div>
          </div>
        </div>

        {/* Outline Styles */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Outline Styles</h2>
          <p className="mb-4 text-gray-600">Color-based outline styles using our design system.</p>
          
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Basic Outlines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg ol-r3">
                  ol-r3
                </div>
                <div className="p-4 bg-white rounded-lg ol-b3">
                  ol-b3
                </div>
                <div className="p-4 bg-white rounded-lg ol-g3">
                  ol-g3
                </div>
                <div className="p-4 bg-white rounded-lg ol-y3">
                  ol-y3
                </div>
                <div className="p-4 bg-white rounded-lg ol-o3">
                  ol-o3
                </div>
                <div className="p-4 bg-white rounded-lg ol-i3">
                  ol-i3
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Outline Thickness Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg ol-b3-thin">
                  ol-b3-thin
                </div>
                <div className="p-4 bg-white rounded-lg ol-b3">
                  ol-b3 (default)
                </div>
                <div className="p-4 bg-white rounded-lg ol-b3-thick">
                  ol-b3-thick
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Outline Style Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg ol-r3">
                  ol-r3 (solid)
                </div>
                <div className="p-4 bg-white rounded-lg ol-r3-dashed">
                  ol-r3-dashed
                </div>
                <div className="p-4 bg-white rounded-lg ol-r3-dotted">
                  ol-r3-dotted
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Outline Intensity (by shade)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="p-4 bg-white rounded-lg ol-g1">
                  ol-g1
                </div>
                <div className="p-4 bg-white rounded-lg ol-g2">
                  ol-g2
                </div>
                <div className="p-4 bg-white rounded-lg ol-g3">
                  ol-g3
                </div>
                <div className="p-4 bg-white rounded-lg ol-g4">
                  ol-g4
                </div>
                <div className="p-4 bg-white rounded-lg ol-g5">
                  ol-g5
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Glow Outlines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg ol-glow-b">
                  ol-glow-b
                </div>
                <div className="p-4 bg-white rounded-lg ol-glow-r">
                  ol-glow-r
                </div>
                <div className="p-4 bg-white rounded-lg ol-glow-g">
                  ol-glow-g
                </div>
                <div className="p-4 bg-white rounded-lg ol-glow-y">
                  ol-glow-y
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-brand mb-2">Outline on Interactive Elements</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="ol-b3 focus:ol-b3-thick">
                  Button with Blue Outline
                </Button>
                <Button className="focus:ol-g3-thick">
                  Focus for Green Outline
                </Button>
                <Card className="ol-r3-thin hover:ol-r3">
                  <h4 className="font-brand text-xl mb-2">Card with Outline</h4>
                  <p className="text-gray-600">Hover to see thicker outline</p>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Layout Examples</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>Grid Item 1</Card>
              <Card>Grid Item 2</Card>
              <Card>Grid Item 3</Card>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button>Flex Item 1</Button>
              <Button>Flex Item 2</Button>
              <Button>Flex Item 3</Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Styles; 