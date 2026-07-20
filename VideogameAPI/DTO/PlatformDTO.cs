namespace VideogameAPI.DTO;

public class PlatformReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class PlatformCreateDto
{
    public string Name { get; set; } = string.Empty;
}