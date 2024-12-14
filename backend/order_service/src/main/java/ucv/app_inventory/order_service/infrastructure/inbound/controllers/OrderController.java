package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.application.OrderCreateUseCase;
import ucv.app_inventory.order_service.application.OrderUpdateUseCase;
import ucv.app_inventory.order_service.application.OrderDeleteUseCase;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.exception.ApiResponse;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.InvalidStateException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/order")
@Tag(name = "Order Management", description = "Operations for managing orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderFindUseCase orderFindUseCase;
    private final OrderCreateUseCase orderCreateUseCase;
    private final OrderUpdateUseCase orderUpdateUseCase;
    private final OrderDeleteUseCase orderDeleteUseCase;
    private final OrderMapper orderMapper;

    @Autowired
    public OrderController(OrderFindUseCase orderFindUseCase, OrderCreateUseCase orderCreateUseCase,
                           OrderUpdateUseCase orderUpdateUseCase, OrderDeleteUseCase orderDeleteUseCase, OrderMapper orderMapper) {
        this.orderFindUseCase = orderFindUseCase;
        this.orderCreateUseCase = orderCreateUseCase;
        this.orderUpdateUseCase = orderUpdateUseCase;
        this.orderDeleteUseCase = orderDeleteUseCase;
        this.orderMapper = orderMapper;
    }

    @GetMapping("/listAll")
    @Operation(summary = "Get all orders", description = "Retrieve a paginated list of all orders")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> findAll(final Pageable pageable) {
        try {
            // Attempt to retrieve the paginated list of orders
            Page<OrderDTO> orders = orderFindUseCase.listOrdersPaginated(pageable);

            // If orders are found, return them with a 200 OK status
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response with a general error message
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/findByDate")
    @Operation(summary = "Find orders by date range", description = "Retrieve orders within a specified date range")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> findOrdersByDate(
            @Parameter(description = "Start date of the range", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @Parameter(description = "End date of the range", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,

            Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders within the specified date range
            Page<OrderDTO> orders = orderFindUseCase.findOrdersByDate(startDate, endDate, pageable);

            // If orders are found, return them with a 200 OK status
            if (orders.isEmpty()) {
                // If no orders were found, return a 404 Not Found status with a message
                ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found within the specified date range.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Otherwise, return the found orders with a 200 OK status
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response with a general error message
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/findByStatus")
    @Operation(summary = "Find orders by status", description = "Retrieve orders filtered by status")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> findOrdersByStatus(
            @Parameter(description = "Order status", required = true)
            @RequestParam String status, Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders with the given status
            Page<OrderDTO> orders = orderFindUseCase.findOrdersByStatus(status, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found with the specified status.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (InvalidArgumentException e){
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/findBySupplier")
    @Operation(summary = "Find orders by supplier name", description = "Retrieve orders filtered by supplier name")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> findOrdersBySupplier(
            @Parameter(description = "Supplier name", required = true)
            @RequestParam String supplier_name, Pageable pageable) {

        try {

            // Attempt to retrieve the paginated list of orders for the given supplier ID
            Page<OrderDTO> orders = orderFindUseCase.findOrdersBySupplier(supplier_name, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found for the specified supplier.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/findBySupplierAndStatus")
    @Operation(summary = "Find orders by supplier and status", description = "Retrieve orders filtered by supplier name and status")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> findOrdersBySupplierAndStatus(
            @Parameter(description = "Supplier name", required = true)
            @RequestParam String supplier_name,

            @Parameter(description = "Order status", required = true)
            @RequestParam String status,

            Pageable pageable) {

        try {

            // Attempt to retrieve the paginated list of orders for the given supplier name and status
            Page<OrderDTO> orders = orderFindUseCase.findOrdersBySupplierAndStatus(supplier_name, status, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found for the specified supplier and status.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Page<OrderDTO>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("findById/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieve an order by its ID")
    public ResponseEntity<ApiResponse<OrderDTO>> findById(
            @Parameter(description = "ID of the order", required = true)
            @PathVariable Object id) {

        try {
            // Attempt to find the orderDTO by its ID using the modified use case method that throws an exception if not found
            OrderDTO orderDTO = orderMapper.mapToOrderDTO(orderFindUseCase.findById(id));

            // Return the found orderDTO with a 200 OK response
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.OK.value(), "Order retrieved successfully.");
            response.setData(orderDTO);
            return ResponseEntity.ok(response);

        } catch (InvalidArgumentException e){
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (OrderNotFoundException e) {
            // If the order is not found, return a 404 Not Found response with the error message
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            // Log the exception
            logger.error("Error occurred while retrieving order with ID {}: {}", id, e.getMessage(), e);

            // Return a 500 Internal Server Error response for any other unexpected errors
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/create")
    @Operation(summary = "Create a new order", description = "Create a new order and return the created order details")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @Valid @RequestBody
            @Parameter(description = "Order data to be created", required = true)
            OrderDTO orderDTO) {

        try {
            // Attempt to create the new order using the provided OrderDTO

            Order newOrder = orderMapper.mapToOrder(orderDTO);
            Order createdOrder = orderCreateUseCase.createOrder(newOrder);
            OrderDTO createdOrderDTO =  orderCreateUseCase.getOrderDTO(createdOrder.getId());
            // If the order is created successfully, return a 201 Created response with the order data
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.CREATED.value(), "Order created successfully.");
            response.setData(createdOrderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (InvalidArgumentException e) {
            // Handle validation or argument errors and return a 400 Bad Request response
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<OrderDTO> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update an existing order", description = "Update an order's details by ID")
    public ResponseEntity<ApiResponse<Order>> updateOrder(
            @PathVariable Long id,
            @RequestBody OrderDTO orderDTO) {

        try {
            // Attempt to update the order with the given ID and order data
            Order oldOrder = orderFindUseCase.findById(id);
            Order orderToUpdate = orderUpdateUseCase.validateChanges(oldOrder, orderDTO);
            Order updated = orderUpdateUseCase.updateOrder(orderToUpdate);

            // If the order is updated successfully, return a 200 OK response with the updated order data
            ApiResponse<Order> response = new ApiResponse<>(HttpStatus.OK.value(), "Order updated successfully.");
            response.setData(updated);
            return ResponseEntity.ok(response);

        } catch (OrderNotFoundException e) {
            // If the order with the specified ID is not found, return a 404 Not Found response
            ApiResponse<Order> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (InvalidArgumentException e) {
            // Handle invalid order data and return a 400 Bad Request response
            ApiResponse<Order> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Order> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete an order", description = "Delete an order by its ID")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(
            @Parameter(description = "ID of the order to delete", required = true)
            @PathVariable Long id) {

        try {
            // Attempt to find the order by ID and throw an exception if not found
            Order order = orderFindUseCase.findById(id);

            // Attempt to delete the orderDTO using the deleteOrder use case
            orderDeleteUseCase.deleteOrder(order);

            // If deletion is successful, return a 204 No Content response with a success message
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NO_CONTENT.value(), "Order deleted successfully.");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);

        } catch (OrderNotFoundException e) {
            // If the order is not found, return a 404 Not Found response with an error message
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (InvalidStateException e) {
            // If the order is in an invalid state for deletion (e.g., PENDING), return a 400 Bad Request response with an error message
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // If any other unexpected error occurs, return a 500 Internal Server Error response with a general error message
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/findByCreationDate")
    @Operation(summary = "Find orders by creation date", description = "Retrieve orders filtered by creation date")
    public ResponseEntity<ApiResponse<Page<Order>>> findByCreationDate(
            @Parameter(description = "Creation date", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate creationDate,
            Pageable pageable) {

        try {
            // Attempt to find orders by creation date
            Page<Order> orders = orderFindUseCase.findOrdersByCreationDate(creationDate, pageable);

            // If orders are found, return a 200 OK response with the list of orders
            if (orders.hasContent()) {
                ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
                response.setData(orders);
                return ResponseEntity.ok(response);
            }

            // If no orders are found, return a 404 Not Found response
            ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found for the given creation date.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/findByTotalRange")
    @Operation(summary = "Find orders by total range", description = "Retrieve orders within a specified total range")
    public ResponseEntity<ApiResponse<Page<Order>>> findByTotalRange(
            @Parameter(description = "Minimum total amount", required = true)
            @RequestParam Double minTotal,

            @Parameter(description = "Maximum total amount", required = true)
            @RequestParam Double maxTotal,

            Pageable pageable) {

        try {
            // Validate that minTotal is not greater than maxTotal
            if (minTotal > maxTotal) {
                ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Minimum total cannot be greater than maximum total.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Attempt to find orders within the specified total range
            Page<Order> orders = orderFindUseCase.findOrdersByTotalRange(minTotal, maxTotal, pageable);

            // If orders are found, return a 200 OK response with the list of orders
            if (orders.hasContent()) {
                ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
                response.setData(orders);
                return ResponseEntity.ok(response);
            }

            // If no orders are found, return a 404 Not Found response
            ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "No orders found in the specified total range.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponse<Page<Order>> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
