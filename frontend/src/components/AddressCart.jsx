import React, { useEffect, useState } from 'react';
import { Button, Card, IconButton, TextField } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const AddressCard = ({
    item,
    showButton,
    handleSelectAddress,
    navigateToCheckOut,
    handleEditAddress,
    handleDeleteAddress,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState({ ...item });

    const handleChange = (e) => {
        setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        handleEditAddress(editedAddress);
        setIsEditing(false);
    };

    return (
        <Card className="w-72 bg-zinc-900 p-5 rounded-2xl shadow-lg text-white space-y-4">
            <div className="flex items-start gap-3">
                <HomeIcon fontSize="medium" className="text-white mt-1" />
                <div className="flex-1 space-y-1">
                    {isEditing ? (
                        <>
                            <TextField
                                label="City"
                                variant="standard"
                                fullWidth
                                name="city"
                                value={editedAddress.city}
                                onChange={handleChange}
                                InputProps={{ className: "text-white" }}
                            />
                            <TextField
                                label="Street"
                                variant="standard"
                                fullWidth
                                name="streetAddress"
                                value={editedAddress.streetAddress}
                                onChange={handleChange}
                                InputProps={{ className: "text-white" }}
                            />
                            <TextField
                                label="State"
                                variant="standard"
                                fullWidth
                                name="stateProvince"
                                value={editedAddress.stateProvince}
                                onChange={handleChange}
                                InputProps={{ className: "text-white" }}
                            />
                            <TextField
                                label="Postal Code"
                                variant="standard"
                                fullWidth
                                name="postalCode"
                                value={editedAddress.postalCode}
                                onChange={handleChange}
                                InputProps={{ className: "text-white" }}
                            />
                            <TextField
                                label="Country"
                                variant="standard"
                                fullWidth
                                name="country"
                                value={editedAddress.country}
                                onChange={handleChange}
                                InputProps={{ className: "text-white" }}
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="font-semibold text-xl">{item.city}</h1>
                            <p className="text-neutral-400 text-sm">
                                {item.streetAddress}, {item.stateProvince}, <br />{item.country}, {item.postalCode}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                {showButton && !isEditing && (
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            handleSelectAddress(item);
                            navigateToCheckOut();
                        }}
                        className="rounded-md border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition"
                    >
                        Select
                    </Button>
                )}
                {isEditing ? (
                    <>
                        <IconButton color="success" onClick={handleSave} aria-label="save">
                            <SaveIcon />
                        </IconButton>
                        <IconButton color="warning" onClick={() => setIsEditing(false)} aria-label="cancel">
                            <CancelIcon />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton color="primary" onClick={() => setIsEditing(true)} aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteAddress(item)} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </div>
        </Card>
    );
};

export default AddressCard;
