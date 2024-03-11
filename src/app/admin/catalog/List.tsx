import styled from "@emotion/styled";
import {
  AutocompleteInput,
  Filter,
  List,
  ReferenceArrayInput,
  ReferenceInput,
  TextInput,
  useListContext
} from "react-admin";
import { MaterialInput } from "../offcuts/Create";
import Cart from "./Cart";
import DeleteFiltersButton from "./DeleteFiltersButton";
import OffcutCard from "./OffcutCard";

const FiltersContainer = styled.div`
  width: 100%;
  position: sticky;
`;

const DeleteFilterButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 15px;
`;

const Filters = (props: any) => {
  return (
    <FiltersContainer>
      <Filter {...props}>
        <TextInput
          key="q"
          label="Rechercher par nom, référence ou mot clé dans le cartel..."
          source="q"
          alwaysOn
          fullWidth
        />
        <ReferenceInput
          key="matter"
          source="matter"
          reference="matters"
          label="Matière"
          alwaysOn
        >
          <AutocompleteInput optionText="value" label="Matière" fullWidth />
        </ReferenceInput>
        <MaterialInput
          key="material"
          source="material"
          alwaysOn
          label="Matériau"
          fullWidth
        />
        <ReferenceArrayInput
          key="sizes"
          source="sizes"
          reference="sizes"
          label="Taille"
          alwaysOn
        >
          <AutocompleteInput optionText="value" label="Taille" fullWidth />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          key="colors"
          source="colors"
          reference="colors"
          label="Couleur"
          alwaysOn
        >
          <AutocompleteInput optionText="value" label="Couleur" fullWidth />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          key="qualities"
          source="qualities"
          reference="qualities"
          label="Qualité"
          alwaysOn
        >
          <AutocompleteInput
            optionText="value"
            label="Qualité"
            fullWidth
            sx={{
              marginRight: "50px",
            }}
          />
        </ReferenceArrayInput>
      </Filter>
      <DeleteFilterButtonContainer>
        <DeleteFiltersButton />
      </DeleteFilterButtonContainer>
    </FiltersContainer>
  );
};

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
    filters={<Filters />}
    sort={{ field: "createdAt", order: "DESC" }}
    component={"div"}
    aside={<Cart />}
    actions={false}
    sx={{
      "[data-source]": {
        flexGrow: 1,
      },
      "[data-source=q]": {
        width: "100%",
      },
    }}
  >
    <OffcutGridList />
  </List>
);

export default OffcutList;
