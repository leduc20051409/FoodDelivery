![FoodDelivery](https://socialify.git.ci/leduc20051409/FoodDelivery/image?custom_language=Java&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Overlapping+Hexagons&stargazers=1&theme=Dark)
# 🍔 FoodDelivery

A full-stack food delivery platform with a Spring Boot backend and a React.js frontend.

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/project/configuration?id=ngntu10_OptiMart)

## Introduction

Welcome to **FoodDelivery**. This project is a comprehensive, full-stack food delivery platform. The **backend** is built with **Spring Boot** to handle all business logic, order processing, and data management. The **frontend** is developed using **React.js**, providing a smooth and intuitive user interface for customers to browse menus, place orders, and track deliveries.


## System Requirements

To run this project, you will need to have the following tools installed for both the frontend and backend components:

### Backend

- **Java Development Kit (JDK) 17** or higher.
- **Maven** build tool.
- A **PostgreSQL** database system set up and configured.
- **Hibernate**, **JPA**.
- **Docker** with **Docker Compose**.
- **Redis** for data caching.

### Frontend

- **Node.js** and **npm** or **yarn**.


## Key Features

The platform includes a robust **permission-based access control system** to ensure a secure and tailored experience for both administrators and regular users.

### Admin Features

- **Manage Restaurants & Menus**: Admins can add, update, and remove restaurants, along with managing their menus, items, and pricing.
- **Track & Manage Orders**: View all orders in real-time and update their status (e.g., preparing, out for delivery, delivered).
- **Review & Manage User Feedback**: Admins can moderate user reviews and ratings to maintain content quality and authenticity.
- **User Management**: Edit user details, assign roles (e.g., admin, customer, delivery driver), and manage permissions.
- **View Business Statistics**: Access detailed analytics on sales, popular dishes, and delivery performance.

### User Features

- **Browse Restaurants & Menus**: Explore a wide range of restaurants and their menus, complete with dish details and pricing.
- **Place & Pay for Orders**: Easily add items to a cart and complete purchases with various payment options.
- **Live Order Tracking**: Track the real-time status of your order from placement to delivery.
- **Rate & Review Dishes**: Provide feedback and ratings on food and service to help other users make informed choices.
- **Manage Order History**: View past orders, reorder favorite meals, and update personal information.


## Getting Started

Follow these steps to set up and run both the frontend and backend.

### Method 1: Run Locally (Optional for frontend and backend)

1. **Clone the repository:**
```bash
   git clone [https://github.com/leduc20051409/FoodDelivery.git](https://github.com/leduc20051409/FoodDelivery.git)
```

#### 1. Navigate to the project directory:

```bash
  cd FoodDelivery
```

#### 2. Build the project:

```bash
  # Using Maven
  mvn clean install
```

#### 3. Configure the environments:

- Update `application.properties` or `application.yml` with your environments details.

#### 4. Run the application:



```bash
  # Using Maven
  mvn spring-boot:run
```

### Method 2: Run the Application Using Docker Compose
```bash
   git clone https://github.com/leduc20051409/FoodDelivery.git
```

#### 1. Navigate to the project directory:

```bash
  cd FoodDelivery
```

#### 2. Build and start the containers using Docker Compose:

```bash
  docker-compose -f docker-compose.yml up --build
```

[//]: # ()
[//]: # (## Demo)

[//]: # (![1715441188385]&#40;https://github.com/user-attachments/assets/ea07616a-5404-4ccd-bab0-b472b67a061a&#41;)

## API Documentation

Document the API endpoints and their functionalities. You can use tools like `Swagger` for
automated `API documentation`.

## Contributing

If you would like to contribute to the development of this project, please follow our contribution guidelines.

![Alt](https://repobeats.axiom.co/api/embed/fd7fd76dafe452bdb7c2bc12856bd45c277ee732.svg "Repobeats analytics image")
## License

This project is licensed under the [`Apache License`](LICENSE).

```text
Apache License
Copyright (c) 2025 Le Anh Duc
```