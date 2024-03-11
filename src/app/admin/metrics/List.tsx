import { Button } from "@mui/material";
import {
  Datagrid,
  DateInput,
  List,
  NumberField,
  TextField,
  useListContext,
} from "react-admin";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { env } from "next-runtime-env";

const startOfYear = new Date(new Date().getFullYear(), 0, 1);
const today = new Date();

const Actions = () => {
  const { data } = useListContext();

  const handleClick = () => {
    if (!env("NEXT_PUBLIC_CALCULATOR_URL")) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_CALCULATOR_URL is not set"
      );
    }

    const values = data.reduce((values, metric) => {
      return [
        ...values,
        {
          type: "id",
          id: metric.id,
          value: metric.value,
        },
      ];
    }, []);

    const url = `${env(
      "NEXT_PUBLIC_CALCULATOR_URL"
    )}/project?values=${JSON.stringify(values)}&type=${env(
      "NEXT_PUBLIC_CALCULATOR_PROJECT_TYPE"
    )}`;

    window.open(url, "_blank");
  };

  return (
    <Button
      startIcon={<AddLinkIcon />}
      onClick={handleClick}
      sx={{
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      size="small"
    >
      Créer nouveau calcul
    </Button>
  );
};

const filters = [
  <DateInput key="start" source="start" label="De" alwaysOn />,
  <DateInput key="end" source="end" label="À" alwaysOn />,
];

const MetricsList = () => (
  <List
    filters={filters}
    sort={{ field: "id", order: "ASC" }}
    filterDefaultValues={{
      start: startOfYear,
      end: today,
    }}
    pagination={false}
    perPage={1000}
    actions={<Actions />}
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="category" label="Catégorie" />
      <TextField source="id" label="Identifiant" />
      <NumberField source="value" label="Valeur" />
      <TextField source="unit" label="Unité" />
    </Datagrid>
  </List>
);

export default MetricsList;
