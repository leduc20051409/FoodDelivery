package com.leanhduc.fooddelivery.Service.Address;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.AddressRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService{
    private final AddressRepository addressRepository;
    private final IUserService userService;
    private final UserRepository userRepository;

    @Override
    public Page<Address> getAllAddresses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Address> addresses = addressRepository.findAll(pageable);
        return addresses;
    }

    @Override
    public void deleteAddressByUser(Long id, String jwt) {
        User user = userService.findByJwtToken(jwt);
        Address addressToDelete = user.getAddresses().stream()
                .filter(address -> address.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if(!addressToDelete.getOrders().isEmpty()) {
            throw new ResourceNotFoundException("Cannot delete address that is associated with orders");
        }
        user.getAddresses().remove(addressToDelete);
        addressToDelete.setUser(null);
        userRepository.save(user);
        addressRepository.delete(addressToDelete);
    }

    @Override
    public Address changeAddressForUser(AddressRequest addressRequest, Long addressId, String jwt) {
        User user = userService.findByJwtToken(jwt);
        Address address = user.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        address.setStreetAddress(addressRequest.getStreetAddress());
        address.setCity(addressRequest.getCity());
        address.setStateProvince(addressRequest.getStateProvince());
        address.setPostalCode(addressRequest.getPostalCode());
        address.setCountry(addressRequest.getCountry());
        address.setPhoneNumber(addressRequest.getPhoneNumber());

        Address updatedAddress = addressRepository.save(address);
        return updatedAddress;
    }

    @Override
    public List<Address> getAllAddressesByUserId(Long userId) {
        return addressRepository.findAllByUserId(userId);
    }
}
