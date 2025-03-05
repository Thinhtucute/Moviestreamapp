CREATE DATABASE moviestreamapp;
USE moviestreamapp;

-- Tạo bảng độc lập trước
CREATE TABLE Media (
    MediaID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    ReleaseYear YEAR,
    Duration INT,
    Language VARCHAR(50),
    AgeRating VARCHAR(10),
    PosterURL VARCHAR(200),
    TrailerURL VARCHAR(200),
    AddedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ViewCount INT DEFAULT 0,
    AccessLevel ENUM('Free', 'Premium', 'VIP') DEFAULT 'Free',
    MediaType ENUM('Movie', 'Series') NOT NULL,
    INDEX idx_media_title (Title)
);

CREATE TABLE Genres (
    GenreID INT PRIMARY KEY AUTO_INCREMENT,
    GenreName VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Actors (
    ActorID INT PRIMARY KEY AUTO_INCREMENT,
    ActorName VARCHAR(100) NOT NULL,
    Bio TEXT,
    Birthdate DATE
);

CREATE TABLE Directors (
    DirectorID INT PRIMARY KEY AUTO_INCREMENT,
    DirectorName VARCHAR(100) NOT NULL,
    Bio TEXT
);

CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    JoinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    SubscriptionPlan ENUM('Free', 'Premium', 'VIP') DEFAULT 'Free',
    SubscriptionExpiry DATE,
    AvatarURL VARCHAR(200),
    LastLogin DATETIME,
    AccountStatus ENUM('Active', 'Banned', 'Suspended') DEFAULT 'Active',
    INDEX idx_username (Username)
);

CREATE TABLE Promotions (
    PromoID INT PRIMARY KEY AUTO_INCREMENT,
    PromoCode VARCHAR(50) UNIQUE NOT NULL,
    Discount DECIMAL(5,2),
    ExpiryDate DATE,
    IsActive BOOLEAN DEFAULT TRUE
);

-- Bảng quan hệ nhiều-nhiều
CREATE TABLE MediaGenres (
    MediaID INT,
    GenreID INT,
    PRIMARY KEY (MediaID, GenreID),
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES Genres(GenreID) ON DELETE CASCADE
);

CREATE TABLE MediaActors (
    MediaID INT,
    ActorID INT,
    RoleName VARCHAR(100),
    PRIMARY KEY (MediaID, ActorID),
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (ActorID) REFERENCES Actors(ActorID) ON DELETE CASCADE
);

CREATE TABLE MediaDirectors (
    MediaID INT,
    DirectorID INT,
    PRIMARY KEY (MediaID, DirectorID),
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (DirectorID) REFERENCES Directors(DirectorID) ON DELETE CASCADE
);

-- Bảng phụ thuộc vào Media
CREATE TABLE Seasons (
    SeasonID INT PRIMARY KEY AUTO_INCREMENT,
    MediaID INT,
    SeasonNumber INT NOT NULL,
    Description TEXT,
    ReleaseDate DATE,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE
);

-- Bảng phụ thuộc vào Seasons
CREATE TABLE Episodes (
    EpisodeID INT PRIMARY KEY AUTO_INCREMENT,
    SeasonID INT,
    EpisodeNumber INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Duration INT,
    ReleaseDate DATE,
    FOREIGN KEY (SeasonID) REFERENCES Seasons(SeasonID) ON DELETE CASCADE
);

-- Bảng phụ thuộc Media/Episodes
CREATE TABLE MediaStreams (
    StreamID INT PRIMARY KEY AUTO_INCREMENT,
    MediaID INT,
    EpisodeID INT,
    StreamURL VARCHAR(200) NOT NULL,
    Quality ENUM('SD', 'HD', '4K') DEFAULT 'HD',
    FileSize BIGINT,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (EpisodeID) REFERENCES Episodes(EpisodeID) ON DELETE CASCADE,
    CONSTRAINT chk_stream_type CHECK (MediaID IS NOT NULL OR EpisodeID IS NOT NULL)
);

CREATE TABLE Subtitles (
    SubtitleID INT PRIMARY KEY AUTO_INCREMENT,
    MediaID INT,
    EpisodeID INT,
    Language VARCHAR(50) NOT NULL,
    SubtitleURL VARCHAR(200) NOT NULL,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (EpisodeID) REFERENCES Episodes(EpisodeID) ON DELETE CASCADE,
    CONSTRAINT chk_subtitle_type CHECK (MediaID IS NOT NULL OR EpisodeID IS NOT NULL)
);

-- Bảng thống kê/phụ thuộc người dùng
CREATE TABLE MediaViews (
    ViewID INT PRIMARY KEY AUTO_INCREMENT,
    MediaID INT,
    EpisodeID INT,
    ViewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (EpisodeID) REFERENCES Episodes(EpisodeID) ON DELETE CASCADE
);

CREATE TABLE WatchHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    MediaID INT,
    EpisodeID INT,
    WatchDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Progress INT,
    CONSTRAINT chk_progress CHECK (Progress BETWEEN 0 AND 100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (EpisodeID) REFERENCES Episodes(EpisodeID) ON DELETE CASCADE,
    INDEX idx_watchhistory_user (UserID)
);

CREATE TABLE Ratings (
    RatingID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    MediaID INT,
    EpisodeID INT,
    RatingValue TINYINT CHECK (RatingValue BETWEEN 1 AND 5),
    Comment TEXT,
    RatingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE,
    FOREIGN KEY (EpisodeID) REFERENCES Episodes(EpisodeID) ON DELETE CASCADE,
    INDEX idx_ratings_media (MediaID)
);

CREATE TABLE Favorites (
    UserID INT,
    MediaID INT,
    AddedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, MediaID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID) ON DELETE CASCADE
);

-- Bảng phụ thuộc Promotions và Users
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Amount DECIMAL(10,2),
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod VARCHAR(50),
    TransactionID VARCHAR(255),
    PromoID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PromoID) REFERENCES Promotions(PromoID)
);

-- Bảng phụ thuộc Users (cuối cùng)
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Message TEXT NOT NULL,
    SentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);