import { DataGrid } from '@material-ui/data-grid';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';


const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function EventAssigneeTable({ eventData, refresh }) {

  const userData = useContext(UserContext)
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventAssigneeIds, setEventAssigneeIds] = useState(eventData.Teams.map(team => team.id))
  const [teams, setTeams] = useState([]);
  useEffect( () => {
    try{
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/teams`
      }).then( response => {
        setTeams(response.data);
        setIsLoaded(true);
      })
    }
    catch(err){
      console.error(err);
    }
  }, [userData])

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
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
            url: `http://localhost:8080/events/${eventData.id}}/removeTeam`,
            data: {
              "TeamId": params.id
            }
          }).then(() => {
            setEventAssigneeIds(eventAssigneeIds.filter( id => id !== params.row.id ))
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
            url: `http://localhost:8080/events/${eventData.id}}/addTeam`,
            data: {
              "TeamId": params.id
            }
          }).then(() => {
            setEventAssigneeIds(eventAssigneeIds.concat([params.row.id]))
          }).catch( error => {
            console.error(error);
          })
        }

        return eventAssigneeIds.includes(params.row.id) ? <Button style={{color: "red"}} onClick={handleRemove}>Remove</Button> : <Button style={{color: "green"}} onClick={handleAdd}>Assign</Button>
      },
    }
  ];

  const formatedTeams = teams.map(team => {
    return {
      id: team.id,
      name: team.name,
      users: team.Users
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
          rows={formatedTeams}
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