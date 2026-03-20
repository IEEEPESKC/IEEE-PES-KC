'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './admin.css';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/verify');
        const data = await res.json();
        
        if (!data.authenticated && pathname !== '/admin/login') {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(data.authenticated);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [pathname]);
  
  if (pathname === '/admin/login') {
    return children;
  }
  
  if (isAuthenticated === null) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}