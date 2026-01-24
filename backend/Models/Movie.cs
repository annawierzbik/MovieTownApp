using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieTown.Models
{
    public class Movie
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string Genre { get; set; }

        public string Duration { get; set; } 

        public string Rating { get; set; } 

        public string ReleaseDate { get; set; } 

        [Required]
        public string PosterImg { get; set; } 

        public string BackdropImg { get; set; } 

        public string Director { get; set; }

        public string Cast { get; set; } 

        public ICollection<Screening> Screenings { get; set; }
    }
}