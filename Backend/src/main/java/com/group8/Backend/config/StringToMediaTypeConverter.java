package com.group8.Backend.config;

import com.group8.Backend.entity.MediaType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToMediaTypeConverter implements Converter<String, MediaType> {
    @Override
    public MediaType convert(String source) {
        return MediaType.fromValue(source);
    }
}
