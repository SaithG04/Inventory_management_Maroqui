import React from "react";

const ToastMock = React.forwardRef((_, ref) => {
    const show = jest.fn();
    ref.current = { show };
    return null;
});

export default ToastMock;
