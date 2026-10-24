public class Label
{
    public int LabelId { get; set; }
    public string Name { get; set; } = null!;

    // FK referente a tabela user
    public int UserId { get; set; }
}
