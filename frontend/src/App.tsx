// Main App Component - Routes and Navigation Setup
import './App.css'
import Navbar from './components/Navbar.tsx';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import SocialPage from './pages/SocialPage.tsx';
import DecksPage from './pages/DecksPage.tsx';
import StudyPage from './pages/StudyPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

// Navigation links for the navbar
const navLinks = [
	{ label: 'Social', href: '/social' },
	{ label: 'Decks', href: '/decks' },
	{ label: 'Study', href: '/study' },
];

// Main app with routing
function App() {
	return (
		<>
			<Navbar title="Quizler" links={navLinks} />
			{/* Page routes */}
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