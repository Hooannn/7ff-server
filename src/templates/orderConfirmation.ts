import { IOrder } from '@/models/Order';

export const orderConfirmationTemplate = (order: IOrder, url: string) => `<!DOCTYPE html>
<html>

<head>
    <title>Order confirmation - 7FF</title>
</head>

<body>
    <div>
        <div>Hi there,</div>
        <p><a href="${url}" target="_blank">link</a> Orders</p>
        <br/>
        <p>${JSON.stringify(order)}</p>
        <br/>
        <p>Cheers!</p>
    </div>

</body>

</html>`;
