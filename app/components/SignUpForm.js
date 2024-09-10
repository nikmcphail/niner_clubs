export default function SignUpForm() {

    return (
        <form>
            <div>
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" placeholder="John Doe" required />
            </div>

            <div>
                <label htmlFor="email">Email (uncc/charlotte.edu)</label>
                <input type="email" id="email" pattern="^[a-zA-Z0-9._%+\-]+@(uncc\.edu|charlotte\.edu)$" placeholder="johndoe@charlotte.edu" required />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter password" required />
            </div>

            <button className="bg-uncc-green p-3 text-white font-bold" type="submit">Create User</button>
        </form>
    )
}