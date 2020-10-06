import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone  from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { TextArea }= Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0 , label: "Film & Animation"},
    {value : 1, label: "Autos & Vehicles"},
    {value : 2, label: "Music"},
    {value : 3, label: "Pets & Animals"}

]

export default function VideoUploadPage() {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState('Film & Animation')
    const [FilePath, setFilePath] = useState("")
    const [duration, setDuration] = useState("")
    const [thumbnailPath, setThumbnailPath] = useState("")
    
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) =>{
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) =>{
       setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    const onDrop = (files)=> {
            let formData = new FormData;
            const config = {
                header : { 'content-type' : 'mulipart/form-data'}
            }
            formData.append("file", files[0])
            
            Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success){
                        console.log(response.data)

                        let variable = {
                            url: response.data.url,
                        fileName: response.data.fileName
                             }
                                setFilePath(response.data.url)
                                console.log(FilePath);

                        Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success){ 

                               console.log(response.data.fileDuration);
                                setDuration(response.data.fileDuration);

             

                                
                                console.log(response.data.filePath)
                                setThumbnailPath(response.data.filePath);
                                
                            
                            }else { 
                                alert("썸네일 생성 실패")
                            }
                        })
                }else{      
                    alert('video 업로드 실패')
                }
            }) 
    }
const onSubmit = (e) => {
    e.preventDefault();

const variables = {
    writer: user.userData._id,
    title: VideoTitle,
    description: Description,
    privacy: Private,
    filePath: FilePath,
    category: Category,
    duration: duration,
    thumbnail: thumbnailPath,
}

    Axios.post('/api/video/uploadVideo', variables)
    .then(response => {
        if(response.data.success){
            console.log(response.data);
        }else { 
            alert('비디오 업로드에 실패했습니다')
        }
    })
}


    return (
        <div style={{maxWidth: '700px', margin:'2rem auto'}} >
            <div style = {{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level = {2}>Upload Video</Title>
            </div>

            <Form onSubmit = { onSubmit }>
                <div style = {{ display : 'flex', justifyContent: 'space-between'}}>
                <Dropzone
                 onDrop = { onDrop }
                 multiple = { false }
                 maxsize = { 10000000 }
                 >
                 {({ getRootProps, getInputProps}) => (
                     <div style = {{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                     alignItems: 'center', justifyContent: 'center'}}{...getRootProps()}>
                    <input { ...getInputProps()}/>
                    <Icon type = "plus" style = {{ frontSize: '3rem'}}/>
                     </div>
                 )}
                 </Dropzone>

            {thumbnailPath &&
            <div>
                <img src= {`http://localhost:5000/${thumbnailPath}`} alt ="thumbnail" />
            </div>
            }
            </div>
            <br/><br/>  

            <label>Title</label>
            <Input 
                onChange = { onTitleChange}
                value = {VideoTitle}
            />

              <br/><br/>
              <label>Description</label>
            <TextArea 
                onChange = {onDescriptionChange}
                value = { Description }
            />
              <br/><br/>

              <select onChange = {onPrivateChange} >
                  {PrivateOptions.map((item, index) => (
                      <option key = { index } value={item.value}>{item.label}</option>
                  ))} 
              </select>

<br/><br/>

              <select onChange = {onCategoryChange}>
              {CategoryOptions.map((item, index) => (
                  <option key = { index } value={item.value}>{item.label}</option>
              ))}
              </select>
<br/> <br/>

              <Button type = "primary" size="large" onClick = {onSubmit}>
                  Submit
              </Button>
            </Form>
            </div>
       
    )
}
