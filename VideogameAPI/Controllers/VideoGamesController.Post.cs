using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.DTO;
using VideogameAPI.Models;

namespace VideogameAPI.Controllers;

public partial class VideoGamesController
{
    [HttpPost]
    public async Task<ActionResult<VideoGameReadDto>> PostVideoGame(VideoGameCreateDto dto)
    {
        var developers = await _context.Developers
            .Where(d => dto.DeveloperIds.Contains(d.Id))
            .ToListAsync();

        var platforms = await _context.Platforms
            .Where(p => dto.PlatformIds.Contains(p.Id))
            .ToListAsync();

        var videoGame = new VideoGame
        {
            Title = dto.Title,
            Price = dto.Price,
            IsReleased = dto.IsReleased,
            ReleaseDate = dto.ReleaseDate.ToUniversalTime(),
            PublisherId = dto.PublisherId,
            Developers = developers,
            Platforms = platforms
        };

        _context.VideoGames.Add(videoGame);
        await _context.SaveChangesAsync();

        var publisher = await _context.Publishers.FindAsync(videoGame.PublisherId);

        var responseDto = new VideoGameReadDto
        {
            Id = videoGame.Id,
            Title = videoGame.Title,
            Price = videoGame.Price,
            IsReleased = videoGame.IsReleased,
            ReleaseDate = videoGame.ReleaseDate,
            PublisherName = publisher?.Name ?? string.Empty,
            DeveloperNames = videoGame.Developers.Select(d => d.Name).ToList(),
            PlatformNames = videoGame.Platforms.Select(p => p.Name).ToList()
        };

        return CreatedAtAction(nameof(GetVideoGame), new { id = videoGame.Id }, responseDto);
    }
}