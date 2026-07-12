using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.Data;
using VideogameAPI.Models;
using System.Linq;

namespace VideogameAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideoGamesController : ControllerBase
{
    
    private readonly VideoGameDbContext _context;

    
    public VideoGamesController(VideoGameDbContext context)
    {
        _context = context;
    }

    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoGameResponseDto>>> GetVideoGames()
    {
        
        var games = await _context.VideoGames.OrderBy(g => g.Id).ToListAsync();

        
        var gamesDto = games.Select(g => new VideoGameResponseDto
        {
            Id = g.Id,
            Title = g.Title,
            Platform = g.Platform,
            Developer = g.Developer
        }).ToList();

        
        return Ok(gamesDto);
    }
    
    
    
    [HttpPost]
    public async Task<ActionResult<VideoGameResponseDto>> PostVideoGame(VideoGameCreateDto dto)
    {
        
        var newGame = new VideoGame
        {
            Title = dto.Title,
            Platform = dto.Platform,
            Developer = dto.Developer,
            Publisher = dto.Publisher 
        };

        
        _context.VideoGames.Add(newGame);
        await _context.SaveChangesAsync();

        
        var responseDto = new VideoGameResponseDto
        {
            Id = newGame.Id,
            Title = newGame.Title,
            Platform = newGame.Platform,
            Developer = newGame.Developer
        };

        return CreatedAtAction(nameof(GetVideoGame), new { id = newGame.Id }, responseDto);
    }
    
    
    
    [HttpGet("{id}")]
    public async Task<ActionResult<VideoGameResponseDto>> GetVideoGame(int id)
    {
        var videoGame = await _context.VideoGames.FindAsync(id);

        if (videoGame == null)
        {
            return NotFound(); 
        }

        
        var responseDto = new VideoGameResponseDto
        {
            Id = videoGame.Id,
            Title = videoGame.Title,
            Platform = videoGame.Platform,
            Developer = videoGame.Developer
        };

        return responseDto;
    }

    
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVideoGame(int id)
    {
        
        var videoGame = await _context.VideoGames.FindAsync(id);
        if (videoGame == null)
        {
            return NotFound();
        }

        
        _context.VideoGames.Remove(videoGame);
        await _context.SaveChangesAsync();

        
        return NoContent(); 
    }
    
    
    
    [HttpPut("{id}")]
    public async Task<IActionResult> PutVideoGame(int id, VideoGameCreateDto dto)
    {
        
        var game = await _context.VideoGames.FindAsync(id);
        if (game == null)
        {
            return NotFound();
        }

        
        game.Title = dto.Title;
        game.Platform = dto.Platform;
        game.Developer = dto.Developer;
        game.Publisher = dto.Publisher;

        
        await _context.SaveChangesAsync();

        return NoContent();
    }
}