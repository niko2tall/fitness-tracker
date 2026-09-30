import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import {
    getProgressExerciseOptions,
} from '../../services/api';

import type {
    ExerciseType,
} from '../../types/exercise';

import type {
    ProgressExerciseOption,
} from '../../types/progressHub';

type ExerciseTypeFilter =
    | 'All'
    | ExerciseType;

const maximumVisibleResults =
    8;

function ProgressExercisePicker() {
    const [
        exercises,
        setExercises,
    ] =
        useState<
            ProgressExerciseOption[]
        >([]);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        typeFilter,
        setTypeFilter,
    ] =
        useState<
            ExerciseTypeFilter
        >('All');

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        reloadVersion,
        setReloadVersion,
    ] = useState(0);

    useEffect(() => {
        const controller =
            new AbortController();

        async function loadExercises() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getProgressExerciseOptions(
                        controller.signal
                    );

                setExercises(
                    sortExercises(
                        response
                    )
                );
            } catch (error) {
                if (
                    error instanceof
                    DOMException &&
                    error.name ===
                    'AbortError'
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        error,
                        'Unable to load Exercises.'
                    )
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoading(false);
                }
            }
        }

        void loadExercises();

        return () => {
            controller.abort();
        };
    }, [reloadVersion]);

    const filteredExercises =
        useMemo(
            () => {
                const normalizedSearch =
                    searchTerm
                        .trim()
                        .toLocaleLowerCase();

                return exercises.filter(
                    (exercise) => {
                        if (
                            typeFilter !==
                            'All' &&
                            exercise.exerciseType !==
                            typeFilter
                        ) {
                            return false;
                        }

                        if (
                            normalizedSearch
                                .length === 0
                        ) {
                            return true;
                        }

                        const searchableText =
                            [
                                exercise.name,
                                exercise.exerciseType,
                                formatTrackingType(
                                    exercise
                                        .trackingType
                                ),
                            ]
                                .join(' ')
                                .toLocaleLowerCase();

                        return searchableText
                            .includes(
                                normalizedSearch
                            );
                    }
                );
            },
            [
                exercises,
                searchTerm,
                typeFilter,
            ]
        );

    const visibleExercises =
        filteredExercises.slice(
            0,
            maximumVisibleResults
        );

    function handleRetry() {
        setReloadVersion(
            (value) =>
                value + 1
        );
    }

    return (
        <section
            className="progress-exercise-picker"
            aria-labelledby="progress-exercise-picker-title"
        >
            <header className="progress-exercise-picker__header">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Exercise Analytics
                    </p>

                    <h2 id="progress-exercise-picker-title">
                        Find Exercise Progress
                    </h2>

                    <p>
                        Search for an Exercise
                        and open its completed
                        history, personal records,
                        and performance trends.
                    </p>
                </div>

                {!isLoading &&
                    !error && (
                        <span className="progress-exercise-picker__total">
                            {exercises.length}{' '}
                            {exercises.length ===
                                1
                                ? 'Exercise'
                                : 'Exercises'}
                        </span>
                    )}
            </header>

            {!isLoading &&
                !error && (
                    <>
                        <div className="progress-exercise-picker__controls">
                            <label className="progress-exercise-search">
                                <span>
                                    Search
                                </span>

                                <input
                                    type="search"
                                    value={
                                        searchTerm
                                    }
                                    placeholder="Search Bench Press, Run, Pull-Up..."
                                    onChange={(event) =>
                                        setSearchTerm(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </label>

                            <div
                                className="progress-exercise-filters"
                                role="group"
                                aria-label="Exercise type filter"
                            >
                                <button
                                    type="button"
                                    className={
                                        typeFilter ===
                                            'All'
                                            ? 'progress-exercise-filter progress-exercise-filter--active'
                                            : 'progress-exercise-filter'
                                    }
                                    aria-pressed={
                                        typeFilter ===
                                        'All'
                                    }
                                    onClick={() =>
                                        setTypeFilter(
                                            'All'
                                        )
                                    }
                                >
                                    All
                                </button>

                                <button
                                    type="button"
                                    className={
                                        typeFilter ===
                                            'Strength'
                                            ? 'progress-exercise-filter progress-exercise-filter--active'
                                            : 'progress-exercise-filter'
                                    }
                                    aria-pressed={
                                        typeFilter ===
                                        'Strength'
                                    }
                                    onClick={() =>
                                        setTypeFilter(
                                            'Strength'
                                        )
                                    }
                                >
                                    Strength
                                </button>

                                <button
                                    type="button"
                                    className={
                                        typeFilter ===
                                            'Cardio'
                                            ? 'progress-exercise-filter progress-exercise-filter--active'
                                            : 'progress-exercise-filter'
                                    }
                                    aria-pressed={
                                        typeFilter ===
                                        'Cardio'
                                    }
                                    onClick={() =>
                                        setTypeFilter(
                                            'Cardio'
                                        )
                                    }
                                >
                                    Cardio
                                </button>
                            </div>
                        </div>

                        <div
                            className="progress-exercise-picker__result-summary"
                            aria-live="polite"
                        >
                            {filteredExercises
                                .length === 0
                                ? 'No matching Exercises'
                                : visibleExercises
                                    .length ===
                                    filteredExercises
                                        .length
                                    ? `${filteredExercises.length} ${filteredExercises.length ===
                                        1
                                        ? 'match'
                                        : 'matches'
                                    }`
                                    : `Showing ${visibleExercises.length} of ${filteredExercises.length} matches`}
                        </div>
                    </>
                )}

            {isLoading && (
                <div
                    className="progress-exercise-picker__state"
                    aria-live="polite"
                >
                    <strong>
                        Loading Exercises...
                    </strong>

                    <span>
                        Preparing available
                        Exercise progress options.
                    </span>
                </div>
            )}

            {!isLoading &&
                error && (
                    <div
                        className="progress-exercise-picker__state progress-exercise-picker__state--error"
                        role="alert"
                    >
                        <strong>
                            Exercises couldn't be
                            loaded
                        </strong>

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            className="progress-hub-secondary-action"
                            onClick={
                                handleRetry
                            }
                        >
                            Try Again
                        </button>
                    </div>
                )}

            {!isLoading &&
                !error &&
                filteredExercises
                    .length === 0 && (
                    <div className="progress-exercise-picker__empty">
                        <strong>
                            No Exercises match your
                            search
                        </strong>

                        <p>
                            Try another name or
                            change the Exercise Type
                            filter.
                        </p>

                        <button
                            type="button"
                            className="progress-hub-secondary-action"
                            onClick={() => {
                                setSearchTerm('');
                                setTypeFilter(
                                    'All'
                                );
                            }}
                        >
                            Clear Search
                        </button>
                    </div>
                )}

            {!isLoading &&
                !error &&
                visibleExercises.length >
                0 && (
                    <div className="progress-exercise-results">
                        {visibleExercises.map(
                            (exercise) => (
                                <article
                                    key={
                                        exercise.id
                                    }
                                    className="progress-exercise-result"
                                >
                                    <div className="progress-exercise-result__main">
                                        <div>
                                            <h3>
                                                {
                                                    exercise.name
                                                }
                                            </h3>

                                            <div className="progress-exercise-result__badges">
                                                <span>
                                                    {
                                                        exercise
                                                            .exerciseType
                                                    }
                                                </span>

                                                <span>
                                                    {formatTrackingType(
                                                        exercise
                                                            .trackingType
                                                    )}
                                                </span>

                                                {exercise.isArchived && (
                                                    <span className="progress-exercise-result__badge--archived">
                                                        Archived
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {exercise.isArchived && (
                                            <p className="progress-exercise-result__archive-note">
                                                Historical
                                                progress only
                                            </p>
                                        )}
                                    </div>

                                    <Link
                                        to={`/progress/exercises/${encodeURIComponent(
                                            exercise.id
                                        )}`}
                                        className="progress-exercise-result__action"
                                    >
                                        View Progress
                                    </Link>
                                </article>
                            )
                        )}
                    </div>
                )}

            {!isLoading &&
                !error &&
                filteredExercises.length >
                maximumVisibleResults && (
                    <p className="progress-exercise-picker__limit-note">
                        Refine your search to
                        narrow the remaining
                        results.
                    </p>
                )}
        </section>
    );
}

function sortExercises(
    exercises:
        ProgressExerciseOption[]
): ProgressExerciseOption[] {
    return [
        ...exercises,
    ].sort(
        (
            left,
            right
        ) => {
            if (
                left.isArchived !==
                right.isArchived
            ) {
                return left.isArchived
                    ? 1
                    : -1;
            }

            return left.name
                .localeCompare(
                    right.name,
                    undefined,
                    {
                        sensitivity:
                            'base',
                    }
                );
        }
    );
}

function formatTrackingType(
    trackingType:
        ProgressExerciseOption['trackingType']
): string {
    switch (
    trackingType
    ) {
        case 'WeightAndReps':
            return 'Weight + Reps';

        case 'RepsOnly':
            return 'Reps Only';

        case 'Duration':
            return 'Duration';

        case 'DistanceAndDuration':
            return 'Distance + Duration';

        default:
            return trackingType;
    }
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return (
        error instanceof Error &&
            error.message.trim().length >
            0
            ? error.message
            : fallback
    );
}

export default ProgressExercisePicker;