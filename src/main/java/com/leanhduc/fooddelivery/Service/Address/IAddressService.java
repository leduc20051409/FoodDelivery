package com.leanhduc.fooddelivery.Service.Address;

import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IAddressService {
    Page<Address> getAllAddresses(int page, int size);
    void deleteAddressByUser(Long id, String jwt);
    Address changeAddressForUser(AddressRequest addressRequest, Long addressId, String jwt);

    List<Address> getAllAddressesByUserId(Long userId);
}
