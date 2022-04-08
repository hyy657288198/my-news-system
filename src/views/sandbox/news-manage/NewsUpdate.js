import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setformInfo] = useState({})
  const [content, setContent] = useState("")

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

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      let {title,categoryId,content} = res.data
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, [props.match.params.id])


  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      "content": content,
      "auditState": auditState,
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
        title="Update News"
        onBack={()=>props.history.goBack()}
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

