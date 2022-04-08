import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment'
import axios from 'axios';

export default function NewsPreview(props) {
  const [newsInfo, setnewsInfo] = useState(null)
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      setnewsInfo(res.data)
    })
  }, [props.match.params.id])

  const auditList = ["Not approved", "Audit", "Accept", "Reject"]
  const publishList = ["Unpublished", "To be published", "Published", "Sunset"]

  const colorList = ["black","orange","green","red"]
  return (
    <div>
      {
        newsInfo && <div>

          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
                <Descriptions.Item label="Author">
                  {newsInfo.author}
                </Descriptions.Item>

                <Descriptions.Item label="Creation time">
                  {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
                </Descriptions.Item>
                
                <Descriptions.Item label="Publish time">
                  {newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}
                </Descriptions.Item>
                
                <Descriptions.Item label="Region">
                  {newsInfo.region}
                </Descriptions.Item>

                <Descriptions.Item label="Audit status" >
                  <span style={{ color: colorList[newsInfo.auditState] }}>
                    {auditList[newsInfo.auditState]}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="Publish status" >
                  <span style={{ color: colorList[newsInfo.publishState] }}>
                    {publishList[newsInfo.publishState]}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="Views">
                  {newsInfo.view}
                </Descriptions.Item>

                <Descriptions.Item label="Likes">
                  {newsInfo.star}
                </Descriptions.Item>
                
                <Descriptions.Item label="Comments">0</Descriptions.Item>

            </Descriptions>
          </PageHeader>

          <div dangerouslySetInnerHTML={{
            __html:newsInfo.content
          }} style={{
            margin:"0 24px",
            border:"1px solid gray"
          }}>
          </div>
        </div>
      }
    </div>
  )
}
