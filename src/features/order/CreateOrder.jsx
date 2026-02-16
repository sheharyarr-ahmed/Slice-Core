import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import store from "../../store";
import { fetchAddress } from "../user/userSlice";
import { formatCurrency } from "../../utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const navigation = useNavigation();
  const formErrors = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const username = useSelector((state) => state.user.username);
  const addressStatus = useSelector((state) => state.user.status);
  const address = useSelector((state) => state.user.address);
  const position = useSelector((state) => state.user.position);
  const addressError = useSelector((state) => state.user.error);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const isLoadingAddress = addressStatus === "loading";

  useEffect(() => {
    if (address) setAddressInput(address);
  }, [address]);

  if (!cart.length) return <EmptyCart />;

  return (
    <div>
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="post">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && (
            <p className="mt-2 rounded-md bg-red-100 text-xs text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow space-y-2">
            <input
              className="input w-full"
              type="text"
              name="address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              disabled={isLoadingAddress}
              required
            />
            <button
              type="button"
              className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium"
              disabled={isLoadingAddress}
              onClick={() => store.dispatch(fetchAddress())}
            >
              {isLoadingAddress ? "Getting position..." : "Get Position"}
            </button>
            {addressStatus === "error" && (
              <p className="rounded-md bg-red-100 text-xs text-red-700">
                {addressError}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position?.latitude && position?.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting} type="primary">
            {`Order ${totalItems} pizzas now (${formatCurrency(totalPrice)})`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      "PLEASE GIVE US YOUR CONTACT PHONE NUMBER. WE MIGHT NEED IT TO CONTACT YOU.";
  }
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
