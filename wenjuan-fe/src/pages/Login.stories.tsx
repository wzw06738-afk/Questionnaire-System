import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'
import Login from './Login'

export default {
  title: 'Pages/Login',
  component: Login,
  decorators: [
    Story => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
} as ComponentMeta<typeof Login>

const Template: ComponentStory<typeof Login> = () => <Login />

export const Default = Template.bind({})
Default.parameters = {
  layout: 'fullscreen',
}

export const DarkMode = Template.bind({})
DarkMode.parameters = {
  layout: 'fullscreen',
}
DarkMode.decorators = [
  Story => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return <Story />
  },
]
