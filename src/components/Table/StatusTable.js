import statusIcon from '../../assets/icons/Ellipse 3.png';
import './style.status_table.css';

const data = [
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},
    {date: "10 Feb, 2022", id: "8KU70146GY", customer: "ShareTrip", status: "Draft", amount: "৳ 1,200.00"},


]

const statusTable = () => {
    return (
        <div className='status-table'>
            <table className="table table-auto min-w-full text-left">
            <thead>
                <tr >
                    <th className="first-heading">Create Date</th>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((val, key) => {
                        return(
                            <tr key={key}>
                                <td className="first-heading">{val.date}</td>
                                <td>{val.id}</td>
                                <td>{val.customer}</td>
                                <td><img src={statusIcon} alt="scheduled icon" className="inline-block icon"/>{val.status}</td>
                                <td>{val.amount}</td>
                            </tr>
                        )
                    })
                }
          </tbody>
        </table>
        </div>
    );
}

export default statusTable;