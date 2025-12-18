using Microsoft.EntityFrameworkCore;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

// הוספת מדיניות CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// הוספת קונפיגורציה של מסד נתונים
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("ToDoDB"), 
    Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.44-mysql")));

// הוספת Controllers
builder.Services.AddControllers();

// הוספת API Explorer
builder.Services.AddEndpointsApiExplorer();

// הוספת Swagger
builder.Services.AddSwaggerGen();

var app = builder.Build();

// שימוש במדיניות CORS
app.UseCors("AllowAllOrigins");


// הפעלת Swagger
//if (app.Environment.IsDevelopment())
//{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // אם רוצים שה-Swagger יופיע ב-root
    });
//}

app.MapControllers();

// הגדרות של API
app.MapGet("/items", async (ToDoDbContext db) =>
{
    return await db.Items.ToListAsync();
})
.WithName("GetAllItems");

app.MapPost("/items", async (Item item, ToDoDbContext db) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
})
.WithName("AddItem");

app.MapPut("/items/{id}", async (int id, Item updatedItem, ToDoDbContext db) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.IsComplete = updatedItem.IsComplete;

    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("UpdateItem");

app.MapDelete("/items/{id}", async (int id, ToDoDbContext db) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
})

.WithName("DeleteItem");
app.MapGet("/", () => "Server is running!");

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
var isLocal = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("RENDER"));

if (isLocal)
{
    app.Run($"http://localhost:{port}");
}
else
{
    app.Run($"http://0.0.0.0:{port}");
}
