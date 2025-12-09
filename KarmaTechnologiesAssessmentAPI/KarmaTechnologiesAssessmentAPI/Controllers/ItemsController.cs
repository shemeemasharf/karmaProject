using Microsoft.AspNetCore.Mvc;
using FullStackAPI.DTOs;
using FullStackAPI.Services;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _service;

        public ItemsController(IItemService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ItemDto itemDto)
        {
            var addedItem = await _service.AddAsync(itemDto);
            return Ok(addedItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ItemDto itemDto)
        {
            itemDto.Id = id; // override JSON Id with route Id
            var updatedItem = await _service.UpdateAsync(itemDto);
            if (updatedItem == null)
                return NotFound();
            return Ok(updatedItem);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
