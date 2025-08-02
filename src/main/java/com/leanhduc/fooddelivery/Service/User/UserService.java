package com.leanhduc.fooddelivery.Service.User;

import com.leanhduc.fooddelivery.Configuration.CustomerUserDetailService;
import com.leanhduc.fooddelivery.Configuration.JwtTokenUtils;
import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.Cart;
import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.AddressRepository;
import com.leanhduc.fooddelivery.Repository.CartRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import com.leanhduc.fooddelivery.RequestDto.EditUserRequest;
import com.leanhduc.fooddelivery.RequestDto.LoginRequest;
import com.leanhduc.fooddelivery.RequestDto.RegisterRequest;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;
import com.leanhduc.fooddelivery.ResponseDto.UserDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtils;
    private final CustomerUserDetailService customerUserDetailService;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public AuthResponse createUser(RegisterRequest user) throws Exception {
        Optional<User> isEmailExist = userRepository.findByEmail(user.getEmail());
        if (isEmailExist.isPresent()) {
            throw new Exception("Email is already exist");
        }

        User createUser = new User();
        createUser.setEmail(user.getEmail());
        createUser.setFullName(user.getFullName());
        createUser.setRole(user.getRole());
        createUser.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(createUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);
        savedUser.setCart(cart);

        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtTokenUtils.generateToken(auth);

        return new AuthResponse(token, "Register success", savedUser.getRole());
    }

    @Override
    public AuthResponse signIn(LoginRequest request) {
        String username = request.getEmail();
        String password = request.getPassword();
        Authentication authentication = authenticate(username, password);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        String token = jwtTokenUtils.generateToken(authentication);

        return new AuthResponse(token, "Login success", RoleUser.valueOf(roles));
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("User not found");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Override
    public User findByJwtToken(String jwtToken) {
        String email = jwtTokenUtils.getEmailFromToken(jwtToken);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User editUser(EditUserRequest user, User currentUser) throws AlreadyExistsException {
        if (user.getFullName() != null) {
            currentUser.setFullName(user.getFullName());
        }
        if (user.getEmail() != null && !user.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new AlreadyExistsException("Email already exists");
            }
            currentUser.setEmail(user.getEmail());
        }
        return userRepository.save(currentUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        System.out.println("🚀 [UserService] Deleting user: " + user.getEmail());
        if (user.getRole().equals(RoleUser.ROLE_ADMIN)) {
            throw new UnauthorizedAccessException("You cannot delete an admin user");
        }
        if (user.getCart() != null) {
            user.getCart().setCustomer(null);
            user.setCart(null);
        }
        userRepository.delete(user);
    }

    @Override
    public Page<UserDto> getUsers(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(this::conversionToDto);
    }

    @Override
    public UserDto conversionToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public List<OrderDto> conversionToListDto(List<User> users) {
        List<OrderDto> userDtos = new ArrayList<>();
        for (User user : users) {
            OrderDto userDto = modelMapper.map(user, OrderDto.class);
            userDtos.add(userDto);
        }
        return userDtos;
    }

    @Override
    public Address addAddressToUser(AddressRequest address, String jwtToken) {
        if (address == null) {
            throw new IllegalArgumentException("Address request cannot be null.");
        }

        User user = findByJwtToken(jwtToken);
        boolean isDuplicate = user.getAddresses().stream()
                .anyMatch(existing ->
                        existing.getStreetAddress().equals(address.getStreetAddress()) &&
                                existing.getCity().equals(address.getCity()) &&
                                existing.getPostalCode().equals(address.getPostalCode())
                );

        if (isDuplicate) {
            throw new AlreadyExistsException("This address already exists for the user");
        }

        Address newAddress = new Address();
        newAddress.setStreetAddress(address.getStreetAddress());
        newAddress.setCity(address.getCity());
        newAddress.setStateProvince(address.getStateProvince());
        newAddress.setPostalCode(address.getPostalCode());
        newAddress.setCountry(address.getCountry());
        newAddress.setPhoneNumber(address.getPhoneNumber());
        newAddress.setUser(user);

        Address savedAddress = addressRepository.save(newAddress);
        user.getAddresses().add(savedAddress);
        userRepository.save(user);

        return savedAddress;
    }

}
