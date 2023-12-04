import { Edit, NumberInput, SimpleForm, TextInput } from 'react-admin';
import TransportModeInput from './TransportModeInput';

const TransportEdit = () => (
    <Edit>
        <SimpleForm>
            <TransportModeInput source="mode" />
            <NumberInput source="distance" />
            <NumberInput source="weight" />
            <NumberInput source="passengers" />
        </SimpleForm>
    </Edit>
);

export default TransportEdit;