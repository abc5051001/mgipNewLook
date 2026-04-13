import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
export default function ImgMediaCard({Title, Content, imgSrc}) {
  return (
    <Card sx={{ maxWidth: 450 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={imgSrc}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {Title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {Content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}