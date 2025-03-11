import Form from "./Components/Form"
 
function App() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex justify-center items-center lg:w-1/2">
        <Form />
      </div>
      <div className="hidden lg:flex items-center justify-center h-full w-1/2 bg-[#111827]">
        <div className="grid grid-cols-1 justify-center items-center mx-10">
              <div className="col-end-1 h-14 w-14 rounded-full animate-spin bg-gradient-to-tr from-violet-500 to-pink-400" />
              <div className="ml-4 mb-2 justify-center items-center text-white text-5xl">
                Smart Cuts
              </div>
              <p className="text-white text-lg flex-none  col-span-2 mt-6">
                SmartCuts is a web-based salon management platform that allows customers
                to book appointments, browse services, and
                make online payments.
                Salon owners can manage staff schedules, track appointments,
                and handle payments through an intuitive dashboard<br/><br/>
                <button className="hover:scale-105 text-semibold border p-2 bg-violet-500 text-white rounded-xl  text-lg border-violet-500 px-10">Log in</button>
                <button className="hover:scale-105 text-semibold border p-2 bg-violet-500 text-white rounded-xl  text-lg border-violet-500 ml-10 px-10">Sign up</button>

              </p>
              {/* <button className="mt-10 text-md px-2 py-2 border text-white border-violet-500">Log in</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
