using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;



[Index("Username", IsUnique = true), Index("Email", IsUnique = true)]
public class User
{
    public int UserId { get; set; }
    
    [MinLength(5), MaxLength(30)] public string Username { get; set; } = null!;
    
    [MaxLength(256)] public string Email { get; set; } = null!;
    
    [MinLength(5), MaxLength(30)] public string Password { get; set; } = null!;
    // Tarefas relacionadas ao user
    public List<Task> Tasks { get; set; } = new List<Task>();
    
  
}