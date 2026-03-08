import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="not-found-container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F0EDE5', // Sand color 
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                fontSize: '150px',
                fontWeight: '900',
                color: '#004643', // Cyprus color
                lineHeight: '1',
                marginBottom: '20px',
                opacity: '0.1',
                position: 'absolute'
            }}>404</div>

            <div className="glass-card" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '60px 40px',
                borderRadius: '24px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                zIndex: 1
            }}>
                <i className="ri-error-warning-line" style={{
                    fontSize: '4rem',
                    color: '#004643',
                    marginBottom: '24px',
                    display: 'block'
                }}></i>
                <h1 style={{ color: '#004643', marginBottom: '16px', fontSize: '2rem', fontWeight: '800' }}>Page Not Found</h1>
                <p style={{ color: '#555', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/" style={{
                    backgroundColor: '#004643',
                    color: '#FFF',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 16px rgba(0, 70, 67, 0.2)'
                }}>
                    <i className="ri-arrow-left-line"></i> Back to Home
                </Link>
            </div>
        </div>
    );
}
