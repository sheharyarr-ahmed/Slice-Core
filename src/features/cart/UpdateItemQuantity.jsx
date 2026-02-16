import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button type="small" onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>
        -
      </Button>
      <span>{currentQuantity}</span>
      <Button type="small" onClick={() => dispatch(increaseItemQuantity(pizzaId))}>
        +
      </Button>
    </div>
  );
}

UpdateItemQuantity.propTypes = {
  pizzaId: PropTypes.number.isRequired,
  currentQuantity: PropTypes.number.isRequired,
};

export default UpdateItemQuantity;
