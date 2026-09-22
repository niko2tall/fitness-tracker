using FitnessTracker.Api.DTOs.Progress;

namespace FitnessTracker.Api.Services.Progress;

public interface IProgressService
{
    Task<ExerciseHistoryResponseDto?>
        GetExerciseHistoryAsync(
            Guid exerciseId,
            CancellationToken cancellationToken
                = default);
}