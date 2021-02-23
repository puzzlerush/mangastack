import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography,
  List, ListItem, ListItemText,
  Select, InputLabel, FormControl, TextField,
  Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectGroup: {
    minWidth: 250
  },
  list: {
    width: 700
  }
}));

const ChapterList = ({ chapters }) => {
  const classes = useStyles();

  const [sortBy, setSortBy] = useState('ascending');
  const [groupFilter, setGroupFilter] = useState('');
  const [chapterSkip, setChapterSkip] = useState(NaN);

  const chapterGroups = {};
  chapters.forEach((chapter) => {
    Object.keys(chapter.groups).forEach((groupID) => {
      chapterGroups[chapter.groups[groupID]] = groupID;
    });
  });

  const groupsDropdownOptions = Object.keys(chapterGroups).map((groupName) => (
    <option value={groupName}>
      {groupName}
    </option>
  ))

  const filteredChapters = chapters.filter((chapter) => (
    (!groupFilter || Object.keys(chapter.groups).includes(chapterGroups[groupFilter])) &&
    (isNaN(chapterSkip) || parseInt(chapter.chapter) >= chapterSkip)
  ));
  const sortedChapters = filteredChapters.sort((a, b) => {
    if (sortBy === 'descending') {
      return parseInt(b.chapter) - parseInt(a.chapter);
    } else {
      return parseInt(a.chapter) - parseInt(b.chapter);
    }
  })
  const chaptersToDisplay = sortedChapters.map((chapter) => (
    <ListItem key={chapter.hash} button>
      <ListItemText
        primary={`Chapter ${chapter.chapter} ${chapter.title && ` - ${chapter.title}`}`}
        secondary={moment(chapter.timestamp * 1000).format('LL')}
      />
      {Object.values(chapter.groups).join(', ')}
    </ListItem>
  ));
  return (
    <Card elevation={10}>
      <CardContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="all-chapters"
            id="all-chapters"
          >
            <Typography variant="subtitle1">See all chapters</Typography>
          </AccordionSummary>
          <AccordionDetails>

            <List className={classes.list}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="sort-by-select">Sort by</InputLabel>
                <Select
                  native
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  inputProps={{ name: 'sort', id: 'sort-by-select' }}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="group-filter-select">Filter by scanlation group</InputLabel>
                <Select
                  className={classes.selectGroup}
                  native
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  inputProps={{ name: 'group', id: 'group-filter-select' }}
                >
                  <option aria-label="None" value="" />
                  {groupsDropdownOptions}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id="skip-chapters-input"
                  label="Skip chapters before"
                  type="number"
                  value={chapterSkip}
                  onChange={(e) => setChapterSkip(parseInt(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              {chaptersToDisplay}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ChapterList;