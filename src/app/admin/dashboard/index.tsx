import * as React from "react";
import { Title } from "react-admin";
import CardWithIcon from "./CardWithIcon";
import TransportResource from "../transports";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1em;
  gap: 1em;

  > * {
    flex-grow: 0;
    min-width: 300px;
  }
`;

const Table = styled.table`
  font-size: 0.5em;
`;

const Dashboard = () => {
  // const modes = Object.values(TransportMode).map((mode, index) => mode);
  
  return (
  <>
    <Title title="Welcome to the administration" />
    <Container>
      <CardWithIcon
        to="/transports"
        icon={TransportResource.icon}
        title={"Transports"}
        subtitle={(
          <Table>
            {/* {modes.map((mode, index) => (
              <tr key={index}>
                <td>{mode}</td>
                <td>1278 km</td>
              </tr>
            ))} */}
          </Table>

        )}
      />
    </Container>
  </>
)};

export default Dashboard;
