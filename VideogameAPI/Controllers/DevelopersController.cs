using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.Data;
using VideogameAPI.DTO;
using VideogameAPI.Models;

namespace VideogameAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DevelopersController : ControllerBase
{
    private readonly VideoGameDbContext _context;

    public DevelopersController(VideoGameDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeveloperReadDto>>> GetDevelopers()
    {
        var developers = await _context.Developers
            .OrderBy(d => d.Id)
            .ToListAsync();

        var developersDto = developers.Select(d => new DeveloperReadDto
        {
            Id = d.Id,
            Name = d.Name,
            FoundedDate = d.FoundedDate
        }).ToList();

        return Ok(developersDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DeveloperReadDto>> GetDeveloper(int id)
    {
        var developer = await _context.Developers.FindAsync(id);

        if (developer == null)
        {
            return NotFound();
        }

        var responseDto = new DeveloperReadDto
        {
            Id = developer.Id,
            Name = developer.Name,
            FoundedDate = developer.FoundedDate
        };

        return Ok(responseDto);
    }

    [HttpPost]
    public async Task<ActionResult<DeveloperReadDto>> PostDeveloper(DeveloperCreateDto dto)
    {
        var newDeveloper = new Developer
        {
            Name = dto.Name,
            FoundedDate = dto.FoundedDate.ToUniversalTime()
        };

        _context.Developers.Add(newDeveloper);
        await _context.SaveChangesAsync();

        var responseDto = new DeveloperReadDto
        {
            Id = newDeveloper.Id,
            Name = newDeveloper.Name,
            FoundedDate = newDeveloper.FoundedDate
        };

        return CreatedAtAction(nameof(GetDeveloper), new { id = newDeveloper.Id }, responseDto);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDeveloper(int id)
    {
        var developer = await _context.Developers.FindAsync(id);
        if (developer == null)
        {
            return NotFound();
        }

        _context.Developers.Remove(developer);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}