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
 * TransactionAspect es un aspecto que intercepta métodos transaccionales anotados con
 * {@code @Transactional}. Su propósito es:
 * 1. Registrar la información antes de que comience la transacción.
 * 2. Registrar el tiempo de inicio de la transacción.
 * 3. Manejar excepciones que ocurren dentro de los métodos transaccionales.
 * 4. Registrar la finalización exitosa de las transacciones.
 */
@Aspect
@Component
public class TransactionAspect {

    // Logger para registrar información de las transacciones.
    private static final Logger logger = LoggerFactory.getLogger(TransactionAspect.class);

    /**
     * Intercepta cualquier método anotado con {@code @Transactional} antes de que se ejecute.
     * Registra el nombre del método y los argumentos que se pasan a él, así como la hora en que comienza.
     *
     * @param joinPoint Punto de ejecución del método interceptado que contiene información del método.
     */
    @Before("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void manageTransaction(JoinPoint joinPoint) {
        // Obtener el nombre del método interceptado
        String methodName = joinPoint.getSignature().getName();
        logger.info("Iniciando una transacción en el método: {}", methodName);

        // Loguear los argumentos del método interceptado
        Object[] args = joinPoint.getArgs();
        if (args != null && args.length > 0) {
            logger.info("Argumentos del método: ");
            for (Object arg : args) {
                logger.info(" - {}", arg);
            }
        }

        // Registrar el tiempo de inicio de la transacción
        long startTime = System.currentTimeMillis();
        logger.info("La transacción comenzó a las: {}", startTime);
    }

    /**
     * Intercepta cualquier excepción que ocurra en métodos anotados con {@code @Transactional}.
     * Registra un mensaje de error con el detalle de la excepción lanzada.
     *
     * @param ex La excepción lanzada durante la ejecución de la transacción.
     */
    @AfterThrowing(pointcut = "@annotation(org.springframework.transaction.annotation.Transactional)", throwing = "ex")
    public void handleTransactionException(Exception ex) {
        logger.error("Ocurrió una excepción durante la transacción: ", ex);
    }

    /**
     * Intercepta la salida de un método transaccional cuando este se ejecuta correctamente sin excepciones.
     * Registra la finalización exitosa de la transacción y puede calcular el tiempo de ejecución.
     *
     * @param joinPoint Punto de ejecución del método interceptado.
     * @param result    Resultado devuelto por el método transaccional (si lo hay).
     */
    @AfterReturning(pointcut = "@annotation(org.springframework.transaction.annotation.Transactional)", returning = "result")
    public void logTransactionSuccess(JoinPoint joinPoint, Object result) {
        // Obtener el nombre del método interceptado
        String methodName = joinPoint.getSignature().getName();
        logger.info("La transacción en el método '{}' finalizó exitosamente.", methodName);

        // Loguear el resultado del método (si lo hay)
        if (result != null) {
            logger.info("Resultado devuelto por el método: {}", result);
        }

        // Registrar el tiempo de finalización de la transacción (opcionalmente se puede medir el tiempo transcurrido)
        long endTime = System.currentTimeMillis();
        logger.info("La transacción finalizó a las: {}", endTime);
    }
}