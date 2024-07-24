

export default function SignIn() {
  return (
    <>
    <div className="bg-[#F5FBF9] flex justify-center items-center w-full h-screen">
        <div className="animate__animated animate__fadeInUp">
            <h1>Sign In</h1>
            <form>
                <div>
                    <input type="email" placeholder="Please enter your user name." />
                </div>
                <div>
                    <input type="password" placeholder="Please enter your password"/>
                </div>
                <div>
                    <button>Sign In</button>
                </div>  
            </form>

            <hr />

            <div>
                <button to="/signup">Sign Up</button>
            </div>
        </div>

    </div>
    </>
  )
}
