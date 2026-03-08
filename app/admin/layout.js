'use client';
import './admin.css';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
