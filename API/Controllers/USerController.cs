using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   [Authorize]
    public class USersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public USersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
           
            return Ok(users);
        }

        [HttpGet("{username}", Name ="GetUser")] // using this route name in retun createdAtRoute sttus in adding photo
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await _userRepository.GetMemberAsync(username);
            return user;           
        }
        
        [HttpPut]
        public async Task<ActionResult> UpdatUser(MemberUpdateDto memberUpdateDto)
        {
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.GetUserName();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("faild to update user");
        }

        [HttpPost("add-photo")] 
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null)  return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0 ) 
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
                // return _mapper.Map<PhotoDto>(photo); 
                return CreatedAtRoute("GetUser",new {username = user.UserName},_mapper.Map<PhotoDto>(photo)) ;
            }
            return BadRequest("problem adding photo");
        } 
        
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo.IsMain)  return BadRequest("this is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("failed to set main photo");
                     
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(x=>x.Id == photoId);

            if(photo == null)  return NotFound();
            if(photo.IsMain)  return BadRequest("you cann't delete your main photo");
            if(photo.PublicId != null)
            {
               var result= await _photoService.DeletePhotoAsync(photo.PublicId);

               if(result.Error != null) return BadRequest(result.Error.Message);            
            }

            user.Photos.Remove(photo);           
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("faild to delete photo");
        }

    }

}