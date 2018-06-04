import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import { translate, Trans } from 'react-i18next';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {

        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
});






const Dashboard = (props) => {
    console.log(props);
    const { t, i18n } = props;
    const { classes } = props;
    return (
        <div >
            <span style={{paddingLeft:24}}>Dashboard</span>


            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image="http://via.placeholder.com/350x150"
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        Midat Source
                        <span>{t('Welcome to React.js')}</span>
                    </Typography>
                    <Typography component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>

                    <Button size="small" color="primary">
                        Accès
                    </Button>
                </CardActions>
            </Card>

            <Card className={classes.card}>

                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        Midat Rivières
                    </Typography>
                    <Typography component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                       Accès
                    </Button>

                </CardActions>
            </Card>


            <Card className={classes.card}>

                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        Midat Rivières
                    </Typography>
                    <Typography component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        Accès
                    </Button>

                </CardActions>
            </Card>

        </div>
    );
};


Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate('translations')(Dashboard));

