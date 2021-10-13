import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import EditEventModal from '../components/EditEventModal'

const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function EventsTable({ events, teams, refresh }) {
  
  const columns = [
    {
      field: 'name',
      headerName: 'Nazwa',
      flex: 1
    },
    {
      field: 'place',
      headerName: 'Miejsce',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Data i godzina',
      type: 'dateTime',
      flex: 1
    },
    {
      field: 'edit',
      headerName: 'Edytuj',
      width: 150,
      renderCell: (params) => {
        return (
          <EditEventModal label={"Edytuj"} refresh={refresh} teams={ teams } data={params.row} />
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
            url: `http://localhost:8080/events/${params.row.id}/delete`
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

  const formatedEvents = events.map(event => {
    return {
      id: event.id,
      name: event.name,
      place: event.place,
      date: new Date(event.date),
      teams: event.Teams
    }
  }) 

  const classes = useStyles();
  
  return (
    <div className={classes.tableContainer}>
      <DataGrid
        rows={formatedEvents}
        columns={columns}
        pageSize={2}
        rowsPerPageOptions={[2]}
        disableSelectionOnClick
      />
    </div>
  );
}