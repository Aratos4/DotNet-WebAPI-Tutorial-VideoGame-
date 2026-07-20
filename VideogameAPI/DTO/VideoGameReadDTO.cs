namespace VideogameAPI.DTO;

public class VideoGameReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsReleased { get; set; }
    public decimal Price { get; set; }
    public string PublisherName { get; set; } = string.Empty;
    public List<string> DeveloperNames { get; set; } = new();
    public List<string> PlatformNames { get; set; } = new();
    public DateTime ReleaseDate { get; set; }
}