using System.ComponentModel.DataAnnotations;

namespace MovieTown.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        [Required]
        public int ScreeningId { get; set; }
        public Screening Screening { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public int Row { get; set; }

        [Required]
        public int Seat { get; set; }
    }
}