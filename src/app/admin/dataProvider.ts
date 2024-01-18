import jsonServerProvider from "ra-data-json-server";
import {
  CreateParams,
  DataProvider,
  UpdateParams,
  fetchUtils,
} from "react-admin";

export const endpoint = "/api";

const baseDataProvider = jsonServerProvider(endpoint);

type PostParams = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  matter: string;
  material: string;
  sizes: string[];
  colors: string[];
  quality: string;
  reference: string;
  audience: string;
  brandPolicy: string;
  source: string;
  pictures: {
    rawFile: File;
    src?: string;
    title?: string;
  }[];
};

const createOffcutsPostData = (
  params: CreateParams<PostParams> | UpdateParams<PostParams>
) => {
  const formData = new FormData();
  params.data.name && formData.append("name", params.data.name);
  params.data.description &&
    formData.append("description", params.data.description);
  params.data.quantity &&
    formData.append("quantity", params.data.quantity.toString());
  params.data.matter && formData.append("matter", params.data.matter);
  params.data.material && formData.append("material", params.data.material);
  params.data.sizes &&
    params.data.sizes.forEach((sizes) => formData.append(`sizes`, sizes));
  params.data.colors &&
    params.data.colors.forEach((colors) => formData.append(`colors`, colors));
  params.data.quality && formData.append("quality", params.data.quality);
  params.data.reference && formData.append("reference", params.data.reference);
  params.data.audience && formData.append("audience", params.data.audience);
  params.data.brandPolicy &&
    formData.append("brandPolicy", params.data.brandPolicy);
  params.data.source && formData.append("source", params.data.source);
  params.data.pictures &&
    params.data.pictures.forEach((picture) => {
      if (!picture.rawFile) {
        formData.append(`pictures`, JSON.stringify(picture));
        return;
      }
      formData.append(`pictures`, picture.rawFile);
    });
  return formData;
};

export const dataProvider: DataProvider = {
  ...baseDataProvider,
  create: (resource, params) => {
    if (resource === "offcuts") {
      const formData = createOffcutsPostData(params);
      return fetchUtils
        .fetchJson(`${endpoint}/${resource}`, {
          method: "POST",
          body: formData,
        })
        .then(({ json }) => ({ data: json }));
    }

    return baseDataProvider.create(resource, params);
  },
  update: (resource, params) => {
    if (resource === "offcuts") {
      const formData = createOffcutsPostData(params);
      formData.append("id", params.id);
      return fetchUtils
        .fetchJson(`${endpoint}/${resource}/${params.id}`, {
          method: "PUT",
          body: formData,
        })
        .then(({ json }) => ({ data: json }));
    }

    return baseDataProvider.update(resource, params);
  },
};

export default dataProvider;
