import { makeStyles } from '@material-ui/core';
import { Grid, Paper, Typography } from '@material-ui/core';


const useStyles = makeStyles({
  notePaper: {
    padding: "20px",
    backgroundColor: "yellow"
  }
});

export default function EventNotes({ notes }) {
  const classes = useStyles();

  return (
    <Grid container spacing={1}>
      {
        notes.length > 0 ?
        notes.map((note, i) => {
          return(
            <Grid item xl={2} key={i}>
              <Paper className={classes.notePaper}>
                <Typography component="h3" variant="h5">
                  {note.title}
                </Typography>
                <Typography component="p" variant="body1">
                  {note.content} 
                </Typography>               
              </Paper>
            </Grid>
          )
        })
        :
        <Typography type="p" variant="body1">
          No notes were added to this event
        </Typography>
      }
    </Grid>
  );
}