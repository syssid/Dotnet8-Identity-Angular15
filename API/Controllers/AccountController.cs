using API.DTOs.Account;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService jWTService;
        private readonly SignInManager<Users> signInManager;
        private readonly UserManager<Users> userManager;

        public AccountController(JWTService jWTService, SignInManager<Users> signInManager, UserManager<Users> userManager)
        {
            this.jWTService = jWTService;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }
        [Authorize]
        [HttpGet("refresh-token")]
        public async Task<ActionResult<UserDTO>> RefreshToken()
        {
            var user = await userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value!);

            return CreateApplicationUserDTO(user!);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await userManager.FindByNameAsync(loginDTO.UserName!);

            if (user == null) return BadRequest("Invalid UserName or Password");

            if (user.EmailConfirmed == false) return BadRequest("Please confirm your Email");

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDTO.Password!, false);

            if(!result.Succeeded) return BadRequest("Invalid UserName or Password");

            return CreateApplicationUserDTO(user);
        }
        [HttpPost("register")]
        public async Task<IActionResult> UserRegister(RegisterDTO registerDTO)
        {
            if (await CheckEmailExistsAsync(registerDTO.Email))
                return BadRequest($"exist account is using {registerDTO.Email} email address. please try with a new email");

            var userToAdd = new Users
            {
                FirstName = registerDTO.FirstName.ToLower(),
                LastName = registerDTO.LastName.ToLower(),
                Email = registerDTO.Email.ToLower(),
                UserName = registerDTO.Email.ToLower(),
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(userToAdd, registerDTO.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new JsonResult(new {title = "Create Account", message = "Your Account has been created successfully"}));
        }
        public UserDTO CreateApplicationUserDTO(Users user)
        {

            return new UserDTO
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = jWTService.CreateJWT(user)
            };
        }

        private async Task<bool> CheckEmailExistsAsync(string Email)
        {
            return await userManager.Users.AnyAsync(x => x.Email == Email.ToLower());
        }
    }
}
