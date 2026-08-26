import { Link } from 'react-router-dom';

function DashboardPage() {
    return (
        <main className="app-shell">
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">
                        Fitness Tracker
                    </p>

                    <h1>Dashboard</h1>

                    <p className="page-header__description">
                        Track workouts, exercises, and your
                        fitness progress from one place.
                    </p>
                </div>
            </header>

            <section className="dashboard-grid">
                <article className="dashboard-card">
                    <p className="dashboard-card__eyebrow">
                        Exercise Library
                    </p>

                    <h2>Manage Exercises</h2>

                    <p>
                        Browse built-in exercises and create,
                        edit, or archive your custom exercises.
                    </p>

                    <Link
                        to="/exercises"
                        className="dashboard-card__link"
                    >
                        Open Exercise Library
                    </Link>
                </article>

                <article className="dashboard-card">
                    <p className="dashboard-card__eyebrow">
                        Workout Tracking
                    </p>

                    <h2>Workouts</h2>

                    <p>
                        Workout logging and performance tracking
                        will be built in the next development
                        phase.
                    </p>

                    <Link
                        to="/workouts"
                        className="dashboard-card__link"
                    >
                        View Workouts
                    </Link>
                </article>
            </section>
        </main>
    );
}

export default DashboardPage;