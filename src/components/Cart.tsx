import React from 'react'
import CartItems from './CartItems'

//styles
import { Wrapper } from './Cart.Styles'

//types
import {CartItemType}  from '../App'

type Props = {
    cartItems : CartItemType[];
    addToCart : (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
}

const Cart : React.FC<Props> = ({cartItems ,addToCart , removeFromCart}) => {


    // get the total
    const calculateTotal = (items: CartItemType[]) => {
        return items.reduce((acc:number , item) => acc  + item.amount * item.price , 0)
    }


    return (
        <Wrapper>
            <h3>Your Chopping Cart</h3>
            {cartItems.length === 0 ? (<p>No Items in Cart</p>) : null}

            {
                cartItems.map(item => (
                    <CartItems 
                      key={item.id}
                      item={item}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                     />
                ))
            }
            <h2>
                Total : ${calculateTotal(cartItems).toFixed(2)}
            </h2>
        </Wrapper>
    )
}

export default Cart
