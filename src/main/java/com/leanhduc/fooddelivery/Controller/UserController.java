package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import com.leanhduc.fooddelivery.RequestDto.EditUserRequest;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final IUserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> findByJwtToken(@RequestHeader("Authorization") String jwtToken) throws Exception {
        return new ResponseEntity<>(userService.findByJwtToken(jwtToken), HttpStatus.OK);
    }

    @PostMapping("/edit")
    public ResponseEntity<User> editUser(@RequestHeader("Authorization") String jwtToken,
                                         @RequestBody EditUserRequest editUserRequest) throws AlreadyExistsException {
        User user = userService.findByJwtToken(jwtToken);
        User updatedUser = userService.editUser(editUserRequest, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }


}
