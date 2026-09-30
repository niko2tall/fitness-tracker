namespace FitnessTracker.Api.DTOs.Progress;

public sealed class StrengthVolumeResponseDto
{
    public IReadOnlyList<StrengthVolumeWorkoutDto> Workouts { get; init; }
        = Array.Empty<StrengthVolumeWorkoutDto>();
}