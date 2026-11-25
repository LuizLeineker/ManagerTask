using System.ComponentModel.DataAnnotations;

public class TaskItem
{
    [Key]
    public int TaskId { get; set; }
    [MaxLength(30)] public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? DueDate { get; set; }

    // FK referente a tabela user
    public int UserId { get; set; }

    // FK da etiqueta (pode ser nula)
    public int? LabelId { get; set; }
    public Label? Label { get; set; }
}
