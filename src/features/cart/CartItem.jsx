import PropTypes from "prop-types";
import { formatCurrency } from "../../utils/helpers";

function CartItem({ item }) {
  const { name, quantity, totalPrice } = item;

  return (
    <li className="flex items-center justify-between py-3 text-sm">
      <p>
        {quantity}&times; {name}
      </p>
      <div>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;
