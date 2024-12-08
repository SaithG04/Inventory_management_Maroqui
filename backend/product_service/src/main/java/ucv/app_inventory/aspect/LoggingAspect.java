package ucv.app_inventory.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * LoggingAspect is an aspect that intercepts application methods to log trace and debug information.
 * Its purpose is to:
 * 1. Log the entry and exit of methods, including their parameters and return value.
 * 2. Log any exceptions that occur during method execution.
 */
@Aspect
@Component
public class LoggingAspect {

    // Logger to record information about intercepted methods
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Intercepts any method in the application to log its entry and exit.
     * Also measures the method's execution time.
     *
     * @param proceedingJoinPoint Execution point of the intercepted method, allowing the method to continue execution.
     * @return The value returned by the intercepted method.
     * @throws Throwable If an exception occurs during the method execution.
     */
    @Around("execution(* ucv.app_inventory.supplier_service..*(..))")
    public Object logMethodExecution(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        String methodName = proceedingJoinPoint.getSignature().getName();
        Object[] methodArgs = proceedingJoinPoint.getArgs();

        // Log method entry
        logger.info("Entering method: {} with arguments: {}", methodName, methodArgs);

        long startTime = System.currentTimeMillis();
        Object result;

        try {
            // Proceed with method execution
            result = proceedingJoinPoint.proceed();
        } catch (Throwable ex) {
            logger.error("Exception in method: {}", methodName, ex);
            throw ex;  // Rethrow the exception to avoid interrupting flow
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Log method exit
        logger.info("Exiting method: {} with result: {} (execution time: {} ms)", methodName, result, duration);

        return result;
    }

    /**
     * Intercepts any exception thrown by application methods and logs an error message.
     *
     * @param joinPoint Execution point of the method where the exception occurred.
     * @param ex        The exception thrown during method execution.
     */
    @AfterThrowing(pointcut = "execution(* ucv.app_inventory.supplier_service..*(..))", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().getName();
        logger.error("Exception thrown in method: {} with message: {}", methodName, ex.getMessage(), ex);
    }
}