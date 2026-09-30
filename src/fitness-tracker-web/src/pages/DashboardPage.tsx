import {
    Link,
} from 'react-router-dom';

import '../styles/dashboard.css';

function DashboardPage() {
    return (
        <main className="app-shell dashboard-page">
            <header className="dashboard-header">
                <p className="page-header__eyebrow">
                    Fitness Tracker
                </p>

                <h1>
                    Dashboard
                </h1>

                <p className="page-header__description">
                    Log training, manage your
                    exercise library, review
                    completed sessions, and
                    follow your progress over
                    time.
                </p>
            </header>

            <section
                className="dashboard-action-grid"
                aria-label="Fitness Tracker areas"
            >
                <Link
                    to="/workouts"
                    className="dashboard-action-card"
                >
                    <div>
                        <p className="dashboard-action-card__eyebrow">
                            Training
                        </p>

                        <h2>
                            Workouts
                        </h2>

                        <p>
                            Start a Workout,
                            continue active
                            sessions, log Exercises,
                            and record Sets.
                        </p>
                    </div>

                    <span className="dashboard-action-card__link">
                        Open Workouts →
                    </span>
                </Link>

                <Link
                    to="/exercises"
                    className="dashboard-action-card"
                >
                    <div>
                        <p className="dashboard-action-card__eyebrow">
                            Library
                        </p>

                        <h2>
                            Exercises
                        </h2>

                        <p>
                            Browse built-in
                            Exercises and manage
                            custom movements used
                            throughout your
                            training.
                        </p>
                    </div>

                    <span className="dashboard-action-card__link">
                        Open Exercise Library →
                    </span>
                </Link>

                <Link
                    to="/history"
                    className="dashboard-action-card"
                >
                    <div>
                        <p className="dashboard-action-card__eyebrow">
                            Completed Training
                        </p>

                        <h2>
                            Workout History
                        </h2>

                        <p>
                            Review completed
                            sessions, durations,
                            filters, metrics, and
                            historical Workout
                            details.
                        </p>
                    </div>

                    <span className="dashboard-action-card__link">
                        View Workout History →
                    </span>
                </Link>

                <Link
                    to="/progress"
                    className="dashboard-action-card dashboard-action-card--progress"
                >
                    <div>
                        <p className="dashboard-action-card__eyebrow">
                            Analytics
                        </p>

                        <h2>
                            Progress
                        </h2>

                        <p>
                            Explore Exercise
                            performance, personal
                            records, training
                            trends, and body
                            composition.
                        </p>
                    </div>

                    <span className="dashboard-action-card__link">
                        View Progress →
                    </span>
                </Link>
            </section>

            <section className="dashboard-progress-callout">
                <div>
                    <p className="dashboard-action-card__eyebrow">
                        Progress Tracking
                    </p>

                    <h2>
                        Turn completed training into useful history
                    </h2>

                    <p>
                        Completed Workouts drive
                        your Exercise records and
                        performance trends, while
                        Body Measurements provide
                        a separate view of weight
                        and body-composition
                        changes over time.
                    </p>
                </div>

                <Link
                    to="/progress"
                    className="dashboard-progress-callout__action"
                >
                    Open Progress
                </Link>
            </section>
        </main>
    );
}

export default DashboardPage;