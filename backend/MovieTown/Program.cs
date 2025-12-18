using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MovieTown.Models; 
using BCrypt.Net; 
using System.Security.Claims; // Wymagane dla ClaimTypes
using System.IdentityModel.Tokens.Jwt; // Wymagane dla JwtRegisteredClaimNames
using Microsoft.AspNetCore.Authorization; // Wymagane dla FallbackPolicy

var builder = WebApplication.CreateBuilder(args);

// --- 1. KONFIGURACJA BAZY DANYCH ---
builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- 2. POBIERANIE I WALIDACJA KLUCZA JWT ---
var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("Jwt:Key not configured in app settings.");

// --- 3. KONFIGURACJA UWIERZYTELNIANIA (AUTHENTICATION) ---
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
            
            // 💡 KLUCZOWE POPRAWKI MAPOWANIA ROSZCZEŃ (NAPRAWIAJĄCE BŁĄD 401)
            // Używamy "sub" jako głównego identyfikatora użytkownika.
            NameClaimType = JwtRegisteredClaimNames.Sub, 
            // Używamy ClaimTypes.Role, aby atrybut [Authorize(Roles="Admin")] działał poprawnie.
            RoleClaimType = ClaimTypes.Role,
            
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        
        // --- DIAGNOSTYKA JWT ---
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

// --- 4. KONFIGURACJA AUTORYZACJI (AUTHORIZATION) ---
// Ta linia jest wymagana, by atrybuty [Authorize] działały.
builder.Services.AddAuthorization(); 

// Opcjonalne: Ustawienie FallbackPolicy, aby wszystkie endpointy wymagały autoryzacji
// (jeśli nie jest jawnie użyty [AllowAnonymous]), ale pozostawiamy to w komentarzu,
// by zachować obecną logikę z [Authorize] na poziomie kontrolera.
/* builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
*/

builder.Services.AddControllers();

// --- 5. KONFIGURACJA CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000") 
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();


// --- 6. INICJALIZACJA BAZY DANYCH I TWORZENIE ADMINA ---
var adminEmail = "admin@cinema.com";
var adminPassword = "SecureAdminPassword123";
var adminFullName = "System Administrator";

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CinemaDbContext>();
        
        // Migracja bazy danych
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
                // Uzupełnij pozostałe pola, jeśli są wymagane przez model (np. PhoneNumber)
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

// --- 7. KONFIGURACJA MIDDLEWARE (PORZĄDEK JEST KLUCZOWY!) ---

app.UseCors("AllowFrontend");

app.UseRouting();

// Uwierzytelnianie musi być przed Autoryzacją
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();