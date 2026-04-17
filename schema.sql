-- ================================================
-- JITPATEL WEB DEV — DATABASE SCHEMA
-- Run this SQL in MySQL Workbench or MySQL CLI
-- ================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS jitpatel_webdev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jitpatel_webdev;

-- 2. Inquiries table (auto-created by server.js too)
CREATE TABLE IF NOT EXISTS inquiries (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL,
  phone        VARCHAR(20)   DEFAULT NULL,
  service      VARCHAR(80)   DEFAULT NULL,
  message      TEXT          NOT NULL,
  ip_address   VARCHAR(50)   DEFAULT NULL,
  status       ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Sample verification query
SELECT 'Database and table created successfully!' AS message;
SELECT COUNT(*) AS total_inquiries FROM inquiries;
