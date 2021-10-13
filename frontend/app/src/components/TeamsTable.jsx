import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import EditTeamModal from '../components/EditTeamModal';


const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function TeamsTable({ teams, users, refresh }) {
  
  const columns = [
    {
      field: 'name',
      headerName: 'Nazwa',
      flex: 1
    },
    {
      field: 'edit',
      headerName: 'Edytuj',
      width: 150,
      renderCell: (params) => {
        return (
          <EditTeamModal label={"Edytuj"} refresh={refresh} users={ users } data={params.row} />
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
            url: `http://localhost:8080/teams/${params.row.id}/delete`
          }).then( async (response) => {
            await refresh()
          }).catch(error => console.error(error))
        }
        return (
          <Button style={{color: "red"}} onClick={onClick}>Usuń</Button>
        );
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