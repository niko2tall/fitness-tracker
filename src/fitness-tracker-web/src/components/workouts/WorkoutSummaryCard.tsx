import { Link } from 'react-router-dom';

import type {
    WorkoutSummary,
} from '../../types/workout';

import {
    formatDateTime,
} from '../../utils/dateTime';

interface WorkoutSummaryCardProps {
    workout: WorkoutSummary;
}

function WorkoutSummaryCard({
    workout,
}: WorkoutSummaryCardProps) {
    const isActive =
        workout.endedAtUtc === null;

    const exerciseLabel =
        workout.exerciseCount === 1
            ? '1 exercise'
            : `${workout.exerciseCount} exercises`;

    return (
        <article className="workout-summary-card">
            <header className="workout-summary-card__header">
                <div>
                    <div className="workout-summary-card__badges">
                        <span
                            className={
                                isActive
                                    ? 'workout-status workout-status--active'
                                    : 'workout-status workout-status--completed'
                            }
                        >
                            {isActive
                                ? 'Active'
                                : 'Completed'}
                        </span>

                        <span className="workout-type-badge">
                            {workout.workoutType}
                        </span>
                    </div>

                    <h3>{workout.name}</h3>
                </div>
            </header>

            <dl className="workout-summary-card__meta">
                <div>
                    <dt>Started</dt>
                    <dd>
                        {formatDateTime(
                            workout.startedAtUtc
                        )}
                    </dd>
                </div>

                <div>
                    <dt>Exercises</dt>
                    <dd>{exerciseLabel}</dd>
                </div>

                {!isActive &&
                    workout.endedAtUtc && (
                        <div>
                            <dt>Completed</dt>
                            <dd>
                                {formatDateTime(
                                    workout.endedAtUtc
                                )}
                            </dd>
                        </div>
                    )}
            </dl>

            <Link
                to={`/workouts/${workout.id}`}
                className="workout-summary-card__link"
            >
                {isActive
                    ? 'Continue Workout'
                    : 'View Workout'}
            </Link>
        </article>
    );
}

export default WorkoutSummaryCard;