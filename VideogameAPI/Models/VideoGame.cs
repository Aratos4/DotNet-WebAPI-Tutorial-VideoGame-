namespace VideogameAPI.Models;

public class VideoGame
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsReleased { get; set; }
    public decimal Price { get; set; }
    public int PublisherId { get; set; }
    public Publisher? Publisher { get; set; }
    public List<Developer> Developers { get; set; } = new();
    public List<Platform> Platforms { get; set; } = new();
    public DateTime ReleaseDate { get; set; }
}