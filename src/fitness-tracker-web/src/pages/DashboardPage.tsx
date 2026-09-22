import {
    Link,
} from 'react-router-dom';

function DashboardPage() {
    return (
        <main className="app-shell">
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">
                        Fitness Tracker
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="page-header__description">
                        Track workouts, manage
                        exercises, and review your
                        training history from one
                        place.
                    </p>
                </div>
            </header>

            <section className="dashboard-grid">
                <article className="dashboard-card">
                    <p className="dashboard-card__eyebrow">
                        Exercise Library
                    </p>

                    <h2>
                        Manage Exercises
                    </h2>

                    <p>
                        Browse built-in exercises
                        and create, edit, or archive
                        your custom exercises.
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

                    <h2>
                        Active Workouts
                    </h2>

                    <p>
                        Start a workout or continue
                        a training session already
                        in progress.
                    </p>

                    <Link
                        to="/workouts"
                        className="dashboard-card__link"
                    >
                        Open Workouts
                    </Link>
                </article>

                <article className="dashboard-card">
                    <p className="dashboard-card__eyebrow">
                        Training History
                    </p>

                    <h2>
                        Workout History
                    </h2>

                    <p>
                        Review completed sessions
                        and inspect your recorded
                        exercises, sets, and
                        performance.
                    </p>

                    <Link
                        to="/history"
                        className="dashboard-card__link"
                    >
                        View Workout History
                    </Link>
                </article>
            </section>
        </main>
    );
}

export default DashboardPage;