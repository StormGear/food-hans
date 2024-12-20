import React from "react";
import axios from "axios";
import baseUrl from "../../../constants";
import { useEffect } from "react";
import MenuItem from "./MenuItem";
import { useContext } from "react";
import { MenuContext } from "../../../contextproviders/Menucontext";
import { CartContext } from "../../../contextproviders/Cartcontext";
// import { AuthContext } from "../../../contextproviders/Authcontext";

const Menu = () => {
  const { menuItems, setMenuItems } = useContext(MenuContext);
  const {  addToCart } = useContext(CartContext);
  // const { authState } = useContext(AuthContext)

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/menuitems`)
        const data = await response.data;
        setMenuItems((prev) => [...data]);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [setMenuItems]);

  return (

      <div className="p-4 grid grid-cols-3 gap-3">
        {menuItems.map((item) => (
          <MenuItem key={item.menuitem_id} item={item} onAddToCart={addToCart} />
        ))}
      </div>
  );
};

export default Menu;
