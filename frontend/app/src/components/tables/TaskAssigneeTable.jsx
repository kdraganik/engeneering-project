import { DataGrid } from '@material-ui/data-grid';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContext';

const useStyles = makeStyles({
  tableContainer:{
    minWidth: '500px',
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function TaskAssigneeTable({ taskData }) {

  const userData = useContext(UserContext)

  const [teamUsers, setTeamUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    try{
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/teams/${taskData.TeamId}/getUsers`
      }).then(response => {
        setTeamUsers(response.data);
        setIsLoaded(true)
      })
    }
    catch(err){
      console.error(err);
    }
  }, [taskData, userData])

  const [taskAssigneeIds, setTaskAssigneeIds] = useState(taskData.Users.map( user => user.id ))
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
          setIsLoaded(false)
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'put',
            url: `http://localhost:8080/tasks/${taskData.id}}/removeUser`,
            data: {
              "UserId": params.row.id
            }
          }).then( resposne => {
            setTaskAssigneeIds(taskAssigneeIds.filter( id => id !== params.row.id ))
            setIsLoaded(true);
          }).catch( error => {
            console.error(error);
          })
        }

        const handleAdd = async () => {
          setIsLoaded(false)
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'put',
            url: `http://localhost:8080/tasks/${taskData.id}}/addUser`,
            data: {
              "UserId": params.row.id
            }
          }).then( resposne => {
            setTaskAssigneeIds(taskAssigneeIds.concat([params.row.id]))
            setIsLoaded(true)
            
          }).catch( error => {
            console.error(error);
          })
        }

        return taskAssigneeIds.includes(params.row.id) ? <Button style={{color: "red"}} onClick={handleRemove}>Remove</Button> : <Button style={{color: "green"}} onClick={handleAdd}>Assign</Button>
      },
    },
  ];

  const formatedUsers = teamUsers.map(user => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }
  })

  const classes = useStyles();
  
  return(
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
  )
}