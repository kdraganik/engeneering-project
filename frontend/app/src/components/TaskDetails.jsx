import { Paper, Grid, FormControl, InputLabel, NativeSelect, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import TaskTable from './TaskTable'

const useStyles = makeStyles({
  paper: {
    padding: "10px",
    borderRadius: "2px",
  },
  danger: {
    color: "red"
  },
  group:{
    margin: "15px 0"
  },
  gridDivider: {
    marginTop: "25px"
  },
  gridTop: {
    marginBottom: "10px"
  },
});

export default function TaskDetails({ taskData }){

  const { description, status, priority, date, isSubtask, Tasks, Team, User } = taskData;
  const parsedDate = new Date(date);
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"] 
  const dateString = `${parsedDate.getUTCDate()} ${monthName[parsedDate.getUTCMonth()]} ${parsedDate.getUTCFullYear()}`;

  const classes = useStyles();
  return(
    <Paper className={classes.paper}>
      <Grid container>
        <Grid className={classes.group} item container direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="h3" variant="h6">
            Priority: {priority}
          </Typography>
          <Typography component="h3" variant="h6">
            Date: <span className={ new Date() > parsedDate ? classes.danger : "" }>{dateString}</span>
          </Typography>
          <FormControl>
            <InputLabel htmlFor="select">Status</InputLabel>
            <NativeSelect id="select" value={status}>
              <option value="to do">To do</option>
              <option value="in progress">In progress</option>
              <option value="done">Done</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid className={classes.group} item container direction="column" alignItems="flex-start">
          <Typography component="h4" variant="h6">Assignment</Typography>
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <Grid item xs={12}>
                {
                  Team ?
                  <Typography component="p" variant="body1"><strong>Responsible team:</strong> {Team.name}</Typography>
                  :
                  <Typography className={classes.danger} component="p" variant="body1">No team assigned to this task</Typography>
                }
              </Grid>
              <Grid item xs={12}>
              {
                User ?
                <Typography component="p" variant="body1"><strong>Assigned users:</strong> {User.firstName} {User.lastName}</Typography>
                :
                <Typography className={classes.danger} component="p" variant="body1">No user assigned to this task</Typography>
              }
              </Grid>
            </Grid>
        </Grid>
        <Grid className={classes.group} item container direction="column" alignItems="flex-start">
          <Typography component="h4" variant="h6">Task description</Typography>
          {
            description ?
            <Typography component="p" variant="body1">{description}</Typography>
            :
            <Typography component="p" variant="body1">No description</Typography>
          }
        </Grid>
        {
          !isSubtask ?
          <Grid className={classes.group} item container direction="row" alignItems="center">
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <Typography component="h4" variant="h6">Subtasks</Typography>
              <Button variant="contained" color="primary">+Add subtask</Button>
            </Grid>
            {
              Tasks.length > 0 ? 
              <TaskTable tasks={ Tasks }/>
              :
              <Typography component="p" variant="body1">No subtasks</Typography>
            }
          </Grid>
          :
          ""
        }
      </Grid>
    </Paper>
  )
}