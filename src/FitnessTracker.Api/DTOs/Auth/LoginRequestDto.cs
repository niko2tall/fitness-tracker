using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.DTOs.Auth;

public sealed class LoginRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(
        256,
        ErrorMessage = "Email cannot exceed 256 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(
        128,
        MinimumLength = 1,
        ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; }
}