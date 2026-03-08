export default function PageBanner({ title, subtitle, breadcrumb }) {
    return (
        <section className="page-banner">
            <div className="container">
                <div className="page-banner-content">
                    {subtitle && <span className="section-badge">{subtitle}</span>}
                    <h1>{title}</h1>
                    {breadcrumb && (
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb-list">
                                {breadcrumb.map((item, i) => (
                                    <li key={i} className={i === breadcrumb.length - 1 ? 'active' : ''}>
                                        {i < breadcrumb.length - 1 ? (
                                            <a href={item.href}>{item.label}</a>
                                        ) : (
                                            item.label
                                        )}
                                        {i < breadcrumb.length - 1 && <span className="sep"> / </span>}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
}
