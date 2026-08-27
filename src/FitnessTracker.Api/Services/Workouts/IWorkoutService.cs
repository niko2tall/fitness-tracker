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

    Task<WorkoutExerciseResponseDto?> AddExerciseAsync(
        Guid workoutId,
        AddWorkoutExerciseDto dto,
        CancellationToken cancellationToken = default);
}