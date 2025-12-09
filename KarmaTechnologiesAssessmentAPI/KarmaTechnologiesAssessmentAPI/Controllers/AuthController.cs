using Microsoft.AspNetCore.Mvc;
using FullStackAPI.DTOs;
using FullStackAPI.Models;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly User hardcodedUser = new User { Username = "admin", Password = "admin123" };

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (loginDto.Username == hardcodedUser.Username && loginDto.Password == hardcodedUser.Password)
                return Ok(new { message = "Login successful" });

            return Unauthorized(new { message = "Invalid credentials" });
        }
    }
}
