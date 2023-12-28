import {
  CheckboxGroupInput,
  DateInput,
  Create,
  SimpleForm,
  TextInput,
  useResourceDefinition,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const ListCreate = () => {
  const resource = useResourceDefinition();
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="key" />
        <TextInput source="value" />
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
    </Create>
  );
};

export default ListCreate;
