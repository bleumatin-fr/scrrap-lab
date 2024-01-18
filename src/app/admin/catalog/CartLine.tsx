/* eslint-disable @next/next/no-img-element */
import { CartItem } from "../entries/CartItem";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import { ChangeEvent } from "react";

const CartLineContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-top: 1rem;
`;

const PictureContainer = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 5px;
  flex-shrink: 0;
  margin-top: 10px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CartLine = ({
  item,
  onRemove,
  onChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onChange: (quantity: number) => void;
}) => {
  return (
    <CartLineContainer>
      <PictureContainer>
        {item.offcut.pictures[0] && (
          <img
            loading="lazy"
            src={item.offcut.pictures[0].src}
            alt={item.offcut.pictures[0].alt}
            width="50px"
          />
        )}
      </PictureContainer>
      <div>
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.5rem",
          }}
        >
          {item.offcut.reference}
        </Typography>
        <Typography variant="body2">{item.offcut.name}</Typography>
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <div
        style={{
          marginTop: 15,
        }}
      >
        <TextField
          label="Quantité"
          type="number"
          value={item.quantity}
          variant="outlined"
          sx={{
            maxWidth: "100px",
            minWidth: "100px",
            width: "100px",
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(parseFloat(e.target.value))
          }
        />
      </div>
      <CloseIcon
        style={{
          cursor: "pointer",
          marginTop: 22,
        }}
        onClick={onRemove}
      />
    </CartLineContainer>
  );
};

export default CartLine;
