// import * as React from 'react';
// import { Link } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// export default function App(props) {
//     const [value, setValue] = React.useState(new Date());

//     const [rangeValue, setRangeValue] = React.useState([null, null]);

//     if(props.name === "all" ) {
//         return (
//             <div className='flex rounded bg-[#F5F5F5]'>
                
//                 <Link to="#">
//                     <svg className=' h-[56px] float-left mt-0' viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <rect className='h-full' fill="#F5F5F5"/>
//                         <path d="M30 33L24 27L30 21" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                 </Link>
        
        
//                 <LocalizationProvider className="text-center" dateAdapter={AdapterDateFns} >
//                     <DatePicker
//                     label="Filter Date"
//                     value={value}
//                     inputFormat="MMM dd, yyyy"
//                     onChange={setValue}
//                     renderInput={(params) => <TextField className="w-full border-none"  {...params} />}
//                     />
//                 </LocalizationProvider>
                
        
//                 <Link to="#">
//                     <svg className='h-[56px] float-right -mt-0.5 ' viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <rect className='h-full' fill="#F5F5F5"/>
//                         <path d="M24 33L30 27L24 21" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                 </Link>
        
        
//                 <style jsx="true">{`
//                     input[type=tel]:focus, input[type=text]:focus { box-shadow: none; }
//                 `}</style>
        
        
//             </div>
//         );
//     }
//     else if(props.name === "custom") {
//         return (
//             <div className='flex rounded bg-[#F5F5F5]'>
//                 <style jsx="true">{`
//                     input[type=tel]:focus, input[type=text]:focus { box-shadow: none; }
//                 `}</style>
//             </div>
//         );
//     }
    
// }