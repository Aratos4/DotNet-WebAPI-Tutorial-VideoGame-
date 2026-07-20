using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideogameAPI.Data;
using VideogameAPI.DTO;
using VideogameAPI.Models;

namespace VideogameAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PublishersController : ControllerBase
{
    private readonly VideoGameDbContext _context;

    public PublishersController(VideoGameDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PublisherReadDto>>> GetPublishers()
    {
        var publishers = await _context.Publishers
            .OrderBy(p => p.Id)
            .ToListAsync();

        var publishersDto = publishers.Select(p => new PublisherReadDto
        {
            Id = p.Id,
            Name = p.Name
        }).ToList();

        return Ok(publishersDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PublisherReadDto>> GetPublisher(int id)
    {
        var publisher = await _context.Publishers.FindAsync(id);

        if (publisher == null)
        {
            return NotFound();
        }

        var responseDto = new PublisherReadDto
        {
            Id = publisher.Id,
            Name = publisher.Name
        };

        return Ok(responseDto);
    }

    [HttpPost]
    public async Task<ActionResult<PublisherReadDto>> PostPublisher(PublisherCreateDto dto)
    {
        var newPublisher = new Publisher
        {
            Name = dto.Name
        };

        _context.Publishers.Add(newPublisher);
        await _context.SaveChangesAsync();

        var responseDto = new PublisherReadDto
        {
            Id = newPublisher.Id,
            Name = newPublisher.Name
        };

        return CreatedAtAction(nameof(GetPublisher), new { id = newPublisher.Id }, responseDto);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePublisher(int id)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
        {
            return NotFound();
        }

        _context.Publishers.Remove(publisher);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}