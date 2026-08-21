using FitnessTracker.Api.DTOs.Exercises;
using FitnessTracker.Api.Services.Exercises;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exerciseService;

    public ExercisesController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(IReadOnlyList<ExerciseResponseDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ExerciseResponseDto>>> GetAll(
        [FromQuery] bool includeArchived = false,
        CancellationToken cancellationToken = default)
    {
        var exercises = await _exerciseService.GetAllAsync(
            includeArchived,
            cancellationToken);

        return Ok(exercises);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(
        typeof(ExerciseResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ExerciseResponseDto>> GetById(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var exercise = await _exerciseService.GetByIdAsync(
            id,
            cancellationToken);

        if (exercise is null)
        {
            return NotFound();
        }

        return Ok(exercise);
    }

    [HttpPost]
    [ProducesResponseType(
        typeof(ExerciseResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ExerciseResponseDto>> Create(
        CreateExerciseDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var exercise = await _exerciseService.CreateAsync(
                dto,
                cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new { id = exercise.Id },
                exercise);
        }
        catch (ArgumentException exception)
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Invalid exercise",
                detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Exercise conflict",
                detail: exception.Message);
        }
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(
        typeof(ExerciseResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ExerciseResponseDto>> Update(
        Guid id,
        UpdateExerciseDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var exercise = await _exerciseService.UpdateAsync(
                id,
                dto,
                cancellationToken);

            if (exercise is null)
            {
                return NotFound();
            }

            return Ok(exercise);
        }
        catch (ArgumentException exception)
        {
            return Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Invalid exercise",
                detail: exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Exercise conflict",
                detail: exception.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Archive(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var archived = await _exerciseService.ArchiveAsync(
                id,
                cancellationToken);

            if (!archived)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Exercise conflict",
                detail: exception.Message);
        }
    }
}