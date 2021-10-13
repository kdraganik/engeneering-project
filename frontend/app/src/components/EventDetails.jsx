import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/grid'
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room'
import EventIcon from '@material-ui/icons/Event'
import AccessTimeIcon from '@material-ui/icons/AccessTime'

const useStyles = makeStyles({
  gridContainer: {
    height: "100%"
  },
  paperStyles: {
    padding: "10px",
    borderRadius: "0.5px",
    height: "214px"
  }
});

export default function EventDetails ({ eventData }) {
  const classes = useStyles();

  const parsedDate = new Date(eventData.date);
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"] 
  const dateString = `${parsedDate.getUTCDate()} ${monthName[parsedDate.getUTCMonth()]} ${parsedDate.getUTCFullYear()}`;
  const timeString = `${parsedDate.getUTCHours()}:${(parsedDate.getMinutes()<10?'0':'') + parsedDate.getMinutes()}`;

  return (
    <Paper className={classes.paperStyles}>
      <Grid className={classes.gridContainer} container justifyContent="center" alignItems="center" alignContent="center">
        <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12}>
          <RoomIcon/>
          <Typography component="h3" variant="h6">
            {eventData.place}
          </Typography>
        </Grid>
        <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12}>
          <EventIcon/>
          <Typography component="h3" variant="h6">
            {dateString}
          </Typography>
        </Grid>
        <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12}>
          <AccessTimeIcon/>
          <Typography component="h3" variant="h6">
            {timeString}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}