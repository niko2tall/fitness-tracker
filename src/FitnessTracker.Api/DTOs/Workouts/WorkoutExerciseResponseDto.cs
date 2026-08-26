using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class WorkoutExerciseResponseDto
{
    public Guid Id { get; set; }

    public Guid ExerciseId { get; set; }

    public string ExerciseName { get; set; } = string.Empty;

    public ExerciseType ExerciseType { get; set; }

    public ExerciseTrackingType TrackingType { get; set; }

    public int OrderIndex { get; set; }

    public string? Notes { get; set; }

    public IReadOnlyList<WorkoutSetResponseDto> Sets { get; set; }
        = new List<WorkoutSetResponseDto>();
}