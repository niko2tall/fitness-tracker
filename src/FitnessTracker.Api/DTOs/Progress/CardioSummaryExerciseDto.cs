using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Progress;

public sealed class CardioSummaryExerciseDto
{
    public Guid ExerciseId { get; init; }

    public string ExerciseName { get; init; } = string.Empty;

    public ExerciseTrackingType TrackingType { get; init; }

    public double DistanceMeters { get; init; }

    public double DurationSeconds { get; init; }

    public int CardioSetCount { get; init; }
}