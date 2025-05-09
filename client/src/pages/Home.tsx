import React from 'react';
import Section from '../components/common/Section';

const Home = () => (
  <Section className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl md:text-5xl font-brand text-indigo-500 animate-growShrink">Welcome to Dev Profiles</h1>
    <p className="text-lg md:text-xl text-gray-600 font-body mt-4 text-center">Build, share, and connect with developers and companies.</p>
    <div className="mt-4 font-mono text-arcade-green">// Accent/Mono Example</div>
  </Section>
);

export default Home; 