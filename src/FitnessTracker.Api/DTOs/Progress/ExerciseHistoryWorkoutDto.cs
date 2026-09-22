using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Progress;

public class ExerciseHistoryWorkoutDto
{
    public Guid WorkoutId { get; set; }

    public Guid WorkoutExerciseId { get; set; }

    public string WorkoutName { get; set; }
        = string.Empty;

    public WorkoutType WorkoutType { get; set; }

    public DateTime StartedAtUtc { get; set; }

    public DateTime? EndedAtUtc { get; set; }

    public string? ExerciseNotes { get; set; }

    public IReadOnlyList<ExerciseHistorySetDto> Sets
    {
        get;
        set;
    } = new List<ExerciseHistorySetDto>();
}