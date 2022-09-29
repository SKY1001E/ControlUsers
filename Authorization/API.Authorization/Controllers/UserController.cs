using API.Authorization.BindingModel;
using API.Authorization.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Authorization.DTO;
using API.Authorization.JWTToken;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using API.Authorization.Enums;

namespace API.Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly JWTConfig _jwtConfig;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(
            ILogger<UserController> logger, 
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager, 
            IOptions<JWTConfig> jwtConfig, 
            RoleManager<IdentityRole> roleManager
            )
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtConfig = jwtConfig.Value;
            _roleManager = roleManager;
        }

        [HttpPost]
        [Route("RegisterUser")]
        public async Task<object> Register([FromBody] AddUpdateRegisterUserBindingModel model)
        {
            try
            {
                if (!await _roleManager.RoleExistsAsync(model.Role))
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Role doesn't exist", null));
                }

                var user = new AppUser()
                {
                    FullName = model.FullName,
                    Email = model.Email,
                    UserName = model.Email,
                    DateCreated = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    var tempUser = await _userManager.FindByEmailAsync(model.Email);
                    await _userManager.AddToRoleAsync(tempUser, model.Role);

                    return Task.FromResult(new ResponseModel(ResponseCode.Ok, "User has been Registered", null));
                }

                return Task.FromResult(new ResponseModel(ResponseCode.Error, "", result.Errors.Select(x => x.Description).ToArray()));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet]
        [Route("GetAllUser")]
        [Authorize(Roles = "Admin")]
        public async Task<object> GetAllUser()
        {
            try
            {
                List<UserDTO> allUserDTO = new List<UserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

                    allUserDTO.Add(new UserDTO(user.FullName, user.Email, user.UserName, user.DateCreated, role));
                }

                return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "", allUserDTO));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet]
        [Route("GetUserList")]
        [Authorize(Roles = "User, Admin")]
        public async Task<object> GetUserList()
        {
            try
            {
                List<UserDTO> allUserDTO = new List<UserDTO>();
                var users = _userManager.Users.ToList();
                foreach (var user in users)
                {
                    var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

                    if(role == "User")
                        allUserDTO.Add(new UserDTO(user.FullName, user.Email, user.UserName, user.DateCreated, role));
                }

                return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "", allUserDTO));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<object> Login([FromBody] LoginBindingModel model)
        {
            try
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
                if (result.Succeeded)
                {
                    var appUser = await _userManager.FindByEmailAsync(model.Email);
                    var role = (await _userManager.GetRolesAsync(appUser)).FirstOrDefault();
                    var user = new UserDTO(appUser.FullName, appUser.Email, appUser.UserName, appUser.DateCreated, role);
                    user.Token = GenerateJWT(appUser, role);

                    return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "", user));
                }

                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Email or Password is invalid", null));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost]
        [Route("AddRole")]
        [Authorize]
        public async Task<object> AddRole([FromBody] AddRoleBindingModel model)
        {
            try
            {
                if (model == null || model.Role == "")
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Parameters are missing", null));

                }
                if (await _roleManager.RoleExistsAsync(model.Role))
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "Role already exist", null)); 

                }

                var role = new IdentityRole();
                role.Name = model.Role;
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "Role added successfully", null));
                }

                return await Task.FromResult(new ResponseModel(ResponseCode.Error, "Something went wrong, please try again later", null));
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpGet]
        [Route("GetRoles")]
        public async Task<object> GetRoles()
        {
            try
            {
                var roles = _roleManager.Roles.Select(x => x.Name).ToList();

                return await Task.FromResult(new ResponseModel(ResponseCode.Ok, "", roles));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        private string GenerateJWT(AppUser user, string role)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);

        }
    }
}
