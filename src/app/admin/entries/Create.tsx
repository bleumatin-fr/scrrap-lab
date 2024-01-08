import styled from "@emotion/styled";
import SaveIcon from "@mui/icons-material/Save";
import { CreateBase, SaveButton, SimpleForm } from "react-admin";
import GeneralInformationStep from "./GeneralInformationStep";
import OffcutStep from "./OffcutStep";
import TransportsStep from "./TransportsStep";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  gap: 1rem;
  width: 100%;
`;

const CreateWizard = () => {
  return (
    <Container>
      <GeneralInformationStep />
      <OffcutStep />
      <TransportsStep />
      <SaveButton
        label="Enregistrer"
        variant="contained"
        fullWidth
        icon={<SaveIcon />}
        size="large"
        color="primary"
      />
    </Container>
  );
};

const ModelCreate = () => {
  return (
    <CreateBase redirect="list">
      <SimpleForm toolbar={false} component={undefined}>
        <CreateWizard />
      </SimpleForm>
    </CreateBase>
  );
};
export default ModelCreate;
