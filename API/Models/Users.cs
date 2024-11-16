using Microsoft.AspNetCore.Identity;
namespace API.Models
{
    public class Users : IdentityUser
    {
        public required string? FirstName { get; set; }
        public required string? LastName { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
    }
}
