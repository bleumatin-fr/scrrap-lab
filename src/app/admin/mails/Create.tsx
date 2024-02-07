import { RichTextInput } from "ra-input-rich-text";
import { Create, SimpleForm, TextInput } from "react-admin";

export const Fields = () => {
  return (
    <>
      <TextInput source="key" />
      <TextInput source="subject" label="Sujet" fullWidth/>
      <RichTextInput
        source="html"
        label="HTML"
        fullWidth
        sx={{
          "& .ProseMirror": {
            minHeight: 150,
          },
        }}
      />
      <TextInput source="text" label="Texte" multiline fullWidth/>
    </>
  );
};

const MailCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Create>
);

export default MailCreate;
