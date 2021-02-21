import {
  Card, CardContent,
  List, ListItem, ListItemText
} from '@material-ui/core';
import moment from 'moment';

const ChapterList = ({ chapters }) => {
  const chaptersToDisplay = chapters.map((chapter) => (
    <ListItem key={chapter.chapter} button>
      <ListItemText 
        primary={`Chapter ${chapter.chapter} ${chapter.title && ` - ${chapter.title}`}`} 
        secondary={moment(chapter.timestamp * 1000).format('LL')}
      />
    </ListItem>
  ));
  return (
    <Card elevation={10}>
      <CardContent>
        <List>
          {chaptersToDisplay}
        </List>
      </CardContent>
    </Card>
  );
};

export default ChapterList;