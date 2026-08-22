import type { ExerciseType } from '../../types/exercise';

interface ExerciseFiltersProps {
    searchTerm: string;
    selectedType: ExerciseType | 'All';
    selectedMuscleGroup: string;
    selectedEquipment: string;
    muscleGroups: string[];
    equipmentOptions: string[];
    resultCount: number;
    totalCount: number;
    onSearchTermChange: (value: string) => void;
    onTypeChange: (value: ExerciseType | 'All') => void;
    onMuscleGroupChange: (value: string) => void;
    onEquipmentChange: (value: string) => void;
    onClearFilters: () => void;
}

function ExerciseFilters({
    searchTerm,
    selectedType,
    selectedMuscleGroup,
    selectedEquipment,
    muscleGroups,
    equipmentOptions,
    resultCount,
    totalCount,
    onSearchTermChange,
    onTypeChange,
    onMuscleGroupChange,
    onEquipmentChange,
    onClearFilters,
}: ExerciseFiltersProps) {
    const hasActiveFilters =
        searchTerm.trim().length > 0 ||
        selectedType !== 'All' ||
        selectedMuscleGroup !== 'All' ||
        selectedEquipment !== 'All';

    return (
        <section
            className="exercise-filters"
            aria-label="Exercise search and filters"
        >
            <div className="exercise-filters__grid">
                <div className="filter-field filter-field--search">
                    <label htmlFor="exercise-search">
                        Search
                    </label>

                    <input
                        id="exercise-search"
                        type="search"
                        value={searchTerm}
                        placeholder="Search exercises..."
                        onChange={(event) =>
                            onSearchTermChange(event.target.value)
                        }
                    />
                </div>

                <div className="filter-field">
                    <label htmlFor="exercise-type">
                        Exercise Type
                    </label>

                    <select
                        id="exercise-type"
                        value={selectedType}
                        onChange={(event) =>
                            onTypeChange(
                                event.target.value as ExerciseType | 'All'
                            )
                        }
                    >
                        <option value="All">All Types</option>
                        <option value="Strength">Strength</option>
                        <option value="Cardio">Cardio</option>
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="muscle-group">
                        Muscle Group
                    </label>

                    <select
                        id="muscle-group"
                        value={selectedMuscleGroup}
                        onChange={(event) =>
                            onMuscleGroupChange(event.target.value)
                        }
                    >
                        <option value="All">All Muscle Groups</option>

                        {muscleGroups.map((muscleGroup) => (
                            <option
                                key={muscleGroup}
                                value={muscleGroup}
                            >
                                {muscleGroup}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="equipment">
                        Equipment
                    </label>

                    <select
                        id="equipment"
                        value={selectedEquipment}
                        onChange={(event) =>
                            onEquipmentChange(event.target.value)
                        }
                    >
                        <option value="All">All Equipment</option>

                        {equipmentOptions.map((equipment) => (
                            <option
                                key={equipment}
                                value={equipment}
                            >
                                {equipment}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="exercise-filters__footer">
                <p
                    className="exercise-results-count"
                    aria-live="polite"
                >
                    Showing <strong>{resultCount}</strong> of{' '}
                    <strong>{totalCount}</strong> exercises
                </p>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="clear-filters-button"
                        onClick={onClearFilters}
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </section>
    );
}

export default ExerciseFilters;