"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/app/assets/images/logo.webp";
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff, mdiEmail, mdiLock } from '@mdi/js';
import { useRouter } from "next/navigation";
import axios from "axios";

// URL dasar API dari variabel lingkungan
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

/**
 * Komponen halaman Login
 * @returns {JSX.Element} Komponen halaman login
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  /**
   * Fungsi untuk menangani pengiriman form login
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Mengirim permintaan login ke API
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email,
        password
      });
      
      // Memeriksa apakah respons berisi token dan user
      if (response.data && response.data.token && response.data.user) {
        // Menyimpan token di localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Menyimpan token di cookie untuk middleware
        document.cookie = `auth_token=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 hari
        
        // Menyimpan data user di localStorage jika rememberMe dicentang
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Redirect ke dashboard setelah login berhasil
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from') || '/dashboard';
        router.push(from);
      } else {
        setError("Format respons login tidak valid.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Login gagal. Silakan periksa kembali email dan password Anda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src={Logo} 
                alt="Klinik Sari Dharma Logo" 
                width={100} 
                height={100} 
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Klinik Sari Dharma
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Login Backoffice
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon path={mdiEmail} size={1} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon path={mdiLock} size={1} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    path={showPassword ? mdiEyeOff : mdiEye} 
                    size={1} 
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
                  />
                </button>
              </div>
            </div>
            
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Ingat saya
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Lupa password?
                </a>
              </div>
            </div>
            
            <div className="mb-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Klinik Sari Dharma. All rights reserved.
        </div>
      </div>
    </div>
  );
}
