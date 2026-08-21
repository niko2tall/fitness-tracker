using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Exercises;

public class ExerciseResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ExerciseType ExerciseType { get; set; }

    public ExerciseTrackingType TrackingType { get; set; }

    public string? PrimaryMuscleGroup { get; set; }

    public string? Equipment { get; set; }

    public bool IsCustom { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}