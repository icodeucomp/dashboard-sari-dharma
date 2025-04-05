import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware untuk memeriksa autentikasi pengguna
 * Melindungi rute dashboard agar hanya dapat diakses oleh pengguna yang sudah login
 * @param request - Objek permintaan Next.js
 * @returns Response atau undefined
 */
export function middleware(request: NextRequest) {
  // Mengambil token autentikasi dari cookies
  const authToken = request.cookies.get('auth_token');
  
  // Periksa apakah URL permintaan dimulai dengan '/dashboard'
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // Jika ini adalah rute dashboard dan tidak ada token yang valid
  if (isDashboardRoute && (!authToken || authToken.value === '')) {
    // Redirect ke halaman login
    const loginUrl = new URL('/login', request.url);
    // Menyimpan URL yang dicoba diakses untuk redirect kembali setelah login
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    
    // Buat response untuk redirect
    const response = NextResponse.redirect(loginUrl);
    
    // Hapus cookie auth_token jika ada (untuk memastikan konsistensi)
    response.cookies.delete('auth_token');
    
    return response;
  }

  // Lanjutkan dengan permintaan jika autentikasi valid
  return NextResponse.next();
}

/**
 * Konfigurasi untuk menentukan jalur mana yang harus ditangani oleh middleware
 */
export const config = {
  // Menerapkan middleware hanya pada rute dashboard
  matcher: '/dashboard/:path*',
};
