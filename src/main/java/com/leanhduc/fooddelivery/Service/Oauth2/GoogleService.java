package com.leanhduc.fooddelivery.Service.Oauth2;

import com.leanhduc.fooddelivery.Configuration.JwtTokenUtils;
import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;



@Service
@RequiredArgsConstructor
public class GoogleService {
    private final UserRepository userRepository;
    private final JwtTokenUtils jwtTokenUtil;


}
