package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.SupplierNotFoundException;
import ucv.app_inventory.order_service.exception.TotalCannotBeNullException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderCreateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;
    private final SupplierAPIClient supplierAPIClient;
    private final ProductAPIClient productAPIClient;

    private final static Logger logger = LoggerFactory.getLogger(OrderCreateUseCase.class);

    /**
     * Creates a new order based on the details provided in the OrderCreateDTO.
     * The order is first saved with a total of 0.0. Then the details are processed,
     * and the total is recalculated and updated.
     *
     * @param newOrderDTO the order containing order data.
     * @param orderDetails the order details
     * @return the created order.
     * @throws TotalCannotBeNullException if the total is calculated as zero.
     */
    @Transactional
    @CacheEvict(value = "orders") // Evicts the cache for the specific order to ensure the latest version is fetched.
    public Order createOrder(OrderDTO newOrderDTO, List<OrderDetailDTO> orderDetails) {
        Order order = initilizeOrder(newOrderDTO);
        BigDecimal total = processOrderDetails(orderDetails, newOrderDTO.getSupplierName(), order);

        order.setTotal(total);
        return orderMySqlRepository.save(order);
    }

    public Order initilizeOrder(OrderDTO newOrderDTO) {
        newOrderDTO.setStatus("PENDING");
        validateParameters(newOrderDTO);
        LocalDate orderDate = validateOrderDate(newOrderDTO.getOrderDate());
        // Validate and fetch the supplier details
        SupplierDTO supplierDTO = validateSupplier(newOrderDTO);

        // Create the Order entity
        Order order = new Order();
        order.setSupplierId(supplierDTO.getId());
        order.setStatus(OrderState.valueOf(newOrderDTO.getStatus()));
        order.setObservations(newOrderDTO.getObservations());
        order.setOrderDate(orderDate);

        // Save the order with a total of 0.0 to generate the order ID
        order.setTotal(BigDecimal.ZERO);
        order = orderMySqlRepository.save(order);
        return order;
    }

    public BigDecimal processOrderDetails(List<OrderDetailDTO> orderDetailDTOS, String supplierName, Order order) {
        BigDecimal total = BigDecimal.ZERO;

        // Loop through the order details and process each one
        for (OrderDetailDTO detailDTO : orderDetailDTOS) {
            // Validate if the product exists
            ProductDTO productDTO = validateProductExistence(detailDTO.getProductName());

            ProductSupplierDTO productSupplierDTO = getRelation(productDTO, order.getSupplierId(), supplierName);
            // Create a new order detail and associate it with the order
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order); // Associate the detail with the order
            orderDetail.setProductSupplierId(productSupplierDTO.getId());
            orderDetail.setQuantity(detailDTO.getQuantity());

            BigDecimal lineTotal = productSupplierDTO.getPrice()
                    .multiply(BigDecimal.valueOf(detailDTO.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);


            // Calculate the total
            total = total.add(lineTotal);

            // Save the order detail
            orderDetailMySqlRepository.save(orderDetail);
            logger.info("Order detail saved: {}", orderDetail);
        }

        return total;
    }

    /**
     * Validates and fetches the supplier based on the name provided in the order data.
     *
     * @param orderCreateDTO the DTO containing the order data.
     * @return the supplier details.
     * @throws InvalidArgumentException if the supplier name is invalid or the supplier is not found.
     */
    public SupplierDTO validateSupplier(OrderDTO orderCreateDTO) {
        if (orderCreateDTO.getSupplierName() == null || orderCreateDTO.getSupplierName().isEmpty()) {
            throw new InvalidArgumentException("Supplier name cannot be empty.");
        }

        // Fetch the supplier by name using the Supplier API client
        Page<SupplierDTO> suppliers = supplierAPIClient.getSupplierByName(orderCreateDTO.getSupplierName(), Pageable.unpaged());
        logger.info("Response from supplier API: {}", suppliers);
        // Ensure the supplier exists
        if (suppliers.isEmpty()) {
            throw new SupplierNotFoundException("Supplier with name " + orderCreateDTO.getSupplierName() + " does not exist.");
        }

        SupplierDTO supplier = suppliers.getContent().getFirst();
        logger.info("Supplier found: {}", supplier);

        return supplier;
    }

    /**
     * Validates the existence of a product based on its name.
     *
     * @param productName the name of the product.
     * @return the product details if found.
     * @throws InvalidArgumentException if the product is not found.
     */
    public ProductDTO validateProductExistence(String productName) {
        // Check if the product name is provided
        if (productName == null || productName.trim().isEmpty()) {
            throw new InvalidArgumentException("Product name cannot be null or empty.");
        }

        // Call the product API client to fetch products by name
        List<ProductDTO> products = productAPIClient.getProductsByName(productName, 0, 1)
                .orElseThrow(() -> new InvalidArgumentException("No product found with name " + productName));
        logger.info("Response from product API: {}", products);

        if (products == null){
            throw new InvalidArgumentException("Product with name " + productName + " does not exist.");
        }

        // Check if the list is empty or contains invalid products
        if (products.isEmpty() || products.getFirst() == null ||
                products.getFirst().getId() == null || products.getFirst().getName() == null) {
            throw new InvalidArgumentException("Product with name " + productName + " does not exist or is invalid.");
        }

        // Get the first valid product
        ProductDTO productDTO = products.getFirst();
        logger.info("Product found: {}", productDTO);

        // Return the first product found
        return productDTO;
    }


    /**
     * Validates the order date to ensure it is not in the past.
     *
     * @param orderDateString the order date in String.
     * @throws InvalidArgumentException if the order date is invalid.
     */
    public static LocalDate validateOrderDate(String orderDateString) {
        logger.info("Order date received: {}", orderDateString);
        try{
            LocalDate orderDate = LocalDate.parse(orderDateString);
            if (orderDate.isBefore(LocalDate.now())) {
                throw new InvalidArgumentException("Order date cannot be in the past.");
            }
            return orderDate;
        }catch (DateTimeParseException e){
            throw new InvalidArgumentException("Order date must be in the format YYYY-MM-DD.");
        }
    }

    private void validateParameters(OrderDTO orderDTO) {
        if (orderDTO.getSupplierName() == null || orderDTO.getSupplierName().isEmpty()) {
            throw new InvalidArgumentException("Supplier name cannot be empty.");
        }
        if (orderDTO.getOrderDate() == null || orderDTO.getOrderDate().isEmpty()) {
            throw new InvalidArgumentException("Order date cannot be null.");
        }
    }

    public ProductSupplierDTO getRelation(ProductDTO productDTO, Long supplierId, String supplierName) {
        return productAPIClient.getRelationByProductIdAndSupplierId(productDTO.getId(),
                supplierId).orElseThrow(() ->
                new InvalidArgumentException("Product " + productDTO.getName() + " does not associated with the supplier " + supplierName +"."));
    }
}
