using FitnessTracker.Api.DTOs.Workouts;

namespace FitnessTracker.Api.Services.Workouts;

public interface IWorkoutService
{
    Task<IReadOnlyList<WorkoutSummaryDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<WorkoutResponseDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<WorkoutResponseDto> CreateAsync(
        CreateWorkoutDto dto,
        CancellationToken cancellationToken = default);

    Task<WorkoutResponseDto?> UpdateAsync(
        Guid workoutId,
        UpdateWorkoutDto dto,
        CancellationToken cancellationToken = default);

    Task<WorkoutExerciseResponseDto?> AddExerciseAsync(
        Guid workoutId,
        AddWorkoutExerciseDto dto,
        CancellationToken cancellationToken = default);

    Task<bool> RemoveExerciseAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        CancellationToken cancellationToken = default);

    Task<WorkoutSetResponseDto?> AddSetAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        CreateWorkoutSetDto dto,
        CancellationToken cancellationToken = default);

    Task<WorkoutSetResponseDto?> UpdateSetAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        Guid setId,
        UpdateWorkoutSetDto dto,
        CancellationToken cancellationToken = default);

    Task<bool> RemoveSetAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        Guid setId,
        CancellationToken cancellationToken = default);

    Task<WorkoutResponseDto?> CompleteAsync(
        Guid workoutId,
        CancellationToken cancellationToken = default);
}