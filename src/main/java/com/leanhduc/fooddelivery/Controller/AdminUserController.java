package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.ResponseDto.UserDto;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/admin")
public class AdminUserController {
    private final IUserService userService;

    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam (defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader ("Authorization") String jwt) {
        User admin = userService.findByJwtToken(jwt);
        if (admin.getRole() != RoleUser.ROLE_RESTAURANT_OWNER) {
            throw new IllegalStateException("Only admin can access this resource");
        }
        return ResponseEntity.ok(userService.getUsers(page, size));
    }

    @DeleteMapping("/users/{id}/delete")
    public ResponseEntity<MessageResponse> deleteUser(
            @PathVariable Long id,
            @RequestHeader ("Authorization") String jwt) {
        User admin = userService.findByJwtToken(jwt);
        if (admin.getRole() != RoleUser.ROLE_RESTAURANT_OWNER) {
            throw new UnauthorizedAccessException("Only admin can access this resource");
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}