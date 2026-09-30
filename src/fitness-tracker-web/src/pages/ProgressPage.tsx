import {
    Link,
} from 'react-router-dom';

import '../styles/progressHub.css';

function ProgressPage() {
    return (
        <main className="app-shell progress-hub-page">
            <Link
                to="/"
                className="progress-hub-back-link"
            >
                ← Dashboard
            </Link>

            <header className="progress-hub-header">
                <div>
                    <p className="page-header__eyebrow">
                        Analytics
                    </p>

                    <h1>
                        Progress
                    </h1>

                    <p className="page-header__description">
                        Review training history,
                        personal records,
                        performance trends, and
                        body-composition changes.
                    </p>
                </div>
            </header>

            <section
                className="progress-hub-grid"
                aria-label="Progress areas"
            >
                <article className="progress-hub-card">
                    <div>
                        <p className="progress-hub-card__eyebrow">
                            Training Performance
                        </p>

                        <h2>
                            Exercise Progress
                        </h2>

                        <p>
                            Review completed
                            performance history,
                            personal records, and
                            exercise-specific
                            trends.
                        </p>
                    </div>

                    <div className="progress-hub-card__features">
                        <span>
                            Weight + Reps
                        </span>

                        <span>
                            Reps
                        </span>

                        <span>
                            Duration
                        </span>

                        <span>
                            Cardio
                        </span>
                    </div>

                    <Link
                        to="/exercises"
                        className="progress-hub-card__action"
                    >
                        Browse Exercises
                    </Link>
                </article>

                <article className="progress-hub-card">
                    <div>
                        <p className="progress-hub-card__eyebrow">
                            Body Composition
                        </p>

                        <h2>
                            Measurements
                        </h2>

                        <p>
                            Track body weight and
                            optional body-fat
                            percentage with combined
                            historical trend
                            visualization.
                        </p>
                    </div>

                    <div className="progress-hub-card__features">
                        <span>
                            Weight
                        </span>

                        <span>
                            Body Fat
                        </span>

                        <span>
                            kg / lb
                        </span>

                        <span>
                            Trends
                        </span>
                    </div>

                    <Link
                        to="/progress/body"
                        className="progress-hub-card__action"
                    >
                        Open Body Measurements
                    </Link>
                </article>

                <article className="progress-hub-card">
                    <div>
                        <p className="progress-hub-card__eyebrow">
                            Training History
                        </p>

                        <h2>
                            Workout History
                        </h2>

                        <p>
                            Review finalized
                            training sessions,
                            durations, exercise
                            counts, filters, and
                            historical Workout
                            details.
                        </p>
                    </div>

                    <div className="progress-hub-card__features">
                        <span>
                            Completed Sessions
                        </span>

                        <span>
                            Duration
                        </span>

                        <span>
                            Filtering
                        </span>

                        <span>
                            History
                        </span>
                    </div>

                    <Link
                        to="/history"
                        className="progress-hub-card__action"
                    >
                        Open Workout History
                    </Link>
                </article>
            </section>

            <section className="progress-hub-overview">
                <header className="progress-hub-overview__header">
                    <p className="progress-hub-card__eyebrow">
                        Available Analytics
                    </p>

                    <h2>
                        What the app currently tracks
                    </h2>
                </header>

                <div className="progress-hub-overview__grid">
                    <article>
                        <h3>
                            Strength
                        </h3>

                        <p>
                            Track heaviest weight,
                            repetition performance,
                            Set volume, personal
                            records, and historical
                            trends.
                        </p>
                    </article>

                    <article>
                        <h3>
                            Cardio
                        </h3>

                        <p>
                            Track distance,
                            duration, average pace,
                            historical sessions,
                            records, and trends.
                        </p>
                    </article>

                    <article>
                        <h3>
                            Body Composition
                        </h3>

                        <p>
                            Track body-weight
                            history alongside
                            optional body-fat
                            measurements on a
                            shared timeline.
                        </p>
                    </article>
                </div>
            </section>

            <section className="progress-hub-guidance">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Exercise Analytics
                    </p>

                    <h2>
                        Exercise progress is built from completed Workouts
                    </h2>

                    <p>
                        Exercise records and trend
                        charts use finalized Set
                        data from completed
                        Workouts. Active Workout
                        performance is intentionally
                        excluded until the session
                        is completed.
                    </p>
                </div>

                <div className="progress-hub-guidance__actions">
                    <Link
                        to="/workouts"
                        className="progress-hub-secondary-action"
                    >
                        Active Workouts
                    </Link>

                    <Link
                        to="/history"
                        className="progress-hub-secondary-action"
                    >
                        Completed Workouts
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default ProgressPage;