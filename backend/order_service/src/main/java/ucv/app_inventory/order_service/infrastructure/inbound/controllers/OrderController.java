package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
import ucv.app_inventory.order_service.application.dto.OrderRequestDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.exception.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/order")
@Tag(name = "Order Management", description = "Operations for managing orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderFindUseCase orderFindUseCase;
    private final OrderCreateUseCase orderCreateUseCase;
    private final OrderUpdateUseCase orderUpdateUseCase;
    private final OrderDeleteUseCase orderDeleteUseCase;
    private final OrderMapper orderMapper;

    /**
     * Constructor for OrderController, initializing use cases and the mapper for order operations.
     *
     * @param orderFindUseCase   Use case for finding orders.
     * @param orderCreateUseCase Use case for creating new orders.
     * @param orderUpdateUseCase Use case for updating existing orders.
     * @param orderDeleteUseCase Use case for deleting orders.
     * @param orderMapper        Mapper for converting between Order and OrderDTO objects.
     */
    @Autowired
    public OrderController(OrderFindUseCase orderFindUseCase, OrderCreateUseCase orderCreateUseCase,
                           OrderUpdateUseCase orderUpdateUseCase, OrderDeleteUseCase orderDeleteUseCase, OrderMapper orderMapper) {
        this.orderFindUseCase = orderFindUseCase;
        this.orderCreateUseCase = orderCreateUseCase;
        this.orderUpdateUseCase = orderUpdateUseCase;
        this.orderDeleteUseCase = orderDeleteUseCase;
        this.orderMapper = orderMapper;
    }

    /**
     * Retrieves all orders in a paginated format.
     *
     * @param pageable Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/listAll")
    @Operation(
            summary = "Get all orders",
            description = "Retrieve a paginated list of all orders available in the system.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving orders",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<OrderDTO>>> findAll(final Pageable pageable) {
        try {
            // Attempt to retrieve the paginated list of orders
            Page<OrderDTO> orders = orderFindUseCase.listOrdersPaginated(pageable);

            // If orders are found, return them with a 200 OK status
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves orders within a specified date range.
     *
     * @param startDate The start date of the range (format: yyyy-MM-dd).
     * @param endDate   The end date of the range (format: yyyy-MM-dd).
     * @param pageable  Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findByDate")
    @Operation(
            summary = "Find orders by date range",
            description = "Retrieve orders created within the specified start and end dates.",
            parameters = {
                    @Parameter(name = "startDate", description = "Start date of the range (format: yyyy-MM-dd)", required = true),
                    @Parameter(name = "endDate", description = "End date of the range (format: yyyy-MM-dd)", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found within the specified date range",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving orders",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<OrderDTO>>> findOrdersByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders within the specified date range
            Page<OrderDTO> orders = orderFindUseCase.findOrdersByDate(startDate, endDate, pageable);

            // If no orders were found, return a 404 Not Found status with a message
            if (orders.isEmpty()) {
                ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found within the specified date range.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Otherwise, return the found orders with a 200 OK status
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves orders filtered by their status.
     *
     * @param status   The status of the orders to filter by.
     * @param pageable Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findByStatus")
    @Operation(
            summary = "Find orders by status",
            description = "Retrieve orders filtered by their status.",
            parameters = {
                    @Parameter(name = "status", description = "Status of the orders to filter by", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found with the specified status",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid request data",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving orders",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<OrderDTO>>> findOrdersByStatus(
            @RequestParam String status,
            Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders with the given status
            Page<OrderDTO> orders = orderFindUseCase.findOrdersByStatus(status, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found with the specified status.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (InvalidArgumentException e) {
            // Handle invalid arguments in the request
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves orders filtered by supplier name.
     *
     * @param supplier_name The name of the supplier to filter orders by.
     * @param pageable      Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findBySupplier")
    @Operation(
            summary = "Find orders by supplier name",
            description = "Retrieve orders filtered by supplier name.",
            parameters = {
                    @Parameter(name = "supplier_name", description = "Name of the supplier to filter orders by", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found for the specified supplier",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid supplier name provided",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving orders",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<OrderDTO>>> findOrdersBySupplier(
            @RequestParam String supplier_name,
            Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders for the given supplier name
            Page<OrderDTO> orders = orderFindUseCase.findOrdersBySupplier(supplier_name, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found for the specified supplier.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (InvalidArgumentException e) {
            // Handle invalid arguments in the request
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves orders filtered by supplier name and status.
     *
     * @param supplier_name The name of the supplier to filter orders by.
     * @param status        The status of the orders to filter by.
     * @param pageable      Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findBySupplierAndStatus")
    @Operation(
            summary = "Find orders by supplier and status",
            description = "Retrieve orders filtered by supplier name and status.",
            parameters = {
                    @Parameter(name = "supplier_name", description = "Name of the supplier to filter orders by", required = true),
                    @Parameter(name = "status", description = "Status of the orders to filter by", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found for the specified supplier and status",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid request data",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving orders",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<OrderDTO>>> findOrdersBySupplierAndStatus(
            @RequestParam String supplier_name,
            @RequestParam String status,
            Pageable pageable) {

        try {
            // Attempt to retrieve the paginated list of orders for the given supplier name and status
            Page<OrderDTO> orders = orderFindUseCase.findOrdersBySupplierAndStatus(supplier_name, status, pageable);

            // If no orders are found, return a 404 Not Found response
            if (orders.isEmpty()) {
                ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found for the specified supplier and status.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // If orders are found, return them with a 200 OK status
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
            response.setData(orders);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (InvalidArgumentException e) {
            // Handle invalid arguments in the request
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<OrderDTO>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves an order by its unique ID.
     *
     * @param id The unique identifier of the order.
     * @return ResponseEntity containing the order details or an error response.
     */
    @GetMapping("findById/{id}")
    @Operation(
            summary = "Get order by ID",
            description = "Retrieve an order by its unique ID.",
            parameters = {
                    @Parameter(name = "id", description = "Unique ID of the order to retrieve", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Order retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Order not found with the specified ID",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid ID format",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Conflict occurred while retrieving the order",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<OrderDTO>> findById(
            @PathVariable Object id) {

        try {
            // Attempt to find the order by its ID
            OrderDTO orderCreateDTO = orderFindUseCase.findById(id);

            // Return the found order with a 200 OK response
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Order retrieved successfully.");
            response.setData(orderCreateDTO);
            return ResponseEntity.ok(response);

        } catch (SupplierNotFoundException e) {
            // Handle specific exception for supplier not found
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (InvalidArgumentException e) {
            // Handle invalid arguments in the request
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (OrderNotFoundException e) {
            // Handle case where order is not found
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            // Log the exception and return a 500 Internal Server Error response
            logger.error("Error occurred while retrieving order with ID {}: {}", id, e.getMessage(), e);
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Retrieves orders filtered by their creation date.
     *
     * @param creationDate The date of creation to filter orders by (format: yyyy-MM-dd).
     * @param pageable     Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findByCreationDate")
    @Operation(
            summary = "Find orders by creation date",
            description = "Retrieve orders filtered by their creation date.",
            parameters = {
                    @Parameter(name = "creationDate", description = "Date of creation to filter orders by (format: yyyy-MM-dd)", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found for the given creation date",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<Order>>> findByCreationDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate creationDate,
            Pageable pageable) {

        try {
            // Attempt to find orders by creation date
            Page<Order> orders = orderFindUseCase.findOrdersByCreationDate(creationDate, pageable);

            // If orders are found, return a 200 OK response with the list of orders
            if (orders.hasContent()) {
                ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
                response.setData(orders);
                return ResponseEntity.ok(response);
            }

            // If no orders are found, return a 404 Not Found response
            ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found for the given creation date.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Retrieves orders within a specified total range.
     *
     * @param minTotal The minimum total amount for the range.
     * @param maxTotal The maximum total amount for the range.
     * @param pageable Pageable object for pagination settings.
     * @return ResponseEntity containing the paginated list of orders or an error response.
     */
    @GetMapping("/findByTotalRange")
    @Operation(
            summary = "Find orders by total range",
            description = "Retrieve orders within a specified total range.",
            parameters = {
                    @Parameter(name = "minTotal", description = "Minimum total amount for the range", required = true),
                    @Parameter(name = "maxTotal", description = "Maximum total amount for the range", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Orders retrieved successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No orders found within the specified total range",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid range: minimum total cannot be greater than maximum total",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Page<Order>>> findByTotalRange(
            @RequestParam Double minTotal,
            @RequestParam Double maxTotal,
            Pageable pageable) {

        try {
            // Validate that minTotal is not greater than maxTotal
            if (minTotal > maxTotal) {
                ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), "Minimum total cannot be greater than maximum total.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Attempt to find orders within the specified total range
            Page<Order> orders = orderFindUseCase.findOrdersByTotalRange(minTotal, maxTotal, pageable);

            // If orders are found, return a 200 OK response with the list of orders
            if (orders.hasContent()) {
                ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Orders retrieved successfully.");
                response.setData(orders);
                return ResponseEntity.ok(response);
            }

            // If no orders are found, return a 404 Not Found response
            ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "No orders found in the specified total range.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            // If any unexpected error occurs, return a 500 Internal Server Error response
            ApiResponseJSON<Page<Order>> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Creates a new order and returns the created order details.
     *
     * @param orderRequest The data of the order and its details to be created.
     * @return ResponseEntity containing the created order details or an error response.
     */
    @PostMapping("/create")
    @Operation(
            summary = "Create a new order",
            description = "Create a new order and return the details of the created order.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Order data and details for the new order",
                    required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderRequestDTO.class))
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Order created successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid request data or supplier not found",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<OrderDTO>> createOrder(
            @Valid @RequestBody
            @Parameter(description = "Order data and order details", required = true)
            OrderRequestDTO orderRequest) {

        try {
            // Create the order and map it to DTO
            Order order = orderCreateUseCase.createOrder(orderRequest.getOrder(), orderRequest.getOrderDetails());
            OrderDTO createdOrderDTO = orderMapper.mapToOrderDTO(order);

            // Return the created order details with a 201 Created status
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.CREATED.value(), "Order created successfully.");
            response.setData(createdOrderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (InvalidArgumentException | SupplierNotFoundException e) {
            // Handle validation or argument errors
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            // Handle unexpected errors
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Updates an existing order's details by its unique ID.
     *
     * @param id              The unique identifier of the order to update.
     * @param orderRequestDTO The updated data for the order.
     * @return ResponseEntity containing the updated order details or an error response.
     */
    @PutMapping("/update/{id}")
    @Operation(
            summary = "Update an existing order",
            description = "Update the details of an order by its unique ID.",
            parameters = {
                    @Parameter(name = "id", description = "Unique ID of the order to update", required = true)
            },
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Updated order data and details",
                    required = true,
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderRequestDTO.class))
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Order updated successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Order not found with the specified ID",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid request data or invalid state transition",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<OrderDTO>> updateOrder(
            @PathVariable Long id,
            @RequestBody OrderRequestDTO orderRequestDTO) {

        try {
            // Attempt to update the order with the given ID and order data
            Order updatedOrder = orderUpdateUseCase.updateOrder(id, orderRequestDTO);
            OrderDTO updated = orderMapper.mapToOrderDTO(updatedOrder);

            // If the order is updated successfully, return a 200 OK response with the updated order data
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Order updated successfully.");
            response.setData(updated);
            return ResponseEntity.ok(response);

        } catch (OrderNotFoundException e) {
            // Handle case where the order with the specified ID is not found
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (InvalidArgumentException | SupplierNotFoundException | InvalidStateTransitionException e) {
            // Handle invalid order data or state transition errors
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            // Handle unexpected errors
            ApiResponseJSON<OrderDTO> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    /**
     * Deletes an order by its unique ID.
     *
     * @param id The unique identifier of the order to delete.
     * @return ResponseEntity indicating the result of the deletion operation.
     */
    @DeleteMapping("/delete/{id}")
    @Operation(
            summary = "Delete an order",
            description = "Delete an order by its unique ID.",
            parameters = {
                    @Parameter(name = "id", description = "Unique ID of the order to delete", required = true)
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Order deleted successfully",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Order not found with the specified ID",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Invalid state for deletion",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponseJSON.class))
                    )
            }
    )
    public ResponseEntity<ApiResponseJSON<Void>> deleteOrder(
            @PathVariable Long id) {

        try {
            // Attempt to find the order by ID and throw an exception if not found
            Order order = orderMapper.mapToOrder(orderFindUseCase.findById(id));

            // Attempt to delete the order using the deleteOrder use case
            orderDeleteUseCase.deleteOrder(order);

            // If deletion is successful, return a 200 OK response with a success message
            ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.OK.value(), "Order deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (OrderNotFoundException e) {
            // Handle case where the order with the specified ID is not found
            ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (InvalidStateException e) {
            // Handle case where the order is in an invalid state for deletion
            ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.CONFLICT.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            // Handle unexpected errors
            ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
