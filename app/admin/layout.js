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
        const res = await fetch('admin/api/admin/auth/verify');
        const data = await res.json();
        
        // For testing, allow access if on login page or if we have a token
        if (pathname === '/admin/login') {
          setIsAuthenticated(true);
          return;
        }
        
        // Check for token in cookies (simplified for now)
        const hasToken = document.cookie.includes('admin_token');
        if (!hasToken) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Allow access for testing
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [pathname]);
  
  if (pathname === '/admin/login') {
    return children;
  }
  
  if (isAuthenticated === null) {
    return (
      <div className="admin-loading" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
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