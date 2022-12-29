import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';

// Generate Sales Data
function createData(time, amount) {
    return { time, amount };
}

export default function Chart() {
    const theme = useTheme();
    const [DataTicket, setDataTicket] = React.useState([{}]);
    //get ticket
    const dispatch = useDispatch();
    React.useEffect(() => {
        const getDataTicket = async () => {
            try {
                let _ticket = await getDocs(collection(db, 'ticket'));
                _ticket = _ticket.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('_ticket', _ticket);
                setDataTicket(
                    _ticket.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    })
                );
            } catch (err) {
                // setError(err.message);
                setDataTicket([]);
            } finally {
                // setLoading(false);
            }
        };

        getDataTicket();
    }, []);
    //get tour
    const [DataTour, setDataTour] = useState({});

    useEffect(() => {
        const getDataTour = async () => {
            try {
                let _tour = await getDocs(collection(db, 'tour'));
                _tour = _tour.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('tour', _tour);
                setDataTour(
                    _tour.reduce(
                        (obj, t) => ({
                            ...obj,
                            [t.maCX]: t
                        }),
                        {}
                    )
                );
            } catch (err) {
                console.log(err.message);
                setDataTour({});
            } finally {
                // setLoading(false);
            }
        };
        getDataTour();
    }, []);
    const [data, setData] = useState([]);
    //   const data = [
    // createData('25/10/2022', 100),
    // createData('03:00', 300),
    // createData('06:00', 600),
    // createData('09:00', 800),
    // createData('12:00', 1500),
    // createData('15:00', 2000),
    // createData('18:00', 2400),
    // createData('21:00', 2400),
    // createData('24:00', undefined),
    //   ];
    React.useEffect(() => {
        // DataTicket?.map(data =>{
        //     setData([])
        // })
        setData(
            [...new Set(DataTicket.map((t) => t.ngayDat))]
                .sort((a, b) => {
                    return moment(a, 'DD/MM/YYYY') - moment(b, 'DD/MM/YYYY');
                    // const da=new Date()
                })
                .map((t) => {
                    const v = DataTicket.filter((tt) => tt.ngayDat === t)
                        .map((tt) => DataTour[tt.maCX]?.gia)
                        .reduce((a, b) => a + b, 0);
                    return createData(`${t} (${v.toLocaleString('en')})`, v);
                })
        );
    }, [DataTicket, DataTour]);

    return (
        <React.Fragment>
            <Title>Tổng tiền vé theo ngày đặt</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24
                    }}>
                    <XAxis dataKey="time" stroke={theme.palette.text.secondary} style={theme.typography.body2} />
                    <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1
                            }}>
                            Tiền (VNĐ)
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
