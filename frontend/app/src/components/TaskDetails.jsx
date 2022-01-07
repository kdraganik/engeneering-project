import { Paper, Grid, FormControl, NativeSelect, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import TaskTable from './tables/TaskTable'
import axios from "axios";
import AddTaskModal from "./modals/AddTaskModal";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const useStyles = makeStyles({
  paper: {
    padding: "10px",
    borderRadius: "2px",
  },
  danger: {
    color: "red",
    fontSize: "0.9em"
  },
  gridDivider: {
    marginTop: "25px"
  },
  gridTop: {
    marginBottom: "10px"
  },
  group:{
    marginTop: "5px"
  },
  selectLabel:{
    marginRight: "5px"
  },
  bodyType:{
    fontSize: "0.9em"
  }
});

export default function TaskDetails({ taskData, getTaskData }){

  const { description, priority, date, Tasks, Users, Team} = taskData;

  const parsedDate = new Date(date);
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"] 
  const dateString = `${parsedDate.getUTCDate()} ${monthName[parsedDate.getUTCMonth()]} ${parsedDate.getUTCFullYear()}`;
  const userData = useContext(UserContext);

  const handleStatusChange = (event) => {
    try{
      const newStatus = event.currentTarget.value;
      event.currentTarget.blur()
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'put',
        url: `http://localhost:8080/tasks/${taskData.id}/edit`,
        data: {
          status: newStatus
        }
      }).then(() => {
        getTaskData()
      })
    }
    catch(err){
      console.error(err);
    }
  }

  const classes = useStyles();
  return(
    <>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid className={classes.group} item container direction="column" alignItems="center">
            <Typography component="h3" variant="h6">
              Date: <span className={ new Date() > parsedDate ? classes.danger : "" }>{dateString}</span>
            </Typography>
            <Grid item container direction="row" justifyContent="space-between"> 
              <Typography component="h3" variant="h6">
                Priority: {priority}
              </Typography>
              <FormControl>
                <Grid container direction="row">
                  <Typography className={classes.selectLabel} component="h3" variant="h6">
                    Status:
                  </Typography>
                  <NativeSelect style={{ color: taskData.status === 'to do' ? "black" : taskData.status === "in progress" ? "lightskyblue" : "darkgreen" }} id="select" value={taskData.status} onChange={ handleStatusChange }>
                    <option value="to do">To do</option>
                    <option value="in progress">In progress</option>
                    <option value="done">Done</option>
                  </NativeSelect>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
          <Grid className={classes.group} item container direction="column" alignItems="flex-start">
            <Typography component="h4" variant="h6">Assignment</Typography>
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                  {
                    Team ?
                    <Typography className={classes.bodyType} component="p" variant="body1">Responsible team: {Team.name}</Typography>
                    :
                    <Typography className={classes.danger} component="p" variant="body1">No team assigned to this task</Typography>
                  }
                </Grid>
                <Grid item xs={12}>
                {
                  Users.length > 0 ?
                  <Typography className={classes.bodyType} component="p" variant="body1">Asigned Users: 
                  {
                    Users.map((user, i) => <span key={user.id}>{i === 0 ? "" : ","} {user.firstName} {user.lastName}</span> )
                  }
                  </Typography>
                  :
                  <Typography className={classes.danger} component="p" variant="body1">No user assigned to this task</Typography>
                }
                </Grid>
                <Grid className={classes.group} item container direction="column" alignItems="flex-start">
                <Typography component="h4" variant="h6">Task description</Typography>
                {
                  description ?
                  <Typography className={classes.bodyType} component="p" variant="body1">{description}</Typography>
                  :
                  <Typography className={classes.bodyType} component="p" variant="body1">No description</Typography>
                }
              </Grid>
              </Grid>
          </Grid>
          {
            !taskData.TaskId ?
            <Grid className={classes.group} item container direction="row" alignItems="center">
              <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <Typography component="h4" variant="h6">Subtasks</Typography>
                <AddTaskModal label={"+Add Task"} taskId={taskData.id} eventId={ taskData.EventId } parentTeamId={ taskData.TeamId } refresh={ getTaskData }/>
              </Grid>
              {
                Tasks.length > 0 ? 
                <TaskTable tasks={ Tasks } showClosed={true}/>
                :
                <Typography component="p" variant="body1">No subtasks</Typography>
              }
            </Grid>
            :
            ""
          }
        </Grid>
      </Paper>
    </>
  )
}