import React, { useRef, useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SideBarItem = ({ icon, content, isOpen, onClick, subItems, selectedSubItem, setSelectedSubItem, handleSubItemClick }) => {
    const [height, setHeight] = useState(isOpen ? 'auto' : '0px');
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen && subItems?.length) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setHeight('0px');
        }
    }, [isOpen, subItems]);

    const handleSubItemClickInternal = (subItemKey) => {
        setSelectedSubItem(subItemKey);
        handleSubItemClick(subItemKey);
    };

    return (
        <div className="cursor-pointer">
            <div 
                onClick={onClick} 
                className={`h-auto w-52 py-2.5 items-center rounded-3xl px-4 mb-2 transition-colors
                    ${isOpen ? 'bg-[#147BFC] text-white' : 'hover:bg-[#147BFC] hover:text-white'}`}
            >
                <div className="flex items-center">
                    <div className="mr-4">{icon}</div>
                    <div className="flex-grow text-sm">{content}</div>
                    {subItems?.length > 0 && (
                        isOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />
                    )}
                </div>
            </div>
            <div
                ref={contentRef}
                style={{
                    maxHeight: height,
                    transition: 'max-height 0.5s ease',
                    overflow: 'hidden'
                }}
                className="ml-2 mt-2 w-48 rounded-3xl mb-2"
            >
                {isOpen && subItems?.length > 0 && subItems.map((subItem, index) => (
                    <div
                    key={index}
                    className={`pl-4 py-2 mb-1 rounded-3xl transition-colors duration-200 ease-in-out cursor-pointer
                        ${selectedSubItem === subItem.key ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-[#147BFC] hover:text-white hover:shadow-sm'}`}
                    onClick={() => handleSubItemClickInternal(subItem.key)}
                >
                    <div className="flex items-center pl-2 py-1 text-sm">
                        <span className="mr-2">{subItem.icon}</span>
                        <span>{subItem.content}</span>
                    </div>
                </div>
                

                ))}
            </div>
        </div>
    );
};

export default SideBarItem;
