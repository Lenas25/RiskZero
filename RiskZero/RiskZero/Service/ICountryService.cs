using RiskZero.Model;

namespace RiskZero.Service
{
    public interface ICountryService
    {
        Task<IEnumerable<Country>> GetAllCountriesAsync();
    }
}