using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User"; 

    public uint xmin { get; set; }
}
