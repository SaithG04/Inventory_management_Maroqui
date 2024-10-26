package ucv.app_inventory.order_service.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * LoggingAspect es un aspecto que intercepta los métodos de la aplicación para registrar información de seguimiento y depuración.
 * Su propósito es:
 * 1. Registrar la entrada y salida de los métodos, incluyendo sus parámetros y el valor devuelto.
 * 2. Registrar las excepciones que ocurren durante la ejecución de los métodos.
 */
@Aspect
@Component
public class LoggingAspect {

    // Logger para registrar la información de los métodos interceptados
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Intercepta cualquier método de la aplicación y registra su entrada y salida.
     * También mide el tiempo de ejecución del método.
     *
     * @param proceedingJoinPoint Punto de ejecución del método interceptado que permite continuar con la ejecución del método.
     * @return El valor devuelto por el método interceptado.
     * @throws Throwable Si ocurre alguna excepción durante la ejecución del método.
     */
    @Around("execution(* ucv.app_inventory.order_service..*(..))")
    public Object logMethodExecution(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        String methodName = proceedingJoinPoint.getSignature().getName();
        Object[] methodArgs = proceedingJoinPoint.getArgs();

        // Registrar la entrada al método
        logger.info("Entrando al método: {} con argumentos: {}", methodName, methodArgs);

        long startTime = System.currentTimeMillis();
        Object result;

        try {
            // Continuar con la ejecución del método
            result = proceedingJoinPoint.proceed();
        } catch (Throwable ex) {
            logger.error("Excepción en el método: {}", methodName, ex);
            throw ex;  // Rethrow la excepción para no interrumpir el flujo
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Registrar la salida del método
        logger.info("Saliendo del método: {} con resultado: {} (tiempo de ejecución: {} ms)", methodName, result, duration);

        return result;
    }

    /**
     * Intercepta cualquier excepción lanzada por los métodos de la aplicación y registra un mensaje de error.
     *
     * @param joinPoint Punto de ejecución del método donde ocurrió la excepción.
     * @param ex        La excepción lanzada durante la ejecución del método.
     */
    @AfterThrowing(pointcut = "execution(* ucv.app_inventory.order_service..*(..))", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().getName();
        logger.error("Excepción lanzada en el método: {} con mensaje: {}", methodName, ex.getMessage(), ex);
    }
}
