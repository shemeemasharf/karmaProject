using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly AppDbContext _context;

        public ItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Item>> GetAllAsync() => await _context.Items.ToListAsync();

        public async Task<Item> GetByIdAsync(int id) => await _context.Items.FindAsync(id);

        public async Task AddAsync(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Item item)
        {
            var existingItem = await _context.Items.FindAsync(item.Id);
            if (existingItem != null)
            {
                existingItem.Name = item.Name;
                existingItem.Description = item.Description;
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException($"Item with Id {item.Id} not found.");
            }
        }


        public async Task DeleteAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item != null)
            {
                _context.Items.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
