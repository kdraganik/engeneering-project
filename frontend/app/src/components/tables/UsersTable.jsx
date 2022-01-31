import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import EditUserModal from '../modals/EditUserModal'
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function UsersTable({ users, refresh }) {

  const userData = useContext(UserContext)
  
  const columns = [
    {
      field: 'firstName',
      headerName: 'First name',
      flex: 1
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1
    },
    {
      field: 'editAction',
      headerName: 'Edit',
      width: 150,
      renderCell: (params) => {
        return (
          <EditUserModal label={"Edit"} refresh={refresh} editedUserData={params.row} />
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => {
        const onClick = () => {
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'delete',
            url: `http://localhost:8080/users/${params.row.id}/delete`
          }).then( async (response) => {
            await refresh()
          }).catch(error => console.error(error))
        }
        return params.row.id !== userData.id ? <Button style={{color: "red"}} onClick={onClick}>Delete</Button> : "";
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