import './App.css'
import Navbar from './components/Navbar.tsx';
import RecentLevelups from './components/RecentLevelups.tsx';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SocialPage from './pages/SocialPage.tsx';
import DecksPage from './pages/DecksPage.tsx';

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
			</Routes>
		</>
	);
}

export default App;