using FitnessTracker.Api.DTOs.Exercises;

namespace FitnessTracker.Api.Services.Exercises;

public interface IExerciseService
{
    Task<IReadOnlyList<ExerciseResponseDto>> GetAllAsync(
        bool includeArchived = false,
        CancellationToken cancellationToken = default);

    Task<ExerciseResponseDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<ExerciseResponseDto> CreateAsync(
        CreateExerciseDto dto,
        CancellationToken cancellationToken = default);

    Task<ExerciseResponseDto?> UpdateAsync(
        Guid id,
        UpdateExerciseDto dto,
        CancellationToken cancellationToken = default);

    Task<bool> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}