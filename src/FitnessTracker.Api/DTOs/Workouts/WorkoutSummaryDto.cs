using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class WorkoutSummaryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public WorkoutType WorkoutType { get; set; }

    public DateTime StartedAtUtc { get; set; }

    public DateTime? EndedAtUtc { get; set; }

    public int ExerciseCount { get; set; }
}