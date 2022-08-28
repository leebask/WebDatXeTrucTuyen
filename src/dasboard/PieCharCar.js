import { collection, getDocs } from 'firebase/firestore';
import React, { PureComponent, useState } from 'react';
import { useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { db } from '../firebase';
import Title from './Title';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function PieChartCar() {
    //   const demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';
    const [DataCars, setDataCars] = useState([{}]);
    //get cars
    useEffect(() => {
        const getDataCars = async () => {
            try {
                let _cars = await getDocs(collection(db, 'bus'))
                _cars = _cars.docs.map(t => ({
                    ...t.data(),
                    id: t.id
                }))
                console.log('cars', _cars)
                setDataCars(_cars.map(
                    (item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    }
                ));



            } catch (err) {
                // setError(err.message);
                setDataCars([]);

            } finally {
                // setLoading(false);
            }
        }

        getDataCars()
    }, [])
    const [totalCars, settotalCars] = useState()
    const [data, setdata] = useState()

    const [totalCarsGiuongNam, settotalCarsGiuongNam] = useState()
 
    useEffect(() => {
        settotalCars(DataCars.length)
        settotalCarsGiuongNam(DataCars?.filter(k => k.loaiXe == "Giường nằm").length)
        setdata([{ name: 'Group A', value: DataCars?.filter(k => k.loaiXe == "Giường nằm").length },
        { name: 'Group B', value: DataCars.length- DataCars?.filter(k => k.loaiXe == "Giường nằm").length },])
    }, [DataCars])

    return (
        <React.Fragment>
            <Title>Tổng số xe nhà xe sở hữu: {totalCars} xe</Title>
            <div style={{fontWeight:'bold'}}>Giường nằm: {totalCarsGiuongNam} xe</div>
            <div style={{fontWeight:'bold'}}>Ghế ngồi: {totalCars - totalCarsGiuongNam} xe</div>


            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
