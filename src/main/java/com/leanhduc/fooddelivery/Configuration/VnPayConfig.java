package com.leanhduc.fooddelivery.Configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;


@Configuration
@Getter
public class VnPayConfig {


    @Value("${vnPay.payUrl}")
    private String vnp_PayUrl;


    @Value("${vnPay.returnUrl}")
    private String vnp_ReturnUrl;


    @Value("${vnPay.tmnCode}")
    private String vnp_TmnCode;


    @Value("${vnPay.hashSecret}")
    private String secretKey;


    @Value("${vnPay.version}")
    private String vnp_Version;


    @Value("${vnPay.command}")
    private String vnp_Command;


    @Value("${vnPay.orderType}")
    private String orderType;

    public Map<String, String> getVNPayConfig() {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.vnp_Version);
        vnpParamsMap.put("vnp_Command", this.vnp_Command);
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND");
        vnpParamsMap.put("vnp_OrderType", this.orderType);
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_ReturnUrl", this.vnp_ReturnUrl);

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        vnpParamsMap.put("vnp_CreateDate", now.format(formatter));
        vnpParamsMap.put("vnp_ExpireDate", now.plusMinutes(15).format(formatter));

        return vnpParamsMap;
    }


}
