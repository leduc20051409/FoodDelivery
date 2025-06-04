import React, { useState } from "react";
import { Button } from "@mui/material";
import CreateEventForm from "./CreateEventForm";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createEventAction } from "../../State/Customer/Restaurant/Action";

const initialValues = {
  image: "",
  location: "",
  name: "",
  startedAt: null,
  endsAt: null,
};

const Events = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { restaurant, restaurantOrder, ingredient, menu } = useSelector(store => store);

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
    // dispatch(createEventAction({
    //   data: formValues,
    //   jwt: jwt,
    //   restaurantId: restaurant.usersRestaurant.id
    // }));
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
