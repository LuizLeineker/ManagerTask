using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

[Index("Username", IsUnique = true), Index("Email", IsUnique = true)]
public class User
{
    public int UserId { get; set; }

    [MaxLength(30)] public string Username { get; set; } = string.Empty;

    [MaxLength(256)] public string Email { get; set; } = string.Empty;

    [MaxLength(256)] public string Password { get; set; } = string.Empty;

    // Tarefas do usuário (1-N)
    public List<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    // Etiquetas do usuário (1-N)
    public List<Label> Labels { get; set; } = new List<Label>();
}
