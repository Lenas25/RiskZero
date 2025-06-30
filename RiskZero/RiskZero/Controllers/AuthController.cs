using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RiskZero.Data;
using RiskZero.DTOs;
using RiskZero.Model;
using RiskZero.Service;
using static RiskZero.DTOs.AuthDtos;
using BCrypt.Net;

namespace RiskZero.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly RiskZeroDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(RiskZeroDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new
                {
                    message= "El correo electrónico ya está en uso."
                });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                Password = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Usuario registrado exitosamente.",
                user = user.Email
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(UserLoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new
                {
                    message= "Credenciales inválidas."
                });
            }

            string accessToken = _tokenService.CreateAccessToken(user);
            string refreshToken = _tokenService.CreateRefreshToken();

            return Ok(new AuthResponseDto(accessToken, refreshToken));
        }
    }
}