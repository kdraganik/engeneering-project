import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import EditUserModal from '../components/EditUserModal'
import axios from 'axios';

const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function UsersTable({ user, users, refresh }) {
  
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
      field: 'phoneNumber',
      headerName: 'Numer telefonu',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Adres e-mail',
      flex: 1
    },
    {
      field: 'role',
      headerName: 'Rola',
      flex: 1
    },
    {
      field: 'edit',
      headerName: 'Edytuj',
      width: 150,
      renderCell: (params) => {
        return (
          <EditUserModal label={"Edytuj"} refresh={refresh} data={params.row} />
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Usuń',
      width: 150,
      renderCell: (params) => {
        const onClick = () => {
          axios({
            method: 'delete',
            url: `http://localhost:8080/users/${params.row.id}/delete`
          }).then( async (response) => {
            await refresh()
          }).catch(error => console.error(error))
        }
        return params.row.id !== user.id ? <Button style={{color: "red"}} onClick={onClick}>Usuń</Button> : "";
      },
    }
  ];

  const formatedUsers = users.map(user => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
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