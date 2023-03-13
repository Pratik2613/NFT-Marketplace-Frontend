import Router, { useRouter } from "next/router";
import React from 'react'


function Pages() {
const router = useRouter().query
const { id } = router
console.log('ddddddddd',id);
  return (
    <div>{`ITS WORKING ${id}.........`}</div>
  )
}

export default Pages

