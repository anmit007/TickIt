import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@artickit/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./utils/queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete =Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(data:ExpirationCompleteEvent['data'],msg:Message){

        // find the relevant order
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order)
        {
            throw new NotFoundError();
        }

        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id : order.ticket.id
            }
        })
        msg.ack();
    }


}