import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import EditEventModal from '../modals/EditEventModal'
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

export default function EventsTable({ events, teams, refresh }) {

  const userData = useContext(UserContext)
  
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'place',
      headerName: 'Place',
      flex: 1
    },
    {
      field: 'dateTime',
      headerName: 'Date and time',
      type: 'dateTime',
      flex: 1
    },
    {
      field: 'actionEdit',
      headerName: 'Edit',
      width: 150,
      renderCell: (params) => {
        return (
          <EditEventModal label={"Edit"} refresh={refresh} teams={ teams } eventData={params.row} />
        );
      },
    },
    {
      field: 'actionDelete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => {
        const removeEvent = () => {
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'delete',
            url: `http://localhost:8080/events/${params.row.id}/delete`
          }).then( async (response) => {
            await refresh()
          }).catch(error => console.error(error))
        }
        return (
          <Button style={{color: "red"}} onClick={removeEvent}>Delete</Button>
        );
      },
    }
  ];

  const formatedEvents = events.map(event => {

    const parsedDate = new Date(event.date)
    parsedDate.setMinutes(parsedDate.getMinutes() + parsedDate.getTimezoneOffset())

    return {
      id: event.id,
      name: event.name,
      place: event.place,
      date: event.date,
      dateTime: parsedDate,
      Teams: event.Teams
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