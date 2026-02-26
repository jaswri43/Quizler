import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.tsx';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Decks', href: '/decks' },
    { label: 'Contact', href: '/contact' },
];

function App() {
  return (
    <>
      <div>
        <Navbar title="Quizzler" links={navLinks} />
      </div>
    </>
  )
}

export default App
