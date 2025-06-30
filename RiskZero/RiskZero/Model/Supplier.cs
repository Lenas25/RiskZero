using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Necesario para [Column]

namespace RiskZero.Model
{
    public class Supplier
    {
        [Key]
        [StringLength(11, ErrorMessage = "La Identificación Tributaria debe tener un máximo de 11 caracteres.")]
        [Required(ErrorMessage = "La Identificación Tributaria es obligatoria.")]
        [Column("tax_id")]
        public required string TaxId { get; set; }

        [Required(ErrorMessage = "La Razón Social es obligatoria.")]
        [Column("legal_name")] 
        public required string LegalName { get; set; }

        [Required(ErrorMessage = "El Nombre Comercial es obligatorio.")]
        [Column("trade_name")]
        public required string TradeName { get; set; }

        [Required(ErrorMessage = "El Teléfono es obligatorio.")]
        [Column("phone_number")]
        public required string PhoneNumber { get; set; }

        [Required(ErrorMessage = "El Correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        [Column("email")] 
        public required string Email { get; set; }

        [Column("website")]
        public required string Website { get; set; }

        [Column("physical_address")]
        public required string PhysicalAddress { get; set; }

        [Required(ErrorMessage = "El País es obligatorio.")]
        [Column("country_id")]
        public required int CountryId { get; set; }

        [ForeignKey("CountryId")]
        public Country? Country { get; set; }

        [Column("annual_revenue_usd", TypeName = "decimal(18, 2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Los ingresos anuales no pueden ser negativos.")]
        public required decimal AnnualRevenueUsd { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}