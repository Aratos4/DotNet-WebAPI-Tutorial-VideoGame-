namespace VideogameAPI.Models 
{
    public class VideoGameResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string Developer { get; set; } = string.Empty;
        
    }
}