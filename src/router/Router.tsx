import React from 'react'
// https://reach.tech/router/api/Router
import { Router, RouteComponentProps, WindowLocation, Location } from '@reach/router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import BoardList from '@/pages/BoardList'
import Board from '@/pages/Board'
import Editor from '@/pages/Editor'
import Home from '@/pages/Home'
import HotTopic from '@/pages/HotTopic'
import MessageDetail from '@/pages/Message/Detail'
import MessageList from '@/pages/Message/List'
import MyFollow from '@/pages/MyFollow'
import NewTopic from '@/pages/NewTopic'
import Search from '@/pages/Search'
import Setting from '@/pages/Setting'
import Topic from '@/pages/Topic'
import UserCenter from '@/pages/UserCenter'
import UserCenterEdit from '@/pages/UserCenter/Edit'
import About from '@/pages/About'

import LogIn from '@/pages/LogIn'
import Page401 from '@/pages/Error/401'
import Page403 from '@/pages/Error/403'
import Page404 from '@/pages/Error/404'

const Route: React.FunctionComponent<
  RouteComponentProps & {
    // @types/react 里 createElement 签名很混乱
    // tslint:disable-next-line:no-any
    component: any
    // component: React.FunctionComponent<any>
  }
> = props => {
  const { path, component, ...otherProps } = props

  return React.createElement(component, otherProps)
}

export interface ILocation {
  location: WindowLocation
}
const FadeTransitionRouter = (props: any) => (
  <Location>
    {({ location }) => (
      <TransitionGroup className="transition-group">
        <CSSTransition key={location.key} classNames="fade" timeout={500}>
          <Router location={location} className="router">
            {props.children}
          </Router>
        </CSSTransition>
      </TransitionGroup>
    )}
  </Location>
)

const MyRouter: React.FunctionComponent<ILocation> = ({ location }) => (
  <FadeTransitionRouter location={location}>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />

    <Route path="/hotTopics" component={HotTopic} />
    <Route path="/newTopics" component={NewTopic} />
    <Route path="/topic/:topicId" component={Topic} />
    <Route path="/topic/:topicId/anonymous/trace/:postId" component={Topic} />
    <Route path="/topic/:topicId/trace/:userId" component={Topic} />

    <Route path="/myFollow" component={MyFollow} />
    <Route path="/search" component={Search} />

    <Route path="/boardList" component={BoardList} />
    <Route path="/board/:id" component={Board} />

    <Route path="/userCenter" component={UserCenter} />
    <Route path="/userCenter/edit" component={UserCenterEdit} />
    <Route path="/user/:id" component={UserCenter} />

    <Route path="/editor" component={Editor} />

    <Route path="/setting" component={Setting} />
    <Route path="/messageList" component={MessageList} />
    <Route path="/messageDetail/:id" component={MessageDetail} />

    <Route path="/logIn" component={LogIn} />
    <Route path="/error/401" component={Page401} />
    <Route path="/error/403" component={Page403} />
    <Route path="/error/404" component={Page404} />
    <Route default component={Page404} />
  </FadeTransitionRouter>
)

export default React.memo(({ location }: ILocation) => <MyRouter location={location} />)