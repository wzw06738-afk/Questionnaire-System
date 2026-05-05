import React, { FC } from 'react'
import styles from './QuestionInput.module.scss'

type PropsType = {
  fe_id: string,
  props: {
    title: string
    placeholder?: string
  }
}

const QuestionInput: FC<PropsType> = ({ fe_id, props }) => {
  const { title, placeholder = '' } = props

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 300)
  }

  return <>
    <p>{title}</p>
    <div className={styles.inputWrapper}>
      <input name={fe_id} placeholder={placeholder} onFocus={handleFocus}/>
    </div>
  </>
}

export default QuestionInput