import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ReactComponent as ThreeDots } from '../../assets/icons/threedots.svg';
import productIcon from '../../assets/images/image 65.png';
import './style.product_table.css';

const Dropdown = () => {
    return (

        <Menu as="div" className="relative inline-block text-center ml-9">
            <div className=''>
                <Menu.Button >
                    <ThreeDots />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className='block text-center font-medium w-full m-auto px-6 py-4 hover:bg-[#f5f5f5]'
                                    >
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className='block text-center font-medium w-full m-auto px-6 py-4 hover:bg-[#f5f5f5]'
                                    >
                                        Duplicate
                                    </button>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className='block text-center font-medium w-full m-auto px-6 py-4 hover:bg-[#f5f5f5]'
                                    >
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>

                    </Menu.Items>
                </Transition>
            </div>

        </Menu>


    );
}

const data = [
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
    { name: 'Miniket Rice Premium', category: 'Groceries', unit: '5 kg Pack', stock: 5, price: '৳ 305.00' },
]

const productTable = () => {
    return (
        <div className="product-table">
            <table className="table table-auto min-w-full text-left">
                <thead>
                    <tr>
                        <th className="first-heading">Item Image</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Stock</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td><img src={productIcon} alt="product icon" className="inline-block icon" /></td>
                                    <td>{val.name}</td>
                                    <td>{val.category}</td>
                                    <td>{val.unit}</td>
                                    <td>{val.stock}</td>
                                    <td className=''>
                                        {val.price}
                                        <Dropdown />

                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default productTable;