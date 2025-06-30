using Microsoft.EntityFrameworkCore;
using RiskZero.Data;
using RiskZero.Model;

namespace RiskZero.Service
{
    public class CountryService : ICountryService
    {
        private readonly RiskZeroDbContext _context;

        public CountryService(RiskZeroDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Country>> GetAllCountriesAsync()
        {
            return await _context.Countries.ToListAsync();
        }
    }
}
