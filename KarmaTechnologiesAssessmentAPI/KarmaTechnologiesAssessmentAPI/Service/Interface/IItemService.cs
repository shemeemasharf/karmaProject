using FullStackAPI.DTOs;

namespace FullStackAPI.Services
{
    public interface IItemService
    {
        Task<List<ItemDto>> GetAllAsync();
        Task<ItemDto> GetByIdAsync(int id);
        Task<ItemDto> AddAsync(ItemDto itemDto);
        Task<ItemDto> UpdateAsync(ItemDto itemDto);
        Task DeleteAsync(int id);
    }
}
