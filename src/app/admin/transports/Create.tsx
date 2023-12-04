import { Create, NumberInput, SimpleForm, TextInput } from 'react-admin';
import TransportModeInput from './TransportModeInput';

const TransportCreate = () => (
    <Create>
        <SimpleForm>
            <TransportModeInput source="mode" />
            <NumberInput source="distance" />
            <NumberInput source="weight" />
            <NumberInput source="passengers" />
        </SimpleForm>
    </Create>
);

export default TransportCreate;