using System.ComponentModel.DataAnnotations;
using muvinBackend.Enums;

namespace muvinBackend.DTOs;

public class LeadUpdateStatusDto
{
    [Required]
    public StatusLeadEnum StatusLead { get; set; }
}
