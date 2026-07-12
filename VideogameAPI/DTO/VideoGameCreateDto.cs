namespace VideogameAPI.Models
{
    public class VideoGameCreateDto
    {
        
        public string Title { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string Developer { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
    }
}