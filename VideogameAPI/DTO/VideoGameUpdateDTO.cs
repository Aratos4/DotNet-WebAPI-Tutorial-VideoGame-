namespace VideogameAPI.DTO;

public class VideoGameUpdateDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsReleased { get; set; }
    public decimal Price { get; set; }
    public int PublisherId { get; set; }
    public List<int> DeveloperIds { get; set; } = new();
    public List<int> PlatformIds { get; set; } = new();
    public DateTime ReleaseDate { get; set; }
}