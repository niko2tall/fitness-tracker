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
}