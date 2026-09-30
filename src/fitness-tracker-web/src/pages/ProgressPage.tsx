import {
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import CardioSummaryPanel
    from '../components/progress/CardioSummaryPanel';

import ProgressAnalyticsControls
    from '../components/progress/ProgressAnalyticsControls';

import ProgressExercisePicker
    from '../components/progress/ProgressExercisePicker';

import StrengthVolumePanel
    from '../components/progress/StrengthVolumePanel';

import WorkoutFrequencyPanel
    from '../components/progress/WorkoutFrequencyPanel';

import type {
    ProgressAggregateView,
} from '../types/progressDashboard';

import '../styles/progressHub.css';

function ProgressPage() {
    const [
        aggregateView,
        setAggregateView,
    ] =
        useState<
            ProgressAggregateView
        >('Weeks');

    const [
        analyticsNow,
    ] =
        useState(
            () => new Date()
        );

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
                        performance trends,
                        consistency, workload,
                        cardio progress, and
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
                            Exercise-specific
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

                    <a
                        href="#exercise-progress"
                        className="progress-hub-card__action"
                    >
                        Find Exercise Progress
                    </a>
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
                            sessions, frequency,
                            strength workload,
                            cardio volume, and
                            historical Workout
                            details.
                        </p>
                    </div>

                    <div className="progress-hub-card__features">
                        <span>
                            Frequency
                        </span>

                        <span>
                            Strength Volume
                        </span>

                        <span>
                            Cardio
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

            <ProgressAnalyticsControls
                view={
                    aggregateView
                }
                onChange={
                    setAggregateView
                }
            />

            <WorkoutFrequencyPanel
                view={
                    aggregateView
                }
                now={
                    analyticsNow
                }
            />

            <StrengthVolumePanel
                view={
                    aggregateView
                }
                now={
                    analyticsNow
                }
            />

            <CardioSummaryPanel
                view={
                    aggregateView
                }
                now={
                    analyticsNow
                }
            />

            <div id="exercise-progress">
                <ProgressExercisePicker />
            </div>

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
                            Track personal records,
                            Exercise trends, Set
                            performance, and
                            aggregate weighted
                            volume load.
                        </p>
                    </article>

                    <article>
                        <h3>
                            Cardio
                        </h3>

                        <p>
                            Track aggregate distance,
                            duration, session count,
                            pace, longest sessions,
                            and Exercise-specific
                            performance.
                        </p>
                    </article>

                    <article>
                        <h3>
                            Consistency
                        </h3>

                        <p>
                            Review completed Workout
                            frequency across recent
                            weeks and months,
                            including distinct
                            training days.
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
                        Progress Data
                    </p>

                    <h2>
                        Analytics are built from finalized training data
                    </h2>

                    <p>
                        Exercise records,
                        frequency metrics,
                        strength volume, and
                        cardio aggregates use
                        completed Workouts.
                        Active Workout performance
                        remains excluded until the
                        training session is
                        completed.
                    </p>
                </div>

                <div className="progress-hub-guidance__actions">
                    <Link
                        to="/exercises"
                        className="progress-hub-secondary-action"
                    >
                        Manage Exercises
                    </Link>

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