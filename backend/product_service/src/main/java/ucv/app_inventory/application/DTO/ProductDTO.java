package ucv.app_inventory.application.DTO;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ucv.app_inventory.domain.entities.Product;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO implements Serializable {

    @JsonProperty("id_producto")
    private Long id;

    @JsonProperty("nombre")
    private String name;

    @JsonProperty("codigo")
    private String code;

    @JsonProperty("descripcion")
    private String description;

    @JsonProperty("unidad_medida")
    private String unitMeasurement;

    @JsonProperty("stock")
    private Integer stock;

    @JsonProperty("id_categoria")
    private Long categoryId;

    @JsonProperty("estado")
    private Product.Status status;
}
