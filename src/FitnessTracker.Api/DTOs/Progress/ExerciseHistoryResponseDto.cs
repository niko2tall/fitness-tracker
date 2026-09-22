using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Progress;

public class ExerciseHistoryResponseDto
{
    public Guid ExerciseId { get; set; }

    public string ExerciseName { get; set; }
        = string.Empty;

    public ExerciseType ExerciseType { get; set; }

    public ExerciseTrackingType TrackingType
    {
        get;
        set;
    }

    public string? PrimaryMuscleGroup
    {
        get;
        set;
    }

    public string? Equipment { get; set; }

    public bool IsCustom { get; set; }

    public bool IsArchived { get; set; }

    public IReadOnlyList<ExerciseHistoryWorkoutDto>
        Entries
    {
        get;
        set;
    } = new List<ExerciseHistoryWorkoutDto>();
}