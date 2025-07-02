package com.leanhduc.fooddelivery.Configuration;

import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
//        RoleUser role = user.getRole();
//        List<GrantedAuthority> authorities= new ArrayList<>();
//        authorities.add(new SimpleGrantedAuthority(role.toString()));
        return CustomerUserDetail.buildUserDetails(user);
    }
}
