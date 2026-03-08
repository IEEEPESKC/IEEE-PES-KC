import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children }) {
    return (
        <div className="box-layout">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
