using RiskZero.Model;

namespace RiskZero.Service
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetAllSuppliersAsync();
        Task<Supplier?> GetSupplierByIdAsync(string taxId);
        Task<Supplier> CreateSupplierAsync(Supplier supplier);
        Task<bool> UpdateSupplierAsync(string taxId, Supplier supplier);
        Task<bool> DeleteSupplierAsync(string taxId);
    }
}