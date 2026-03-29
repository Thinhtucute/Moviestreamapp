package com.group8.Backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MediaTypeConverter implements AttributeConverter<MediaType, String> {
    @Override
    public String convertToDatabaseColumn(MediaType attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }

    @Override
    public MediaType convertToEntityAttribute(String dbData) {
        return MediaType.fromValue(dbData);
    }
}
