using System.ComponentModel.DataAnnotations;

public class Label
{
    public int LabelId { get; set; }
    [MaxLength(30)] public string Name { get; set; } = string.Empty;

    // FK referente a tabela user
    public int UserId { get; set; }
}
