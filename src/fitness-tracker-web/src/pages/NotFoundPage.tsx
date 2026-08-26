import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <main className="app-shell">
            <section className="status-panel">
                <h1>Page not found</h1>

                <p>
                    The page you're looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    className="page-link"
                >
                    Return to Dashboard
                </Link>
            </section>
        </main>
    );
}

export default NotFoundPage;