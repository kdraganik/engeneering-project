import { DataGrid } from '@material-ui/data-grid';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContext';
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

export default function TeamMembersTable({ teamData }) {

  const userData = useContext(UserContext)
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamUserIds, setTeamUserIds] = useState(teamData.users.map(user => user.id))
  const [users, setUsers] = useState([]);
  useEffect( () => {
    try{
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/users`
      }).then( response => {
        setUsers(response.data);
        setIsLoaded(true);
      })
    }
    catch(err){
      console.error(err);
    }
  }, [userData])

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
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        const handleRemove = async () => {
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'put',
            url: `http://localhost:8080/teams/${teamData.id}}/removeUser`,
            data: {
              "UserId": params.row.id
            }
          }).then( resposne => {
            setTeamUserIds(teamUserIds.filter( id => id !== params.row.id ))
          }).catch( error => {
            console.error(error);
          })
        }

        const handleAdd = async () => {
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'put',
            url: `http://localhost:8080/teams/${teamData.id}}/addUser`,
            data: {
              "UserId": params.row.id
            }
          }).then( resposne => {
            setTeamUserIds(teamUserIds.concat([params.row.id]))
          }).catch( error => {
            console.error(error);
          })
        }

        return teamUserIds.includes(params.row.id) ? <Button style={{color: "red"}} onClick={handleRemove}>Remove</Button> : <Button style={{color: "green"}} onClick={handleAdd}>Add</Button>
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
    <>
    {
      !isLoaded ?
      <CircularProgress />
      :
      <div className={classes.tableContainer}>
        <DataGrid
          rows={formatedUsers}
          columns={columns}
          pageSize={2}
          rowsPerPageOptions={[2]}
          disableSelectionOnClick
        />
      </div>
    }
  </>
  );
}