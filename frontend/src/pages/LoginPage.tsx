// Login/Register Page - Authentication form
// Features: Login for existing users, register for new users with role selection
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('')

  const handleSubmit = async () => {
    const url = isLogin ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/register';
    const body: any = { email, password };
    if (!isLogin){
      body.username = username;
      body.role = role;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      if (isLogin) localStorage.setItem('access_token', data.access_token);
      if (isLogin) localStorage.setItem('user_id', data.user_id);

      const userResponse = await fetch(`http://127.0.0.1:5000/api/user/${data.user_id}`);
      const userData = await userResponse.json();

      if (userResponse.ok) {
        localStorage.setItem('username', userData.data.username);
        window.dispatchEvent(new Event('authChange'));
      }

      navigate('/decks')

    } else {
      setMessage(data.error);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
          />
          {!isLogin && (
              <>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="login-input"
                    style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem', color: role === '' ? '#666' : 'white' }}
                >
                  <option value="" disabled hidden>Role</option>
                  <option value="student">I am a Student</option>
                  <option value="teacher">I am a Teacher</option>
                </select>
              </>
          )}
        </div>

        <div className="cta-buttons">
          <button className="cta-button primary" onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Register'}
          </button>
          <button className="cta-button secondary" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>

        {message && <p style={{ marginTop: '1rem', color: '#FF6600' }}>{message}</p>}
      </div>
    </section>
  );
}
