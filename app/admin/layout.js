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
        // Fix: Use absolute path from root, not relative
        const res = await fetch('/api/admin/auth/verify');
        const data = await res.json();
        
        if (pathname === '/admin/login') {
          setIsAuthenticated(true);
          return;
        }
        
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // For development, allow access
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [pathname, router]);
  
  if (pathname === '/admin/login') {
    return children;
  }
  
  if (isAuthenticated === null) {
    return (
      <div style={{ 
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