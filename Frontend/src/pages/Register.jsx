import { useState } from "react"

const Register = () => {

    const[formData, setFormData] = useState({
        firstName: '',
        middleName:'',
        lastName: '',
        userName: '',
        email:'',

    })

  return (
    <div className="h-screen">
        <div className="p-20">
            <form action="">
                <label htmlFor="firstName">
                <span className="text-sm font-medium text-gray-700"> First Name </span>

                <input
                    type="firstName"
                    id="firstName"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>
            <label htmlFor="middleName">
                <span className="text-sm font-medium text-gray-700"> Middle Name </span>

                <input
                    type="middleName"
                    id="middleName"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>
            <label htmlFor="lastName">
                <span className="text-sm font-medium text-gray-700"> Last Name </span>

                <input
                    type="lastName"
                    id="lastName"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>
            <label htmlFor="userName">
                <span className="text-sm font-medium text-gray-700"> Last Name </span>

                <input
                    type="lastName"
                    id="lastName"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>
            <label htmlFor="Email">
                <span className="text-sm font-medium text-gray-700"> Email </span>

                <input
                    type="email"
                    id="Email"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>
            <label htmlFor="Password">
                <span className="text-sm font-medium text-gray-700"> Enter Password </span>

                <input
                    type="password"
                    id="password"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                />
            </label>

            <button type="submit">Register</button>
            </form>
            
        </div>
      

    </div>
  )
}
export default Register
