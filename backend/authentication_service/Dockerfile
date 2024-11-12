# Usa una imagen de Maven con Java 21 ya instalada
FROM maven:3.9.4-eclipse-temurin-21 AS build

# Copia el código fuente al contenedor
COPY . /app
WORKDIR /app

# Ejecuta la compilación del proyecto
RUN mvn clean package -DskipTests

# Usa una imagen más ligera de Java para el runtime
FROM openjdk:21-jdk-slim

# Copia el archivo .jar generado desde el contenedor de construcción
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "/app.jar"]
