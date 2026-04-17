package com.campus.transport.dto;

import com.campus.transport.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateDTO {

    @NotNull(message = "Status is required")
    private RequestStatus status;
}
