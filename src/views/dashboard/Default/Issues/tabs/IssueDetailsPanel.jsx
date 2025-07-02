import {
  Box,
  Divider,
  Typography,
  Paper,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
} from '@mui/material';

export default function IssueDetailsPanel({
  sampleIssue,
  comments,
  comment,
  setComment,
  handleAddComment,
  placeholderImages,
}) {
  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 320,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflow: 'scroll',
      }}
    >
      <Typography variant="h6">Issue Details</Typography>
      <Divider />
      <Typography variant="subtitle2">
        Information about the selected issue
      </Typography>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {sampleIssue.title}
        </Typography>
        <Typography sx={{ mb: 1 }}>{sampleIssue.description}</Typography>
        <Typography>
          <b>Priority:</b>{' '}
          <span
            style={{
              color:
                sampleIssue.priority === 'High'
                  ? 'red'
                  : sampleIssue.priority === 'Medium'
                    ? 'orange'
                    : 'green',
            }}
          >
            {sampleIssue.priority}
          </span>
        </Typography>
        <Typography>
          <b>Category:</b> {sampleIssue.category}
        </Typography>
        <Typography>
          <b>Assignee:</b> {sampleIssue.assignee}
        </Typography>
        <Typography>
          <b>Created:</b> {sampleIssue.createdAt.toLocaleDateString()}
        </Typography>
        <Typography>
          <b>Status:</b> {sampleIssue.status}
        </Typography>
      </Box>

      {/* Photos */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Photos
        </Typography>
        <ImageList cols={3} rowHeight={100} sx={{ mb: 2 }}>
          {placeholderImages.map((img, idx) => (
            <ImageListItem key={idx}>
              <img
                src={img}
                alt={`placeholder-${idx}`}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Comments */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Comments
        </Typography>
        <List sx={{ maxHeight: 150, overflow: 'auto', mb: 1 }}>
          {comments.map((c, idx) => (
            <ListItem alignItems="flex-start" key={idx}>
              <ListItemAvatar>
                <Avatar src={c.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={c.user}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {c.text}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {c.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
          <Button variant="contained" onClick={handleAddComment}>
            Post
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
