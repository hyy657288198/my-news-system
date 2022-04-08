import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal,Popover, Switch} from 'antd'
import axios from 'axios'
import { 
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons'

const { confirm } = Modal

export default function RightList() {
  const [dataSource, setdataSource] = useState([])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            const list = res.data

            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })
            setdataSource(list)
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: 'Right name',
            dataIndex: 'title'
        },
        {
            title: "Path",
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: "Operation",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    
                    <Popover content={<div style={{textAlign:"center"}}>
                        <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                    </div>} title="Page Configuration" trigger={item.pagepermisson===undefined?'':'click'}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
                    </Popover>
                </div>
            }
        }
    ];

    const  switchMethod = (item)=>{
        item.pagepermisson = item.pagepermisson===1?0:1
        setdataSource([...dataSource])

        if(item.grade===1){
            axios.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }

    const confirmMethod = (item) => {
        confirm({
            title: 'Are you sure you want to delete?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {},
        });

    }
    //delete
    const deleteMethod = (item) => {
        // Current page synchronization status + backend synchronization
        if (item.grade === 1) {
            setdataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        }else{
            let list = dataSource.filter(data=>data.id===item.rightId)
            list[0].children = list[0].children.filter(data=>data.id!==item.id)
            setdataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} />
        </div>
    )
}
