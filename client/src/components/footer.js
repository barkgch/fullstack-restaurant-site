import React from 'react'
import Logo from '../img/logo.png'

const Footer = () => {
  return (
    <footer>
      <img src={Logo} />
      <span>Made with &hearts; and following the <a target='_blank' href="https://youtu.be/0aPLk2e2Z3g?si=2cPLE7b1ixwzHL8J">Lama Dev tutorial</a>!</span>
    </footer>
  )
}

export default Footer