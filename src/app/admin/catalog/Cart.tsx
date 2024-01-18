import styled from "@emotion/styled";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent } from "@mui/material";
import { useCreate, useNotify, useRefresh, useStore } from "react-admin";
import { CartItem } from "../entries/CartItem";
import CartLine from "./CartLine";

const ActionsContainer = styled.div`
  margin-top: 2rem;
`;

const Cart = () => {
  const [cart, setCart] = useStore<CartItem[]>("cart", []);
  const refresh = useRefresh();
  const notify = useNotify();
  const [create, { isLoading, error }] = useCreate(
    "exits",
    {
      data: {
        date: new Date(),
        offcuts: cart,
      },
    },
    {
      onSuccess: () => {
        notify(`Commande passée`, { type: "success" });
        setCart([]);
        refresh();
      },
      onError: (e) => {
        notify(`Erreur lors de la commande`, { type: "error" });
        console.log("ERROR", e);
      },
    }
  );

  const displayCart = cart.length > 0;

  const handleResetClicked = () => {
    setCart([]);
  };

  const handleSaveClicked = () => {
    create("exits", {
      data: {
        date: new Date(),
        offcuts: cart,
      },
    });
  };

  const handleLineRemovedClicked = (id: string) => () => {
    setCart(cart.filter((item) => item.offcut.id !== id));
  };

  const handleLineQuantityChanged = (id: string) => (quantity: number) => {
    setCart(
      cart.map((item) => (item.offcut.id === id ? { ...item, quantity } : item))
    );
  };

  return (
    <Card
      sx={{
        minWidth: displayCart ? 345 : 0,
        width: displayCart ? 345 : 0,
        transition: "all 0.5s",
      }}
    >
      <CardContent
        sx={{
          position: "fixed",
          height: "calc(100vh - 64px)",
          width: "345px",
        }}
      >
        <h2>
          <ShoppingCartIcon /> Panier
        </h2>
        {cart.map((item) => (
          <CartLine
            key={item.offcut.id}
            item={item}
            onRemove={handleLineRemovedClicked(item.offcut.id)}
            onChange={handleLineQuantityChanged(item.offcut.id)}
          />
        ))}
        <ActionsContainer>
          <LoadingButton
            startIcon={<ShoppingCartIcon />}
            onClick={handleSaveClicked}
            size="small"
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            Commander
          </LoadingButton>
          <Button
            onClick={handleResetClicked}
            size="small"
            variant="text"
            fullWidth
            disabled={isLoading}
          >
            Annuler
          </Button>
        </ActionsContainer>
      </CardContent>
    </Card>
  );
};

export default Cart;
