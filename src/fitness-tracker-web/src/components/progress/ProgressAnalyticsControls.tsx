import type {
    ProgressAggregateView,
} from '../../types/progressDashboard';

import '../../styles/progressDashboard.css';

interface ProgressAnalyticsControlsProps {
    view:
    ProgressAggregateView;

    onChange:
    (
        view:
            ProgressAggregateView
    ) => void;
}

function ProgressAnalyticsControls({
    view,
    onChange,
}: ProgressAnalyticsControlsProps) {
    const isWeeks =
        view === 'Weeks';

    return (
        <section
            className="progress-analytics-controls"
            aria-labelledby="progress-analytics-controls-title"
        >
            <header className="progress-analytics-controls__header">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Aggregate Analytics
                    </p>

                    <h2 id="progress-analytics-controls-title">
                        Progress Period
                    </h2>

                    <p>
                        Use one period across
                        Workout Frequency,
                        Strength Volume, and
                        Cardio Progress.
                    </p>
                </div>
            </header>

            <div className="progress-analytics-controls__body">
                <div className="progress-analytics-period">
                    <span className="progress-analytics-period__label">
                        Analytics Range
                    </span>

                    <div
                        className="progress-analytics-period__buttons"
                        role="group"
                        aria-label="Aggregate analytics period"
                    >
                        <button
                            type="button"
                            className={
                                isWeeks
                                    ? 'progress-analytics-period__button progress-analytics-period__button--active'
                                    : 'progress-analytics-period__button'
                            }
                            aria-pressed={
                                isWeeks
                            }
                            onClick={() =>
                                onChange(
                                    'Weeks'
                                )
                            }
                        >
                            8 Weeks
                        </button>

                        <button
                            type="button"
                            className={
                                !isWeeks
                                    ? 'progress-analytics-period__button progress-analytics-period__button--active'
                                    : 'progress-analytics-period__button'
                            }
                            aria-pressed={
                                !isWeeks
                            }
                            onClick={() =>
                                onChange(
                                    'Months'
                                )
                            }
                        >
                            6 Months
                        </button>
                    </div>

                    <p
                        className="progress-analytics-period__description"
                        aria-live="polite"
                    >
                        {isWeeks
                            ? 'Aggregate charts are showing the most recent 8 calendar weeks, including the current partial week.'
                            : 'Aggregate charts are showing the most recent 6 calendar months, including the current partial month.'}
                    </p>
                </div>

                <nav
                    className="progress-analytics-navigation"
                    aria-label="Progress analytics sections"
                >
                    <span className="progress-analytics-navigation__label">
                        Jump to
                    </span>

                    <div className="progress-analytics-navigation__links">
                        <a
                            href="#workout-frequency"
                            className="progress-analytics-navigation__link"
                        >
                            Frequency
                        </a>

                        <a
                            href="#strength-volume"
                            className="progress-analytics-navigation__link"
                        >
                            Strength
                        </a>

                        <a
                            href="#cardio-progress"
                            className="progress-analytics-navigation__link"
                        >
                            Cardio
                        </a>

                        <a
                            href="#exercise-progress"
                            className="progress-analytics-navigation__link"
                        >
                            Exercises
                        </a>
                    </div>
                </nav>
            </div>
        </section>
    );
}

export default ProgressAnalyticsControls;