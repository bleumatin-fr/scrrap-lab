import jsonServerProvider from "ra-data-json-server";
import {
  CreateParams,
  DataProvider as BaseDataProvider,
  UpdateParams,
  fetchUtils,
  Identifier,
} from "react-admin";
import httpClient from "./httpClient";

export interface DataProvider extends BaseDataProvider {
  validateExit: (exitId: Identifier) => Promise<any>;
  importUsers: (formData: FormData) => Promise<any>;
}

type PostParams = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  matter: string;
  material: string;
  sizes: string[];
  colors: string[];
  qualities: string[];
  reference: string;
  audiences: string[];
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
  params.data.qualities &&
    params.data.qualities.forEach((qualities) =>
      formData.append(`qualities`, qualities)
    );
  params.data.reference && formData.append("reference", params.data.reference);
  params.data.audiences &&
    params.data.audiences.forEach((audiences) =>
      formData.append(`audiences`, audiences)
    );
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

export const dataProviderFactory: (
  endpoint: string | undefined
) => DataProvider = (endpoint: string | undefined) => {
  const baseDataProvider = jsonServerProvider(endpoint, httpClient);
  return {
    ...baseDataProvider,
    create: (resource, params) => {
      if (resource === "offcuts") {
        const formData = createOffcutsPostData(params);
        return httpClient(`${endpoint}/${resource}`, {
          method: "POST",
          body: formData,
          headers: new Headers({}),
        }).then(({ json }) => ({ data: json }));
      }

      return baseDataProvider.create(resource, params);
    },
    update: (resource, params) => {
      if (resource === "offcuts") {
        const formData = createOffcutsPostData(params);
        formData.append("id", params.id);
        return httpClient(`${endpoint}/${resource}/${params.id}`, {
          method: "PUT",
          body: formData,
          headers: new Headers({}),
        }).then(({ json }) => ({ data: json }));
      }

      return baseDataProvider.update(resource, params);
    },
    validateExit: (exitId: Identifier) => {
      return httpClient(`${endpoint}/exits/${exitId}/validate`, {
        method: "POST",
        body: "",
      });
    },
    importUsers: (formData: FormData) => {
      return httpClient(`${endpoint}/users/import`, {
        method: "POST",
        headers: new Headers({}),
        body: formData,
      });
    },
  };
};

export default dataProviderFactory;
