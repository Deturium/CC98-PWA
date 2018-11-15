import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'

import { useGlobalContainer } from '@/hooks/useContainer'
import settingInstance from '@/containers/setting'
import userInstance from '@/containers/user'

import LoadingCircle from '@/components/LoadingCircle'
import Editor from './Editor'
import PostHead from './PostHead'

import { getTopicInfo } from '@/services/topic'
import { getBoardNameById } from '@/services/board'
import { IPost, ITopic } from '@cc98/api'
import AwardDialog from './AwardDialog'
import PostList from './PostList'

interface Props {
  // 普通帖子
  topicId: string
  // 追踪匿名帖子
  postId: string
  // 追踪非匿名帖子
  userId: string
}
export interface TempAward {
  id: number
  content: string
  reason: string
  operatorName?: string
}

export default (props: Props) => {
  const { topicId, userId, postId } = props
  // 引入全局属性
  const { state } = useGlobalContainer(settingInstance)
  const userInfo = useGlobalContainer(userInstance).state.myInfo

  const [topicInfo, setTopicInfo] = useState<ITopic | null>(null)
  const [open, setOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<IPost | null>(null)
  const [identifyId, setIdentifyId] = useState<string | null>(null)
  const [quote, setQuote] = useState<string | undefined>(undefined)
  const [isTrace, setIsTrace] = useState(Boolean(postId) || Boolean(userId))
  const [tempAward, setTempAward] = useState<TempAward | null>(null)

  // 如果是追踪模式 设置追踪id
  useEffect(
    () => {
      setIsTrace(Boolean(postId) || Boolean(userId))
      setIdentifyId(postId || userId)
    },
    [postId, userId]
  )

  // 获取帖子基本信息
  useEffect(() => {
    ;(async () => {
      if (isNaN(parseInt(topicId, 10))) {
        navigate('/404')

        return null
      }

      const topic = await getTopicInfo(topicId)
      topic.fail().succeed(async topicInfo => {
        const boardName = await getBoardNameById(topicInfo.boardId)
        topicInfo.boardName = boardName
        setTopicInfo(topicInfo)
      })
    })()
  }, [])

  const handleClickOpen = (info: IPost) => {
    setOpen(true)
    setCurrentPost(info)
  }

  const handleDialogClose = () => setOpen(false)

  if (topicInfo === null) {
    return <LoadingCircle />
  }

  return (
    <>
      <PostHead topicInfo={topicInfo} />

      {currentPost && (
        <AwardDialog
          open={open}
          onClose={handleDialogClose}
          currentPost={currentPost}
          callback={(data: TempAward) =>
            setTempAward({ ...data, operatorName: userInfo ? userInfo.name : '' })
          }
        />
      )}

      <PostList
        key={`${topicInfo.id}-${isTrace}`}
        topicInfo={topicInfo}
        identifyId={identifyId}
        isTrace={isTrace}
        handleClickOpen={handleClickOpen}
        handleDialogClose={handleDialogClose}
        setQuote={setQuote}
        tempAward={tempAward}
      />

      <Editor
        topic={topicInfo}
        initContent={quote}
        resetInitContent={() => setQuote(undefined)}
        callback={() => {
          /** */
        }}
        theme={state.theme}
      />
    </>
  )
}
