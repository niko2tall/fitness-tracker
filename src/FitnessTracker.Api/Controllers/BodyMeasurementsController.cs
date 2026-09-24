using FitnessTracker.Api.DTOs.BodyMeasurements;
using FitnessTracker.Api.Services.BodyMeasurements;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/body-measurements")]
public class BodyMeasurementsController :
    ControllerBase
{
    private readonly IBodyMeasurementService
        _bodyMeasurementService;

    public BodyMeasurementsController(
        IBodyMeasurementService
            bodyMeasurementService)
    {
        _bodyMeasurementService =
            bodyMeasurementService;
    }

    [HttpGet]
    public async Task<
        ActionResult<
            IReadOnlyList<
                BodyMeasurementResponseDto>>>
        GetMeasurements(
            CancellationToken cancellationToken)
    {
        var measurements =
            await _bodyMeasurementService
                .GetMeasurementsAsync(
                    cancellationToken);

        return Ok(
            measurements);
    }

    [HttpGet("{id:guid}")]
    public async Task<
        ActionResult<
            BodyMeasurementResponseDto>>
        GetMeasurement(
            Guid id,
            CancellationToken cancellationToken)
    {
        var measurement =
            await _bodyMeasurementService
                .GetMeasurementAsync(
                    id,
                    cancellationToken);

        if (
            measurement is null
        )
        {
            return NotFound();
        }

        return Ok(
            measurement);
    }

    [HttpPost]
    public async Task<
        ActionResult<
            BodyMeasurementResponseDto>>
        CreateMeasurement(
            CreateBodyMeasurementDto request,
            CancellationToken cancellationToken)
    {
        if (
            request.RecordedAtUtc ==
            default)
        {
            ModelState.AddModelError(
                nameof(
                    request.RecordedAtUtc),
                "RecordedAtUtc is required.");

            return ValidationProblem(
                ModelState);
        }

        var created =
            await _bodyMeasurementService
                .CreateMeasurementAsync(
                    request,
                    cancellationToken);

        return CreatedAtAction(
            nameof(
                GetMeasurement),
            new
            {
                id =
                    created.Id,
            },
            created);
    }

    [HttpPut("{id:guid}")]
    public async Task<
        ActionResult<
            BodyMeasurementResponseDto>>
        UpdateMeasurement(
            Guid id,
            UpdateBodyMeasurementDto request,
            CancellationToken cancellationToken)
    {
        if (
            request.RecordedAtUtc ==
            default)
        {
            ModelState.AddModelError(
                nameof(
                    request.RecordedAtUtc),
                "RecordedAtUtc is required.");

            return ValidationProblem(
                ModelState);
        }

        var updated =
            await _bodyMeasurementService
                .UpdateMeasurementAsync(
                    id,
                    request,
                    cancellationToken);

        if (
            updated is null
        )
        {
            return NotFound();
        }

        return Ok(
            updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult>
        DeleteMeasurement(
            Guid id,
            CancellationToken cancellationToken)
    {
        var deleted =
            await _bodyMeasurementService
                .DeleteMeasurementAsync(
                    id,
                    cancellationToken);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}