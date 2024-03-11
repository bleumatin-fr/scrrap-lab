import { ResourceProps } from "react-admin";

const withPermissions =
  (component: ResourceProps) => (permissions: string[]) => {
    const componentKeys = Object.keys(component) as (keyof ResourceProps)[];
    return componentKeys.reduce((acc: Partial<ResourceProps>, key) => {
      switch (key) {
        case "edit":
        case "list":
        case "create":
          if (
            permissions.includes(
              `${component.name}.${component.options?.permissionKey || key}`
            ) ||
            permissions.includes(
              `${component.name}.${component.options?.permissionKey || key}-own`
            )
          ) {
            acc[key] = component[key];
          }
          return acc;
        default:
          return {
            ...acc,
            [key]: component[key],
          };
      }
    }, {}) as ResourceProps;
  };

export default withPermissions;
