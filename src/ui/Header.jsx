import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header>
      <Link to="/">SLICE CORE</Link>
      <SearchOrder />
      <p>sheharyar</p>
    </header>
  );
}

export default Header;
