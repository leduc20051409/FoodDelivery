package com.leanhduc.fooddelivery.Service.User;

import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import com.leanhduc.fooddelivery.RequestDto.EditUserRequest;
import com.leanhduc.fooddelivery.RequestDto.LoginRequest;
import com.leanhduc.fooddelivery.RequestDto.RegisterRequest;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;
import com.leanhduc.fooddelivery.ResponseDto.UserDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IUserService {
    AuthResponse createUser(RegisterRequest user) throws Exception;

    AuthResponse signIn(LoginRequest request);

    User findByJwtToken(String jwtToken);

    User findByEmail(String email);

    User editUser(EditUserRequest user, User currentUser) throws AlreadyExistsException;

    void deleteUser(Long id);

    UserDto conversionToDto(User user);

    Page<UserDto> getUsers(int pageNumber, int pageSize);

    List<OrderDto> conversionToListDto(List<User> users);

    Address addAddressToUser(AddressRequest address, String jwtToken);
}

