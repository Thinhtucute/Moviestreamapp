-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: moviestream-db-voduythinh2004-6080.l.aivencloud.com    Database: movie_streaming_app
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b592d899-012d-11f1-84cb-3297e0268485:1-339,
d03f2f32-bf24-11f0-82a2-56ae92c5756d:1-271';

--
-- Table structure for table `Actors`
--

DROP TABLE IF EXISTS `Actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actors` (
  `ActorID` int NOT NULL AUTO_INCREMENT,
  `ActorName` varchar(255) NOT NULL,
  `Bio` text,
  `Birthdate` date DEFAULT NULL,
  `ProfileImageURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ActorID`)
) ENGINE=InnoDB AUTO_INCREMENT=5477220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Directors`
--

DROP TABLE IF EXISTS `Directors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Directors` (
  `DirectorID` int NOT NULL AUTO_INCREMENT,
  `DirectorName` varchar(255) NOT NULL,
  `Bio` text,
  `Birthdate` date DEFAULT NULL,
  PRIMARY KEY (`DirectorID`)
) ENGINE=InnoDB AUTO_INCREMENT=5456825 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EpisodeStreams`
--

DROP TABLE IF EXISTS `EpisodeStreams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EpisodeStreams` (
  `StreamID` int NOT NULL AUTO_INCREMENT,
  `EpisodeID` int DEFAULT NULL,
  `StreamURL` varchar(200) DEFAULT NULL,
  `Quality` enum('SD','HD','4K') DEFAULT 'HD',
  `FileSize` bigint DEFAULT NULL,
  PRIMARY KEY (`StreamID`),
  KEY `EpisodeID` (`EpisodeID`),
  CONSTRAINT `EpisodeStreams_ibfk_1` FOREIGN KEY (`EpisodeID`) REFERENCES `Episodes` (`EpisodeID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=771 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Episodes`
--

DROP TABLE IF EXISTS `Episodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Episodes` (
  `EpisodeID` int NOT NULL AUTO_INCREMENT,
  `MediaID` int DEFAULT NULL,
  `EpisodeNumber` int NOT NULL,
  `season` varchar(255) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Duration` int DEFAULT NULL,
  `ReleaseDate` date DEFAULT NULL,
  `StreamURL` varchar(255) DEFAULT NULL,
  `MediaType` enum('tv','movie') NOT NULL DEFAULT 'tv',
  PRIMARY KEY (`EpisodeID`),
  KEY `MediaID` (`MediaID`),
  CONSTRAINT `chk_episodes_mediatype` CHECK ((`MediaType` = _utf8mb4'tv'))
) ENGINE=InnoDB AUTO_INCREMENT=62679 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Favorites`
--

DROP TABLE IF EXISTS `Favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Favorites` (
  `UserID` int NOT NULL,
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') NOT NULL,
  `AddedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`,`MediaID`,`MediaType`),
  KEY `MediaID` (`MediaID`),
  KEY `fk_favorites_media` (`MediaID`,`MediaType`),
  CONSTRAINT `Favorites_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorites_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Genres` (
  `GenreID` int NOT NULL AUTO_INCREMENT,
  `GenreName` varchar(255) NOT NULL,
  PRIMARY KEY (`GenreID`),
  UNIQUE KEY `GenreName` (`GenreName`)
) ENGINE=InnoDB AUTO_INCREMENT=10771 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `InvalidatedToken`
--

DROP TABLE IF EXISTS `InvalidatedToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvalidatedToken` (
  `id` varchar(255) NOT NULL,
  `expiryTime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Media`
--

DROP TABLE IF EXISTS `Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Media` (
  `MediaID` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `ReleaseYear` int DEFAULT NULL,
  `Duration` int DEFAULT NULL,
  `Language` varchar(255) DEFAULT NULL,
  `AgeRating` varchar(255) DEFAULT NULL,
  `PosterURL` varchar(255) DEFAULT NULL,
  `BackdropURL` varchar(255) DEFAULT NULL,
  `TrailerURL` varchar(255) DEFAULT NULL,
  `AddedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ViewCount` int DEFAULT '0',
  `AccessLevel` varchar(255) DEFAULT NULL,
  `MediaType` enum('movie','tv') NOT NULL,
  `StreamURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MediaID`,`MediaType`),
  KEY `idx_media_title` (`Title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MediaActors`
--

DROP TABLE IF EXISTS `MediaActors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MediaActors` (
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') NOT NULL,
  `ActorID` int NOT NULL,
  `RoleName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MediaID`,`MediaType`,`ActorID`),
  KEY `ActorID` (`ActorID`),
  CONSTRAINT `fk_mediaactors_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `MediaActors_ibfk_2` FOREIGN KEY (`ActorID`) REFERENCES `Actors` (`ActorID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MediaDirectors`
--

DROP TABLE IF EXISTS `MediaDirectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MediaDirectors` (
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') NOT NULL,
  `DirectorID` int NOT NULL,
  PRIMARY KEY (`MediaID`,`MediaType`,`DirectorID`),
  KEY `DirectorID` (`DirectorID`),
  CONSTRAINT `fk_mediadirectors_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `MediaDirectors_ibfk_2` FOREIGN KEY (`DirectorID`) REFERENCES `Directors` (`DirectorID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MediaGenres`
--

DROP TABLE IF EXISTS `MediaGenres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MediaGenres` (
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') NOT NULL,
  `GenreID` int NOT NULL,
  PRIMARY KEY (`MediaID`,`MediaType`,`GenreID`),
  KEY `GenreID` (`GenreID`),
  CONSTRAINT `fk_mediagenres_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `MediaGenres_ibfk_2` FOREIGN KEY (`GenreID`) REFERENCES `Genres` (`GenreID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MediaViews`
--

DROP TABLE IF EXISTS `MediaViews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MediaViews` (
  `ViewID` int NOT NULL AUTO_INCREMENT,
  `MediaID` int DEFAULT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `EpisodeID` int DEFAULT NULL,
  `ViewDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ViewID`),
  KEY `MediaID` (`MediaID`),
  KEY `EpisodeID` (`EpisodeID`),
  KEY `fk_mediaviews_media` (`MediaID`,`MediaType`),
  CONSTRAINT `fk_mediaviews_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `MediaViews_ibfk_2` FOREIGN KEY (`EpisodeID`) REFERENCES `Episodes` (`EpisodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MovieLensLinks`
--

DROP TABLE IF EXISTS `MovieLensLinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MovieLensLinks` (
  `movieId` int NOT NULL COMMENT 'MovieLens ID',
  `imdbId` int DEFAULT NULL COMMENT 'IMDB ID without tt prefix',
  `tmdbId` int DEFAULT NULL COMMENT 'TMDB ID',
  PRIMARY KEY (`movieId`),
  KEY `idx_tmdbId` (`tmdbId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MovieStreams`
--

DROP TABLE IF EXISTS `MovieStreams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MovieStreams` (
  `StreamID` int NOT NULL AUTO_INCREMENT,
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `StreamURL` varchar(200) DEFAULT NULL,
  `Quality` enum('SD','HD','4K') DEFAULT 'HD',
  `FileSize` bigint DEFAULT NULL,
  PRIMARY KEY (`StreamID`),
  KEY `MediaID` (`MediaID`),
  KEY `fk_moviestreams_media` (`MediaID`,`MediaType`),
  CONSTRAINT `fk_moviestreams_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=791 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Message` text NOT NULL,
  `SentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsRead` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`NotificationID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payments` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `TransactionID` varchar(255) DEFAULT NULL,
  `PromoID` int DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `UserID` (`UserID`),
  KEY `PromoID` (`PromoID`),
  CONSTRAINT `Payments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `Payments_ibfk_2` FOREIGN KEY (`PromoID`) REFERENCES `Promotions` (`PromoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Permissions`
--

DROP TABLE IF EXISTS `Permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permissions` (
  `PermissionID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `PermissionName` varchar(50) NOT NULL,
  PRIMARY KEY (`PermissionID`),
  UNIQUE KEY `UK4sfreu8w0w177morr9kdq1d7c` (`PermissionName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Promotions`
--

DROP TABLE IF EXISTS `Promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Promotions` (
  `PromoID` int NOT NULL AUTO_INCREMENT,
  `PromoCode` varchar(50) NOT NULL,
  `Discount` decimal(5,2) DEFAULT NULL,
  `ExpiryDate` date DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`PromoID`),
  UNIQUE KEY `PromoCode` (`PromoCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ratings` (
  `RatingID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `MediaID` int DEFAULT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `EpisodeID` int DEFAULT NULL,
  `RatingValue` tinyint DEFAULT NULL,
  `Comment` text,
  `RatingDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RatingID`),
  KEY `UserID` (`UserID`),
  KEY `EpisodeID` (`EpisodeID`),
  KEY `idx_ratings_media` (`MediaID`),
  KEY `fk_ratings_media` (`MediaID`,`MediaType`),
  CONSTRAINT `fk_ratings_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `Ratings_ibfk_3` FOREIGN KEY (`EpisodeID`) REFERENCES `Episodes` (`EpisodeID`) ON DELETE CASCADE,
  CONSTRAINT `Ratings_chk_1` CHECK ((`RatingValue` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RolePermission`
--

DROP TABLE IF EXISTS `RolePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolePermission` (
  `RoleID` int NOT NULL,
  `PermissionID` int NOT NULL,
  PRIMARY KEY (`RoleID`,`PermissionID`),
  KEY `FKm3t7jrco1erf6hjcov6hs2bgj` (`PermissionID`),
  CONSTRAINT `FKian0874o2a8rv6g71l804x7p1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`),
  CONSTRAINT `FKm3t7jrco1erf6hjcov6hs2bgj` FOREIGN KEY (`PermissionID`) REFERENCES `Permissions` (`PermissionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`RoleID`),
  UNIQUE KEY `UKlxrdl2vtur3k7m7mssbm5bd43` (`RoleName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Subtitles`
--

DROP TABLE IF EXISTS `Subtitles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subtitles` (
  `SubtitleID` int NOT NULL AUTO_INCREMENT,
  `MediaID` int DEFAULT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `EpisodeID` int DEFAULT NULL,
  `Language` varchar(50) NOT NULL,
  `SubtitleURL` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`SubtitleID`),
  KEY `MediaID` (`MediaID`),
  KEY `EpisodeID` (`EpisodeID`),
  KEY `fk_subtitles_media` (`MediaID`,`MediaType`),
  CONSTRAINT `fk_subtitles_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `Subtitles_ibfk_2` FOREIGN KEY (`EpisodeID`) REFERENCES `Episodes` (`EpisodeID`) ON DELETE CASCADE,
  CONSTRAINT `chk_subtitle_type` CHECK (((`MediaID` is not null) or (`EpisodeID` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=3915 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserRole`
--

DROP TABLE IF EXISTS `UserRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRole` (
  `UserID` int NOT NULL,
  `RoleID` int NOT NULL,
  PRIMARY KEY (`UserID`,`RoleID`),
  KEY `FK57tp4pk93wa764jlyxramqjm8` (`RoleID`),
  CONSTRAINT `FK57tp4pk93wa764jlyxramqjm8` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`),
  CONSTRAINT `FKjifhxi93ok70e26v4c1v3gbw3` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `JoinDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `SubscriptionPlan` enum('Free','Premium','VIP') DEFAULT 'Free',
  `SubscriptionExpiry` date DEFAULT NULL,
  `AvatarURL` varchar(255) DEFAULT NULL,
  `LastLogin` datetime DEFAULT NULL,
  `AccountStatus` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`),
  KEY `idx_username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ViewingHistory`
--

DROP TABLE IF EXISTS `ViewingHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ViewingHistory` (
  `UserID` int NOT NULL,
  `MediaID` int NOT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `AddedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_viewed` datetime(6) DEFAULT NULL,
  `media_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`UserID`,`MediaID`),
  KEY `idx_user_lastViewed` (`UserID`,`AddedDate`),
  KEY `FKj2qfisprk2dh39t4rn5gnyeyt` (`user_id`),
  CONSTRAINT `FKj2qfisprk2dh39t4rn5gnyeyt` FOREIGN KEY (`user_id`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `WatchHistory`
--

DROP TABLE IF EXISTS `WatchHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WatchHistory` (
  `HistoryID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `MediaID` int DEFAULT NULL,
  `MediaType` enum('movie','tv') DEFAULT NULL,
  `EpisodeID` int DEFAULT NULL,
  `WatchDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Progress` int DEFAULT NULL,
  PRIMARY KEY (`HistoryID`),
  KEY `MediaID` (`MediaID`),
  KEY `EpisodeID` (`EpisodeID`),
  KEY `idx_watchhistory_user` (`UserID`),
  KEY `fk_watchhistory_media` (`MediaID`,`MediaType`),
  CONSTRAINT `fk_watchhistory_media` FOREIGN KEY (`MediaID`, `MediaType`) REFERENCES `Media` (`MediaID`, `MediaType`) ON DELETE CASCADE,
  CONSTRAINT `WatchHistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `WatchHistory_ibfk_3` FOREIGN KEY (`EpisodeID`) REFERENCES `Episodes` (`EpisodeID`) ON DELETE CASCADE,
  CONSTRAINT `chk_progress` CHECK ((`Progress` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 15:59:49
