using Microsoft.AspNetCore.Mvc;
using VideogameAPI.Data;

namespace VideogameAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public partial class VideoGamesController : ControllerBase
{
    private readonly VideoGameDbContext _context;

    public VideoGamesController(VideoGameDbContext context)
    {
        _context = context;
    }
}