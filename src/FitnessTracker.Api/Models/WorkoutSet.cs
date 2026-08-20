using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.Models;

public class WorkoutSet
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WorkoutExerciseId { get; set; }

    public WorkoutExercise WorkoutExercise { get; set; } = null!;

    public int SetNumber { get; set; }

    public SetType SetType { get; set; } = SetType.Working;

    public int? Reps { get; set; }

    public double? WeightKg { get; set; }

    public int? DurationSeconds { get; set; }

    public double? DistanceMeters { get; set; }

    public double? Rpe { get; set; }

    public bool IsCompleted { get; set; }

    public string? Notes { get; set; }
}