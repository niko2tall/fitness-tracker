using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class CreateWorkoutDto
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public WorkoutType? WorkoutType { get; set; }

    [StringLength(2000)]
    public string? Notes { get; set; }
}