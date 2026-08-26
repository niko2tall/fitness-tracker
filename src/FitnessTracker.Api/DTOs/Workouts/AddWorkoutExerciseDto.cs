using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.DTOs.Workouts;

public class AddWorkoutExerciseDto
{
    [Required]
    public Guid? ExerciseId { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}