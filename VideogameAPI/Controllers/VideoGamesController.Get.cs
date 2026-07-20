using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.DTO;

namespace VideogameAPI.Controllers;

public partial class VideoGamesController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoGameReadDto>>> GetVideoGames()
    {
        var games = await _context.VideoGames
            .Include(g => g.Publisher)
            .Include(g => g.Developers)
            .Include(g => g.Platforms)
            .OrderBy(g => g.Id)
            .ToListAsync();

        var gamesDto = games.Select(g => new VideoGameReadDto
        {
            Id = g.Id,
            Title = g.Title,
            IsReleased = g.IsReleased,
            Price = g.Price,
            ReleaseDate = g.ReleaseDate,
            PublisherName = g.Publisher != null ? g.Publisher.Name : string.Empty,
            DeveloperNames = g.Developers.Select(d => d.Name).ToList(),
            PlatformNames = g.Platforms.Select(p => p.Name).ToList()
        }).ToList();

        return Ok(gamesDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VideoGameReadDto>> GetVideoGame(int id)
    {
        var videoGame = await _context.VideoGames
            .Include(g => g.Publisher)
            .Include(g => g.Developers)
            .Include(g => g.Platforms)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (videoGame == null)
        {
            return NotFound();
        }

        var responseDto = new VideoGameReadDto
        {
            Id = videoGame.Id,
            Title = videoGame.Title,
            IsReleased = videoGame.IsReleased,
            Price = videoGame.Price,
            ReleaseDate = videoGame.ReleaseDate,
            PublisherName = videoGame.Publisher != null ? videoGame.Publisher.Name : string.Empty,
            DeveloperNames = videoGame.Developers.Select(d => d.Name).ToList(),
            PlatformNames = videoGame.Platforms.Select(p => p.Name).ToList()
        };

        return Ok(responseDto);
    }
}