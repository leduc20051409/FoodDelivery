import React, { useState } from "react";
import { Button } from "@mui/material";
import CreateEventForm from "./CreateEventForm";
import dayjs from "dayjs";

const initialValues = {
  image: "",
  location: "",
  name: "",
  startedAt: null,
  endsAt: null,
};

const Events = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, dateType) => {
    const formattedDate = dayjs(date).format("MMMM DD, YYYY hh:mm A");
    setFormValues({ ...formValues, [dateType]: formattedDate });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted Form Values:", formValues);
    // Optionally close and reset form:
    // setFormValues(initialValues);
    // handleCloseModal();
  };

  return (
    <div>
      <div className="p-5">
        <Button
          sx={{ padding: "1rem 2rem" }}
          onClick={handleOpenModal}
          variant="contained"
          color="primary"
        >
          Create New Event
        </Button>
      </div>

      <CreateEventForm
        open={openModal}
        onClose={handleCloseModal}
        formValues={formValues}
        handleFormChange={handleFormChange}
        handleDateChange={handleDateChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Events;
