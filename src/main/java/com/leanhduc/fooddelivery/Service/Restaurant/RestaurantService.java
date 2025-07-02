package com.leanhduc.fooddelivery.Service.Restaurant;

import com.leanhduc.fooddelivery.ResponseDto.RestaurantDto;
import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.ContactInfor;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.AddressRepository;
import com.leanhduc.fooddelivery.Repository.RestaurantRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.RequestDto.RestaurantRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService implements IRestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public Restaurant createRestaurant(RestaurantRequest restaurantRequest, User user) throws AlreadyExistsException {
        if (user.getRestaurant() != null) {
            throw new AlreadyExistsException("User already has a restaurant");
        }

        Address address = addressRepository.save(restaurantRequest.getAddress());
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantRequest.getName());
        restaurant.setDescription(restaurantRequest.getDescription());
        restaurant.setCuisineType(restaurantRequest.getCuisineType());
        restaurant.setAddress(address);
        restaurant.setContactInfor(restaurantRequest.getContactInfor());
        restaurant.setOpeningHours(restaurantRequest.getOpeningHours());
        restaurant.setImages(restaurantRequest.getImages());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setUser(user);
        user.setRestaurant(restaurant);
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Override
    public Restaurant updateRestaurant(Long id, RestaurantRequest restaurantRequest) {
        Restaurant restaurant = getRestaurantById(id);
        RestaurantDto restaurantDto = new RestaurantDto();
        if (restaurantRequest.getCuisineType() != null) {
            restaurant.setCuisineType(restaurantRequest.getCuisineType());
        }
        if (restaurantRequest.getDescription() != null) {
            restaurant.setDescription(restaurantRequest.getDescription());
            restaurantDto.setDescription(restaurantRequest.getDescription());
        }
        if (restaurantRequest.getName() != null) {
            restaurant.setName(restaurantRequest.getName());
            restaurantDto.setTitle(restaurantRequest.getName());
        }
        if (restaurantRequest.getContactInfor() != null) {
            ContactInfor existingContactInfor = restaurant.getContactInfor();
            if (existingContactInfor == null) {
                existingContactInfor = new ContactInfor();
            }

            updateContactInfor(existingContactInfor, restaurantRequest.getContactInfor());
            restaurant.setContactInfor(existingContactInfor);
        }
        if (restaurantRequest.getImages() != null) {
            List<String> currentImages = getStrings(restaurantRequest, restaurant);
            restaurant.setImages(currentImages);
            restaurantDto.setImages(currentImages);

            List<User> usersWithFavorite = userRepository.findAll().stream()
                    .filter(user -> user.getFavorites() != null &&
                            user.getFavorites().stream()
                                    .anyMatch(fav -> fav.getId().equals(id)))
                    .toList();

            for (User user : usersWithFavorite) {
                user.getFavorites().stream()
                        .filter(fav -> fav.getId().equals(id))
                        .forEach(fav -> fav.setImages(currentImages));
                userRepository.save(user);
            }
        }
        return restaurantRepository.save(restaurant);
    }

    private void updateContactInfor(ContactInfor existing, ContactInfor request) {
        if (request == null) return;

        if (request.getEmail() != null) {
            existing.setEmail(request.getEmail());
        }
        if (request.getMobile() != null) {
            existing.setMobile(request.getMobile());
        }
        if (request.getInstagram() != null) {
            existing.setInstagram(request.getInstagram());
        }
        if (request.getTwitter() != null) {
            existing.setTwitter(request.getTwitter());
        }
    }

    private List<String> getStrings(RestaurantRequest restaurantRequest, Restaurant restaurant) {
        List<String> currentImages = restaurant.getImages();
        for (int i = 0; i < restaurantRequest.getImages().size(); i++) {
            String newImage = restaurantRequest.getImages().get(i);
            if (newImage != null && !newImage.isEmpty()) {
                if (i < currentImages.size()) {
                    currentImages.set(i, newImage);
                } else {
                    currentImages.add(newImage);
                }
            }
        }
        return currentImages;
    }

    @Override
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurantRepository.delete(restaurant);
    }

    @Override
    public List<Restaurant> searchRestaurant(String keyword) {
        return restaurantRepository.findBySearchQuery(keyword);
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) {
        return restaurantRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        RestaurantDto restaurantDto = new RestaurantDto();
        restaurantDto.setDescription(restaurant.getDescription());
        restaurantDto.setTitle(restaurant.getName());
        restaurantDto.setImages(restaurant.getImages());
        restaurantDto.setId(restaurantId);

        boolean isFavourite = false;
        List<RestaurantDto> favorites = user.getFavorites();
        for (RestaurantDto favorite : favorites) {
            if (favorite.getId().equals(restaurantId)) {
                isFavourite = true;
                break;
            }
        }
        if (isFavourite) {
            favorites.removeIf(favorite -> favorite.getId().equals(restaurantId));
        } else {
            favorites.add(restaurantDto);
        }
        userRepository.save(user);
        return restaurantDto;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setOpen(!restaurant.isOpen());
        return restaurantRepository.save(restaurant);
    }
}
