using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Workouts;

public class CreateWorkoutSetDto
{
    public SetType SetType { get; set; } = SetType.Working;

    [Range(1, int.MaxValue)]
    public int? Reps { get; set; }

    [Range(0.0, double.MaxValue)]
    public double? WeightKg { get; set; }

    [Range(1, int.MaxValue)]
    public int? DurationSeconds { get; set; }

    [Range(0.0, double.MaxValue)]
    public double? DistanceMeters { get; set; }

    [Range(1.0, 10.0)]
    public double? Rpe { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}