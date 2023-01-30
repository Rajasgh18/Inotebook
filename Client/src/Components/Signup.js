import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup(props) {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    let navigate = useNavigate();
    const { name, email, password } = credentials;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        const json = await response.json();
        if(json.success){
            localStorage.setItem('token', json.authToken);
            props.showAlert("Created Your Account Successfully!", "primary");
            navigate("/");
        }
        else{
            props.showAlert(json.error, "danger");
        }
    }

    return (
        <>
            <div className="container my-5">
                <h2 className="my-3">SignUp</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" name="name" value={credentials.name} onChange={handleChange} id="name" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" name="email" value={credentials.email} onChange={handleChange} id="email" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" onChange={handleChange} value={credentials.password} id="password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" name="cpassword" onChange={handleChange} value={credentials.cpassword} id="cpassword" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    );
}
export default Signup;