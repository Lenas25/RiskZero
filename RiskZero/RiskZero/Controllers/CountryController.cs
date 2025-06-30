using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskZero.Model;
using RiskZero.Service;

namespace RiskZero.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;

        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetContries()
        {
            var countries = await _countryService.GetAllCountriesAsync();
            return Ok(new
            {
                message = "Obtuvimos correctamente la lista de paises.",
                data = countries
            });
        }

    }
}
