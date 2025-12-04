import React,{useState,useEffect} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import '../recentlySearched/recently.scss'
import { ArrowRight, ArrowUpRight, Car, Xmark, XmarkCircleSolid } from 'iconoir-react'
import TabTitle from '../../../components/tabHeading/tabTitle'
import { useNavigate } from 'react-router'
import { servicesDB } from '../../../api/data/servicesDB'

export default function RecentlySearched() {

    const [selectedId, setSelectedId] = useState(null)
    const [objectNumber, setObjectNumber] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);

    let navigateTo = useNavigate();

    useEffect(() => {

    const length = (servicesDB.length) - 1;
    
    const piper = []
    
    for( var x = 0; x < 6; x++ ){

        piper.push( servicesDB[Math.floor(Math.random() * length)] )

    }

    if(piper.length === 6 ) {

        setData(piper);

    }
        
        
    }, []);


    const listItems = {

        initial : {
            opacity : 0,
            scale : .7
        },
    
        animate : (index) => (
    
            { 
    
                opacity : 1,
                scale : 1,
    
                transition : {
                    delay : .2 * index,
                    duration : .3,
                    type : 'spring'
                }
    
            }
        )
    }

    const handleElementsFix = () => {

        document.querySelector('.recentlySearchedDom').classList.add('blur');

    }

    const handleCloseModal = () => {

        document.querySelector('.recentlySearchedDom').classList.remove('blur')

    }

    const handleThemeEdit = (theme) => {

        let initial = theme.replaceAll("_", " & ")
        let wordSplit = initial.split(" ");
        let join = wordSplit.join().replaceAll(",", " ");

        return join;

    }



  return (

    <div className="recentlySearchedDom">

        <TabTitle title = '# Top 6 most searched services' url = '#' />
        
        <div className="contentCards">

            {
            
            data.map((item, index) => (

                <motion.div className='cardPoint' layoutId={item.id} 

                key={index}
                variants={listItems}
                initial = "initial"
                whileInView= "animate"
                custom={index}
                
                onClick={() => {

                    window.open(item.url)
                    

                }}>

                    <div className="iconTin"> 

                        <div className="pin pin1">0{index+1}.</div>
                        <div className="pin pin2">0{index+1}.</div>

                    </div>

                    <div className="contentPin"> 

                        <motion.div className='title thick'>
                            
                            <div className="titleForm"> {item.sub_service} </div>
                            <div className="arrowIn"> 
                                <div className="arrow_Z arrow1"><ArrowUpRight /> </div>
                                <div className="arrow_Z arrow2"><ArrowUpRight /> </div>
                            </div>

                        </motion.div>

                        <div className='themed'> { handleThemeEdit(item.theme) } - </div>

                    </div>

                </motion.div>

                ))
            
            }
            
            {/* <AnimatePresence>

            {

                selectedId && (

                    <motion.div className='showMaxOn' layoutId={selectedId}>

                        <motion.div className='title_showMax'>{items[objectNumber].title}</motion.div>
                        <motion.div className='subtitle_showMax'>{items[objectNumber].subtitle}</motion.div>

                        <div className="linksRelevant">

                            {
                                items[objectNumber].url.map( (url, index) => {

                                    return <div key = {index} className="list" onClick={() => navigateTo(url.url) } > {url.name} <ArrowRight width={15} height={15} /> </div>

                                } )
                            }

                        </div>

                        <motion.div className='cancelMark' onClick={ 

                            () => {
                                setSelectedId(null) ;
                                handleCloseModal();
                                setIsOpen(false);
                            }

                        } >  
                        
                            <Xmark className='cancelModal' color='#000' strokeWidth={2}/> 
                        
                        </motion.div>

                    </motion.div>

                )

            }

            </AnimatePresence> */}

        </div>

    </div>

  )
}
