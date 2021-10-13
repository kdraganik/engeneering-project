import  { Grid, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import TaskTable from '../components/TaskTable';
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  eventBox: {
    width: '100%',
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    backgroundColor: "#292929",
    color: "#f3f3f3"
  },
  eventDetails: {
    color: "#c2c2c2",
    marginBottom: "20px"
  },
  cardDetails: {
    flex: 1,
  },
  paperStyles: {
    padding: "10px",
    borderRadius: "0.5px"
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

export default function HomeEventDetails({ user, eventData }){

  const { name, place } = eventData;
  const parsedDate = new Date(eventData.date);
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"] 
  const dateString = `${monthName[parsedDate.getUTCMonth()]} ${parsedDate.getUTCDate()} ${parsedDate.getUTCFullYear()}`;
  const timeString = `${parsedDate.getUTCHours()}:${(parsedDate.getMinutes()<10?'0':'') + parsedDate.getMinutes()}`;
  const tasks = eventData.Tasks.filter(task => task.Users.some(u => u.id === user.id));

  const classes = useStyles();

  return(
    <Grid item className={classes.eventBox}>
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Link className={classes.link} to={`event/${ eventData.id }`}>
              <Typography component="h2" variant="h5">
                {name}
              </Typography>
              <Typography className={classes.eventDetails} variant="subtitle1">
                {place}, {dateString} @ {timeString}
              </Typography>
            </Link>
            {
              tasks.length > 0 ? 
              <TaskTable tasks={ tasks }/> 
              : 
              <Paper className={classes.paperStyles}>
                <Typography type="p" variant="body1">
                  You don't have assigned tasks in this event
                </Typography>
              </Paper>
            }
          </CardContent>
        </div>
      </Card>
    </Grid>
  )
}