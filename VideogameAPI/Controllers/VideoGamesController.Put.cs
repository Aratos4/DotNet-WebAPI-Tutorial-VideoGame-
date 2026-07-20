using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.DTO;

namespace VideogameAPI.Controllers;

public partial class VideoGamesController
{
    [HttpPut("{id}")]
    public async Task<IActionResult> PutVideoGame(int id, VideoGameUpdateDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest();
        }

        var videoGame = await _context.VideoGames
            .Include(v => v.Developers)
            .Include(v => v.Platforms)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (videoGame == null)
        {
            return NotFound();
        }

        var developers = await _context.Developers
            .Where(d => dto.DeveloperIds.Contains(d.Id))
            .ToListAsync();

        var platforms = await _context.Platforms
            .Where(p => dto.PlatformIds.Contains(p.Id))
            .ToListAsync();

        videoGame.Title = dto.Title;
        videoGame.Price = dto.Price;
        videoGame.IsReleased = dto.IsReleased;
        videoGame.ReleaseDate = dto.ReleaseDate.ToUniversalTime();
        videoGame.PublisherId = dto.PublisherId;
        videoGame.Developers = developers;
        videoGame.Platforms = platforms;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.VideoGames.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }
}