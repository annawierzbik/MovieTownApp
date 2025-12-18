using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieTown.Models
{
    public class Screening
    {
        public int Id { get; set; }

        [Required]
        public int CinemaId { get; set; }
        public Cinema Cinema { get; set; }

        [Required]
        public string MovieTitle { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
    }
}