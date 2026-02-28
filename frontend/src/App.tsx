import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.tsx';
import HeroSection from './components/HeroSection.tsx';
import RecentLevelups from './components/RecentLevelups.tsx';

const navLinks = [
    { label: 'Social', href: '/social' },
    { label: 'Decks', href: '/decks' },
    { label: 'Games', href: '/games' },
];

function App() {
  return (
    <>
      <div>
        <Navbar title="Quizzler" links={navLinks} />
        <HeroSection />
        <RecentLevelups />
      </div>
    </>
  )
}

export default App
