import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles({
  tableContainer:{
    minWidth: '500px',
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function TeamMembersTable({ users, team, teamUserIds, refresh }) {
  
  const columns = [
    {
      field: 'firstName',
      headerName: 'Imię',
      flex: 1
    },
    {
        field: 'lastName',
        headerName: 'Nazwisko',
        flex: 1
    },
    {
      field: 'action',
      headerName: 'Akcja',
      width: 150,
      renderCell: (params) => {
        const handleRemove = async () => {
          axios({
            method: 'put',
            url: `http://localhost:8080/teams/${team.id}}/removeUser`,
            data: {
              "UserId": params.id
            }
          }).then( resposne => {
            refresh();
          }).catch( error => {
            console.error(error);
          })
        }

        const handleAdd = async () => {
          axios({
            method: 'put',
            url: `http://localhost:8080/teams/${team.id}}/addUser`,
            data: {
              "UserId": params.id
            }
          }).then( resposne => {
            refresh();
          }).catch( error => {
            console.error(error);
          })
        }

        return teamUserIds.includes(params.row.id) ? <Button style={{color: "red"}} onClick={handleRemove}>Usuń</Button> : <Button style={{color: "green"}} onClick={handleAdd}>Dodaj</Button>
      },
    },
  ];

  const formatedUsers = users.map(user => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }
  }) 

  const classes = useStyles();
  
  return (
    <div className={classes.tableContainer}>
      <DataGrid
        rows={formatedUsers}
        columns={columns}
        pageSize={2}
        rowsPerPageOptions={[2]}
        disableSelectionOnClick
      />
    </div>
  );
}