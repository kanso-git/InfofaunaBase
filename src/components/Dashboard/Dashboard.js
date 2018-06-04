import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Col, Grid, Row} from 'react-material-responsive-grid';
import {translate} from 'react-i18next';
import Icon from '@material-ui/core/Icon';

import mdrImg from '../../assets/images/mdr-card.JPG';
import mdsImg from '../../assets/images/mds-card.jpg';

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
        padding: 10
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});


const Dashboard = (props) => {
    console.log(props);
    const {t, i18n} = props;
    const {classes} = props;
    return (

        <Grid>
            <Row>
                <Col md={4}>
                    <Card className={classes.card}>
                        <Typography gutterBottom variant="headline" component="h2">
                            MIDAT
                        </Typography>

                        <br/>
                        <CardMedia
                            className={classes.media}
                            image={mdrImg}
                            title="Contemplative Reptile"
                        />

                        <CardContent>
                        {/* <span>{t('Welcome to React.js')}</span> */}
                        <Typography component="p">
                            MIDAT est un Système d’information pour l’évaluation des indices biotiques de la qualité des cours d’eau
                            avec l’aide de macrozoobenthos.
                        </Typography>

                        </CardContent>
                        <CardActions>

                            <Button color="primary" className={classes.button}>
                                Login
                                <Icon className={classes.rightIcon}>login</Icon>
                            </Button>
                        </CardActions>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={classes.card}>
                        <Typography gutterBottom variant="headline" component="h2">
                            MIDAT-Sources
                        </Typography>

                        <br/>
                        <CardMedia
                            className={classes.media}
                            image={mdsImg}
                            title="Contemplative Reptile"
                        />
                        <CardContent>
                            <Typography component="p">
                                    MIDAT-Sources est un système d’information qui intègre toutes les données relatives aux études éco-morphologiques et faunistiques des sources.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button color="primary" className={classes.button}>
                                Login
                                <Icon className={classes.rightIcon}>login</Icon>
                            </Button>
                        </CardActions>
                    </Card>
                </Col>
                <Col md={4}>
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

                            <Button color="primary" className={classes.button}>
                                Login
                                <Icon className={classes.rightIcon}>login</Icon>
                            </Button>
                        </CardActions>
                    </Card>
                </Col>

            </Row>
        </Grid>

    );
};


Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(translate('translations')(Dashboard));

