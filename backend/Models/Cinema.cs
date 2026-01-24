using System.ComponentModel.DataAnnotations;

namespace MovieTown.Models 
{
    public class Cinema
    {
        public int Id { get; set; } 

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int Rows { get; set; } 

        [Required]
        public int SeatsPerRow { get; set; }
    }
}