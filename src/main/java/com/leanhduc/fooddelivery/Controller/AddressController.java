package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.RoleUser;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.AddressRequest;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Service.Address.IAddressService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AddressController {
    private final IAddressService addressService;
    private final IUserService userService;

    @GetMapping("/admin/addresses")
    public ResponseEntity<Page<Address>> getAllAddresses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam (defaultValue = "10") int size,
            @RequestHeader ("Authorization") String jwt) {
        User user = userService.findByJwtToken(jwt);
        if (user.getRole() != RoleUser.ROLE_RESTAURANT_OWNER) {
            throw new UnauthorizedAccessException("Only restaurant owner can access this resource");
        }
        return new ResponseEntity<>(addressService.getAllAddresses(page, size), HttpStatus.OK);
    }

    @PostMapping("/users/addresses/add-address")
    public ResponseEntity<Address> addAddressToUser(@RequestHeader("Authorization") String jwtToken,
                                                    @Valid @RequestBody AddressRequest address) {
        Address savedAddress = userService.addAddressToUser(address, jwtToken);
        return new ResponseEntity<>(savedAddress, HttpStatus.CREATED);
    }

    @DeleteMapping("/users/addresses/{id}/delete")
    public ResponseEntity<MessageResponse> deleteAddress(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) {
        addressService.deleteAddressByUser(id, jwt);
        return new ResponseEntity<>(new MessageResponse("Address deleted successfully"), HttpStatus.OK);
    }

    @PutMapping("/users/addresses/{addressId}/update")
    public ResponseEntity<Address> changeAddress(
            @RequestBody AddressRequest addressRequest,
            @PathVariable Long addressId,
            @RequestHeader("Authorization") String jwt) {
        Address updatedAddress = addressService.changeAddressForUser(addressRequest, addressId, jwt);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    @GetMapping("/users/addresses")
    public ResponseEntity<List<Address>> getAllAddressesByUserId(
            @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwtToken(jwt);
        List<Address> addresses = addressService.getAllAddressesByUserId(user.getId());
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
}
