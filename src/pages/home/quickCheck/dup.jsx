<div 
                        
                        className="quickAsapLinks">

                            <motion.a initial = {{opacity : 0, y : -50}} whileInView = {{opacity : 1, y:1}} transition={{delay : 0.1 }} viewport = {{once : true}} href="/services/housing" className="linkBin">

                                <div className="content">

                                    <div className='quick__title'> 
                                        Housing in Lagos
                                        <div className="icon"><ArrowUpRight/></div> 
                                    </div>

                                    <p>Get info on housing, permits etc.</p>

                                </div>

                            </motion.a>

                            <motion.a initial = {{opacity : 0, y : -50}} whileInView = {{opacity : 1, y:1}} transition={{delay : 0.2 }} viewport = {{once : true}} href='/services/tourism' className="linkBin">

                                <div className="content">

                                    <div className="quick__title">

                                        Visit and tour Lagos
                                        <div className="icon"><ArrowUpRight/></div> 

                                    </div>

                                    <p>Book your trip, Get a guide, etc.</p>

                                </div>

                            </motion.a>

                            <motion.a initial = {{opacity : 0, y : -50}} whileInView = {{opacity : 1, y:1}} transition={{delay : 0.3}} viewport = {{once : true}} href="/services/education" className="linkBin">

                                <div className="content">

                                    <div className='quick__title'> 
                                        Education in Lagos
                                        <div className="icon"><ArrowUpRight/></div> 
                                    </div>

                                    <p>View Educational centers</p>

                                </div>
                                
                            </motion.a>

                            <motion.a initial = {{opacity : 0, y : -50}} whileInView = {{opacity : 1, y:1}} transition={{delay : 0.4 }} viewport = {{once : true}} href="/government/mdas" className="linkBin">

                                <div className="content">

                                    <div className='quick__title'> 
                                    Explore agencies
                                        <div className="icon"><ArrowUpRight/></div> 
                                    </div>

                                    <p>View Agencies directories</p>

                                </div>
                                
                            </motion.a>

                            <motion.a initial = {{opacity : 0, y : -50}} whileInView = {{opacity : 1, y:1}} transition={{delay : 0.5 }} viewport = {{once : true}} href="/services/laws" className="linkBin">

                                <div className="content">

                                    <div className='quick__title'> 
                                        State laws and guidlines
                                        <div className="icon"><ArrowUpRight/></div> 
                                    </div>

                                    <p>Get acquianted with Lagos Laws.</p>

                                </div>
                                
                            </motion.a>

                            <div className="linkServices">

                                Ready to explore? <a onClick={handleServices}>Browse all services</a>

                            </div>
                            

                        </div>

                        </IconoirProvider>

                    </div>




                    // styles


                    .quickCheck{
                        overflow: hidden;
                        position: relative;
                        background-color: #fcfff5;
                    
                        .lineBg{
                            height: 100%;
                            width: 50%;
                            position: absolute;
                            top: 0;
                            right: -100px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transform: rotateY(180deg);
                    
                            img{
                                height: 150%;
                            }
                        }
                    
                        .getStarted{
                            
                            display: flex;
                            justify-content: space-between;
                            flex-direction: column;
                            gap: 30px;
                            width: 100%;
                            padding: 100px 0;
                            position: relative;
                            z-index: 3;
                    
                            .title{
                                margin-top: 30px;
                                font-size: 17px;
                                font-weight: 500;
                            }
                    
                            .real{
                                margin-bottom: 10px;
                                font-size: 17px;
                                font-weight: 500;
                            }
                        
                            .textString{
                        
                                font-weight: 500;
                                position: relative;
                                color: #000;
                                border-radius: 10px;
                                width: 60%;
                                display: flex;
                                flex-direction: column;
                    
                                .textChange{
                        
                                    width: 100%;
                                    font-size: 65px;
                                    font-weight: 500;
                                    line-height: 63px;
                                    letter-spacing: -1px;
                                    font-family: "Cormorant Garamond", serif;    
                                    font-style: italic;
                                    margin-bottom: 20px;
                    
                                    .many{
                                        line-height: 35px;
                                        padding-bottom: 15px;
                                    }    
                                    
                                }
                                
                                .pasty{
                    
                                    margin-top: 15px;
                                    width: 70%;
                                    font-weight: 400;
                                    font-size: 16px;
                                    line-height: 24px;
                                    color: #444;
                                    border-left: 3px solid #009C3E;
                                    padding-left: 20px;
                                
                                }
                    
                            }   
                        
                            .quickAsapLinks{
                    
                                width: 100%;
                                display: flex;
                                align-items: center;
                                position: relative;
                                flex-wrap: wrap;
                                gap: 15px;
                    
                                .linkServices{
                                    font-size: 16px;
                                    color: #808080;
                                    margin-top: 30px;
                                    position: absolute;
                                    bottom: 20px;
                                    left: 0;
                                    display: none;
                        
                                    a{
                                        color: #009C3E;
                                        text-decoration: underline;
                                        cursor: pointer;
                                        font-weight: 500;
                                    }
                                }
                        
                                .quick__title{
                                    font-weight: 500;
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                    line-height: 27px;
                                    color: #000;
                                    font-size: 18px;
                    
                                    .icon{
                                        position: absolute;
                                        top: 25px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        border-radius: 50%;
                                        color: #009C3E;
                                        right: 20px;
                                        transform: translateY(-50%);
                                    }
                                }
                                
                                .content{
                    
                                    transition: all .4s cubic-bezier(0.175, 0.885, 0.32, 1.8);
                                }
                    
                        
                                .linkBin{
                                    width: 320px;
                                    border: 1px solid rgba($color: #000000, $alpha: 0.1);
                                    cursor: pointer;
                                    display: flex;
                                    position: relative;
                                    padding: 35px 25px;
                                    border-radius: 5px;
                                    background-color: #fff;
                                    overflow: hidden;
                    
                                    &:last-child{
                                        border: none;
                                    }
                        
                                    &.untold{
                        
                                        gap: 0px;
                        
                                        p{
                                            margin-left: auto;
                                            margin-top: -1px;
                                            font-weight: 600;
                                            color: var(--lime);
                                        }
                        
                                    }
                        
                                    &:hover{
                        
                                        border-color: #009C3E;
                                        background-color: #009C3E;
                                        color: #000;
                                        border-radius: 5px;
                    
                                        .content{
                                            padding-left: 10px;
                                        }
                    
                                        .icon{
                                            color: #fff;
                                            right: 30px;
                                            top: 35px;
                                            transition: all .4s cubic-bezier(0.175, 0.885, 0.32, 1.8);
                                        }
                    
                                        .quick__title{
                                            text-decoration: underline;
                                        }
                    
                                        .quick__title, p{
                                            color: #fff;
                                        }
                        
                                    }
                        
                                    h1{
                                        color: #000;
                                        font-size: 21px;
                                    }
                        
                                    p{
                                        margin-top: 5px;
                                        font-size: 14px;
                                        color: #878787;
                                    }
                    
                                }
                        
                            }
                        }
                    
                    }
                    
                    
                    
                    
                    