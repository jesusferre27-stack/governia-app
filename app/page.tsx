export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[#0d1b2a] font-sans">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          {/* AQUÍ ACTIVAMOS EL VERDE CÍVICO EN EL TÍTULO */}
          <h1 className="text-[#1bda5b] text-[32px] font-bold leading-tight">GOVERNIA</h1>
        </header>
        
        <main className="bg-[#1b263b] p-8 rounded-xl shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-[#e0e1dd] text-2xl font-bold">Staff Login</h3>
            <p className="text-[#778da9] text-base pt-2">Sign in to access the GOVERNIA portal.</p>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[#e0e1dd] text-sm font-medium pb-2">Email Address</label>
              <input 
                className="w-full rounded-lg text-[#e0e1dd] border border-[#415a77] bg-[#2a364a] h-14 p-3.5 outline-none focus:border-[#1bda5b]"
                placeholder="you@yourmunicipality.gov" 
                type="email" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#e0e1dd] text-sm font-medium pb-2">Password</label>
              <input 
                className="w-full rounded-lg text-[#e0e1dd] border border-[#415a77] bg-[#2a364a] h-14 p-3.5 outline-none focus:border-[#1bda5b]"
                placeholder="••••••••••••" 
                type="password" 
              />
            </div>

            {/* AQUÍ ACTIVAMOS EL VERDE CÍVICO EN EL BOTÓN */}
            <button className="flex w-full items-center justify-center rounded-lg bg-[#1bda5b] h-14 px-6 text-base font-semibold text-[#0d1b2a] hover:brightness-110 transition-all" type="submit">
              Login
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}