import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import { getToken, removeToken } from '../auth';
import { motion } from 'framer-motion';

export default function Dashboard({ onLogout }) {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        setColleges(res.data);
        setFilteredColleges(res.data); // Initialize filtered colleges
      })
      .catch(() => {
        alert('Session expired');
        removeToken();
        onLogout();
      });
  }, []);

  useEffect(() => {
    // Filter colleges based on search term
    const filtered = colleges.filter((college) =>
      college.college_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColleges(filtered);
  }, [searchTerm, colleges]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Submissions Dashboard
          </h2>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
          >
            Logout
          </button>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          />
        </div>
        <button
          onClick={downloadCSV}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium mb-6"
        >
          Export CSV
        </button>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-4 text-left font-medium rounded-tl-lg">ID</th>
                <th className="px-6 py-4 text-left font-medium">College</th>
                <th className="px-6 py-4 text-left font-medium">NSS Units</th>
                <th className="px-6 py-4 text-left font-medium">Unit No.</th>
                <th className="px-6 py-4 text-left font-medium">Principal</th>
                <th className="px-6 py-4 text-left font-medium">Mobile</th>
                <th className="px-6 py-4 text-left font-medium rounded-tr-lg">Excel</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((c, index) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 text-gray-700">{c.id}</td>
                  <td className="px-6 py-4 text-gray-700">{c.college_name}</td>
                  <td className="px-6 py-4 text-gray-700">{c.nss_units}</td>
                  <td className="px-6 py-4 text-gray-700">{c.unit_number}</td>
                  <td className="px-6 py-4 text-gray-700">{c.principal_name}</td>
                  <td className="px-6 py-4 text-gray-700">{c.principal_mobile}</td>
                  <td className="px-6 py-4">
                    <a
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition duration-200"
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
      </motion.div>
    </div>
  );
}