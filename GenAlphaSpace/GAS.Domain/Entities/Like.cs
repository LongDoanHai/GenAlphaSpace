using System.ComponentModel.DataAnnotations;

namespace GenAlphaSpace.GAS.Domain.Entities
{
    public class Like
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int Userid { get; set; }
        //Navigation Properties
        public Post Post { get; set; }
        public User User { get; set; }
    }
}
