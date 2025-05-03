// @ts-nocheck
import React, { useState,  useReducer, useContext } from "react";
// import { CartContext } from "../../../contextproviders/Cartcontext";
import { loadingReducer, initialState } from "../../reducers/reducers";
import Spinner from "../../Spinner";
import { CartContext } from "../../../contextproviders/Cartcontext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contextproviders/Authcontext";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



const MenuItem = ({ item, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loadingState, dispatch] = useReducer(loadingReducer, initialState);
  const { cartItems } = useContext(CartContext)
  const { authState } = useContext(AuthContext)

  const navigate = useNavigate();

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((opt) => opt !== option)
        : [...prev, option]
    );
  };

  const isMenuItemInCart = (id) => {
    return cartItems.find((item) => item.menuitem_id === id);
  }

  const handleAddToCart = async (e) => {
   if (e.target.textContent === 'Add to Cart') {
    dispatch({ type: 'LOADING' });
    const res = await onAddToCart(item, selectedOptions)
    if (res.error) {
      dispatch({ type: 'ERROR', payload: res.message });
    } else {
      dispatch({ type: 'SUCCESS' });
    }
  } else {
    navigate(`/users/${authState.user.user_id}/cart`)
  }
  };

  return (
    <div className="mx-auto w-2/3">
     <Card className="overflow-scroll">
      <CardMedia
        component="img"
        alt="green iguana"
        image={item.image_url}
        className="h-40"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
         {item.name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
         Price: GH₵ {item.price}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <div className="my-4">
        <p className="font-semibold">Extra Toppings:</p>
        {item.extra_toppings.map((option) => (
          <label key={option} className="block">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      {selectedOptions.length > 0 && (
        <div className="my-4">
          <p className="font-semibold">Selected Options:</p>
          <ul className="list-disc ml-6">
            {selectedOptions.map((opt) => (
              <li key={opt}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
      </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">
        <button
            disabled={loadingState.loading}
            onClick={ handleAddToCart}
            className={`${loadingState.loading ? "bg-gray-300" : "bg-secondary-color"} text-white px-4 py-2 rounded min-w-20`}
          >
            {(() => {
          switch (loadingState.success) {
            case true:
              return 'Go to Cart';
            case false:
              return  loadingState.loading ? <Spinner /> : isMenuItemInCart(item.menuitem_id) ? 'Go to Cart' : 'Add to Cart';
            default:
              return  'Go to Cart';
          }
          })()}
          </button>
        </Button>
      </CardActions>
     </Card>
    </div>
  );
};


export default MenuItem;
