import './App.css'
import Navbar from './components/Navbar.tsx';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SocialPage from './pages/SocialPage.tsx';
import DecksPage from './pages/DecksPage.tsx';
import GamesPage from './pages/GamesPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

const navLinks = [
	{ label: 'Social', href: '/social' },
	{ label: 'Decks', href: '/decks' },
	{ label: 'Games', href: '/games' },
];

function App() {
	return (
		<>
			<Navbar title="Quizler" links={navLinks} />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/social" element={<SocialPage />} />
				<Route path="/decks" element={<DecksPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/login" element={<LoginPage />} />
			</Routes>
		</>
	);
}

export default App;