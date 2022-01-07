import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff'
  },
  statusToDo:{
    fontWeight: 600,
    backgroundColor: "lightgrey",
    display: "block",
    position: "relative",
    textAlign: "center",
  },
  statusInProgress:{
    fontWeight: 600,
    backgroundColor: "lightskyblue",
  },
  statusDone:{
    fontWeight: 600,
    color: "white",
    backgroundColor: "darkgreen",
  },
  dateOverdue: {
    backgroundColor: "red",
  },
  dateDue: {
    backgroundColor: "yellow",
  },
  tableButton:{
    color: "white",
    padding: "0 4px",
    margin: "1px",
    fontSize: "0.7em",
    marginTop: "5px",
    backgroundColor: "white"
  }
});

export default function TaskTable({ tasks, showClosed }) {
  
  const classes = useStyles();

  const [areClosed, setAreClosed] = useState(false);

  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 117,
      align: "center",
      cellClassName: (params) => 
        params.value === "to do" 
        ? classes.statusToDo 
        : params.value === "in progress" 
        ? classes.statusInProgress
        : classes.statusDone
    },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
    },
    {
      field: 'date',
      headerName: "Date",
      flex: 1,
      type: 'date',
      cellClassName: (params) => 
        params.value < new Date()
        ? classes.dateOverdue
        : new Date().getFullYear() === params.value.getFullYear() && new Date().getDate() === params.value.getDate() && new Date().getMonth() === params.value.getMonth()
        ? classes.dateDue
        : ""
    }
  ];

  const formatedTasks = tasks.map(task => {

    const parsedDate = new Date(task.date)
    parsedDate.setMinutes(parsedDate.getMinutes() + parsedDate.getTimezoneOffset())

    return {
      id: task.id,
      status: task.status,
      name: task.name,
      priority: task.priority,
      date: parsedDate
    }
  }).sort(
    function(a, b) {          
       if (a.date === b.date) {
          return b.status > a.status ? 2 : -2
       }
       return a.date > b.date ? 1 : -1
    }).filter(task => areClosed ? task.status === "done" : task.status !== "done")
  
  return (
    <>
      {showClosed ? <Button onClick={ () => setAreClosed(!areClosed) } className={classes.tableButton}>{areClosed ? <span style={{color:"grey"}}>Show open tasks</span> : <span style={{color:"darkgreen"}}>Show closed tasks</span> }</Button> : "" }
      <div className={classes.tableContainer}>
        <DataGrid
          rows={formatedTasks}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[2, 5, 10]}
          disableSelectionOnClick
          onCellClick={(params) => window.location.assign(`/task/${params.row.id}`)}
        />
      </div>
    </>
  );
}