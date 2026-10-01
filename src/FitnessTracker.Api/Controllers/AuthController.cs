using FitnessTracker.Api.DTOs.Auth;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(
        typeof(AuthUserDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthUserDto>> Register(
        RegisterRequestDto request)
    {
        var displayName =
            request.DisplayName.Trim();

        var email =
            request.Email.Trim();

        if (string.IsNullOrWhiteSpace(displayName))
        {
            ModelState.AddModelError(
                nameof(request.DisplayName),
                "Display name is required.");

            return ValidationProblem(ModelState);
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),

            DisplayName =
                displayName,

            UserName =
                email,

            Email =
                email,

            PreferredWeightUnit =
                WeightUnit.Kilograms,

            PreferredDistanceUnit =
                DistanceUnit.Kilometers,

            CreatedAtUtc =
                DateTime.UtcNow,
        };

        var result =
            await _userManager.CreateAsync(
                user,
                request.Password);

        if (!result.Succeeded)
        {
            AddIdentityErrors(
                result);

            return ValidationProblem(
                ModelState);
        }

        await _signInManager.SignInAsync(
            user,
            isPersistent: false);

        return StatusCode(
            StatusCodes.Status201Created,
            MapUser(user));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(
        typeof(AuthUserDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthUserDto>> Login(
        LoginRequestDto request)
    {
        var email =
            request.Email.Trim();

        var user =
            await _userManager
                .FindByEmailAsync(
                    email);

        if (user is null)
        {
            return Unauthorized(
                CreateInvalidCredentialsProblem());
        }

        var result =
            await _signInManager
                .PasswordSignInAsync(
                    user,
                    request.Password,
                    request.RememberMe,
                    lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            return Unauthorized(
                CreateInvalidCredentialsProblem());
        }

        return Ok(
            MapUser(user));
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(
        StatusCodes.Status204NoContent)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        await _signInManager
            .SignOutAsync();

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(
        typeof(AuthUserDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthUserDto>> Me()
    {
        var user =
            await _userManager
                .GetUserAsync(
                    User);

        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(
            MapUser(user));
    }

    private void AddIdentityErrors(
        IdentityResult result)
    {
        foreach (
            var error
            in result.Errors)
        {
            ModelState.AddModelError(
                error.Code,
                error.Description);
        }
    }

    private static ProblemDetails CreateInvalidCredentialsProblem()
    {
        return new ProblemDetails
        {
            Title =
                "Invalid credentials",

            Detail =
                "The email or password is incorrect.",

            Status =
                StatusCodes.Status401Unauthorized,
        };
    }

    private static AuthUserDto MapUser(
        ApplicationUser user)
    {
        return new AuthUserDto
        {
            Id =
                user.Id,

            DisplayName =
                user.DisplayName,

            Email =
                user.Email ??
                string.Empty,

            PreferredWeightUnit =
                user.PreferredWeightUnit,

            PreferredDistanceUnit =
                user.PreferredDistanceUnit,

            CreatedAtUtc =
                user.CreatedAtUtc,
        };
    }
}