import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Card, CardContent, CircularProgress, Box } from '@material-ui/core';

import { fetchMenus } from '../../common/components/actions';
import { AppContext } from '../../appContext';

const useStyles = makeStyles(theme => ({
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  link: {
    textDecoration: 'none',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    height: 100,
  },
}));

const MenusPageComponent = () => {
  const context = useContext(AppContext);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    if(context.restaurantId) {
      fetchMenus({
        restaurantId: context.restaurantId,
      })
        .then(menus => {
          context.setMenus(menus);
        })
        .catch(err => {
          setErrorMessage(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [context.restaurantId]);

  const menusElements = context.menus.map(menu => {
    return (
      <Link key={menu._id} to={`/menu/${menu._id}`} className={classes.link}>
        <Card variant="outlined" className={classes.card} display="flex">
          <CardContent>
            <b>{menu.name}</b>
          </CardContent>
        </Card>
      </Link>
    );
  });

  return (
    <>
      {isLoading && (
        <Box className={classes.centered}>
          <CircularProgress/>
        </Box>
      )}
      {!isLoading && !errorMessage && (
        menusElements.length ?
          menusElements :
          <Box className={classes.centered}><b>No menus found</b></Box>
      )}
      {!isLoading && errorMessage && (<Box className={classes.centered}><b>{errorMessage}</b></Box>)}
    </>
  );
};

export default MenusPageComponent;
