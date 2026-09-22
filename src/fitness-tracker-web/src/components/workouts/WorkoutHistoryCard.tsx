import {
    Link,
} from 'react-router-dom';

import type {
    WorkoutSummary,
} from '../../types/workout';

import {
    formatDateTime,
} from '../../utils/dateTime';

import {
    formatWorkoutDuration,
    getWorkoutDurationSeconds,
} from '../../utils/workoutMetrics';

interface WorkoutHistoryCardProps {
    workout: WorkoutSummary;
}

function WorkoutHistoryCard({
    workout,
}: WorkoutHistoryCardProps) {
    const duration =
        getWorkoutDurationSeconds(
            workout
        );

    return (
        <article className="workout-history-card">
            <header className="workout-history-card__header">
                <div className="workout-summary-card__badges">
                    <span className="workout-status workout-status--completed">
                        Completed
                    </span>

                    <span className="workout-type-badge">
                        {workout.workoutType}
                    </span>
                </div>

                <h3>
                    {workout.name}
                </h3>
            </header>

            <dl className="workout-history-card__details">
                <div>
                    <dt>
                        Started
                    </dt>

                    <dd>
                        {formatDateTime(
                            workout.startedAtUtc
                        )}
                    </dd>
                </div>

                <div>
                    <dt>
                        Completed
                    </dt>

                    <dd>
                        {workout.endedAtUtc
                            ? formatDateTime(
                                workout.endedAtUtc
                            )
                            : '—'}
                    </dd>
                </div>

                <div>
                    <dt>
                        Duration
                    </dt>

                    <dd>
                        {formatWorkoutDuration(
                            duration
                        )}
                    </dd>
                </div>

                <div>
                    <dt>
                        Exercises
                    </dt>

                    <dd>
                        {workout.exerciseCount}
                    </dd>
                </div>
            </dl>

            <footer className="workout-history-card__footer">
                <Link
                    to={`/workouts/${workout.id}`}
                    className="workout-history-card__link"
                >
                    View Workout
                </Link>
            </footer>
        </article>
    );
}

export default WorkoutHistoryCard;