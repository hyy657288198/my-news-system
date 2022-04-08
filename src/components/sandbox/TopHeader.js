import React from 'react'
import { Layout, Dropdown, Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

const { Header } = Layout;

const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

function TopHeader(props) {
    const changeCollapsed = () => {
        props.changeCollapsed()
    }
    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={()=>{
                localStorage.removeItem("token")
                props.history.replace("/login")
            }}>Log Out</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px'}}>
        {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>}
        <div style={{ float: "right" }}>
            
            <Dropdown overlay={menu}>
                <Button type="dashed" style={{ background:'#F8F8F8' }}>welcome back, <b> {username}</b></Button>
            </Dropdown>
        </div>
        </Header>
    )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
