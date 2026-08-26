using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class WorkoutResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public WorkoutType WorkoutType { get; set; }

    public DateTime StartedAtUtc { get; set; }

    public DateTime? EndedAtUtc { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public IReadOnlyList<WorkoutExerciseResponseDto> Exercises { get; set; }
        = new List<WorkoutExerciseResponseDto>();
}