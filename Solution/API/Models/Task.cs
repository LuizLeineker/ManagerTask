using System.ComponentModel.DataAnnotations;

public class Task
{
    public int TaskId { get; set; }
    [MinLength(5), MaxLength(30)] public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // FK referente a tabela user 
    public int UserId { get; set; }
   
    
}