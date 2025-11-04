FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/FoodDelivery-0.0.1-SNAPSHOT.jar /app/FoodDelivery.jar
ENTRYPOINT ["java", "-jar", "FoodDelivery.jar"]