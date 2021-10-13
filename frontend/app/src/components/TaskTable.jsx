import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tableContainer:{ 
    height: '230px', 
    width: '100%', 
    backgroundColor: '#fff',
    marginTop: '15px'
  }
});

export default function TaskTable({ tasks }) {
  
  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
    },
    {
        field: 'name',
        headerName: 'Task name',
        flex: 1
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1
    },
    {
      field: 'date',
      headerName: "Date",
      flex: 1,
      type: 'date'
    }
  ];

  const formatedTasks = tasks.map(task => {
    task.date = new Date(task.date)
    return {
      id: task.id,
      status: task.status,
      name: task.name,
      priority: task.priority,
      date: task.date
    }
  }) 

  const classes = useStyles();
  
  return (
    <div className={classes.tableContainer}>
      <DataGrid
        rows={formatedTasks}
        columns={columns}
        pageSize={2}
        rowsPerPageOptions={[2]}
        disableSelectionOnClick
        onCellClick={(params) => window.location.assign(`/task/${params.row.id}`)}
      />
    </div>
  );
}