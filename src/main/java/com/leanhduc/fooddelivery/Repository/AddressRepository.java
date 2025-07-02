package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findById(Long id);

    List<Address>  findAllByUserId(Long userId);
}
