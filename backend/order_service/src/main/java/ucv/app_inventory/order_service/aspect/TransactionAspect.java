package ucv.app_inventory.order_service.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * TransactionAspect is an aspect that intercepts transactional methods annotated with
 * {@code @Transactional}. Its purpose is to:
 * 1. Log information before the transaction begins.
 * 2. Record the transaction start time.
 * 3. Handle exceptions that occur within transactional methods.
 * 4. Log the successful completion of transactions.
 */
@Aspect
@Component
public class TransactionAspect {

    // Logger to record transaction information
    private static final Logger logger = LoggerFactory.getLogger(TransactionAspect.class);

    /**
     * Intercepts any method annotated with {@code @Transactional} before it executes.
     * Logs the method name, its arguments, and the start time.
     *
     * @param joinPoint Execution point of the intercepted method, containing method information.
     */
    @Before("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void manageTransaction(JoinPoint joinPoint) {
        // Get the name of the intercepted method
        String methodName = joinPoint.getSignature().getName();
        logger.info("Starting a transaction in method: {}", methodName);

        // Log the arguments of the intercepted method
        Object[] args = joinPoint.getArgs();
        if (args != null && args.length > 0) {
            logger.info("Method arguments: ");
            for (Object arg : args) {
                logger.info(" - {}", arg);
            }
        }

        // Log the start time of the transaction
        long startTime = System.currentTimeMillis();
        logger.info("Transaction started at: {}", startTime);
    }

    /**
     * Intercepts any exception that occurs in methods annotated with {@code @Transactional}.
     * Logs an error message with details of the thrown exception.
     *
     * @param ex The exception thrown during transaction execution.
     */
    @AfterThrowing(pointcut = "@annotation(org.springframework.transaction.annotation.Transactional)", throwing = "ex")
    public void handleTransactionException(Exception ex) {
        logger.error("An exception occurred during the transaction: ", ex);
    }

    /**
     * Intercepts the exit of a transactional method when it executes successfully without exceptions.
     * Logs the successful completion of the transaction and can calculate execution time.
     *
     * @param joinPoint Execution point of the intercepted method.
     * @param result    Result returned by the transactional method (if any).
     */
    @AfterReturning(pointcut = "@annotation(org.springframework.transaction.annotation.Transactional)", returning = "result")
    public void logTransactionSuccess(JoinPoint joinPoint, Object result) {
        // Get the name of the intercepted method
        String methodName = joinPoint.getSignature().getName();
        logger.info("The transaction in method '{}' completed successfully.", methodName);

        // Log the result of the method (if any)
        if (result != null) {
            logger.info("Result returned by the method: {}", result);
        }

        // Log the end time of the transaction (optionally calculate elapsed time)
        long endTime = System.currentTimeMillis();
        logger.info("Transaction ended at: {}", endTime);
    }
}
