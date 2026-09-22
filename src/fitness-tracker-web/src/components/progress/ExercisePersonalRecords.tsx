import {
    useMemo,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import type {
    ExerciseHistoryResponse,
} from '../../types/progress';

import {
    calculateExercisePersonalRecords,
} from '../../utils/personalRecords';

import {
    formatDateTime,
} from '../../utils/dateTime';

interface ExercisePersonalRecordsProps {
    history: ExerciseHistoryResponse;
}

function ExercisePersonalRecords({
    history,
}: ExercisePersonalRecordsProps) {
    const records =
        useMemo(
            () =>
                calculateExercisePersonalRecords(
                    history
                ),
            [history]
        );

    if (
        records.length === 0
    ) {
        return null;
    }

    return (
        <section
            className="exercise-pr-section"
            aria-labelledby="exercise-pr-title"
        >
            <header className="workout-section__header">
                <div>
                    <p className="workout-section__eyebrow">
                        Personal Records
                    </p>

                    <h2 id="exercise-pr-title">
                        Current Records
                    </h2>
                </div>

                <span className="workout-section__count">
                    {records.length}
                </span>
            </header>

            <p className="exercise-pr-section__description">
                Records are calculated from
                finalized Sets in completed
                Workouts.
            </p>

            <div className="exercise-pr-grid">
                {records.map(
                    (record) => (
                        <article
                            key={
                                record.kind
                            }
                            className="exercise-pr-card"
                        >
                            <p className="exercise-pr-card__label">
                                {record.label}
                            </p>

                            <strong className="exercise-pr-card__value">
                                {
                                    record.displayValue
                                }
                            </strong>

                            {record.detail && (
                                <p className="exercise-pr-card__detail">
                                    {record.detail}
                                </p>
                            )}

                            <dl className="exercise-pr-card__source">
                                <div>
                                    <dt>
                                        Workout
                                    </dt>

                                    <dd>
                                        {
                                            record.workoutName
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt>
                                        Achieved
                                    </dt>

                                    <dd>
                                        {formatDateTime(
                                            record
                                                .achievedAtUtc
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt>
                                        Set
                                    </dt>

                                    <dd>
                                        Set{' '}
                                        {
                                            record.setNumber
                                        }
                                        {' · '}
                                        {
                                            record.setType
                                        }
                                    </dd>
                                </div>
                            </dl>

                            <Link
                                to={`/workouts/${record.workoutId}`}
                                className="exercise-pr-card__link"
                            >
                                View Source Workout
                            </Link>
                        </article>
                    )
                )}
            </div>
        </section>
    );
}

export default ExercisePersonalRecords;