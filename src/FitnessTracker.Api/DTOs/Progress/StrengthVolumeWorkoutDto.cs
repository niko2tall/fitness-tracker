using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Progress;

public sealed class StrengthVolumeWorkoutDto
{
    public Guid WorkoutId { get; init; }

    public string WorkoutName { get; init; } = string.Empty;

    public WorkoutType WorkoutType { get; init; }

    public DateTime StartedAtUtc { get; init; }

    public DateTime? EndedAtUtc { get; init; }

    public double TotalVolumeLoadKg { get; init; }

    public int VolumeSetCount { get; init; }

    public IReadOnlyList<StrengthVolumeExerciseDto> Exercises { get; init; }
        = Array.Empty<StrengthVolumeExerciseDto>();
}