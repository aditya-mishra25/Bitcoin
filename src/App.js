import React, {useEffect, useState} from 'react';
import {Dimmer,Loader,Select,Card} from 'semantic-ui-react';
import './App.css';
import Chart from "react-apexcharts";
// import { Dimmer, Loader } from 'semantic-ui-react';

const options =[{value:'USD', text:'USD'},{value:'EUR', text:'EUR'},{value:'GBP', text:'GBP'}]

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [chartData,setChartData] = useState(null);
  const [series, setSeries] = useState(null);
  useEffect(()=>{
    async function fetchData(){
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await res.json();
      setPriceData(data.bpi);
      getChartData();
    }
    fetchData();
  },[])

  const handleSelect = (e,data) =>{
    setCurrency(data.value)
  }

  const getChartData = async() =>{
    const res = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json');
    const data = await res.json();
    const categories = Object.keys(data.bpi)
    const series = Object.values(data.bpi);
    setChartData({
      xaxis:{
        categories:categories
      }
    })
    setSeries([{
      name:'Bitcoin Price',
      data:series

    }
    ])
    setLoading(false);
  }
  // const key ='MTgxYzA3MGE2MWI1NDhlMWEyOTkxNGQ2YTdhYjM4NmY;
  return (
    <div className="App">
      <div className="nav" style={{padding:15, backgroundColor:'gold'}}>
        Coindesk Api Data
      </div>
      {
        loading ?(
          <div>
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          </div>
        ):(
          <div>
          <div className="priceContainer" style={{
            display:'flex',
            justifyContent:'space-around',
            alignItem:'center',
            width:600,
            height:300,
            marginTop:'5%',
            marginLeft:'30%'    
          }}>
            <div className="form" style={{flex:1}}>
              <Select placeholder="Select your currency" onChange={handleSelect} options={options}></Select>
            </div>
            <div className="price"  style={{flex:1}}>
              <Card>
                <Card.Content>
                  <Card.Header>
                    {currency} Currency
                  </Card.Header>
                  <Card.Description>
                    {priceData[currency].rate}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'center'}}>
            <Chart options={chartData} series={series} type='line' width='1000' height='300'></Chart>
          </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
