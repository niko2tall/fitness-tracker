using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.Models;

public class Exercise
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public ExerciseType ExerciseType { get; set; }

    public ExerciseTrackingType TrackingType { get; set; }

    public string? PrimaryMuscleGroup { get; set; }

    public string? Equipment { get; set; }

    public bool IsCustom { get; set; }

    public Guid? CreatedByUserId { get; set; }

    public ApplicationUser? CreatedByUser { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; }
        = new List<WorkoutExercise>();
}