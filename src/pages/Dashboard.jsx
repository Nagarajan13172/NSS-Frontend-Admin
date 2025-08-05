import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUniversity, FaUsers, FaUser, FaFilter, FaPhone, FaFileExcel, FaLeaf } from 'react-icons/fa';
import { API_BASE } from '../api';
import { getToken, removeToken } from '../auth';
import periyarLogo from '../../public/logo.png';

export default function Dashboard({ onLogout }) {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [principalFilter, setPrincipalFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [particles, setParticles] = useState([]);

  const collegeList = [
    "College of Engineering, Guindy", "PSG College of Technology", "SSN College of Engineering",
    "Thiagarajar College of Engineering", "Kumaraguru College of Technology", "Sona College of Technology",
    "Coimbatore Institute of Technology", "Government College of Technology", "Velammal Engineering College",
    "Meenakshi Sundararajan Engineering College", "Sri Sairam Engineering College", "Rajalakshmi Engineering College",
    "K.L.N. College of Engineering", "RMK Engineering College", "Panimalar Engineering College",
    "Easwari Engineering College", "KCG College of Technology", "St. Joseph’s College of Engineering",
    "Dr. Mahalingam College of Engineering", "Bannari Amman Institute of Technology", "Kongu Engineering College",
    "Government College of Engineering, Salem", "Sri Krishna College of Engineering", "Adhiyamaan College of Engineering",
    "Annamalai University", "Anna University Regional Campus", "VIT Vellore",
    "SRM Institute of Science and Technology", "SASTRA University", "Hindustan Institute of Technology",
    "Saveetha Engineering College", "Jeppiaar Engineering College", "Vel Tech University",
    "Dr. MGR University", "Amrita Vishwa Vidyapeetham", "Chennai Institute of Technology",
    "Narayanaguru College of Engineering", "Dhanalakshmi Srinivasan Engineering College", "Oxford Engineering College",
    "Paavai Engineering College", "Mepco Schlenk Engineering College", "PSNA College of Engineering",
    "Velalar College of Engineering", "Shree Venkateshwara Hi-Tech", "Selvam College of Technology",
    "SNS College of Technology", "SKCET", "Dr. NGP Institute of Technology", "Sri Ramakrishna Engineering College"
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setColleges(res.data);
        setFilteredColleges(res.data);
      })
      .catch(() => {
        alert('Session expired');
        removeToken();
        onLogout();
      });
  }, [onLogout]);

  useEffect(() => {
    const filtered = colleges.filter((college) =>
      (searchTerm ? college.college_name === searchTerm : true) &&
      (unitFilter ? college.nss_units.toString() === unitFilter : true) &&
      college.principal_name.toLowerCase().includes(principalFilter.toLowerCase()) &&
      college.principal_mobile.includes(mobileFilter)
    );
    setFilteredColleges(filtered);
    setCurrentPage(1);
  }, [searchTerm, unitFilter, principalFilter, mobileFilter, colleges]);

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

  const downloadCSV = () => {
    if (!filteredColleges.length) return;

    const header = Object.keys(filteredColleges[0]).join(',');
    const rows = filteredColleges.map((c) => Object.values(c).join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'college_submissions.csv';
    a.click();
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredColleges.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredColleges.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalColleges = colleges.length;
  const totalStudents = colleges.reduce((sum, c) => sum + (c.total_students || 0), 0);
  const totalUnits = colleges.reduce((sum, c) => sum + (parseInt(c.nss_units) || 0), 0);
  const filteredCount = filteredColleges.length;

  return (
    <div className="min-h-screen bg-white to-cyan-300 relative overflow-hidden pt-1 pb-12 px-4 sm:px-7 lg:px-10">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .shadow-text { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
          .star-effect {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            animation: twinkle 2s infinite ease-in-out;
          }
          @keyframes twinkle {
            0%, 100% { transform: scale(0.5); opacity: 0.3; }
            50% { transform: scale(1); opacity: 0.8; }
          }
          .card-glow {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .card-glow::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
            transform: rotate(45deg);
            transition: all 0.5s ease;
            opacity: 0;
          }
          .card-glow:hover::before {
            opacity: 0.5;
            transform: rotate(45deg) translate(20%, 20%);
          }
        `}
      </style>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-r from-emerald-700 to-teal-600 shadow-[0_8px_35px_rgba(16,185,129,0.35)] z-50 flex items-center justify-between px-6 lg:px-20 relative overflow-hidden"
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1920 96"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#34D399', stopOpacity: 0.5 }} />
            </linearGradient>
          </defs>
          <g>
            <path
              d="M0,96 C200,48 400,72 600,48 C800,24 1000,72 1200,48 C1400,24 1600,72 1920,48"
              fill="url(#headerGradient)"
              opacity="0.3"
            />
            <path
              d="M300,84 Q400,36 500,84 T700,84 Q800,36 900,84 T1100,84 Q1200,36 1300,84 T1500,84"
              fill="none"
              stroke="url(#headerGradient)"
              strokeWidth="8"
              opacity="0.4"
            />
            <path
              d="M50,72 Q150,24 250,72 T450,72 Q550,24 650,72 T850,72"
              fill="none"
              stroke="url(#headerGradient)"
              strokeWidth="6"
              opacity="0.35"
            />
          </g>
        </svg>
        <div className="flex items-center space-x-6 relative z-10">
          <motion.img
            src={periyarLogo}
            alt="Periyar University Logo"
            className="w-16 h-16 rounded-full border-2 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.65)] object-cover"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.15, rotate: 8, boxShadow: '0 0 45px rgba(16, 185, 129, 0.85)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl lg:text-4xl font-inter font-extrabold text-white tracking-tight"
            >
              Periyar University
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base lg:text-xl font-poppins font-medium text-emerald-100 leading-tight"
            >
              NAAC 'A++' Grade | NIRF Rank 56
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base lg:text-xl font-poppins font-medium text-emerald-100"
            >
              Salem-636011, Tamil Nadu
            </motion.p>
          </div>
        </div>
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239,68,68,0.75)' }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 px-6 py-3 bg-red-600 text-white rounded-full font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <FaLeaf className="text-xl" />
          Logout
        </motion.button>
      </motion.header>
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
        className="max-w-7xl mx-auto relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-inter font-extrabold text-emerald-900 text-center mb-10 pt-4 tracking-tight shadow-text"
        >
          NSS Submissions Dashboard
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: FaUniversity, title: 'Total Colleges', value: totalColleges, gradient: 'from-emerald-500 to-teal-500', delay: 0.3 },
            { icon: FaUsers, title: 'Total Students', value: totalStudents, gradient: 'from-cyan-500 to-blue-500', delay: 0.4 },
            { icon: FaFilter, title: 'Filtered Content', value: filteredCount, gradient: 'from-lime-500 to-green-500', delay: 0.5 },
            { icon: FaUsers, title: 'Total Units', value: totalUnits, gradient: 'from-teal-500 to-cyan-500', delay: 0.6 },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: card.delay }}
              className={`relative card-glow bg-gradient-to-br ${card.gradient} backdrop-blur-xl rounded-2xl shadow-2xl border-4 border-white/30 ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300 p-6 flex items-center gap-4 overflow-hidden`}
            >
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="star-effect"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <card.icon className="text-2xl text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-poppins font-semibold text-white">{card.title}</h3>
                <p className="text-2xl font-inter font-bold text-white">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border-4 border-emerald-500/75 ring-4 ring-emerald-300/55 p-6 mb-10"
        >
          <h3 className="text-2xl font-inter font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <FaFilter className="text-emerald-800 text-2xl" />
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2 text-lg font-poppins">
                <FaUniversity className="text-emerald-800" />
                College Name
              </label>
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800"
              >
                <option value="">All Colleges</option>
                {collegeList.map((college) => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2 text-lg font-poppins">
                <FaUsers className="text-emerald-800" />
                NSS Units
              </label>
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800"
              >
                <option value="">All Units</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num} Units</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2 text-lg font-poppins">
                <FaUser className="text-emerald-800" />
                Principal Name
              </label>
              <input
                type="text"
                placeholder="Search principal..."
                value={principalFilter}
                onChange={(e) => setPrincipalFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2 flex items-center gap-2 text-lg font-poppins">
                <FaPhone className="text-emerald-800" />
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Search mobile..."
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800"
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border-4 border-emerald-500/75 ring-4 ring-emerald-300/55 hover:ring-emerald-400/75 transition-all duration-300 p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-inter font-bold text-emerald-900 flex items-center gap-3">
              <FaFileExcel className="text-emerald-800 text-2xl" />
              Submission Records
            </h3>
            <motion.button
              onClick={downloadCSV}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16,185,129,0.75)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <FaFileExcel className="text-xl" />
              Export CSV
            </motion.button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-800 font-poppins font-semibold">Show</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/75 transition-all duration-300 font-poppins text-gray-800"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>{num} entries</option>
                ))}
              </select>
            </div>
            <div className="text-gray-800 font-poppins">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredColleges.length)} of {filteredColleges.length} entries
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="px-6 py-4 text-left font-poppins font-semibold rounded-tl-xl">ID</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold">College</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold">NSS Units</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold">Unit No.</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold">Principal</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold">Mobile</th>
                  <th className="px-6 py-4 text-left font-poppins font-semibold rounded-tr-xl">Excel</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((c, index) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-200 hover:bg-emerald-50/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-poppins font-semibold text-gray-700">{c.id}</td>
                    <td className="px-6 py-4 font-poppins font-semibold  text-gray-700">{c.college_name}</td>
                    <td className="px-6 py-4 font-poppins font-semibold  text-gray-700">{c.nss_units}</td>
                    <td className="px-6 py-4 font-poppins font-semibold text-gray-700">{c.unit_number}</td>
                    <td className="px-6 py-4 font-poppins font-semibold text-gray-700">{c.principal_name}</td>
                    <td className="px-6 py-4 font-poppins font-semibold  text-gray-700">{c.principal_mobile}</td>
                    <td className="px-6 py-4">
                      <a
                        className="text-blue-600 hover:text-blue-800  font-poppins font-semibold  hover:underline transition duration-200"
                        href={`http://localhost:4000/uploads/${c.excel_file}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <motion.button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 bg-emerald-600 text-white rounded-xl font-poppins font-semibold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </motion.button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => paginate(page)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`px-4 py-2 rounded-xl font-poppins font-semibold ${currentPage === page ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 bg-emerald-600 text-white rounded-xl font-poppins font-semibold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}