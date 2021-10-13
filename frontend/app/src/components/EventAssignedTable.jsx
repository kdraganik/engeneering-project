import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';


const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function EventAssignedTable({ teams, event, eventTeamIds, refresh }) {
  
  const columns = [
    {
      field: 'name',
      headerName: 'Nazwa',
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
            url: `http://localhost:8080/events/${event.id}}/removeTeam`,
            data: {
              "TeamId": params.id
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
            url: `http://localhost:8080/events/${event.id}}/addTeam`,
            data: {
              "TeamId": params.id
            }
          }).then( resposne => {
            refresh();
          }).catch( error => {
            console.error(error);
          })
        }

        return eventTeamIds.includes(params.row.id) ? <Button style={{color: "red"}} onClick={handleRemove}>Usuń</Button> : <Button style={{color: "green"}} onClick={handleAdd}>Dodaj</Button>
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
    <div className={classes.tableContainer}>
      <DataGrid
        rows={formatedTeams}
        columns={columns}
        pageSize={2}
        rowsPerPageOptions={[2]}
        disableSelectionOnClick
      />
    </div>
  );
}