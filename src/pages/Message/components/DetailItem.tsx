/**
 * @author dongyansong
 * @date 2018-10-26
 */
import React from 'react'
import { IMessageContent } from '@cc98/api'
import styled from 'styled-components'

import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'

import useContainer from '@/hooks/useContainer'
import userInstace from '@/containers/user'
import useUserId from '@/hooks/useUserId'

import dayjs from 'dayjs'

const ListItemAvatarS = styled(ListItemAvatar)`
  align-self: flex-start;
`

const MessageRoot = styled.div`
  width: 50%;
  max-width: 30em;
  min-width: 15em;
  display: flex;
  flex-direction: column;
  padding: 0 1em;
`

const MessageContent = styled.div`
  background-color: #eee;
  line-height: 2em;
  padding: 0.25em 0.5em;
  position: relative;
  font-size: 0.85em;
  border-radius: 3px;
  min-height: 3em;
  display: flex;
  align-items: center;
`

const MessageContentLeft = styled(MessageContent)`
  &::before {
    content: '';
    border-style: solid;
    border-width: 0.5em 0.5em 0.5em 0;
    border-color: transparent;
    border-right-color: #eee;
    left: -0.5em;
    position: absolute;
    top: 1em;
  }
`

const MessageContentRight = styled(MessageContent)`
  &::after {
    content: '';
    border-style: solid;
    border-width: 0.5em 0 0.5em 0.5em;
    border-color: transparent;
    border-left-color: #eee;
    right: -0.5em;
    position: absolute;
    top: 1em;
  }
`

const MessageDate = styled.span<{ right?: boolean }>`
  color: #666;
  font-size: 0.7em;
  align-self: ${props => (props.right ? 'flex-end' : '')};
`

interface Props {
  message: IMessageContent
}

// TODO: 消息气泡
const renderItem = (message: IMessageContent, userAvatar: string, isCurrSend: boolean) =>
  !isCurrSend ? (
    <ListItem>
      <ListItemAvatarS>
        <Avatar src={userAvatar} />
      </ListItemAvatarS>
      <MessageRoot>
        <MessageContentLeft>{message.content}</MessageContentLeft>
        <MessageDate right>{dayjs(message.time).format('YYYY-MM-DD HH:mm:ss')}</MessageDate>
      </MessageRoot>
    </ListItem>
  ) : (
    <ListItem>
      <ListItemText />
      <MessageRoot>
        <MessageContentRight>{message.content}</MessageContentRight>
        <MessageDate>{dayjs(message.time).format('YYYY-MM-DD HH:mm:ss')}</MessageDate>
      </MessageRoot>
      <ListItemAvatarS>
        <Avatar src={userAvatar} />
      </ListItemAvatarS>
    </ListItem>
  )

export default ({ message }: Props) => {
  const {
    state: { myInfo },
  } = useContainer(userInstace)

  const { portraitUrl } = useUserId(message.senderId)

  return renderItem(message, portraitUrl, myInfo!.id === message.senderId)
}
