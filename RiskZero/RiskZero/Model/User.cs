using System.ComponentModel.DataAnnotations;

namespace RiskZero.Model
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

    }
}
