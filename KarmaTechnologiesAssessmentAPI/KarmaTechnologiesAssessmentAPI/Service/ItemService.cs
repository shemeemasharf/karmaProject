using FullStackAPI.DTOs;
using FullStackAPI.Models;
using FullStackAPI.Repositories;

namespace FullStackAPI.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _repo;

        public ItemService(IItemRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ItemDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return items.Select(i => new ItemDto { Id = i.Id, Name = i.Name, Description = i.Description }).ToList();
        }

        public async Task<ItemDto> GetByIdAsync(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return null;
            return new ItemDto { Id = item.Id, Name = item.Name, Description = item.Description };
        }

        public async Task<ItemDto> AddAsync(ItemDto itemDto)
        {
            var item = new Item { Name = itemDto.Name, Description = itemDto.Description };
            await _repo.AddAsync(item);
            itemDto.Id = item.Id;
            return itemDto;
        }

        public async Task<ItemDto> UpdateAsync(ItemDto itemDto)
        {
            var item = new Item { Id = itemDto.Id, Name = itemDto.Name, Description = itemDto.Description };
            await _repo.UpdateAsync(item);
            return itemDto;
        }

        public async Task DeleteAsync(int id) => await _repo.DeleteAsync(id);
    }
}
