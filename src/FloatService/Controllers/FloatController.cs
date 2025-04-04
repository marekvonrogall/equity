using Microsoft.AspNetCore.Mvc;

namespace FloatService.Controllers;

[ApiController]
[Route("[controller]")]
public class FloatController : ControllerBase
{
    [HttpGet("ping")]
    public async Task<IActionResult> Ping()
    {
        string message = "works! (floatService)";
        return Ok(message);
    }
}
