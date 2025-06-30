using Microsoft.EntityFrameworkCore;
using RiskZero.Data;
using RiskZero.Model;

namespace RiskZero.Service
{
    public class SupplierService : ISupplierService
    {
        private readonly RiskZeroDbContext _context;

        public SupplierService(RiskZeroDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Supplier>> GetAllSuppliersAsync()
        {
            return await _context.Suppliers
                                 .Include(s => s.Country)
                                 .ToListAsync();
        }

        public async Task<Supplier?> GetSupplierByIdAsync(string taxId)
        {
            return await _context.Suppliers
                                 .Include(s => s.Country)
                                 .FirstOrDefaultAsync(s => s.TaxId == taxId);
        }

        public async Task<Supplier> CreateSupplierAsync(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return supplier;
        }

        public async Task<bool> UpdateSupplierAsync(string taxId, Supplier supplier)
        {
            var existingSupplier = await _context.Suppliers.FindAsync(taxId);
            if (existingSupplier == null)
            {
                return false;
            }

            existingSupplier.LegalName = supplier.LegalName;
            existingSupplier.TradeName = supplier.TradeName;
            existingSupplier.PhoneNumber = supplier.PhoneNumber;
            existingSupplier.Email = supplier.Email;
            existingSupplier.Website = supplier.Website;
            existingSupplier.PhysicalAddress = supplier.PhysicalAddress;
            existingSupplier.CountryId = supplier.CountryId;
            existingSupplier.AnnualRevenueUsd = supplier.AnnualRevenueUsd;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSupplierAsync(string taxId)
        {
            var supplierToDelete = await _context.Suppliers.FindAsync(taxId);
            if (supplierToDelete == null)
            {
                return false;
            }

            _context.Suppliers.Remove(supplierToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}