import { Header } from "@/components/Header";
import { ShoppingCart, Utensils } from "lucide-react";
import { Link } from "react-router";
import "./SelectUserType.css";

function SelectUserType() {
  return (
    <>
      <Header title="Select User Type" />

      <main className="select-page">
        <section className="select-option">
          {/* We don't have real images yet, so an icon fills the image spot from the wireframe */}
          <div className="select-image" aria-hidden="true">
            <ShoppingCart size={72} />
          </div>
          <Link to="/marketplace" className="select-button">
            Buy Swipes
          </Link>
        </section>

        <section className="select-option">
          <div className="select-image" aria-hidden="true">
            <Utensils size={72} />
          </div>
          <Link to="/my-listings" className="select-button">
            Sell Swipes
          </Link>
          <Link to="/my-listings" className="select-button secondary-button">
            My Listings
          </Link>
        </section>
      </main>
    </>
  );
}

export default SelectUserType;
