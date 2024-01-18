/* eslint-disable @next/next/no-img-element */
import styled from "@emotion/styled";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { MouseEvent, useRef, useState } from "react";
import {
  EditButton,
  ReferenceArrayField,
  ReferenceField,
  ShowButton,
  useRedirect,
  useStore,
} from "react-admin";
import Lightbox, { ThumbnailsRef } from "yet-another-react-lightbox";
import { Counter, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { CartItem } from "../entries/CartItem";

import "yet-another-react-lightbox/plugins/counter.css";

const CardMediaContainer = styled.div`
  position: relative;
  max-height: 200px;
  overflow: hidden;
`;

const CardWeightContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const OffcutCard = ({ offcut }: { offcut: any }) => {
  const redirect = useRedirect();
  const thumbnailsRef = useRef<ThumbnailsRef>(null);
  const [picturesOpen, setPicturesOpen] = useState(false);
  const [cart, setCart] = useStore<CartItem[]>("cart", []);

  const handleAddToCartClicked = (offcut: any) => (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (cart.find((item) => item.offcut.id === offcut.id)) {
      return;
    }
    setCart([...cart, { offcut, quantity: 0 }]);
  };

  return (
    <>
      <Lightbox
        open={picturesOpen}
        plugins={[Thumbnails, Counter]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        thumbnails={{ ref: thumbnailsRef }}
        on={{
          click: () => {
            (thumbnailsRef.current?.visible
              ? thumbnailsRef.current?.hide
              : thumbnailsRef.current?.show)?.();
          },
        }}
        close={() => setPicturesOpen(false)}
        slides={offcut.pictures}
      />
      <Card
        key={offcut.id}
        onClick={(e) => {
          e.preventDefault();
          redirect("show", "offcuts", offcut.id);
        }}
        sx={{
          maxWidth: 345,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {offcut.pictures && offcut.pictures.length > 0 && (
          <CardMediaContainer>
            <img
              loading="lazy"
              src={offcut.pictures[0].src}
              alt={offcut.name}
              style={{
                objectFit: "cover",
              }}
            />

            <Chip
              label={`${offcut.pictures.length} photo${
                offcut.pictures.length > 1 ? "s" : ""
              }`}
              size="small"
              icon={<CropOriginalIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPicturesOpen(true);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                opacity: 1,
                backgroundColor: "rgba(255, 255, 255, 1)",
              }}
            />
          </CardMediaContainer>
        )}

        <CardContent
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              position: "relative",
            }}
          >
            {offcut.name}
            <CardWeightContainer>
              <Chip
                label={
                  <Typography variant="caption">
                    {offcut.quantity} kg
                  </Typography>
                }
                size="small"
              />
            </CardWeightContainer>
          </Typography>
          {(offcut.matter || offcut.material) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 60 }}
              >
                Matière
              </Typography>
              {offcut.matter && (
                <Chip
                  label={
                    <ReferenceField
                      source="matter"
                      reference="matters"
                      label="Matière"
                      record={offcut}
                    />
                  }
                  size="small"
                />
              )}
              {offcut.material && (
                <Chip
                  label={
                    <ReferenceField
                      source="material"
                      reference="materials"
                      label="Matériaux"
                      record={offcut}
                    />
                  }
                  size="small"
                />
              )}
            </Typography>
          )}
          {offcut.colors && offcut.colors.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 60 }}
              >
                Couleur
              </Typography>
              <ReferenceArrayField
                source="colors"
                reference="colors"
                label="Couleur"
                record={offcut}
                sx={{ display: "inline-block" }}
              />
            </Typography>
          )}
          {offcut.sizes && offcut.sizes.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 60 }}
              >
                Taille
              </Typography>
              <ReferenceArrayField
                source="sizes"
                reference="sizes"
                label="Taille"
                record={offcut}
                sx={{ display: "inline-block" }}
              />
            </Typography>
          )}
          {offcut.quality && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 60 }}
              >
                État
              </Typography>
              <Chip
                label={
                  <ReferenceField
                    source="quality"
                    reference="qualities"
                    label="Qualité"
                    record={offcut}
                  />
                }
                size="small"
              />
            </Typography>
          )}
          {offcut.description && (
            <>
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 60 }}
              >
                Cartel
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  "> p": {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: offcut.description,
                }}
              ></Typography>
            </>
          )}
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            size="small"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCartClicked(offcut)}
            fullWidth
          >
            Ajouter au panier
          </Button>
        </CardActions>
        <CardActions
          sx={{
            justifyContent: "space-evenly",
            "> *": {
              flexGrow: 1,
            },
          }}
        >
          <ShowButton record={offcut} />
          <EditButton record={offcut} />
        </CardActions>
      </Card>
    </>
  );
};

export default OffcutCard;
