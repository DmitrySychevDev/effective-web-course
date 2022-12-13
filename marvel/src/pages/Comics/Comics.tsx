import React, { useState, useEffect } from 'react';

import {
  Typography,
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

// Components
import { Search, Card } from 'components';

// Store
import { comicsStore } from 'store';

const Comics: React.FC = observer(() => {
  const { t } = useTranslation();
  const { offset, searchQuery, error, loading, comics } = comicsStore;
  const [page, setPage] = useState<number>(Math.ceil(offset / 20));

  useEffect(() => {
    comicsStore.getComicsList();
  }, []);
  useEffect(() => {
    comicsStore.getComicsList();
  }, [offset, searchQuery]);

  useEffect(() => {
    setPage(1);
    comicsStore.setOffset(0);
  }, [searchQuery]);

  const count = comics.data.total ?? 0;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    comicsStore.setOffset((value - 1) * 20);
    setPage(value);
  };
  const search = (searchStr: string | undefined) => {
    comicsStore.setSearchQuery(searchStr);
  };
  return (
    <Box>
      {!error && (
        <Box>
          <Typography
            variant="h2"
            component="h2"
            color="primary"
            sx={{ marginLeft: '15px', marginBottom: '30px' }}
          >
            {`${t('comics')}(${count})`}
          </Typography>
          <Search searchParams="comics" searchEvent={search} />
          {!loading && (
            <Box>
              {count ? (
                <Box>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Pagination
                        count={Math.ceil(count / 20)}
                        color="primary"
                        page={page}
                        onChange={handleChange}
                        sx={{
                          '& .MuiPagination-ul>li': {
                            '& button': { color: 'text.secondary' }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-around">
                    {comics?.data?.results.map((item) => (
                      <Card
                        key={item.id}
                        id={item.id.toString()}
                        picture={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                        title={item.title}
                        description={item.description}
                        type="comics"
                      />
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography
                  variant="h2"
                  color="primary"
                  sx={{ marginLeft: '15px' }}
                >
                  {`${t('comics')} ${t('notFound')}`}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
      {loading && (
        <Grid container justifyContent="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
      {error && <Alert severity="error">{t('error')}</Alert>}
    </Box>
  );
});

export default Comics;
