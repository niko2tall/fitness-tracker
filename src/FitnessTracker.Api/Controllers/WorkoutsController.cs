using FitnessTracker.Api.DTOs.Workouts;
using FitnessTracker.Api.Services.Workouts;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutsController(
        IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(IReadOnlyList<WorkoutSummaryDto>),
        StatusCodes.Status200OK)]
    public async Task<
        ActionResult<IReadOnlyList<WorkoutSummaryDto>>>
        GetAll(
            CancellationToken cancellationToken = default)
    {
        var workouts =
            await _workoutService.GetAllAsync(
                cancellationToken);

        return Ok(workouts);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(
        typeof(WorkoutResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WorkoutResponseDto>>
        GetById(
            Guid id,
            CancellationToken cancellationToken = default)
    {
        var workout =
            await _workoutService.GetByIdAsync(
                id,
                cancellationToken);

        if (workout is null)
        {
            return NotFound();
        }

        return Ok(workout);
    }

    [HttpPost]
    [ProducesResponseType(
        typeof(WorkoutResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<WorkoutResponseDto>>
        Create(
            CreateWorkoutDto dto,
            CancellationToken cancellationToken = default)
    {
        try
        {
            var workout =
                await _workoutService.CreateAsync(
                    dto,
                    cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new { id = workout.Id },
                workout);
        }
        catch (ArgumentException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status400BadRequest,
                title: "Invalid workout",
                detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes
                        .Status500InternalServerError,
                title: "Workout creation failed",
                detail: exception.Message);
        }
    }

    [HttpPost("{workoutId:guid}/exercises")]
    [ProducesResponseType(
        typeof(WorkoutExerciseResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<
        ActionResult<WorkoutExerciseResponseDto>>
        AddExercise(
            Guid workoutId,
            AddWorkoutExerciseDto dto,
            CancellationToken cancellationToken = default)
    {
        try
        {
            var workoutExercise =
                await _workoutService
                    .AddExerciseAsync(
                        workoutId,
                        dto,
                        cancellationToken);

            if (workoutExercise is null)
            {
                return NotFound();
            }

            return StatusCode(
                StatusCodes.Status201Created,
                workoutExercise);
        }
        catch (ArgumentException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status400BadRequest,
                title: "Invalid workout exercise",
                detail: exception.Message);
        }
        catch (KeyNotFoundException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status404NotFound,
                title: "Exercise not found",
                detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status409Conflict,
                title: "Workout exercise conflict",
                detail: exception.Message);
        }
    }

    [HttpPost(
        "{workoutId:guid}/exercises/{workoutExerciseId:guid}/sets")]
    [ProducesResponseType(
        typeof(WorkoutSetResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<WorkoutSetResponseDto>>
        AddSet(
            Guid workoutId,
            Guid workoutExerciseId,
            CreateWorkoutSetDto dto,
            CancellationToken cancellationToken = default)
    {
        try
        {
            var workoutSet =
                await _workoutService.AddSetAsync(
                    workoutId,
                    workoutExerciseId,
                    dto,
                    cancellationToken);

            if (workoutSet is null)
            {
                return NotFound();
            }

            return StatusCode(
                StatusCodes.Status201Created,
                workoutSet);
        }
        catch (ArgumentException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status400BadRequest,
                title: "Invalid workout set",
                detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode:
                    StatusCodes.Status409Conflict,
                title: "Workout set conflict",
                detail: exception.Message);
        }
    }
}