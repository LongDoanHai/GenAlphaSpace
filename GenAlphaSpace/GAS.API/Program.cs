using GenAlphaSpace.GAS.Application.Interfaces;
using GenAlphaSpace.GAS.Application.Services;
using GenAlphaSpace.GAS.Domain.Interfaces;
using GenAlphaSpace.GAS.Infrastructure.Persistence;
using GenAlphaSpace.GAS.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GenAlphaSpace.GAS.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            
            // CORS Policy to allow frontend to fetch data
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });

            //Database
            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));
            //DI
            builder.Services.AddScoped<IPostRepository, PostRepository>();
            builder.Services.AddScoped<IPostService, PostService>();

            var app = builder.Build();

            // Enable CORS before other middleware
            app.UseCors("AllowFrontend");

            //Seed the database with initial data
            using (var scope = app.Services.CreateScope()) 
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await dbContext.Database.MigrateAsync();
                await DbInitializer.SeedAsync(dbContext);
            }
            

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
