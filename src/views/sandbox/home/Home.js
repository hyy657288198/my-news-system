import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setvisible] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      setviewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      setstarList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);
    // Specify configuration items and data for the chart
    var option = {
      title: {
        text: 'News Classification Diagram'
      },
      tooltip: {},
      legend: {
        data: ['quantity']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [{
        name: 'quantity',
        type: 'bar',
        data: Object.values(obj).map(item => item.length)
      }]
    };

    // Display the chart
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = (obj) => {
    //Data processing
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    var myChart;
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }

    var option;
    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        left: 'left',
      },
      series: [
        {
          name: 'number of releases',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Users Browse Most" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Users Like Most" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setTimeout(() => {
                  setvisible(true)
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              title={username}
              description={
                <div>
                  <b>{region ? region : "Global"}</b>
                  <span style={{
                    paddingLeft: "30px"
                  }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="Personal News Classification"
        placement="right"
        closable={true}
        onClose={() => {
          setvisible(false)
        }}
        visible={visible}
      >
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>


      <div ref={barRef} style={{
        width: '100%',
        height: "400px",
        marginTop: "30px"
      }}></div>
    </div>
  )
}

