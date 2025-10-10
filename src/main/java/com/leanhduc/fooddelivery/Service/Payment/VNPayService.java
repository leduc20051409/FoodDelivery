package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Utils.VNPayUtil;
import com.leanhduc.fooddelivery.Configuration.VnPayConfig;
import com.leanhduc.fooddelivery.Exception.InvalidParamException;
import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.OrderStatus;
import com.leanhduc.fooddelivery.Model.PaymentStatus;
import com.leanhduc.fooddelivery.Repository.OrderRepository;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService implements IPaymentService {

    private final VnPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final IOrderService orderService;

    @Override
    public PaymentResponse createPaymentLink(Order order, HttpServletRequest request) {
        if (order == null || order.getId() == null) {
            throw new InvalidParamException("Invalid order provided");
        }

        if (order.getTotalPrice() == null || order.getTotalPrice() <= 0) {
            throw new InvalidParamException("Invalid order total amount");
        }
        String vnp_TxnRef = order.getId() + "_" + VNPayUtil.getRandomNumber(8);
        String vnp_IpAddr = VNPayUtil.getIpAddress(request);
        long amount = Math.round(order.getTotalPrice());

        Map<String, String> vnpParams = vnPayConfig.getVNPayConfig();
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_TxnRef", vnp_TxnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnpParams.put("vnp_IpAddr", vnp_IpAddr);

        String queryUrl = VNPayUtil.createPaymentUrl(vnpParams, true);
        String hashData = VNPayUtil.createPaymentUrl(vnpParams, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        log.info("Payment URL: {}", paymentUrl);
        log.info("VNP_TxnRef: {}", vnp_TxnRef);

        order.setPaymentTransactionId(vnp_TxnRef);
        order.setPaymentStatus(PaymentStatus.PROCESSING);
        orderRepository.save(order);

        PaymentResponse response = new PaymentResponse();
        response.setPayment_url(paymentUrl);
        response.setSessionId(vnp_TxnRef);

        return response;
    }

    @Override
    public void handleWebhook(String payload, String sigHeader) {
    }

    @Override
    public boolean verifyPaymentStatus(String sessionId) {
        String orderIdStr = sessionId.split("_")[0];
        Long orderId = Long.parseLong(orderIdStr);
        Order order = orderService.getOrderById(orderId);
        return PaymentStatus.COMPLETED.equals(order.getPaymentStatus());

    }

    @Transactional
    public Map<String, Object> processVnPayReturn(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();

        Map<String, String> vnpParams = new HashMap<>();
        Map<String, String[]> requestParams = request.getParameterMap();

        for (Map.Entry<String, String[]> entry : requestParams.entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue()[0];
            if (fieldValue != null && !fieldValue.isEmpty()) {
                vnpParams.put(fieldName, fieldValue);
            }
        }

        if (isInvalidSignature(vnpParams)) {
            result.put("success", false);
            result.put("message", "Invalid signature");
            return result;
        }

        String vnp_TxnRef = vnpParams.get("vnp_TxnRef");
        String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
        String vnp_Amount = vnpParams.get("vnp_Amount");

        String orderIdStr = vnp_TxnRef.split("_")[0];
        Long orderId = Long.parseLong(orderIdStr);

        Order order = orderService.getOrderById(orderId);

        long expectedAmount = Math.round(order.getTotalPrice() * 100);
        long receivedAmount = Long.parseLong(vnp_Amount);

        if (expectedAmount != receivedAmount) {
            result.put("success", false);
            result.put("message", "Amount mismatch");
            return result;
        }
        if ("00".equals(vnp_ResponseCode)) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setPaymentDate(new Date());
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(new Date());

            result.put("success", true);
            result.put("message", "Payment successful");
            result.put("orderId", orderId);
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setCancelledAt(new Date());
            order.setUpdatedAt(new Date());

            result.put("success", false);
            result.put("message", getResponseMessage(vnp_ResponseCode));
            result.put("orderId", orderId);
        }

        orderRepository.save(order);

        return result;
    }

    private boolean isInvalidSignature(Map<String, String> vnpParams) {
        String vnp_SecureHash = vnpParams.remove("vnp_SecureHash");
        vnpParams.remove("vnp_SecureHashType");

        String hashData = VNPayUtil.createPaymentUrl(vnpParams, false);
        String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);

        return !calculatedHash.equalsIgnoreCase(vnp_SecureHash);
    }

    private String getResponseMessage(String responseCode) {
        Map<String, String> responseMessages = new HashMap<>();
        responseMessages.put("00", "Giao dịch thành công");
        responseMessages.put("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ");
        responseMessages.put("09", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking");
        responseMessages.put("10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần");
        responseMessages.put("11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán");
        responseMessages.put("12", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa");
        responseMessages.put("13", "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)");
        responseMessages.put("24", "Giao dịch không thành công do: Khách hàng hủy giao dịch");
        responseMessages.put("51", "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch");
        responseMessages.put("65", "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày");
        responseMessages.put("75", "Ngân hàng thanh toán đang bảo trì");
        responseMessages.put("79", "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định");
        responseMessages.put("99", "Các lỗi khác");

        return responseMessages.getOrDefault(responseCode, "Giao dịch không thành công");
    }
}
