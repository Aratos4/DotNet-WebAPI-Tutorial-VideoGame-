namespace VideogameAPI.DTO;

public class DeveloperReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public DateTime FoundedDate { get; set; }
}

public class DeveloperCreateDto
{
    public string Name { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public DateTime FoundedDate { get; set; }
}