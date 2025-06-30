using System.ComponentModel.DataAnnotations;

namespace RiskZero.DTOs
{
    public class AuthDtos
    {
        public record UserRegisterDto([Required, EmailAddress] string Email, [Required, MinLength(6)] string Password);
        public record UserLoginDto([Required, EmailAddress] string Email, [Required] string Password);
        public record AuthResponseDto(string AccessToken, string RefreshToken);
        public record RefreshTokenRequestDto(string RefreshToken);
    }
}
