import React, {useState} from 'react'
import {Link} from 'react-router-dom';
import axios from "axios"
const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};
    const check = () => {
        if(error === "") {
            return msg && <div className="">{msg}</div>;
        } else {
            return "Pls fill in your data properly";
        }
    }
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/register";
			const { data: res } = await axios.post(url, data);
			setMsg(res.message);
            setData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

  return (
		<div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"}}>
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                <div>
                    <h2 className="text-4xl font-bold text-white">Swiss</h2>
                    
                    <p className="max-w-xl mt-3 text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae</p>
                </div>
            </div>
        </div>
        
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">Swiss</h2>
                    
                    <p className="mt-3 text-gray-500 dark:text-gray-300">Register</p>
                </div>

                <div className="mt-8">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="firstname" className="block mb-2 text-sm text-gray-600">FirstName</label>
                            <input type="firstname" onChange={handleChange} name="firstName" id="firstname" value={data.firstName} placeholder="Paul" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>

                        <div className="mt-6">
                            <label htmlFor="lastname" className="block mb-2 text-sm text-gray-600">LastName</label>
                            <input type="lastname" onChange={handleChange} name="lastName" id="lastname" value={data.lastName} placeholder="Morah" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>
                        <div className="mt-6">
                            <label htmlFor="email" className="block mb-2 text-sm text-gray-600">Email Address</label>
                            <input type="email" onChange={handleChange} name="email" id="email" value={data.email} placeholder="example@example.com" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between mb-2">
                                <label htmlFor="password" className="text-sm text-gray-600">Password</label>
                            </div>

                            <input type="password" onChange={handleChange} name="password" value={data.password} id="password" placeholder="Your Password" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>
                        {error && <div className="">{error}</div>}
						{check()}

                        <div className="mt-6">
                            <button
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                Sign in
                            </button>
                        </div>

                    </form>

                    <p className="mt-6 text-sm text-center text-gray-400">Already have an account? <Link to="/" className="text-blue-500 focus:outline-none focus:underline hover:underline">Login</Link>.</p>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Signup