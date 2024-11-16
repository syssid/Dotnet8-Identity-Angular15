using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Account
{
    public class RegisterDTO
    {
        [StringLength(15, MinimumLength = 3 , ErrorMessage = "First name must be atlease {2} and maximum {1} characters")]
        public required string FirstName { get; set; }

        [StringLength(15, MinimumLength = 3, ErrorMessage = "Last name must be atlease {2} and maximum {1} characters")]
        public required string LastName { get; set; }
        [RegularExpression("^[_a-z0-9-]+(.[a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$", ErrorMessage ="Invalid Email Address")]
        public required string Email { get; set; }
        [StringLength(15, MinimumLength = 8, ErrorMessage = "Password must be atlease {2} and maximum {1} characters")]
        public required string Password { get; set; }
    }
}
