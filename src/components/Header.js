import React from 'react';
import { Table } from 'semantic-ui-react';

const Header = ({ state }) => {
  const { web3, stakingBalanceDCT, dacetherBalance } = state;

  return (
    <>
      {Object.keys(web3).length > 0 && (
        <Table celled selectable>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>Staking DAI Balance</Table.HeaderCell>
              <Table.HeaderCell>Reward DCT Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row textAlign='center'>
              <Table.Cell>
                {web3.utils.fromWei(stakingBalanceDCT)} DAI
              </Table.Cell>
              <Table.Cell>{web3.utils.fromWei(dacetherBalance)} DCT</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </>
  );
};

export default Header;
