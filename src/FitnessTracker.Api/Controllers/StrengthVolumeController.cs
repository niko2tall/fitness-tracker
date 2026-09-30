using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Services.Progress;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/progress/strength-volume")]
public sealed class StrengthVolumeController : ControllerBase
{
    private readonly IStrengthVolumeService _strengthVolumeService;

    public StrengthVolumeController(
        IStrengthVolumeService strengthVolumeService)
    {
        _strengthVolumeService = strengthVolumeService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(StrengthVolumeResponseDto),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<StrengthVolumeResponseDto>> GetStrengthVolume(
        CancellationToken cancellationToken)
    {
        var response =
            await _strengthVolumeService.GetStrengthVolumeAsync(
                cancellationToken);

        return Ok(response);
    }
}