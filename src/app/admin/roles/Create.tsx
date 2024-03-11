import availableActions from "@/app/api/roles/availableActions";
import styled from "@emotion/styled";
import { CheckboxGroupInput, Create, SimpleForm, TextInput } from "react-admin";

const ActionsContainer = styled.div`
  > fieldset > div {
    flex-direction: column;
  }
`;

export const Fields = () => {
  return (
    <>
      <TextInput source="name" />
      <ActionsContainer>
        <CheckboxGroupInput
          source="actions"
          choices={availableActions.map((action) => ({
            id: action,
            name: action,
          }))}
        />
      </ActionsContainer>
    </>
  );
};

const RoleCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Create>
);

export default RoleCreate;
