import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Table,Button,notification} from 'antd'

export default function Audit() {
  const [dataSource, setdataSource] = useState([])
  const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
  useEffect(()=>{
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.author===username),
        ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
      ])
    })
  },[roleId,region,username])

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title,item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author'
    },
    {
      title: "Category",
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: "Operation",
      render: (item) => {
        return <div style={{textAlign: "center"}}>
          <Button type="primary" style={{right:"30px"}} onClick={()=>handleAudit(item,2,1)}>Accept</Button>
          <Button danger onClick={()=>handleAudit(item,3,0)}>Reject</Button>
        </div>
      }
    }
  ];

  const handleAudit = (item,auditState,publishState)=>{
    setdataSource(dataSource.filter(data=>data.id!==item.id))

    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message: `Notification`,
        description:
          `You can view the approval status of your news in [Audit manage / Audit list]。`,
        placement:"bottomRight"
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize: 5
      }} 
      
      rowKey={item=>item.id}/>
    </div>
  )
}
