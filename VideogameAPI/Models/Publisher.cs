namespace VideogameAPI.Models;

public class Publisher
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<VideoGame> VideoGames { get; set; } = new();
}