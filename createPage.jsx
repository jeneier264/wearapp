import React from 'react';
import styles from '../style';
import { Navbar, FileUploader, Canvas } from '../components';
import flip from '../assets/flip-svgrepo-com.svg';
import up from '../assets/arrow-up-outline.svg';
import down from '../assets/arrow-down-outline.svg';
import crop from '../assets/crop-outline.svg';
import close from '../assets/close-circle-outline.svg';
import back from '../assets/arrow-back-outline.svg';
import forward from '../assets/arrow-forward-outline.svg';
import { categories, collections, itemSamples } from '../constants';
import heart from '../assets/heart-outline.svg';
import heart_circle from '../assets/heart-circle.svg'
import upload from '../assets/cloud-upload-outline.svg';
import add from '../assets/add-circle.svg';
import { useState, useMemo } from 'react';




const CreatePage = () => { 
    let emptyArray = [];
    const [itemList, setItemList] = useState(itemSamples);
    const [isMainShown, setIsMainShown] = useState(true);
    const  [selectedCategory, setSelectedCategory] = useState();   
    const [isItemSelected, setIsItemSelceted] = useState(null);
    const [ItemsForCanvasArray, setItemsForCanvasArray] = useState(emptyArray);
    
    
    function getFilteredList() {
        if (!selectedCategory) {
          return itemList;
        }
        return itemList.filter((item) => item.category === selectedCategory);
      };

    var filteredList = useMemo(getFilteredList, [selectedCategory, itemList]);

    function handleClickCategory(event) {
        setSelectedCategory(event.currentTarget.value);
        setIsMainShown(current => !current);
     };

    function handleClickItem(event) {
        setIsItemSelceted(event.currentTarget.value);
        var imgOrigin  = new Image();
        imgOrigin.src = itemList.find((el) => el.id == event.currentTarget.value).image; 
        var imgWidth = imgOrigin.naturalWidth * 0.25;
        var imgHeight = imgOrigin.naturalHeight * 0.25;
        var Item = {
            x:  0,
            y: 0,
            width: imgWidth,
            height:imgHeight,
            img: imgOrigin,
        };
        setItemsForCanvasArray([...ItemsForCanvasArray, Item]); // array of id-s of iems that appear on canvas
        
     };

    return (
    <div className="bg-primary w-full overflow-hidden p-0">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
                <Navbar />
                <hr class=" sm:flex my-6 mx-auto h-[0.5px] w-3/4 p-0 border-0 dark:bg-gray-700 hidden" />
            </div>
        </div>

        <div className='flex justify-evenly md:flex-row flex-col pb-3'>
            <div className={`flex-col ${styles.canavsSection1} ${styles.flexCenter} justify-between`}>
                <div className='flex-row justify-between'>
                    <button className='p-2'><img src={flip} alt="flip" className='w-[23px] h-[23px]'/></button>
                    <button className='p-2'><img src={up} alt="up" className='w-[23px] h-[23px]'/></button>
                    <button className='p-2'><img src={down} alt="down" className='w-[23px] h-[23px]'/></button>
                    <button className='p-2'><img src={crop} alt="crop" className='w-[23px] h-[23px]'/></button>
                    <button className='p-2'><img src={close} alt="close" className='w-[23px] h-[23px]'/></button>
                </div>
                <div className='flex-row w-[650px]'>
                { isItemSelected != null ? (
                        <Canvas height={400} width={650} items={ItemsForCanvasArray} />
                    ) : (
                        <p className={`${styles.paragraph1}`}>add items...</p>
                    ) }
                </div>
                <div className='flex-row justify-between'>
                    <button className='p-2'><img src={back} alt="back" className='w-[23px] h-[23px]'/></button>
                    <button className='p-2'><img src={forward} alt="forward" className='w-[23px] h-[23px]'/></button>
                </div>
            </div>


            { isMainShown ? (
            <div className={`flex-col ${styles.canavsSection2} ${styles.flexCenter} justify-between`}>
                <div className='flex-row '>
                    <p className={`${styles.paragraph1} p-2`}>Categories</p>
                </div>
                <div className='grid gap-x-12 gap-y-4 grid-cols-3 grid-rows-2 justify-items-center'>
                        {categories.map((category, index)=>(
                            <div className='flex-col '>
                                <button value={category.id} onClick={handleClickCategory} className={`${styles.categoryHover}`}>
                                    <img
                                    key={category.id}
                                    src={category.image}
                                    alt={category.id}
                                    className={`h-[55px] object-contain cursor-pointer`}
                                    />
                                </button>
                                <p className={`${styles.paragraph1}`}>{category.id}</p>
                            </div>
                        ))}
                </div>
                <hr className="flex my-4 mx-auto h-[0.5px] w-3/4 p-0 border-1 border-black"/>
                <div className='flex flex-row justify-between '>
                    <FileUploader />
                    <div className='flex flex-col justify-between pr-3'>
                        <img src={upload} alt="upload" className='h-[30px]' />
                        <p className={`${styles.paragraph3}`}>My uploads</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                        <img src={heart} alt="" className='h-[30px]' />
                        <p className={`${styles.paragraph3}`}>My likes</p>
                    </div>
                </div>
                <hr className="flex my-4 mx-auto h-[0.5px] w-3/4 p-0 border-1 border-black"/>
                <div className='flex-row '>
                    <p className={`${styles.paragraph1} p-2`}>Collections</p>
                </div>
                <div className='grid gap-8 grid-cols-3 justify-items-center'>
                        {collections.map((collection, index)=>(
                            <div className='flex-col '>
                                <button value={collection.id}  className={`${styles.categoryHover}`}>
                                <img
                                key={collection.id}
                                src={collection.image}
                                alt={collection.id}
                                className={`h-[55px] object-contain cursor-pointer`}
                                />
                                </button>
                                <p className={`${styles.paragraph1}`}>{collection.id}</p>
                            </div>
                        ))}
                </div>
            </div> ) : (
            <div className={`flex-col ${styles.canavsSection2} ${styles.flexCenter} justify-between`}>
                <div className='p-6 grid gap-x-7 gap-y-4 grid-cols-3 justify-between'>
                    {filteredList.map((item, index) => (
                    <div className='container h-[70px] p-3 m-3'>
                        <div className='flex justify-center'>
                            <button value={item.id} onClick={handleClickItem}>
                                <img
                                    key={item.id}
                                    src={item.image}
                                    alt={item.id}
                                    className={`cursor-pointer object-center h-[70px]`}>
                                </img>
                            </button>
                        </div>
                        <div className='flex justify-between opacity-0 hover:opacity-100 '>
                            <button><img src={add} alt="add" className='h-[30px]' /></button>
                            <button><img src={heart_circle} alt="heart" className='h-[30px]' /></button>
                        </div>
                    </div>
                    ))}
                </div>
                <button value={null} onClick={handleClickCategory} className={`p-2 justify-self-start hover:underline`}>
                    <p className={`${styles.paragraph1}`}>Go back</p>
                </button>
             </div> )}
        </div>
    </div>
)};

export default CreatePage;
