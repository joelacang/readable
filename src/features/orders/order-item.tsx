import Image from "next/image";
import type { OrderItemType } from "~/types/order";

interface Props {
  item: OrderItemType;
}

const OrderItem = ({ item }: Props) => {
  return (
    <div key={item.id} className="flex gap-4 rounded-lg border p-4">
      <div className="relative aspect-square size-20 overflow-hidden rounded-lg">
        <Image
          fill
          src={item.product.imageUrl ?? "/placeholder.svg"}
          alt={item.product.name}
          objectFit="contain"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="font-medium">{item.product.name}</h4>
        <p className="text-muted-foreground text-sm">{item.product.format}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">Quantity: {item.quantity}</p>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              ${item.product.price} each
            </p>
            <p className="font-medium">${item.subTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
