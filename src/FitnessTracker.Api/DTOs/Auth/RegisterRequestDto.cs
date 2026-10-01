using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.DTOs.Auth;

public sealed class RegisterRequestDto
{
    [Required]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Display name must be between 2 and 100 characters.")]
    public string DisplayName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(
        256,
        ErrorMessage = "Email cannot exceed 256 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(
        128,
        MinimumLength = 8,
        ErrorMessage = "Password must be between 8 and 128 characters.")]
    public string Password { get; set; } = string.Empty;
}