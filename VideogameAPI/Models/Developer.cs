namespace VideogameAPI.Models;

public class Developer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public List<VideoGame> VideoGames { get; set; } = new();
    public DateTime FoundedDate { get; set; }
}