import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Tag from '../components/common/Tag';
import { Dropdown, DropdownItem } from '../components/common/Dropdown';

const Styles = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              <div className="bg-arcade-green text-black p-4 rounded-lg">Arcade Green (#00FF5F)</div>
              <div className="bg-arcade-blue text-black p-4 rounded-lg">Arcade Blue (#00CFFF)</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-brand mb-2">Accent Colors</h3>
              <div className="bg-[#FF4C4C] text-white p-4 rounded-lg">Neon Red (#FF4C4C)</div>
              <div className="bg-[#FFA500] text-black p-4 rounded-lg">Neon Orange (#FFA500)</div>
              <div className="bg-[#F9FF33] text-black p-4 rounded-lg">Neon Yellow (#F9FF33)</div>
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
                <Button className="bg-arcade-blue">Blue Variant</Button>
                <Button className="bg-[#FF4C4C] text-white">Red Variant</Button>
                <Button className="bg-[#FFA500] text-black">Orange Variant</Button>
                <Button className="bg-[#F9FF33] text-black">Yellow Variant</Button>
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
                <p className="text-gray-600">With arcade blue shadow</p>
              </Card>
              <Card className="bg-arcade-green text-black">
                <h4 className="font-brand text-xl mb-2">Arcade Green Card</h4>
                <p className="text-black/80">With arcade styling</p>
              </Card>
              <Card className="border-2 border-arcade-blue">
                <h4 className="font-brand text-xl mb-2">Bordered Card</h4>
                <p className="text-gray-600">With arcade blue border</p>
              </Card>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-xl font-brand mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Tag colorClass="bg-[#FF4C4C] text-white hover:animate-tag-grow">Red</Tag>
              <Tag colorClass="bg-[#FFA500] text-black hover:animate-tag-grow">Orange</Tag>
              <Tag colorClass="bg-[#F9FF33] text-black hover:animate-tag-grow">Yellow</Tag>
              <Tag colorClass="bg-arcade-green text-black hover:animate-tag-grow">Green</Tag>
              <Tag colorClass="bg-arcade-blue text-black hover:animate-tag-grow">Blue</Tag>
              <Tag colorClass="bg-[#4B0082] text-white hover:animate-tag-grow">Indigo</Tag>
              <Tag colorClass="bg-[#8F00FF] text-white hover:animate-tag-grow">Violet</Tag>
            </div>
          </div>
        </div>

        {/* Animations */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Animations</h2>
          <div className="grid gap-8">
            <div>
              <h3 className="text-xl font-brand mb-2">Grow & Shrink</h3>
              <div className="flex gap-4">
                <span className="font-brand text-2xl animate-growShrink">Animated Text</span>
                <Card className="animate-growShrink">
                  Animated Card
                </Card>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-brand mb-2">Fade In</h3>
              <div className="flex gap-4">
                <Card className="animate-fadeIn">
                  Fade In Card
                </Card>
                <Button className="animate-fadeIn">Fade In Button</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Shadows & Effects */}
        <div className="mb-12">
          <h2 className="text-2xl font-brand mb-4">Shadows & Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-[0_4px_0_0_#00CFFF]">
              Arcade Blue Shadow
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_0_8px_#00CFFF]">
              Neon Blue Glow
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-arcade-blue">
              Arcade Blue Border
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_4px_0_0_#00FF5F]">
              Arcade Green Shadow
            </div>
            <div className="p-4 bg-white rounded-lg shadow-[0_0_8px_#00FF5F]">
              Neon Green Glow
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-arcade-green">
              Arcade Green Border
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