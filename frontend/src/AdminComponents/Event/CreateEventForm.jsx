// src/components/CreateEventForm.jsx

import React from "react";
import {
    Box,
    Button,
    Grid,
    Modal,
    TextField,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    outline: "none",
    boxShadow: 24,
    p: 4,
};

const CreateEventForm = ({
    open,
    onClose,
    formValues,
    handleFormChange,
    handleDateChange,
    handleSubmit,
}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="image"
                                label="Image URL"
                                variant="outlined"
                                fullWidth
                                value={formValues.image}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="location"
                                label="Location"
                                variant="outlined"
                                fullWidth
                                value={formValues.location}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="name"
                                label="Event Name"
                                variant="outlined"
                                fullWidth
                                value={formValues.name}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
                                        }
                                    }}
                                    label="Start Date and Time"
                                    value={formValues.startedAt ? dayjs(formValues.startedAt) : null}
                                    onChange={(newValue) =>
                                        handleDateChange(newValue, "startedAt")
                                    }
                                    format="MMMM DD, YYYY hh:mm A"
                                    sx={{ width: "100%" }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
                                        }
                                    }}
                                    label="End Date and Time"
                                    value={formValues.endsAt ? dayjs(formValues.endsAt) : null}
                                    onChange={(newValue) =>
                                        handleDateChange(newValue, "endsAt")
                                    }
                                    sx={{ width: "100%" }}
                                    format="MMMM DD, YYYY hh:mm A"
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateEventForm;
