/* eslint-disable @next/next/no-img-element */
import styled from "@emotion/styled";
import {
  AutocompleteInput,
  CheckboxGroupInput,
  DateInput,
  List,
  RadioButtonGroupInput,
  ReferenceArrayInput,
  ReferenceInput,
  TextInput,
  useListContext,
} from "react-admin";
import { MaterialInput } from "../offcuts/Create";
import OffcutCard from "./OffcutCard";
import Cart from "./Cart";

const filters = [
  <TextInput key="q" label="Recherche" source="q" alwaysOn />,
  <ReferenceInput
    key="matter"
    source="matter"
    reference="matters"
    label="Matière"
    alwaysOn
  >
    <AutocompleteInput optionText="value" label="Matière" />
  </ReferenceInput>,
  <MaterialInput key="material" source="material" alwaysOn />,
  <ReferenceArrayInput
    key="sizes"
    source="sizes"
    reference="sizes"
    label="Taille"
    alwaysOn
  >
    <CheckboxGroupInput optionText="value" label="Taille" />
  </ReferenceArrayInput>,
  <ReferenceArrayInput
    key="colors"
    source="colors"
    reference="colors"
    label="Couleur"
    alwaysOn
  >
    <CheckboxGroupInput optionText="value" label="Couleur" />
  </ReferenceArrayInput>,
  <ReferenceInput
    key="quality"
    source="quality"
    reference="qualities"
    label="Qualité"
    alwaysOn
  >
    <RadioButtonGroupInput optionText="value" label="Qualité" />
  </ReferenceInput>,
];

const OffcutGridListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(345px, 345px));
  justify-content: flex-start;
  align-items: start;
  gap: 1rem;
`;

const OffcutGridList = () => {
  const { data } = useListContext();

  return (
    <OffcutGridListContainer>
      {data?.map((offcut: any) => (
        <OffcutCard key={offcut.id} offcut={offcut} />
      ))}
    </OffcutGridListContainer>
  );
};

const OffcutList = () => (
  <List
    filters={filters}
    sort={{ field: "createdAt", order: "DESC" }}
    component={"div"}
    aside={<Cart />}
    actions={false}
  >
    <OffcutGridList />
  </List>
);

export default OffcutList;
