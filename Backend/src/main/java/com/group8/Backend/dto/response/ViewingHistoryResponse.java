package com.group8.Backend.dto.response;

import java.time.LocalDateTime;

public class ViewingHistoryResponse {
    private Long mediaId;
    private String title;
    private String posterURL;
    private String mediaType;
    private LocalDateTime lastViewed;

    public Long getMediaId() { return mediaId; }
    public void setMediaId(Long mediaId) { this.mediaId = mediaId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPosterURL() { return posterURL; }
    public void setPosterURL(String posterURL) { this.posterURL = posterURL; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public LocalDateTime getLastViewed() { return lastViewed; }
    public void setLastViewed(LocalDateTime lastViewed) { this.lastViewed = lastViewed; }
}