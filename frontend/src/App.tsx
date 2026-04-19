import './App.css'
import Navbar from './components/Navbar.tsx';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SocialPage from './pages/SocialPage.tsx';
import DecksPage from './pages/DecksPage.tsx';
import StudyPage from './pages/StudyPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

const navLinks = [
	{ label: 'Social', href: '/social' },
	{ label: 'Decks', href: '/decks' },
	{ label: 'Study', href: '/study' },
];

function App() {
	return (
		<>
			<Navbar title="Quizler" links={navLinks} />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/social" element={<SocialPage />} />
				<Route path="/decks" element={<DecksPage />} />
			<Route path="/study" element={<StudyPage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</>
	);
}

export default App;