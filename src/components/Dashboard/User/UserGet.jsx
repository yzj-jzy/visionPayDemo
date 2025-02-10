import React, { useState, useEffect } from 'react';
import ContentStyle from '../ContentStyle';
import { getUser, DeleteUser } from '../../../api/User';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import DeletePop from '../Popup/DeletePop';
import { useAuth } from '../../../contexts/ContentContext'; 

const UserGet = function () {
    const [users, setUsers] = useState({ totalRecords: 0, list: [] });
    const [loading, setLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { canUserList, canUserNew, canUserDelete, canUserEdit, availableMerchants } = useAuth();

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const itemsPerPage = 10;

    useEffect(() => {
        const offset = (currentPage - 1) * itemsPerPage;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const users = await getUser(offset, itemsPerPage);
                console.log(users);
                console.log(users.list);
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (canUserList) {
            fetchUsers();
        } else {
            navigate('/dashboard'); 
        }
    }, [currentPage, canUserList, navigate]);

    const totalRecords = users?.totalRecords || 0;
    const userList = users?.list || [];
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const NavigateCreateUser = () => {
        navigate("/dashboard/users/create");
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setSearchParams({ page: newPage });
        }
    };

    const openDeletePopup = (user) => {
        setSelectedUser(user); 
        setIsPopupVisible(true); 
    };

    const handleDeleteUser = async () => {
        try {
            await DeleteUser(selectedUser.id); 
            const offset = (currentPage - 1) * itemsPerPage;
            const users = await getUser(offset, itemsPerPage);
            setUsers(users);
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setIsPopupVisible(false); 
        }
    };

    return (
        <ContentStyle>
            <div className="h-[30rem] bg-white rounded-3xl pb-44 p-6 box-content phone:overflow-x-auto tabletSmall:overflow-x-auto">
                <div className="flex phone:block justify-between items-center">
                    <h1 className="mt-8 font-semibold text-2xl phone:mb-2">User Account</h1>
                    {canUserNew && (
                        <button 
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            onClick={NavigateCreateUser}
                        >
                            New User +
                        </button>
                    )}
                </div>
                
                <table className="min-w-full mt-4 bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 text-left">Active</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            {canUserDelete && <th className="py-2 px-4 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="py-2 px-4">
                                    {user.emailConfirmed ? (
                                        <FaCheckCircle className="text-green-500" />
                                    ) : (
                                        <FaTimesCircle className="text-red-500" />
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {canUserEdit ? (
                                        <button 
                                            className="text-blue-500 underline hover:text-blue-700"
                                            onClick={() => navigate(`/dashboard/Users/edit?userId=${user.id}`)}
                                        >
                                            {user.userName}
                                        </button>
                                    ) : (
                                        user.userName
                                    )}
                                </td>
                                <td className="py-2 px-4">{user.role}</td>
                                {canUserDelete && (
                                    <td className="py-2 px-4">
                                        <button 
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => openDeletePopup(user)}  
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                )}
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

                {isPopupVisible && selectedUser && (
                    <DeletePop 
                        handleDelete={handleDeleteUser}
                        handleCancel={() => setIsPopupVisible(false)}
                        message={`Are you sure you want to delete ` + selectedUser.userName}
                    />
                )}
            </div>
        </ContentStyle>
    );
};

export default UserGet;
