import { Grid, Paper } from '@mui/material';
import React from 'react'
import Chart from '../dasboard/Chart';
import PieCharCar from '../dasboard/PieCharCar';

function ThongKe() {
  return (
    <div style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <PieCharCar />
                </Paper>
              </Grid>
    </div>
  )
}

export default ThongKe