/* eslint-disable @next/next/no-img-element */
import { CartItem } from "../entries/CartItem";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { TextField, Typography, TextFieldProps } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { NumberInput } from "react-admin";
import WeightField from "../WeightField";

const CartLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-top: 1rem;

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;

    &:nth-of-type(2) {
      margin-left: 60px;
    }
  }
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
      <div>
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
        <div style={{ flexGrow: 1 }}>
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
      </div>
      <div>
        <div
          style={{
            marginTop: 15,
          }}
        >
          <WeightField
            label="Poids"
            value={item.quantity}
            variant="outlined"
            sx={{
              maxWidth: "100px",
              minWidth: "100px",
              width: "100px",
            }}
            onChange={(value: number) => {
              onChange(value);
            }}
          />
        </div>
        <CloseIcon
          style={{
            cursor: "pointer",
            marginTop: 22,
          }}
          onClick={onRemove}
        />
      </div>
    </CartLineContainer>
  );
};

export default CartLine;
