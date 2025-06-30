using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace RiskZero.Model
{
    public class Country
    {
        [Key]
        [Column("country_id")]
        public int CountryId { get; set; }

        [StringLength(100)]
        [Column("name")]
        public string? Name { get; set; }

        [StringLength(3, ErrorMessage = "El código ISO debe tener 2 caracteres.")]
        [Column("iso_code")]
        public string? IsoCode { get; set; }

        [JsonIgnore]
        public ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();

    }
}
