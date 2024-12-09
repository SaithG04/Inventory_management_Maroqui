export class OrderDTO {
    constructor(data) {
        Object.assign(this, data);
    }

    toDomain() {
        return { ...this };
    }

    static fromDomain(order) {
        return new OrderDTO(order);
    }
}
