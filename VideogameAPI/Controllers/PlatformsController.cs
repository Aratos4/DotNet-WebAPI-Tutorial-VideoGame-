using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.Data;
using VideogameAPI.DTO;
using VideogameAPI.Models;

namespace VideogameAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PlatformsController : ControllerBase
{
    private readonly VideoGameDbContext _context;

    public PlatformsController(VideoGameDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlatformReadDto>>> GetPlatforms()
    {
        var platforms = await _context.Platforms
            .OrderBy(p => p.Id)
            .ToListAsync();

        var platformsDto = platforms.Select(p => new PlatformReadDto
        {
            Id = p.Id,
            Name = p.Name
        }).ToList();

        return Ok(platformsDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlatformReadDto>> GetPlatform(int id)
    {
        var platform = await _context.Platforms.FindAsync(id);

        if (platform == null)
        {
            return NotFound();
        }

        var responseDto = new PlatformReadDto
        {
            Id = platform.Id,
            Name = platform.Name
        };

        return Ok(responseDto);
    }

    [HttpPost]
    public async Task<ActionResult<PlatformReadDto>> PostPlatform(PlatformCreateDto dto)
    {
        var newPlatform = new Platform
        {
            Name = dto.Name
        };

        _context.Platforms.Add(newPlatform);
        await _context.SaveChangesAsync();

        var responseDto = new PlatformReadDto
        {
            Id = newPlatform.Id,
            Name = newPlatform.Name
        };

        return CreatedAtAction(nameof(GetPlatform), new { id = newPlatform.Id }, responseDto);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlatform(int id)
    {
        var platform = await _context.Platforms.FindAsync(id);
        if (platform == null)
        {
            return NotFound();
        }

        _context.Platforms.Remove(platform);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}