using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MovieTown.Models; 
using BCrypt.Net; 
using System.Security.Claims; 
using System.IdentityModel.Tokens.Jwt; 
using Microsoft.AspNetCore.Authorization; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("Jwt:Key not configured in app settings.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            
            ValidIssuer = "CinemaApi",
            ValidAudience = "CinemaClient",
            

 
            NameClaimType = JwtRegisteredClaimNames.Sub, 
            RoleClaimType = ClaimTypes.Role,
            
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Token validation failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token successfully validated.");
                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddAuthorization(); 

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost") 
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();


var adminEmail = "admin@cinema.com";
var adminPassword = "SecureAdminPassword123";
var adminFullName = "System Administrator";

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CinemaDbContext>();
        
        context.Database.Migrate();

        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

        if (adminUser == null)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(adminPassword);

            var newAdmin = new User
            {
                Email = adminEmail,
                PasswordHash = hashedPassword,
                FullName = adminFullName,
                Role = "Admin", 
            };

            context.Users.Add(newAdmin);
            await context.SaveChangesAsync();
            
            Console.WriteLine($"Administrator '{adminEmail}' created.");
        }
        else
        {
            Console.WriteLine($"Administrator '{adminEmail}' already exists.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Wystąpił błąd podczas inicjalizacji bazy danych i tworzenia administratora.");
    }
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();