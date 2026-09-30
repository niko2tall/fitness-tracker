import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import BodyMeasurementCard
    from '../components/bodyMeasurements/BodyMeasurementCard';

import BodyMeasurementDialog
    from '../components/bodyMeasurements/BodyMeasurementDialog';

import BodyWeightTrend
    from '../components/bodyMeasurements/BodyWeightTrend';

import DeleteBodyMeasurementDialog
    from '../components/bodyMeasurements/DeleteBodyMeasurementDialog';

import {
    createBodyMeasurement,
    deleteBodyMeasurement,
    getBodyMeasurements,
    updateBodyMeasurement,
} from '../services/api';

import type {
    BodyMeasurement,
    CreateBodyMeasurementRequest,
} from '../types/bodyMeasurement';

import {
    formatDateTime,
} from '../utils/dateTime';

import {
    formatBodyWeight,
    formatBodyWeightChange,
    type BodyWeightDisplayUnit,
} from '../utils/bodyMeasurementUnits';

import '../styles/workouts.css';
import '../styles/bodyMeasurements.css';

function BodyMeasurementsPage() {
    const [
        measurements,
        setMeasurements,
    ] =
        useState<
            BodyMeasurement[]
        >([]);

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
        weightUnit,
        setWeightUnit,
    ] =
        useState<
            BodyWeightDisplayUnit
        >('Kilograms');

    const [
        isCreateOpen,
        setIsCreateOpen,
    ] = useState(false);

    const [
        isCreating,
        setIsCreating,
    ] = useState(false);

    const [
        createError,
        setCreateError,
    ] =
        useState<string | null>(
            null
        );

    const [
        measurementToEdit,
        setMeasurementToEdit,
    ] =
        useState<
            BodyMeasurement | null
        >(null);

    const [
        isEditing,
        setIsEditing,
    ] = useState(false);

    const [
        editError,
        setEditError,
    ] =
        useState<string | null>(
            null
        );

    const [
        measurementToDelete,
        setMeasurementToDelete,
    ] =
        useState<
            BodyMeasurement | null
        >(null);

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false);

    const [
        deleteError,
        setDeleteError,
    ] =
        useState<string | null>(
            null
        );

    useEffect(() => {
        const controller =
            new AbortController();

        async function loadMeasurements() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getBodyMeasurements(
                        controller.signal
                    );

                setMeasurements(
                    sortMeasurements(
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
                        'Unable to load body measurements.'
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

        void loadMeasurements();

        return () => {
            controller.abort();
        };
    }, []);

    const latestMeasurement =
        measurements[0] ??
        null;

    const earliestMeasurement =
        measurements.length > 0
            ? measurements[
            measurements.length -
            1
            ]
            : null;

    const latestBodyFatMeasurement =
        useMemo(
            () =>
                measurements.find(
                    (measurement) =>
                        measurement
                            .bodyFatPercentage !==
                        null
                ) ?? null,
            [measurements]
        );

    const weightChangeKg =
        latestMeasurement &&
            earliestMeasurement
            ? latestMeasurement
                .weightKg -
            earliestMeasurement
                .weightKg
            : null;

    async function refreshMeasurements() {
        const response =
            await getBodyMeasurements();

        setMeasurements(
            sortMeasurements(
                response
            )
        );
    }

    function openCreateDialog() {
        setCreateError(null);
        setIsCreateOpen(true);
    }

    function closeCreateDialog() {
        if (isCreating) {
            return;
        }

        setCreateError(null);
        setIsCreateOpen(false);
    }

    async function handleCreate(
        request:
            CreateBodyMeasurementRequest
    ) {
        try {
            setIsCreating(true);
            setCreateError(null);

            await createBodyMeasurement(
                request
            );

            await refreshMeasurements();

            setIsCreateOpen(false);
        } catch (error) {
            setCreateError(
                getErrorMessage(
                    error,
                    'Unable to create the measurement.'
                )
            );
        } finally {
            setIsCreating(false);
        }
    }

    function openEditDialog(
        measurement:
            BodyMeasurement
    ) {
        setEditError(null);

        setMeasurementToEdit(
            measurement
        );
    }

    function closeEditDialog() {
        if (isEditing) {
            return;
        }

        setEditError(null);
        setMeasurementToEdit(null);
    }

    async function handleEdit(
        request:
            CreateBodyMeasurementRequest
    ) {
        if (!measurementToEdit) {
            return;
        }

        try {
            setIsEditing(true);
            setEditError(null);

            await updateBodyMeasurement(
                measurementToEdit.id,
                request
            );

            await refreshMeasurements();

            setMeasurementToEdit(
                null
            );
        } catch (error) {
            setEditError(
                getErrorMessage(
                    error,
                    'Unable to update the measurement.'
                )
            );
        } finally {
            setIsEditing(false);
        }
    }

    function openDeleteDialog(
        measurement:
            BodyMeasurement
    ) {
        setDeleteError(null);

        setMeasurementToDelete(
            measurement
        );
    }

    function closeDeleteDialog() {
        if (isDeleting) {
            return;
        }

        setDeleteError(null);
        setMeasurementToDelete(null);
    }

    async function handleDelete() {
        if (!measurementToDelete) {
            return;
        }

        try {
            setIsDeleting(true);
            setDeleteError(null);

            await deleteBodyMeasurement(
                measurementToDelete.id
            );

            await refreshMeasurements();

            setMeasurementToDelete(
                null
            );
        } catch (error) {
            setDeleteError(
                getErrorMessage(
                    error,
                    'Unable to delete the measurement.'
                )
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <main className="app-shell body-measurements-page">
                <Link
                    to="/"
                    className="workout-back-link"
                >
                    ← Dashboard
                </Link>

                <header className="body-measurements-header">
                    <div>
                        <p className="page-header__eyebrow">
                            Progress Tracking
                        </p>

                        <h1>
                            Body Measurements
                        </h1>

                        <p className="page-header__description">
                            Record body weight and
                            optional body-fat
                            measurements over time.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="workout-button workout-button--primary"
                        onClick={
                            openCreateDialog
                        }
                    >
                        Add Measurement
                    </button>
                </header>

                <section className="body-measurement-unit-control">
                    <div>
                        <strong>
                            Weight Display
                        </strong>

                        <span>
                            Measurements are stored
                            in kilograms regardless
                            of display unit.
                        </span>
                    </div>

                    <div
                        className="body-measurement-unit-toggle"
                        aria-label="Weight display unit"
                    >
                        <button
                            type="button"
                            className={
                                weightUnit ===
                                    'Kilograms'
                                    ? 'body-measurement-unit-button body-measurement-unit-button--active'
                                    : 'body-measurement-unit-button'
                            }
                            aria-pressed={
                                weightUnit ===
                                'Kilograms'
                            }
                            onClick={() =>
                                setWeightUnit(
                                    'Kilograms'
                                )
                            }
                        >
                            kg
                        </button>

                        <button
                            type="button"
                            className={
                                weightUnit ===
                                    'Pounds'
                                    ? 'body-measurement-unit-button body-measurement-unit-button--active'
                                    : 'body-measurement-unit-button'
                            }
                            aria-pressed={
                                weightUnit ===
                                'Pounds'
                            }
                            onClick={() =>
                                setWeightUnit(
                                    'Pounds'
                                )
                            }
                        >
                            lb
                        </button>
                    </div>
                </section>

                {!isLoading &&
                    !error &&
                    measurements.length >
                    0 && (
                        <section
                            className="body-measurement-summary"
                            aria-label="Body measurement summary"
                        >
                            <article className="body-measurement-summary-card">
                                <span>
                                    Entries
                                </span>

                                <strong>
                                    {
                                        measurements
                                            .length
                                    }
                                </strong>

                                <small>
                                    Recorded measurements
                                </small>
                            </article>

                            <article className="body-measurement-summary-card">
                                <span>
                                    Latest Weight
                                </span>

                                <strong>
                                    {latestMeasurement
                                        ? formatBodyWeight(
                                            latestMeasurement
                                                .weightKg,
                                            weightUnit
                                        )
                                        : '—'}
                                </strong>

                                <small>
                                    {latestMeasurement
                                        ? formatDateTime(
                                            latestMeasurement
                                                .recordedAtUtc
                                        )
                                        : 'No measurements'}
                                </small>
                            </article>

                            <article className="body-measurement-summary-card">
                                <span>
                                    Change Since First
                                </span>

                                <strong>
                                    {weightChangeKg !==
                                        null
                                        ? formatBodyWeightChange(
                                            weightChangeKg,
                                            weightUnit
                                        )
                                        : '—'}
                                </strong>

                                <small>
                                    Latest minus earliest
                                </small>
                            </article>

                            <article className="body-measurement-summary-card">
                                <span>
                                    Latest Body Fat
                                </span>

                                <strong>
                                    {latestBodyFatMeasurement
                                        ?.bodyFatPercentage !==
                                        null &&
                                        latestBodyFatMeasurement
                                            ?.bodyFatPercentage !==
                                        undefined
                                        ? `${latestBodyFatMeasurement.bodyFatPercentage}%`
                                        : '—'}
                                </strong>

                                <small>
                                    {latestBodyFatMeasurement
                                        ? formatDateTime(
                                            latestBodyFatMeasurement
                                                .recordedAtUtc
                                        )
                                        : 'Not recorded'}
                                </small>
                            </article>
                        </section>
                    )}

                {!isLoading &&
                    !error &&
                    measurements.length >
                    0 && (
                        <BodyWeightTrend
                            measurements={
                                measurements
                            }
                            weightUnit={
                                weightUnit
                            }
                        />
                    )}

                {isLoading && (
                    <section
                        className="workout-state-panel"
                        aria-live="polite"
                    >
                        <h2>
                            Loading measurements...
                        </h2>

                        <p>
                            Retrieving your body
                            measurement history.
                        </p>
                    </section>
                )}

                {!isLoading &&
                    error && (
                        <section
                            className="workout-state-panel workout-state-panel--error"
                            role="alert"
                        >
                            <h2>
                                Measurements couldn't
                                be loaded
                            </h2>

                            <p>
                                {error}
                            </p>
                        </section>
                    )}

                {!isLoading &&
                    !error &&
                    measurements.length ===
                    0 && (
                        <section className="body-measurement-empty">
                            <p className="workout-empty-state__eyebrow">
                                No measurements yet
                            </p>

                            <h2>
                                Start your body-weight
                                history
                            </h2>

                            <p>
                                Add your first
                                measurement to begin
                                building the dataset
                                used for body-weight
                                progress tracking.
                            </p>

                            <button
                                type="button"
                                className="workout-button workout-button--primary"
                                onClick={
                                    openCreateDialog
                                }
                            >
                                Add First Measurement
                            </button>
                        </section>
                    )}

                {!isLoading &&
                    !error &&
                    measurements.length >
                    0 && (
                        <section className="body-measurement-history">
                            <header className="workout-section__header">
                                <div>
                                    <p className="workout-section__eyebrow">
                                        Measurement History
                                    </p>

                                    <h2>
                                        Recorded Measurements
                                    </h2>
                                </div>

                                <span className="workout-section__count">
                                    {
                                        measurements
                                            .length
                                    }
                                </span>
                            </header>

                            <div className="body-measurement-list">
                                {measurements.map(
                                    (measurement) => (
                                        <BodyMeasurementCard
                                            key={
                                                measurement.id
                                            }
                                            measurement={
                                                measurement
                                            }
                                            weightUnit={
                                                weightUnit
                                            }
                                            onEdit={
                                                openEditDialog
                                            }
                                            onDelete={
                                                openDeleteDialog
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    )}
            </main>

            <BodyMeasurementDialog
                isOpen={
                    isCreateOpen
                }
                mode="create"
                measurement={null}
                weightUnit={
                    weightUnit
                }
                isSubmitting={
                    isCreating
                }
                error={
                    createError
                }
                onClose={
                    closeCreateDialog
                }
                onSubmit={
                    handleCreate
                }
            />

            <BodyMeasurementDialog
                isOpen={
                    measurementToEdit !==
                    null
                }
                mode="edit"
                measurement={
                    measurementToEdit
                }
                weightUnit={
                    weightUnit
                }
                isSubmitting={
                    isEditing
                }
                error={
                    editError
                }
                onClose={
                    closeEditDialog
                }
                onSubmit={
                    handleEdit
                }
            />

            <DeleteBodyMeasurementDialog
                isOpen={
                    measurementToDelete !==
                    null
                }
                measurement={
                    measurementToDelete
                }
                weightUnit={
                    weightUnit
                }
                isSubmitting={
                    isDeleting
                }
                error={
                    deleteError
                }
                onClose={
                    closeDeleteDialog
                }
                onConfirm={
                    handleDelete
                }
            />
        </>
    );
}

function sortMeasurements(
    measurements:
        BodyMeasurement[]
): BodyMeasurement[] {
    return [
        ...measurements,
    ].sort(
        (
            left,
            right
        ) =>
            getTimestamp(
                right.recordedAtUtc
            ) -
            getTimestamp(
                left.recordedAtUtc
            )
    );
}

function getTimestamp(
    value: string
): number {
    const timestamp =
        Date.parse(value);

    return Number.isFinite(
        timestamp
    )
        ? timestamp
        : 0;
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

export default BodyMeasurementsPage;