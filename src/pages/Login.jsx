import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';
import { API_BASE } from '../api';
import { saveToken } from '../auth';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 40 }, () => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 15 + 10,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        color: `hsl(${Math.random() * 60 + 120}, 85%, 75%)`,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.speedX;
          let newY = p.y + p.speedY;
          if (newX < 0 || newX > window.innerWidth) p.speedX *= -1;
          if (newY < 0 || newY > window.innerHeight) p.speedY *= -1;
          return {
            ...p,
            x: newX,
            y: newY,
            size: p.size + (Math.random() - 0.5) * 0.4,
          };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, { username, password });
      saveToken(res.data.token);
      onLogin();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-200 to-teal-200 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .shadow-text { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
        `}
      </style>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="natureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: '#34D399', stopOpacity: 0.55 }} />
          </linearGradient>
        </defs>
        <g>
          <path
            d="M0,1080 C150,950 350,900 550,950 C750,1000 950,900 1150,950 C1350,1000 1550,900 1920,950"
            fill="url(#natureGradient)"
            opacity="0.35"
          />
          <path
            d="M100,900 C250,750 450,800 650,750 C850,700 1050,800 1250,750 C1450,700 1650,800 1900,750"
            fill="url(#natureGradient)"
            opacity="0.3"
          />
          <path
            d="M150,250 Q250,150 350,250 T550,250 Q650,150 750,250 T950,250 Q1050,150 1150,250 T1350,250"
            fill="none"
            stroke="url(#natureGradient)"
            strokeWidth="16"
            opacity="0.45"
          />
          <path
            d="M50,450 Q150,350 250,450 T450,450 Q550,350 650,450 T850,450 Q950,350 1050,450 T1250,450"
            fill="none"
            stroke="url(#natureGradient)"
            strokeWidth="14"
            opacity="0.4"
          />
          <path
            d="M250,650 Q350,550 450,650 T650,650 Q750,550 850,650 T1050,650"
            fill="none"
            stroke="url(#natureGradient)"
            strokeWidth="12"
            opacity="0.35"
          />
        </g>
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0.7, scale: 0 }}
              animate={{
                x: particle.x,
                y: particle.y,
                scale: particle.size / 10,
                opacity: 0.65,
              }}
              transition={{ duration: 0.03, ease: 'linear' }}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.75)',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-emerald-500/75 ring-4 ring-emerald-300/55 hover:ring-emerald-400/75 transition-all duration-300 p-8 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-inter font-extrabold text-emerald-900 text-center mb-8 tracking-tight shadow-text flex items-center justify-center gap-3"
        >
          <FaLeaf className="text-emerald-800 text-3xl" />
          NSS Admin Login
        </motion.h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-3 text-lg font-poppins">
              <FaUser className="text-emerald-800 text-2xl" />
              Username
            </label>
            <input
              id="username"
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800 text-lg placeholder-gray-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-3 text-lg font-poppins">
              <FaLock className="text-emerald-800 text-2xl" />
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800 text-lg placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-red-600 text-sm text-center font-poppins"
            >
              {error}
            </motion.div>
          )}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(16,185,129,0.75)' }}
            whileTap={{ scale: 0.97 }}
            className={`w-full bg-gradient-to-r from-emerald-700 to-teal-700 text-white py-4 rounded-xl font-bold font-poppins text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaLeaf className="text-2xl" />
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-600 font-poppins"
        >
          Forgot your password?{' '}
          <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline transition duration-200">
            Contact support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}