using GenAlphaSpace.GAS.Domain.Entities;

namespace GenAlphaSpace.GAS.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(AppDbContext appDbContext)
        {
            if (!appDbContext.Users.Any() && !appDbContext.Posts.Any())
            {
                var newUser = new User()
                {
                    Name = "Ervis Trupja",
                    ProfilePictureUrl = "https://img-b.udemycdn.com/user/200_H/16004620_10db_5.jpg"
                };
                await appDbContext.Users.AddAsync(newUser);
                await appDbContext.SaveChangesAsync();

                var newPostWithoutImage = new Post()
                {
                    Content = "This is going to be our first post which is being loaded from the database and it has been created using our test user.",
                    ImageUrl = "",
                    NumsOfReports = 0,
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow,

                    UserId = newUser.Id
                };

                var newPostWithImage = new Post()
                {
                    Content = "This is going to be our first post which is being loaded from the database and it has been created using our test user. This post has an image",
                    ImageUrl = "https://unsplash.com/photos/foggy-mountain-summit-1Z2niiBPg5A",
                    NumsOfReports = 0,
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow,

                    UserId = newUser.Id
                };

                await appDbContext.Posts.AddRangeAsync(newPostWithoutImage, newPostWithImage);
                await appDbContext.SaveChangesAsync();
            }
        }
    }
}
