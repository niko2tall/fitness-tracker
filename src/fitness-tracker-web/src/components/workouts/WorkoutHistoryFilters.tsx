import type {
    WorkoutType,
} from '../../types/workout';

export type WorkoutHistoryDateMode =
    'all' | 'month';

export type WorkoutHistoryTypeFilter =
    'All' | WorkoutType;

interface WorkoutHistoryFiltersProps {
    searchTerm: string;
    workoutTypeFilter:
    WorkoutHistoryTypeFilter;

    dateMode:
    WorkoutHistoryDateMode;

    selectedMonth: Date;
    canGoNextMonth: boolean;

    onSearchTermChange: (
        value: string
    ) => void;

    onWorkoutTypeFilterChange: (
        value:
            WorkoutHistoryTypeFilter
    ) => void;

    onDateModeChange: (
        value:
            WorkoutHistoryDateMode
    ) => void;

    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onClearFilters: () => void;
}

function WorkoutHistoryFilters({
    searchTerm,
    workoutTypeFilter,
    dateMode,
    selectedMonth,
    canGoNextMonth,
    onSearchTermChange,
    onWorkoutTypeFilterChange,
    onDateModeChange,
    onPreviousMonth,
    onNextMonth,
    onClearFilters,
}: WorkoutHistoryFiltersProps) {
    const hasActiveFilters =
        searchTerm.trim().length > 0 ||
        workoutTypeFilter !== 'All' ||
        dateMode !== 'all';

    return (
        <section
            className="workout-history-controls"
            aria-labelledby="workout-history-filters-title"
        >
            <header className="workout-history-controls__header">
                <div>
                    <p className="workout-section__eyebrow">
                        Find Sessions
                    </p>

                    <h2 id="workout-history-filters-title">
                        History Filters
                    </h2>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="workout-history-clear-button"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </button>
                )}
            </header>

            <div className="workout-history-filter-grid">
                <label className="workout-history-field">
                    <span>
                        Search
                    </span>

                    <input
                        type="search"
                        value={searchTerm}
                        placeholder="Search workout names..."
                        onChange={(event) =>
                            onSearchTermChange(
                                event.target.value
                            )
                        }
                    />
                </label>

                <label className="workout-history-field">
                    <span>
                        Workout Type
                    </span>

                    <select
                        value={
                            workoutTypeFilter
                        }
                        onChange={(event) =>
                            onWorkoutTypeFilterChange(
                                event.target
                                    .value as
                                WorkoutHistoryTypeFilter
                            )
                        }
                    >
                        <option value="All">
                            All Types
                        </option>

                        <option value="Strength">
                            Strength
                        </option>

                        <option value="Cardio">
                            Cardio
                        </option>

                        <option value="Mixed">
                            Mixed
                        </option>
                    </select>
                </label>
            </div>

            <div className="workout-history-date-controls">
                <div>
                    <span className="workout-history-date-controls__label">
                        Date Range
                    </span>

                    <div className="workout-history-date-scope">
                        <button
                            type="button"
                            className={
                                dateMode === 'all'
                                    ? 'workout-history-scope-button workout-history-scope-button--active'
                                    : 'workout-history-scope-button'
                            }
                            aria-pressed={
                                dateMode === 'all'
                            }
                            onClick={() =>
                                onDateModeChange(
                                    'all'
                                )
                            }
                        >
                            All History
                        </button>

                        <button
                            type="button"
                            className={
                                dateMode === 'month'
                                    ? 'workout-history-scope-button workout-history-scope-button--active'
                                    : 'workout-history-scope-button'
                            }
                            aria-pressed={
                                dateMode ===
                                'month'
                            }
                            onClick={() =>
                                onDateModeChange(
                                    'month'
                                )
                            }
                        >
                            Month View
                        </button>
                    </div>
                </div>

                {dateMode === 'month' && (
                    <div className="workout-history-month-nav">
                        <button
                            type="button"
                            className="workout-history-month-button"
                            aria-label="Previous month"
                            onClick={
                                onPreviousMonth
                            }
                        >
                            ←
                        </button>

                        <strong>
                            {formatMonth(
                                selectedMonth
                            )}
                        </strong>

                        <button
                            type="button"
                            className="workout-history-month-button"
                            aria-label="Next month"
                            disabled={
                                !canGoNextMonth
                            }
                            onClick={
                                onNextMonth
                            }
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function formatMonth(
    value: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'long',
            year: 'numeric',
        }
    ).format(value);
}

export default WorkoutHistoryFilters;