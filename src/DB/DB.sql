DROP DATABASE IF EXISTS auth;
CREATE DATABASE auth;
USE auth;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL, -- User , Admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS refreshTokens;
CREATE TABLE refreshTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refreshToken VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
);

DROP TABLE IF EXISTS invalidTokens;
CREATE TABLE invalidTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accessToken VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    expirationTime BIGINT NOT NULL
);