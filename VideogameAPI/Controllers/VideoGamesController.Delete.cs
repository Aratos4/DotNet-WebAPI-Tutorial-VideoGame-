using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.Data;

namespace VideogameAPI.Controllers;

public partial class VideoGamesController
{
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVideoGame(int id)
    {
        var videoGame = await _context.VideoGames
            .Include(v => v.Developers)
            .Include(v => v.Platforms)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (videoGame == null)
        {
            return NotFound();
        }

        _context.VideoGames.Remove(videoGame);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}