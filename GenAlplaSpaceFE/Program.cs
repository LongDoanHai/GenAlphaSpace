namespace GenAlplaSpaceFE
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(new WebApplicationOptions
            {
                WebRootPath = "FrontEnd"
            });

            var app = builder.Build();

            //app.MapGet("/", () => "Hello World!");
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new List<string> { "html/index.html" }
            });
            app.UseStaticFiles();
            app.Run();
        }
    }
}
