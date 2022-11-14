using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection ApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            // add Token service
            services.AddScoped<ITokenService,TokenService>();
            // add user repositroy services
            services.AddScoped<IUserRepository,UserRepository>();
            //add cloudinary service
            services.AddScoped<IPhotoService,PhotoService>();
            //add auto mapper 
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(optios=>
            {
                optios.UseSqlite(config.GetConnectionString("DefaultConnection"));

            });
            return services;
        }
        
    }
}