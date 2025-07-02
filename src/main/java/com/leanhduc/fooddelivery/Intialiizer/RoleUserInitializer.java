package com.leanhduc.fooddelivery.Intialiizer;

import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

@RequiredArgsConstructor
public class RoleUserInitializer {
    private final UserRepository userRepository;

//    private CommandLineRunner init(){
//        return args -> {
//            User user = new User();
//            user.setFullName("admin");
//            user.setPassword("admin");
//            user.setRole(RoleUser.ROLE_ADMIN);
//            userRepository.save(user);
//
//            User user1 = new User();
//            user1.setFullName("user");
//            user1.setPassword("user");
//            user1.setRole(RoleUser.ROLE_ADMIN);
//            userRepository.save(user1);
//        };
//    }
}
