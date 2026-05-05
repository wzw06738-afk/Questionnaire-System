import React, { FC } from 'react'
import styles from './QuestionTextarea.module.scss'

type PropsType = {
  fe_id: string,
  props: {
    title: string
    placeholder?: string
  }
}

const QuestionTextarea: FC<PropsType> = ({ fe_id, props }) => {
  const { title, placeholder = '' } = props

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 300)
  }

  return <>
    <p>{title}</p>
    <div className={styles.textAreaWrapper}>
      <textarea name={fe_id} placeholder={placeholder} rows={5} onFocus={handleFocus}/>
    </div>
  </>
}

export default QuestionTextarea