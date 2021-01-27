import {useState} from 'react'
import {useQuery} from 'react-query'
//components
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'
import Cart from './components/Cart'
import Item from './components/Item';
//Styles
import { Wrapper, StyledButton} from './App.styles';



//Types
export type CartItemType = {
    id:number;
    category: string;
    description:string;
    image:string;
    price:number;
    title:string;
    amount: number;
}

// Retrieve data from the Api
const getProducts =  async() : Promise<CartItemType[]> => {
     return await (await fetch('https://fakestoreapi.com/products')).json()
}



const App = () => {

  //State
  const [cartOpen , setCartOpen] = useState(false)
  const [cartItems , setCartItems] = useState([] as CartItemType[]);


  // destructuring from our getProducts using react-query
  const { data, isLoading, error } = useQuery<CartItemType[]>('products' , getProducts)


// functions


  const getTotalItems = (items:CartItemType[]) =>{
   return items.reduce((ac:number , item) => ac + item.amount , 0)
  } 


  const handleAddToCart = (clickedItem :CartItemType) => {
     
    setCartItems(prev => {

      //1-is the item already in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if(isItemInCart){
        return prev.map(item => item.id === clickedItem.id ? {...item , amount: item.amount + 1} : item)
      }

      //2-first time the item is added
      return [...prev , {...clickedItem , amount: 1}]
    })
  }


  const handleRemoveFromCart = (id: number) => {
      setCartItems(prev => (
        prev.reduce((acc , item) => {
          if(item.id === id) {
            if(item.amount === 1) return acc
            return [...acc , {...item , amount : item.amount - 1}]
          }else{
            return [...acc , item ]
          }
        }, [] as CartItemType[])
      ))
  }



  if(isLoading) return <LinearProgress/>
  if(error) return <p>Something went wrong...</p>

  return (
   
        <Wrapper>
          <Drawer 
            anchor="right" 
            open={cartOpen} 
            onClose={() => setCartOpen(false)}>
           <Cart  
              cartItems={cartItems} 
              addToCart={handleAddToCart} 
              removeFromCart={handleRemoveFromCart}  />
            </Drawer>
           <StyledButton  onClick={() => setCartOpen(true)}>
            <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                <AddShoppingCartIcon/>
            </Badge>
         </StyledButton>
            <Grid container spacing={3}>
                {data?.map(item => (
                   <Grid item key={item.id} xs={12} sm={4} >
                     <Item item={item} handleAddToCart={handleAddToCart}   />
                   </Grid>
                ))}
            </Grid>
        </Wrapper>
  )
}

export default App
