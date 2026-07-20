using Microsoft.EntityFrameworkCore;
using VideogameAPI.Models;

namespace VideogameAPI.Data;

public class VideoGameDbContext : DbContext
{
    public VideoGameDbContext(DbContextOptions<VideoGameDbContext> options) : base(options)
    {
    }

    public DbSet<VideoGame> VideoGames { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Developer> Developers { get; set; }
    public DbSet<Platform> Platforms { get; set; }
}