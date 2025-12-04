import React,{useState, useEffect} from 'react'


export default function ImageComp({src}) {

    const [dataSrc, setDataSrc] = useState(src);

    useEffect(() => {
        console.log(dataSrc);
    }, [dataSrc]);
    
  return (

    <div className="newsImage">

        <img src={dataSrc} alt="" />

    </div>

  )

}
