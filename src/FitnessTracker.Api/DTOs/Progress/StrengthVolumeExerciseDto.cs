namespace FitnessTracker.Api.DTOs.Progress;

public sealed class StrengthVolumeExerciseDto
{
    public Guid ExerciseId { get; init; }

    public string ExerciseName { get; init; } = string.Empty;

    public double VolumeLoadKg { get; init; }

    public int VolumeSetCount { get; init; }
}