using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class WorkoutSetResponseDto
{
    public Guid Id { get; set; }

    public int SetNumber { get; set; }

    public SetType SetType { get; set; }

    public int? Reps { get; set; }

    public double? WeightKg { get; set; }

    public int? DurationSeconds { get; set; }

    public double? DistanceMeters { get; set; }

    public double? Rpe { get; set; }

    public bool IsCompleted { get; set; }

    public string? Notes { get; set; }
}