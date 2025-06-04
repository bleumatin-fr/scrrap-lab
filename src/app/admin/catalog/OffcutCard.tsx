/* eslint-disable @next/next/no-img-element */
import styled from "@emotion/styled";
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
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
  usePermissions,
  useStore,
} from "react-admin";
import Lightbox, { ThumbnailsRef } from "yet-another-react-lightbox";
import { Counter, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { CartItem } from "../entries/CartItem";

import "yet-another-react-lightbox/plugins/counter.css";
import ShoppingCart from "../ui/ShoppingCart";

const CardMediaContainer = styled.div`
  position: relative;
  max-height: 200px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: #eee;

  & img {
    transition: transform 0.5s;
  }

  &:hover {
    & img {
      transform: scale(1.1);
    }
  }
`;

const CardWeightContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const OffcutCard = ({ offcut }: { offcut: any }) => {
  const thumbnailsRef = useRef<ThumbnailsRef>(null);
  const [picturesOpen, setPicturesOpen] = useState(false);
  const [cart, setCart] = useStore<CartItem[]>("cart", []);
  const { permissions } = usePermissions();

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
      {offcut.pictures && offcut.pictures.length > 0 && (
        <Lightbox
          open={picturesOpen}
          plugins={[Thumbnails, Counter]}
          counter={{ container: { style: { top: "unset", bottom: 0 } } }}
          thumbnails={{ ref: thumbnailsRef }}
          controller={{
            closeOnBackdropClick: true,
            closeOnPullDown: true,
          }}
          on={{
            click: () => {
              (thumbnailsRef.current?.visible
                ? thumbnailsRef.current?.hide
                : thumbnailsRef.current?.show)?.();
            },
          }}
          close={() => setPicturesOpen(false)}
          slides={offcut.pictures.map((picture: any) => ({
            ...picture,
            src: `/scrrap-lab${picture.src}`,
          }))}
        />
      )}
      <Card
        key={offcut.id}
        sx={{
          maxWidth: 345,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {offcut.pictures && offcut.pictures.length > 0 && (
          <CardMediaContainer
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPicturesOpen(true);
            }}
          >
            <img
              loading="lazy"
              src={`/scrrap-lab${offcut.pictures[0].src}`}
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

        {!offcut.pictures ||
          (offcut.pictures.length === 0 && (
            <CardMediaContainer>
              <img
                loading="lazy"
                src={"/scrrap-lab/image-placeholder.svg"}
                alt=""
                style={{
                  width: "102%",
                  marginLeft: "-1%",
                  marginTop: "-1%",
                }}
              />
            </CardMediaContainer>
          ))}

        <CardContent
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            {offcut.reference}
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              position: "relative",
              paddingRight: "60px",
            }}
          >
            {offcut.name}
            <CardWeightContainer>
              <Chip
                label={
                  <Typography variant="caption">
                    {(offcut.quantity / 1000).toFixed(3)} kg
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
                sx={{ display: "inline-block", width: 80 }}
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
                      link={
                        permissions.includes("matters.edit") ? "edit" : false
                      }
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
                      label="Matériau"
                      record={offcut}
                      link={
                        permissions.includes("materials.edit") ? "edit" : false
                      }
                    />
                  }
                  size="small"
                />
              )}
            </Typography>
          )}
          {offcut.source && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 80 }}
              >
                Provenance
              </Typography>
              <TextField source="source" label="Provenance" record={offcut} />
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
                sx={{ display: "inline-block", width: 80 }}
              >
                Couleur
              </Typography>
              <ReferenceArrayField
                source="colors"
                reference="colors"
                label="Couleur"
                record={offcut}
                sx={{ display: "inline-block" }}
              >
                <SingleFieldList
                  linkType={
                    permissions.includes("colors.edit") ? "edit" : false
                  }
                />
              </ReferenceArrayField>
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
                sx={{ display: "inline-block", width: 80 }}
              >
                Taille
              </Typography>
              <ReferenceArrayField
                source="sizes"
                reference="sizes"
                label="Taille"
                record={offcut}
                sx={{ display: "inline-block" }}
              >
                <SingleFieldList
                  linkType={permissions.includes("sizes.edit") ? "edit" : false}
                />
              </ReferenceArrayField>
            </Typography>
          )}
          {offcut.qualities && offcut.qualities.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 80 }}
              >
                État
              </Typography>
              <ReferenceArrayField
                source="qualities"
                reference="qualities"
                label="Qualité"
                record={offcut}
                sx={{ display: "inline-block" }}
              >
                <SingleFieldList
                  linkType={
                    permissions.includes("qualities.edit") ? "edit" : false
                  }
                />
              </ReferenceArrayField>
            </Typography>
          )}
          {offcut.brandPolicy && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 80 }}
              >
                Exploitation
              </Typography>
              <Chip
                label={
                  <ReferenceField
                    source="brandPolicy"
                    reference="brandPolicies"
                    label="Exploitation"
                    record={offcut}
                    link={
                      permissions.includes("brandPolicies.edit")
                        ? "edit"
                        : false
                    }
                  />
                }
                size="small"
              />
            </Typography>
          )}
          {offcut.audiences && permissions.includes("catalog.see-audience") && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 80 }}
              >
                Destinataires
              </Typography>
              <ReferenceArrayField
                source="audiences"
                reference="audiences"
                label="Destinataires"
                record={offcut}
                sx={{ display: "inline-block" }}
              />
            </Typography>
          )}
          {offcut.description && (
            <>
              <Typography
                variant="caption"
                sx={{ display: "inline-block", width: 80 }}
              >
                Cartel
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component={"div"}
                title={offcut.description.replace(/(<([^>]+)>)/gi, "")}
                sx={{
                  width: "313px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "initial",
                  display: "-webkit-box",
                  wordWrap: "break-word",
                  WebkitBoxOrient: "vertical",
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
            startIcon={<ShoppingCart />}
            onClick={handleAddToCartClicked(offcut)}
            fullWidth
            color="primary"
          >
            Ajouter au panier
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default OffcutCard;
