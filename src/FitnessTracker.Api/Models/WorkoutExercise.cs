namespace FitnessTracker.Api.Models;

public class WorkoutExercise
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WorkoutId { get; set; }

    public Workout Workout { get; set; } = null!;

    public Guid ExerciseId { get; set; }

    public Exercise Exercise { get; set; } = null!;

    public int OrderIndex { get; set; }

    public string? Notes { get; set; }

    public ICollection<WorkoutSet> WorkoutSets { get; set; }
        = new List<WorkoutSet>();
}