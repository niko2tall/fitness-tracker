using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Services.Progress;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/progress/cardio-summary")]
public sealed class CardioSummaryController : ControllerBase
{
    private readonly ICardioSummaryService _cardioSummaryService;

    public CardioSummaryController(
        ICardioSummaryService cardioSummaryService)
    {
        _cardioSummaryService = cardioSummaryService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(CardioSummaryResponseDto),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<CardioSummaryResponseDto>> GetCardioSummary(
        CancellationToken cancellationToken)
    {
        var response =
            await _cardioSummaryService.GetCardioSummaryAsync(
                cancellationToken);

        return Ok(response);
    }
}