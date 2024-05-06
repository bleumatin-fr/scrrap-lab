/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useRecordContext, useTranslate } from "ra-core";
import { TableCellProps } from "@mui/material/TableCell";
import { SxProps } from "@mui/system";
import { sanitizeFieldRestProps, FieldProps } from "react-admin";
import { PropertyPath } from "lodash";

type TextAlign = TableCellProps["align"];
type SortOrder = "ASC" | "DESC";

const fieldPropTypes = {
  sortBy: PropTypes.string,
  sortByOrder: PropTypes.oneOf<SortOrder>(["ASC", "DESC"]),
  source: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.bool,
  ]),
  sortable: PropTypes.bool,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  textAlign: PropTypes.oneOf<TextAlign>([
    "inherit",
    "left",
    "center",
    "right",
    "justify",
  ]),
  emptyText: PropTypes.string,
};

export const ImageField = <
  RecordType extends Record<string, any> = Record<string, any>
>(
  props: ImageFieldProps<RecordType>
) => {
  const { className, emptyText, source, src, title, ...rest } = props;
  const record = useRecordContext(props);
  const sourceValue = get(record, source as PropertyPath);
  const translate = useTranslate();

  if (!sourceValue) {
    return emptyText ? (
      <Typography
        component="span"
        variant="body2"
        className={className}
        {...sanitizeFieldRestProps(rest)}
      >
        {emptyText && translate(emptyText, { _: emptyText })}
      </Typography>
    ) : (
      <Typography
        component="div"
        className={className}
        {...sanitizeFieldRestProps(rest)}
      />
    );
  }

  if (Array.isArray(sourceValue)) {
    return (
      <Root className={className} {...sanitizeFieldRestProps(rest)}>
        <ul className={ImageFieldClasses.list}>
          {sourceValue.map((file, index) => {
            const fileTitleValue = get(file, title as PropertyPath) || title;
            const srcValue = get(file, src as PropertyPath) || title;

            return (
              <li key={index}>
                <img
                  alt={fileTitleValue}
                  title={fileTitleValue}
                  src={
                    srcValue.startsWith("/api/images")
                      ? `/scrrap-lab${srcValue}`
                      : srcValue
                  }
                  className={ImageFieldClasses.image}
                />
              </li>
            );
          })}
        </ul>
      </Root>
    );
  }

  const titleValue =
    get(record, title as PropertyPath, "")?.toString() || title;

  return (
    <Root className={className} {...sanitizeFieldRestProps(rest)}>
      <img
        title={titleValue}
        alt={titleValue}
        src={
          sourceValue?.toString().startsWith("/api/images")
            ? `/scrrap-lab${sourceValue?.toString()}`
            : sourceValue?.toString()
        }
        className={ImageFieldClasses.image}
      />
    </Root>
  );
};

// What? TypeScript loses the displayName if we don't set it explicitly
ImageField.displayName = "ImageField";

ImageField.propTypes = {
  ...fieldPropTypes,
  src: PropTypes.string,
  title: PropTypes.string,
};

const PREFIX = "RaImageField";

export const ImageFieldClasses = {
  list: `${PREFIX}-list`,
  image: `${PREFIX}-image`,
};

const Root = styled(Box, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})({
  [`& .${ImageFieldClasses.list}`]: {
    display: "flex",
    listStyleType: "none",
  },
  [`& .${ImageFieldClasses.image}`]: {
    margin: "0.25rem",
    width: 200,
    height: 100,
    objectFit: "contain",
  },
});

export interface ImageFieldProps<
  RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
  src?: string;
  title?: string;
  sx?: SxProps;
}
