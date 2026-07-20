namespace VideogameAPI.DTO;

public class PublisherReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class PublisherCreateDto
{
    public string Name { get; set; } = string.Empty;
}