import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor.js';
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setformInfo] = useState({})
  const [content, setContent] = useState("")

  const User = JSON.parse(localStorage.getItem("token"))
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setformInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("Content cannot be empty.")
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }

  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data)
    })
  }, [])


  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": User.region?User.region:"Global",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(res=>{
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')

      notification.info({
        message: `Notification`,
        description:
          `You can view your news in ${auditState===0?'[Drafts].':'[Audit list].'}`,
        placement:"bottomRight"
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Write News"
      />

      <Steps current={current}>
        <Step title="Essential Information" description="title, classification" />
        <Step title="Content" description="news content" />
        <Step title="Submit" description="Save as draft or submit for audit" />
      </Steps>


      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? '' : style.active}>

          <Form
              {...layout}
              name="basic"
              ref={NewsForm}
          >
            <Form.Item
              label="News title"
              name="title"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: 'Please input your news category!' }]}
            >
              <Select>
                {
                  categoryList.map(item =>
                      <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>

        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            setContent(value)
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>

      </div>
      <div style={{ marginTop: "100px" }}>
        {
          current > 0 && <Button onClick={handlePrevious}>Back</Button>
        }
        {
          current === 2 && <span style={{  float:"right"}}>
              <Button type="primary" onClick={() => handleSave(0)}>Save to Drafts</Button>
              <Button danger onClick={() => handleSave(1)}>Submit for audit</Button>
          </span>
        }
        {
          current < 2 && <Button style={{  float: "right" }} type="primary" onClick={handleNext}>Next</Button>
        }
      </div>
    </div>
  )
}

