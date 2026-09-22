using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Services.Progress;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/progress")]
public class ProgressController :
    ControllerBase
{
    private readonly IProgressService
        _progressService;

    public ProgressController(
        IProgressService progressService)
    {
        _progressService =
            progressService;
    }

    [HttpGet(
        "exercises/{exerciseId:guid}/history")]
    public async Task<
        ActionResult<ExerciseHistoryResponseDto>>
        GetExerciseHistory(
            Guid exerciseId,
            CancellationToken cancellationToken)
    {
        var history =
            await _progressService
                .GetExerciseHistoryAsync(
                    exerciseId,
                    cancellationToken);

        if (history is null)
        {
            return NotFound();
        }

        return Ok(history);
    }
}