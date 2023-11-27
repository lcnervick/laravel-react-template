import React from 'react';
import headerLogo from '../../images/logo-header.png';
import '../../css/components/Logo.css';


export default function Logo({ type }) {

  return (
    <div className={'logo logo-' + type}>
      <img src={headerLogo} alt={type + " logo"} />
    </div>
  )
}
