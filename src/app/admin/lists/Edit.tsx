import {
  AutocompleteInput,
  CheckboxGroupInput,
  DateInput,
  Edit,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  SimpleForm,
  TextInput,
  useResourceDefinition,
} from "react-admin";

const ListEdit = () => {
  const resource = useResourceDefinition();

  return (
    <Edit redirect="list" title="Modifier">
      <SimpleForm>
        <TextInput source="key" />
        <TextInput source="value" />
        <NumberInput source="order" />
        {Array.isArray(resource.options.availableTags) &&
          resource.options.availableTags.length > 0 && (
            <CheckboxGroupInput
              source="tags"
              choices={resource.options.availableTags.map((tag: string) => ({
                id: tag,
                name: tag,
              }))}
            />
          )}
        {resource.options.linkedTo && (
          <ReferenceInput source="parent" reference={resource.options.linkedTo}>
            <AutocompleteInput optionText="value" />
          </ReferenceInput>
        )}
      </SimpleForm>
    </Edit>
  );
};

export default ListEdit;
