import { makeStyles } from '@material-ui/core';
import { Grid, Paper, Typography } from '@material-ui/core';
import EditNoteModal from './modals/EditNoteModal';


const useStyles = makeStyles({
  notePaper: {
    padding: "10px",
    backgroundColor: "yellow",
    height: "180px",
  },
  noteParagraph: {
    fontSize: "0.8em",
    maxWidth: "100%",
    wordBreak: "break-word"
  }
});

export default function EventNotes({ eventData, refresh, notes }) {
  const classes = useStyles();

  return (
    <Grid container spacing={1}>
      {
        notes.length > 0 ?
        notes.map((note, i) => {
          return(
            <Grid item xs={2} key={i}>
              <EditNoteModal eventData={ eventData } noteData={ note } refresh={ refresh }>
                <Paper className={classes.notePaper}>
                  <Typography component="h3" variant="h5">
                    {note.title}
                  </Typography>
                  <Typography className={classes.noteParagraph} component="p" variant="body1">
                    {note.content} 
                  </Typography>               
                </Paper>
              </EditNoteModal>
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