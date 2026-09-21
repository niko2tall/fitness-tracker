import { apiRequest } from './apiClient';

import type {
    AddWorkoutExerciseRequest,
    CreateWorkoutRequest,
    CreateWorkoutSetRequest,
    UpdateWorkoutRequest,
    UpdateWorkoutSetRequest,
    Workout,
    WorkoutExercise,
    WorkoutSet,
    WorkoutSummary,
} from '../types/workout';

export async function getWorkouts(
    signal?: AbortSignal
): Promise<WorkoutSummary[]> {
    return apiRequest<WorkoutSummary[]>(
        '/api/workouts',
        {
            signal,
        }
    );
}

export async function getWorkoutById(
    workoutId: string,
    signal?: AbortSignal
): Promise<Workout> {
    return apiRequest<Workout>(
        workoutPath(workoutId),
        {
            signal,
        }
    );
}

export async function createWorkout(
    request: CreateWorkoutRequest,
    signal?: AbortSignal
): Promise<Workout> {
    return apiRequest<Workout>(
        '/api/workouts',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function updateWorkout(
    workoutId: string,
    request: UpdateWorkoutRequest,
    signal?: AbortSignal
): Promise<Workout> {
    return apiRequest<Workout>(
        workoutPath(workoutId),
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function addWorkoutExercise(
    workoutId: string,
    request: AddWorkoutExerciseRequest,
    signal?: AbortSignal
): Promise<WorkoutExercise> {
    return apiRequest<WorkoutExercise>(
        `${workoutPath(workoutId)}/exercises`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function removeWorkoutExercise(
    workoutId: string,
    workoutExerciseId: string,
    signal?: AbortSignal
): Promise<void> {
    return apiRequest<void>(
        workoutExercisePath(
            workoutId,
            workoutExerciseId
        ),
        {
            method: 'DELETE',
            signal,
        }
    );
}

export async function addWorkoutSet(
    workoutId: string,
    workoutExerciseId: string,
    request: CreateWorkoutSetRequest,
    signal?: AbortSignal
): Promise<WorkoutSet> {
    return apiRequest<WorkoutSet>(
        `${workoutExercisePath(
            workoutId,
            workoutExerciseId
        )}/sets`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function updateWorkoutSet(
    workoutId: string,
    workoutExerciseId: string,
    setId: string,
    request: UpdateWorkoutSetRequest,
    signal?: AbortSignal
): Promise<WorkoutSet> {
    return apiRequest<WorkoutSet>(
        workoutSetPath(
            workoutId,
            workoutExerciseId,
            setId
        ),
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function removeWorkoutSet(
    workoutId: string,
    workoutExerciseId: string,
    setId: string,
    signal?: AbortSignal
): Promise<void> {
    return apiRequest<void>(
        workoutSetPath(
            workoutId,
            workoutExerciseId,
            setId
        ),
        {
            method: 'DELETE',
            signal,
        }
    );
}

export async function completeWorkout(
    workoutId: string,
    signal?: AbortSignal
): Promise<Workout> {
    return apiRequest<Workout>(
        `${workoutPath(workoutId)}/complete`,
        {
            method: 'POST',
            signal,
        }
    );
}

function workoutPath(
    workoutId: string
): string {
    return (
        '/api/workouts/' +
        encodeURIComponent(workoutId)
    );
}

function workoutExercisePath(
    workoutId: string,
    workoutExerciseId: string
): string {
    return (
        `${workoutPath(workoutId)}` +
        '/exercises/' +
        encodeURIComponent(
            workoutExerciseId
        )
    );
}

function workoutSetPath(
    workoutId: string,
    workoutExerciseId: string,
    setId: string
): string {
    return (
        `${workoutExercisePath(
            workoutId,
            workoutExerciseId
        )}` +
        '/sets/' +
        encodeURIComponent(setId)
    );
}