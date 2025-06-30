using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskZero.Model;
using RiskZero.Service;

namespace RiskZero.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            var suppliers = await _supplierService.GetAllSuppliersAsync();
            return Ok(new
            {
                message = "Obtuvimos correctamente la lista de proveedores.",
                data = suppliers
            });
        }

        [HttpGet("{taxId}")]
        public async Task<ActionResult<Supplier>> GetSupplier(string taxId)
        {
            var supplier = await _supplierService.GetSupplierByIdAsync(taxId);
            if (supplier == null)
            {
                return NotFound($"Proveedor con TaxId '{taxId}' no encontrado.");
            }
            return Ok(new
            {
                message = "Se obtuvo correctamene el proveedor.",
                data = supplier
            });
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> CreateSupplier([FromBody] Supplier supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdSupplier = await _supplierService.CreateSupplierAsync(supplier);
            return CreatedAtAction(nameof(GetSupplier), new { taxId = createdSupplier.TaxId }, createdSupplier);
        }

        [HttpPut("{taxId}")]
        public async Task<IActionResult> UpdateSupplier(string taxId, [FromBody] Supplier supplier)
        {
            if (taxId != supplier.TaxId)
            {
                return BadRequest("El TaxId de la ruta no coincide con el del objeto enviado.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _supplierService.UpdateSupplierAsync(taxId, supplier);
            if (!result)
            {
                return NotFound($"Proveedor con TaxId '{taxId}' no encontrado para actualizar.");
            }

            return NoContent();
        }

        [HttpDelete("{taxId}")]
        public async Task<IActionResult> DeleteSupplier(string taxId)
        {
            var result = await _supplierService.DeleteSupplierAsync(taxId);
            if (!result)
            {
                return NotFound($"Proveedor con TaxId '{taxId}' no encontrado para eliminar.");
            }
            return NoContent();
        }
    }
}