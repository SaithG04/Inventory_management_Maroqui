package ucv.app_inventory.application.DTO;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO implements Serializable {

    @JsonProperty("id_producto")
    private Integer id;

    @JsonProperty("nombre")
    private String name;

    @JsonProperty("codigo")
    private String code;

    @JsonProperty("descripcion")
    private String description;

    @JsonProperty("precio_costo")
    private Double costPrice;

    @JsonProperty("unidad_medida")
    private String unitMeasurement;

    @JsonProperty("stock")
    private String stock;

    @JsonProperty("id_categoria")
    private Integer categoryId;

    @JsonProperty("id_proveedor")
    private Integer supplierId;
}

