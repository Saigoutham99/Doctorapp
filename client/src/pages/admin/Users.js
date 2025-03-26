import React, {useEffect,useState} from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
// import { title } from 'process'
// import { text } from 'stream/consumers'


const Users = () => {
const [users,setUsers] = useState([])


//getUsers
const getUsers = async() =>{
  try {
    const res = await axios.get('/api/v1/admin/getAllUsers',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (res.data.success){
      setUsers(res.data.data);
    }
    
  } catch (error) {
    console.log(error)
  }
}


useEffect(() => {
  getUsers();
},[]);

// antD table col
// const columns = [
//   {
//     title:'Name',
//     dataIndex:'name',
//   },
//   {
//     title:'Email',
//     dataIndex:'email',
//   },
//   {
//     title:'Created At',
//     dataIndex:'createdAt'
//   },
//   {
//     title:'Actions',
//     dataIndex:'actions',
//     render:(text,record) => (
//       <div className='d-flex'>
//         <button className='btn btn-danger'>Block</button>
//       </div>
//     )
//   },
// ]

  return (
    <Layout>
        <h1>Users List</h1>
    </Layout>
  )
}

export default Users
