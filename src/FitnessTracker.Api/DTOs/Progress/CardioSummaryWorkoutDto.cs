using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Progress;

public sealed class CardioSummaryWorkoutDto
{
    public Guid WorkoutId { get; init; }

    public string WorkoutName { get; init; } = string.Empty;

    public WorkoutType WorkoutType { get; init; }

    public DateTime StartedAtUtc { get; init; }

    public DateTime? EndedAtUtc { get; init; }

    public double TotalDistanceMeters { get; init; }

    public double TotalDurationSeconds { get; init; }

    public double DistanceDurationSeconds { get; init; }

    public int CardioSetCount { get; init; }

    public IReadOnlyList<CardioSummaryExerciseDto> Exercises { get; init; }
        = Array.Empty<CardioSummaryExerciseDto>();
}