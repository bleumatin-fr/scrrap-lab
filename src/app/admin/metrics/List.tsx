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

const startOfYear = new Date(new Date().getFullYear(), 0, 1);
const today = new Date();

const Actions = () => {
  const { data } = useListContext();

  const handleClick = () => {
    if (!process.env.NEXT_PUBLIC_CALCULATOR_URL) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_CALCULATOR_URL is not set"
      );
    }
    const url = data.reduce((url: URL, metric) => {
      url.searchParams.append(metric.id, metric.value);
      return url;
    }, new URL(process.env.NEXT_PUBLIC_CALCULATOR_URL));

    // window.open(url, "_blank");

    console.log(url);
  };

  return (
    <Button
      startIcon={<AddLinkIcon />}
      onClick={handleClick}
      sx={{
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
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
      <TextField source="category" />
      <TextField source="id" />
      <NumberField source="value" />
    </Datagrid>
  </List>
);

export default MetricsList;
