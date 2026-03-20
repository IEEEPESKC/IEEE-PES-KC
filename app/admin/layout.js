'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './admin.css';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth...');
        const res = await fetch('/api/admin/auth/verify', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Auth response:', data);
          
          if (pathname === '/admin/login') {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
          
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            console.log('Not authenticated, redirecting to login');
            setIsAuthenticated(false);
            router.push('/admin/login');
          }
        } else {
          console.log('Auth endpoint failed');
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          } else {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // For development, allow access
        if (pathname !== '/admin/login') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [pathname, router]);
  
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px',
        color: '#004643'
      }}>
        Loading admin panel...
      </div>
    );
  }
  
  if (pathname === '/admin/login') {
    return children;
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