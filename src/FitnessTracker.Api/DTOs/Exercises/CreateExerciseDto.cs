using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Exercises;

public class CreateExerciseDto
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public ExerciseType? ExerciseType { get; set; }

    [Required]
    public ExerciseTrackingType? TrackingType { get; set; }

    [StringLength(100)]
    public string? PrimaryMuscleGroup { get; set; }

    [StringLength(100)]
    public string? Equipment { get; set; }
}