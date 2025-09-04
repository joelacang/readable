import {
  CalendarDaysIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import DetailInfo from "~/components/detail-info";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { OrderDetailType } from "~/types/order";
import { formatAddress } from "~/utils/get-values";
import OrderItem from "./order-item";
import PageHeader from "../page/components/page-header";

interface Props {
  order: OrderDetailType;
}
const OrderDetails = ({ order }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailInfo
                title="Order Reference Code"
                description={
                  <p className="text-primary text-sm font-semibold">
                    {order.refCode}
                  </p>
                }
              />
              <DetailInfo
                title="Date Processed"
                description={order.dateCreated.toLocaleString()}
              />
            </div>
            <DetailInfo
              title="Order Status"
              description={<Badge>{order.status}</Badge>}
            />

            <Separator />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <UserIcon className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>{order.userInfo?.name}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <MapPinIcon className="h-4 w-4" />
                  Shipping Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>{order.shippingInfo?.name ?? order.userInfo?.name}</p>
                  <p className="flex items-center gap-2">
                    <PhoneIcon className="h-3 w-3" />
                    {order.shippingInfo?.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MailIcon className="h-3 w-3" />
                    {order.shippingInfo?.email}
                  </p>
                  {order.shippingInfo?.address && (
                    <p className="text-muted-foreground">
                      {formatAddress(order.shippingInfo?.address)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <OrderItem item={item} key={item.id} />
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${order.taxAmount?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${order.shippingFee?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-600">
                <span>Discount</span>
                <span>-${order.discount?.toFixed(2) ?? "0.00"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span className="text-2xl">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Payment Method
              </p>
              <p className="text-sm">{order.paymentInfo.method}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Payment Status
              </p>
              <Badge>{order.paymentStatus?.toUpperCase()}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Processed Date
              </p>
              <p className="text-sm">{order.dateCreated.toLocaleString()}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              View Receipt
            </Button>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Shipping Carrier
              </p>
              <p className="text-sm">carrier here</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Tracking Number
              </p>
              <p className="font-mono text-sm">0123-01231452-02</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Estimated Delivery
              </p>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Important Info
              </p>
              <p className="text-muted-foreground text-sm">Notes are Here</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Track Package
            </Button>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            event.status === "completed"
                              ? "bg-green-500"
                              : event.status === "current"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                          }`}
                        />
                        {index < order.timeline.length - 1 && (
                          <div className="mt-1 h-8 w-px bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-muted-foreground text-xs">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
