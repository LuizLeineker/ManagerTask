using System.ComponentModel.DataAnnotations;

public class Task
{
    public int TaskId { get; set; }
    [MinLength(5), MaxLength(30)] public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? DueDate { get; set; }

    // FK referente a tabela user 
    public int UserId { get; set; }
   
    // FK do rótulo (pode ser nulo)
    public int? LabelId { get; set; }
    public Label? Label { get; set; }
    
}