import React, { useState, useEffect } from 'react';
import ContentStyle from '../ContentStyle';
import { getSubMerchant, deleteSubMerchant } from '../../../api/SubMerchant';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import DeletePop from '../Popup/DeletePop';
import { useAuth } from '../../../contexts/ContentContext'; 

const SubMerchantGet = function () {
    const [merchants, setMerchants] = useState({ totalRecords: 0, list: [] });
    const [loading, setLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); 
    const [selectedMerchant, setSelectedMerchant] = useState(null); 
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { canSubMerchantList, canSubMerchantNew, canSubMerchantDelete, canSubMerchantEdit,loadUserDetail  } = useAuth();

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const itemsPerPage = 10;

    useEffect(() => {
        const offset = (currentPage - 1) * itemsPerPage;

        const fetchMerchants = async () => {
            setLoading(true);
            try {
                const merchants = await getSubMerchant(offset, itemsPerPage);
                console.log(merchants)
                setMerchants(merchants);
            } catch (error) {
                console.error("Error fetching merchants:", error);
            } finally {
                setLoading(false);
            }
        };

        if (canSubMerchantList) {
            fetchMerchants();
        } else {
            navigate('/dashboard'); 
        }
    }, [currentPage, canSubMerchantList, navigate]);

    const handleNavigateToEditMerchant = (merchantId) => {
        navigate(`/dashboard/merchant/edit?merchantId=${merchantId}`);
    };

    const totalRecords = merchants?.totalRecords || 0;
    const merchantList = merchants?.list || [];
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const NavigateCreateMerchant = () => {
        navigate("/dashboard/Merchant/create");
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setSearchParams({ page: newPage });
        }
    };

    const openDeletePopup = (merchant) => {
        setSelectedMerchant(merchant); 
        setIsPopupVisible(true); 
    };

    const handleDeleteMerchant = async () => {
        try {
            await deleteSubMerchant(selectedMerchant.id); 
            const offset = (currentPage - 1) * itemsPerPage;
            const merchants = await getSubMerchant(offset, itemsPerPage); 
            loadUserDetail();
            setMerchants(merchants);
        } catch (error) {
            
        } finally {
            setIsPopupVisible(false); 
        }
    };

    return (
        <ContentStyle>
            <div className="h-[30rem] bg-white rounded-3xl pb-44 p-6 phone:overflow-x-auto tabletSmall:overflow-x-auto box-content">
                <div className="flex phone:block justify-between items-center">
                    <h1 className="mt-8 font-semibold phone:mb-2 text-2xl">Merchants</h1>
                    {canSubMerchantNew && (
                        <button 
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            onClick={NavigateCreateMerchant}
                        >
                            New Merchant +
                        </button>
                    )}
                </div>
                
                <table className="min-w-full mt-4 bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            {canSubMerchantDelete && <th className="py-2 px-4 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {merchantList.map(merchant => (
                            <tr key={merchant.id} className="border-t">
                                <td className="py-2 px-4">
                                    {canSubMerchantEdit ? (
                                        <button
                                        onClick={() => handleNavigateToEditMerchant(merchant.id)}
                                        className="text-blue-500 underline hover:text-blue-700"
                                    >
                                        {merchant.name}
                                    </button>
                                    ) : (
                                        merchant.name
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {canSubMerchantDelete && (
                                        <button 
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => openDeletePopup(merchant)}  
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination controls */}
                <div className="mt-4 flex justify-center items-center space-x-2">
                    {(() => {
                        const pageNumbers = [];
                        let startPage = Math.max(2, currentPage - 1);
                        let endPage = Math.min(totalPages - 1, currentPage + 1);

                        if (currentPage === 1) {
                            endPage = Math.min(totalPages - 1, startPage + 2);
                        } else if (currentPage === totalPages) {
                            startPage = Math.max(2, endPage - 2);
                        }

                        pageNumbers.push(
                            <button
                                key={1}
                                onClick={() => handlePageChange(1)}
                                className={`px-3 py-1 rounded-md transition ${
                                    currentPage === 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                1
                            </button>
                        );

                        if (startPage > 2) {
                            pageNumbers.push(<span key="start-ellipsis">...</span>);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`px-3 py-1 rounded-md transition ${
                                        currentPage === i
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }

                        if (endPage < totalPages - 1) {
                            pageNumbers.push(<span key="end-ellipsis">...</span>);
                        }

                        if (totalPages > 1) {
                            pageNumbers.push(
                                <button
                                    key={totalPages}
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`px-3 py-1 rounded-md transition ${
                                        currentPage === totalPages
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            );
                        }

                        return pageNumbers.length > 1 ? pageNumbers : null;
                    })()}
                </div>

                {isPopupVisible && selectedMerchant && (
                    <DeletePop 
                        handleDelete={handleDeleteMerchant} 
                        handleCancel={() => setIsPopupVisible(false)} 
                        message={`Are you sure you want to delete ${selectedMerchant.name}`}  
                    />
                )}
            </div>
        </ContentStyle>
    );
};

export default SubMerchantGet;
