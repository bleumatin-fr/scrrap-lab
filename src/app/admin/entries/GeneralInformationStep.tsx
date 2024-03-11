import { Card, CardContent, Typography } from "@mui/material";
import { DateInput, required } from "react-admin";

const GeneralInformationStep = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Entrée de chutes
        </Typography>
        <DateInput
          label="Date"
          source="date"
          defaultValue={new Date()}
          validate={required()}
        />
      </CardContent>
    </Card>
  );
};

export default GeneralInformationStep;
