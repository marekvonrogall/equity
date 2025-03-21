using Microsoft.AspNetCore.Mvc;

namespace inventoryService.Controllers;

[ApiController]
[Route("[controller]")]
public class InventoryController : ControllerBase
{
    [HttpGet("ping")]
    public async Task<IActionResult> Ping()
    {
        string message = "works! (inventoryService)";
        return Ok(new
        {
            message
        });
    }
}